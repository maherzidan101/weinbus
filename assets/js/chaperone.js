/* ============================================================================
   WeinBus, Chaperone (driver/attendant) app. The live data source.
   ========================================================================== */
(function (WB) {
  const D = WB.data, qs = WB.qs, qsa = WB.qsa, icon = WB.icon, pick = WB.pick, fmtTime = WB.fmtTime;

  WB.addStrings({
    "c.tab.trip": { en: "Trip", ar: "الرحلة" },
    "c.tab.students": { en: "Students", ar: "الطلاب" },
    "c.tab.more": { en: "More", ar: "المزيد" },
    "c.hi": { en: "Hi", ar: "أهلاً" },
    "c.morningTrip": { en: "Morning Trip", ar: "الرحلة الصباحية" },
    "c.ready": { en: "Ready to roll", ar: "جاهزون للانطلاق" },
    "c.readySub": { en: "Tap start when the bus departs the depot.", ar: "اضغط ابدأ عند انطلاق الباص من المرآب." },
    "c.start": { en: "Start morning trip", ar: "ابدأ الرحلة الصباحية" },
    "c.end": { en: "End trip", ar: "إنهاء الرحلة" },
    "c.startNew": { en: "Start a new trip", ar: "بدء رحلة جديدة" },
    "c.inProgress": { en: "Trip in progress", ar: "الرحلة جارية" },
    "c.complete": { en: "Trip complete!", ar: "اكتملت الرحلة!" },
    "c.completeSub": { en: "All students delivered safely. 🎉", ar: "تم توصيل جميع الطلاب بأمان. 🎉" },
    "c.stopsN": { en: "stops", ar: "محطات" },
    "c.studsN": { en: "students", ar: "طلاب" },
    "c.onboard": { en: "On board", ar: "على الباص" },
    "c.next": { en: "Next stop", ar: "المحطة التالية" },
    "c.eta": { en: "To school", ar: "حتى المدرسة" },
    "c.min": { en: "min", ar: "دقيقة" },
    "c.tapBoard": { en: "Tap each student as they board 👇", ar: "اضغط على كل طالب عند صعوده 👇" },
    "c.scan": { en: "Scan QR wristband", ar: "مسح سوار الـ QR" },
    "c.scanned": { en: "QR scanned, student boarded ✓", ar: "تم المسح, صعد الطالب ✓" },
    "c.sos": { en: "SOS", ar: "طوارئ" },
    "c.sosSent": { en: "SOS sent to the Transport Office", ar: "تم إرسال نداء الطوارئ لإدارة النقل" },
    "c.office": { en: "Transport Office", ar: "إدارة النقل" },
    "c.officeMsg": { en: "Please wait 2 extra min at Gardens, a new student joins today.", ar: "يرجى الانتظار دقيقتين إضافيتين في الجاردنز, ينضم طالب جديد اليوم." },
    "c.startFirst": { en: "Start the trip first to check students in.", ar: "ابدأ الرحلة أولاً لتسجيل صعود الطلاب." },
    "c.board": { en: "Board", ar: "صعد" },
    "c.grade": { en: "Grade", ar: "الصف" },
    "c.duration": { en: "Duration", ar: "المدة" },
    "c.boardedN": { en: "boarded", ar: "صعدوا" },
    "c.plate": { en: "Plate", ar: "اللوحة" },
    "c.role": { en: "Chaperone · Bus 7", ar: "المرافِقة · الباص 7" },
    "c.busLabel": { en: "Bus", ar: "الباص" }
  });

  const chap = D.staff.chaperone;
  const roster = D.roster();
  let pmap = null, shownStatus = null, T = {};

  function av(p, cls) {
    cls = cls || "";
    if (p.photo) return `<div class="avatar ${cls}"><img src="${p.photo}" alt=""></div>`;
    return `<div class="avatar ${cls}" style="background:${p.color || "#94A3B8"}">${p.initials || ""}</div>`;
  }
  function firstName(p) { return pick(p.name).split(" ")[0]; }

  /* ---------- TRIP ---------- */
  function renderTrip(st) {
    st = st || WB.trip.state();
    shownStatus = st.status;
    const v = qs("#view-trip");
    let card = "";
    if (st.status === "idle") {
      card = `<div class="card card--pad-lg center-text stack gap4" style="align-items:center">
        <div style="font-size:54px;line-height:1" class="flipX">🚌</div>
        <div><div class="display big">${WB.t("c.ready")}</div><div class="muted small">${WB.t("c.readySub")}</div></div>
        <div class="row gap6" style="justify-content:center">
          <div class="kpi-mini center-text"><b>${WB.trip.stops.length}</b><span class="muted tiny">${WB.t("c.stopsN")}</span></div>
          <div class="kpi-mini center-text"><b>${roster.length}</b><span class="muted tiny">${WB.t("c.studsN")}</span></div>
          <div class="kpi-mini center-text"><b class="num">7</b><span class="muted tiny">${WB.t("c.busLabel")}</span></div>
        </div>
        <button class="big-action big-action--go" id="btn-start">${icon("play", { width: 26, height: 26 })}<span>${WB.t("c.start")}</span></button>
      </div>`;
    } else if (st.status === "completed") {
      card = `<div class="card card--pad-lg center-text stack gap4" style="align-items:center">
        <div style="font-size:54px">🎉</div>
        <div><div class="display big">${WB.t("c.complete")}</div><div class="muted small">${WB.t("c.completeSub")}</div></div>
        <div class="row gap6" style="justify-content:center">
          <div class="kpi-mini center-text"><b class="num">${roster.length}/${roster.length}</b><span class="muted tiny">${WB.t("c.boardedN")}</span></div>
          <div class="kpi-mini center-text"><b class="num">38</b><span class="muted tiny">${WB.t("c.min")}</span></div>
        </div>
        <button class="big-action big-action--go" id="btn-start">${icon("play", { width: 24, height: 24 })}<span>${WB.t("c.startNew")}</span></button>
      </div>`;
    } else {
      card = `<div class="card card--pad stack gap4">
        <div class="row between"><span class="live">${WB.t("c.inProgress")} <span class="live-dot"></span></span>
          <span class="badge badge--ok"><span class="num" id="c-ob">0</span>/${roster.length} ${WB.t("c.onboard")}</span></div>
        <div class="map-card" style="height:158px"><div id="cmap" style="position:absolute;inset:0"></div></div>
        <div class="progress"><div class="progress__bar" id="c-bar"></div></div>
        <div class="row between center-text">
          <div class="kpi-mini"><span class="muted tiny">${WB.t("c.next")}</span><b class="small" id="c-next">-</b></div>
          <div class="kpi-mini"><span class="muted tiny">${WB.t("c.eta")}</span><b><span class="num" id="c-eta">0</span> ${WB.t("c.min")}</b></div>
        </div>
        <button class="big-action big-action--stop" id="btn-end">${icon("stop", { width: 22, height: 22 })}<span>${WB.t("c.end")}</span></button>
      </div>`;
    }

    v.innerHTML = `
      <header class="app-head">
        <div class="row between">
          <div class="row gap2"><span data-brand-logo="30"></span><b data-brand-short>WeinBus</b></div>
          <div class="row gap2">
            <button class="btn btn--sm" id="btn-sos" style="background:rgba(255,255,255,.9);color:var(--wb-coral-deep);font-weight:800">${icon("sos", { width: 16, height: 16 })} ${WB.t("c.sos")}</button>
            ${av(chap)}
          </div>
        </div>
        <div style="margin-top:12px">
          <div class="greet">${WB.t("c.hi")}, ${firstName(chap)} 👋</div>
          <div class="dim small">${WB.t("c.morningTrip")} · ${pick(D.routeA.name)} · ${WB.t("c.plate")} <span class="num">${D.trip.plate}</span></div>
        </div>
      </header>
      <div class="stack gap4" style="padding:14px 16px 0">
        ${card}
        <div class="card card--pad">
          <div class="row gap3">
            <div class="notif-ic" style="background:var(--brand-primary-soft)">${icon("broadcast", { width: 22, height: 22 })}</div>
            <div class="grow"><div class="row between"><b class="small">${WB.t("c.office")}</b><span class="muted tiny">${WB.ago(6)}</span></div>
              <div class="muted small">${WB.t("c.officeMsg")}</div></div>
          </div>
        </div>
        <div style="height:8px"></div>
      </div>`;

    if (st.status === "enroute") { pmap = WB.buildMap(qs("#cmap"), {}); T = { ob: qs("#c-ob"), bar: qs("#c-bar"), next: qs("#c-next"), eta: qs("#c-eta") }; }
    else { pmap = null; T = {}; }

    const sb = qs("#btn-start"); if (sb) sb.addEventListener("click", () => { if (st.status === "completed") WB.trip.reset(); WB.trip.start(); });
    const eb = qs("#btn-end"); if (eb) eb.addEventListener("click", () => WB.trip.end());
    const sos = qs("#btn-sos"); if (sos) sos.addEventListener("click", () => WB.toast({ icon: "🆘", tone: "danger", title: WB.t("c.sos"), msg: WB.t("c.sosSent") }, 3500));
    WB.applyBrandDom(v);
    if (st.status === "enroute") updateLive(st);
  }

  function updateLive(st) {
    if (!T.ob) return;
    T.ob.textContent = st.onboard;
    T.bar.style.width = Math.round(st.progress * 100) + "%";
    T.next.textContent = pick(D.routeA.stops[st.nextStopIndex].name);
    T.eta.textContent = st.etaSchool;
    if (pmap) pmap.update(st);
  }

  /* ---------- STUDENTS ---------- */
  function renderStudents() {
    const v = qs("#view-students");
    const st = WB.trip.state();
    const groups = D.routeA.stops.filter((s) => s.kids.length).map((s) => `
      <div class="sec-title">${pick(s.name)} <span class="muted small num">${fmtTime(s.time)}</span></div>
      <div class="card" style="overflow:hidden"><div class="list list--divided">
        ${s.kids.map((id) => { const k = D.student(id); const on = st.onboardIds && st.onboardIds.has(id);
          return `<div class="roster-row" data-row="${id}">
            ${av(k, "")}
            <div class="grow"><b class="small">${pick(k.name)}</b><div class="muted tiny">${WB.t("c.grade")} ${k.grade}</div></div>
            <button class="check-btn ${on ? "on" : ""}" data-check="${id}">${icon("check", { width: 22, height: 22 })}</button>
          </div>`; }).join("")}
      </div></div>`).join("");
    v.innerHTML = `
      <header class="app-head" style="border-radius:0 0 24px 24px">
        <div class="row between"><div class="greet" style="font-size:var(--fs-xl)">${WB.t("c.tab.students")}</div>
          <span class="badge" style="background:rgba(255,255,255,.25);color:var(--brand-on-primary)"><span class="num" id="s-ob">${st.onboard}</span>/${roster.length}</span></div>
        <div class="dim small" style="margin-top:4px">${pick(D.routeA.name)}</div>
      </header>
      <div class="stack" style="padding:6px 16px 0">
        ${st.status === "enroute" ? `<div class="chip chip--brand" style="align-self:center;margin:8px 0">${WB.t("c.tapBoard")}</div>` : ""}
        ${groups}
        <button class="btn btn--soft btn--block" id="btn-scan" style="margin-top:8px">${icon("qr", { width: 20, height: 20 })}<span>${WB.t("c.scan")}</span></button>
        <div style="height:8px"></div>
      </div>`;
    qsa("[data-check]", v).forEach((b) => b.addEventListener("click", () => onCheck(b.getAttribute("data-check"))));
    const scan = qs("#btn-scan"); if (scan) scan.addEventListener("click", onScan);
  }
  function onCheck(id) {
    const st = WB.trip.state();
    if (!st.started) { WB.toast({ icon: "ℹ️", tone: "info", title: WB.t("c.tab.trip"), msg: WB.t("c.startFirst") }, 2600); return; }
    if (st.onboardIds && st.onboardIds.has(id)) return;
    WB.trip.boardNow(id);
  }
  function onScan() {
    const st = WB.trip.state();
    if (!st.started) { WB.toast({ icon: "ℹ️", tone: "info", title: WB.t("c.tab.trip"), msg: WB.t("c.startFirst") }, 2600); return; }
    const nextKid = roster.find((k) => !(st.onboardIds && st.onboardIds.has(k.id)));
    if (nextKid) { WB.trip.boardNow(nextKid.id); WB.toast({ icon: "📷", tone: "ok", title: WB.t("c.scan"), msg: WB.t("c.scanned") }, 2400); }
  }
  function markBoarded(id) {
    const btn = qs(`[data-check="${id}"]`);
    if (btn && !btn.classList.contains("on")) { btn.classList.add("on"); WB.confetti(qs("#app"), 22); }
    const so = qs("#s-ob"); if (so) so.textContent = WB.trip.state().onboard;
  }

  /* ---------- MORE ---------- */
  function renderMore() {
    const v = qs("#view-more");
    v.innerHTML = `
      <header class="app-head" style="border-radius:0 0 24px 24px">
        <div class="row gap3">${av(chap, "avatar--lg")}<div><div class="greet" style="font-size:var(--fs-lg)">${pick(chap.name)}</div>
        <div class="dim small">${WB.t("c.role")}</div></div></div></header>
      <div class="stack gap5" style="padding:16px">
        <div class="card card--pad row between"><b>${WB.t("common.language")}</b>
          <div class="seg seg--sm" id="more-lang">
            <button data-l="en" class="${WB.lang === "en" ? "active" : ""}">English</button>
            <button data-l="ar" class="${WB.lang === "ar" ? "active" : ""}">العربية</button></div></div>
        <div class="card card--pad stack gap3">
          <div class="row between"><span class="row gap2">${icon("phone", { width: 18, height: 18 })}<b class="small">${pick(chap.name)}</b></span><span class="muted small num">${chap.phone}</span></div>
          <div class="hr" style="margin:2px 0"></div>
          <div class="row between"><span class="row gap2">${icon("truck", { width: 18, height: 18 })}<b class="small">${pick(D.trip.model)}</b></span><span class="muted small num">${D.trip.plate}</span></div>
        </div>
        <button class="btn btn--ghost btn--block" style="color:var(--wb-coral-deep)">${WB.t("common.signout")}</button>
        <div class="center-text muted tiny" style="padding:8px">${WB.t("common.poweredBy")} · v1.0</div>
      </div>`;
    qsa("#more-lang button", v).forEach((b) => b.addEventListener("click", () => WB.setLang(b.getAttribute("data-l"))));
  }

  /* ---------- tabs / views ---------- */
  let currentView = "trip";
  const TABS = [["trip", "bus"], ["students", "users"], ["more", "settings"]];
  function renderTabs() {
    qs("#tabbar").innerHTML = TABS.map(([id, ic]) =>
      `<a data-view="${id}" class="${id === currentView ? "active" : ""}">${icon(ic, { width: 23, height: 23 })}<span>${WB.t("c.tab." + id)}</span></a>`).join("");
    qsa("[data-view]", qs("#tabbar")).forEach((a) => a.addEventListener("click", () => showView(a.getAttribute("data-view"))));
  }
  function showView(id) {
    currentView = id;
    qsa(".app > .view").forEach((x) => x.classList.toggle("active", x.id === "view-" + id));
    qsa("[data-view]", qs("#tabbar")).forEach((a) => a.classList.toggle("active", a.getAttribute("data-view") === id));
    if (id === "students") renderStudents();
    if (id === "more") renderMore();
  }

  /* ---------- trip wiring ---------- */
  WB.trip.onEvent((e) => {
    if (e.type === "boarded" && currentView === "students") markBoarded(e.student.id);
  });
  WB.trip.onTick((st) => {
    if (st.status !== shownStatus) { renderTrip(st); if (currentView === "students") renderStudents(); }
    else if (st.status === "enroute") updateLive(st);
  });

  function clock() { const d = new Date(); qs("#clock").textContent = ((d.getHours() % 12) || 12) + ":" + String(d.getMinutes()).padStart(2, "0"); }
  WB.onLang(() => { renderTabs(); renderTrip(); if (currentView !== "trip") showView(currentView); });

  function init() { renderTabs(); renderTrip(); clock(); setInterval(clock, 20000); WB.addBackButton(); }
  if (document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", init);
})(window.WB);
