/* ============================================================================
   WeinBus, Trip simulation. Position & ETA are derived from elapsed time, so
   every iframe/tab agrees by reading the same clock + a shared start timestamp.
   Start/End/Reset broadcast over BroadcastChannel('weinbus').
   ========================================================================== */
window.WB = window.WB || {};
(function (WB) {
  const LS = "wb_trip";
  const D = WB.data, trip = D.trip, stops = D.routeA.stops;
  const N = stops.length;
  const arrive = D.trip.legs.map((l) => l.at);          // arrival time-fraction per stop
  const DWELL = 0.055;                                   // pause at each stop
  const depart = arrive.map((a, i) => (i < N - 1 ? Math.min(a + DWELL, arrive[i + 1] - 0.01) : a));
  const REAL_MIN = 35;                                   // displayed trip length (minutes)

  let startedAt = null, status = "idle";
  let tickSubs = [], evtSubs = [], fired = new Set(), raf = null, loop = false, loopTimer = null;

  /* ---- timeline events ------------------------------------------------ */
  const EVENTS = (() => {
    const evs = [{ at: 0.001, type: "started" }];
    stops.forEach((s, k) => s.kids.forEach((kid, j) =>
      evs.push({ at: Math.min(arrive[k] + 0.012 + 0.018 * j, depart[k]), type: "boarded", kid, stopIndex: k, stopTime: s.time })));
    evs.push({ at: 0.84, type: "approaching", stopIndex: N - 1, min: 5 });
    evs.push({ at: 0.985, type: "arrived" });
    evs.push({ at: 1.0, type: "completed" });
    return evs.map((e, i) => ((e.id = i), e)).sort((a, b) => a.at - b.at);
  })();

  /* ---- persistence ---------------------------------------------------- */
  function save() { try { localStorage.setItem(LS, JSON.stringify({ startedAt, status })); } catch (e) {} }
  function load() { try { const o = JSON.parse(localStorage.getItem(LS) || "null"); if (o) { startedAt = o.startedAt; status = o.status; } } catch (e) {} }

  /* ---- math ----------------------------------------------------------- */
  function progress() { return startedAt ? Math.min(1, (Date.now() - startedAt) / trip.durationMs) : 0; }

  function position(p) {
    if (p <= arrive[0]) return { segIndex: 0, segT: 0, atStop: 0 };
    for (let k = 0; k < N; k++) {
      if (p >= arrive[k] && p <= depart[k]) return { segIndex: k, segT: 0, atStop: k };
      if (k < N - 1 && p > depart[k] && p < arrive[k + 1])
        return { segIndex: k, segT: (p - depart[k]) / (arrive[k + 1] - depart[k]), atStop: -1 };
    }
    return { segIndex: N - 1, segT: 0, atStop: N - 1 };
  }
  function etaMinTo(frac, p) { return Math.max(0, Math.ceil((frac - p) * REAL_MIN)); }

  function boardedSet() {
    const s = new Set();
    EVENTS.forEach((e) => { if (e.type === "boarded" && fired.has(e.id)) s.add(e.kid); });
    return s;
  }
  function nextStop(p) { for (let k = 0; k < N; k++) if (arrive[k] > p + 0.0001) return k; return N - 1; }

  /* ---- public state --------------------------------------------------- */
  function state() {
    const p = progress();
    const pos = position(p);
    const ob = boardedSet();
    return {
      status: p >= 1 ? "completed" : startedAt ? "enroute" : "idle",
      started: !!startedAt, progress: p,
      segIndex: pos.segIndex, segT: pos.segT, atStop: pos.atStop,
      pathFrac: (pos.segIndex + pos.segT) / (N - 1),
      etaSchool: etaMinTo(1, p),
      nextStopIndex: nextStop(p),
      onboardIds: ob, onboard: ob.size, total: D.roster().length
    };
  }
  WB.trip = {
    state, stops, arrive, depart,
    etaToStop: (i) => etaMinTo(arrive[i], progress()),
    isLive: () => !!startedAt && progress() < 1
  };

  /* ---- emit ----------------------------------------------------------- */
  function emit(e) {
    const payload = { type: e.type, stopIndex: e.stopIndex, min: e.min };
    if (e.type === "boarded") { payload.student = D.student(e.kid); payload.time = e.stopTime; }
    evtSubs.forEach((cb) => { try { cb(payload); } catch (_) {} });
  }
  function fireDue(p, silent) {
    EVENTS.forEach((e) => {
      if (!fired.has(e.id) && p >= e.at) { fired.add(e.id); if (!silent) emit(e); }
    });
  }
  function catchUpSilent(p) { EVENTS.forEach((e) => { if (p >= e.at) fired.add(e.id); }); }

  /* ---- loop ----------------------------------------------------------- */
  function frame() {
    const p = progress();
    fireDue(p, false);
    const st = state();
    tickSubs.forEach((cb) => { try { cb(st); } catch (_) {} });
    if (st.status === "completed" && loop && !loopTimer) {
      loopTimer = setTimeout(() => { loopTimer = null; reset(true); setTimeout(() => start(true), 700); }, 5200);
    }
    raf = requestAnimationFrame(frame);
  }
  function ensureRaf() { if (!raf) raf = requestAnimationFrame(frame); }

  /* ---- controls ------------------------------------------------------- */
  function start(broadcast) {
    startedAt = Date.now(); status = "enroute"; fired = new Set(); save(); ensureRaf();
    if (broadcast) bcast("start");
    pushTickOnce();
  }
  function end(broadcast) {
    startedAt = Date.now() - trip.durationMs * 0.99;       // jump near the end
    EVENTS.forEach((e) => { if (e.at <= 0.97) fired.add(e.id); }); // silence past boards
    status = "enroute"; save(); ensureRaf();
    if (broadcast) bcast("end");
  }
  function reset(broadcast) {
    startedAt = null; status = "idle"; fired = new Set(); save();
    const st = state(); tickSubs.forEach((cb) => { try { cb(st); } catch (_) {} });
    if (broadcast) bcast("reset");
  }
  function ensureRunning() { if (!startedAt) start(false); else ensureRaf(); }
  function pushTickOnce() { const st = state(); tickSubs.forEach((cb) => { try { cb(st); } catch (_) {} }); }

  /* manual chaperone check-in (board ahead of schedule) */
  function boardNow(kid) {
    const e = EVENTS.find((x) => x.type === "boarded" && x.kid === kid);
    if (e && !fired.has(e.id)) { fired.add(e.id); emit(e); pushTickOnce(); }
  }

  WB.trip.onTick = (cb) => { tickSubs.push(cb); if (startedAt) cb(state()); };
  WB.trip.onEvent = (cb) => evtSubs.push(cb);
  WB.trip.start = () => start(true);
  WB.trip.end = () => end(true);
  WB.trip.reset = () => reset(true);
  WB.trip.ensureRunning = ensureRunning;
  WB.trip.boardNow = boardNow;
  WB.trip.setLoop = (b) => { loop = !!b; if (loop) ensureRaf(); };

  /* ---- cross-frame ---------------------------------------------------- */
  function bcast(action) { if (WB.bc) { try { WB.bc.postMessage({ type: "trip", action, startedAt }); } catch (e) {} } }
  if (WB.bc) WB.bc.addEventListener("message", (e) => {
    const d = e.data; if (!d || d.type !== "trip") return;
    if (d.action === "start") { startedAt = d.startedAt || Date.now(); status = "enroute"; fired = new Set(); save(); ensureRaf(); }
    else if (d.action === "end") { startedAt = d.startedAt; status = "enroute"; EVENTS.forEach((ev) => { if (ev.at <= 0.97) fired.add(ev.id); }); save(); ensureRaf(); }
    else if (d.action === "reset") { reset(false); }
  });

  /* ---- init ----------------------------------------------------------- */
  load();
  if (startedAt) { catchUpSilent(progress()); ensureRaf(); }   // resume silently after reload
})(window.WB);
