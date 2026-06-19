/* ============================================================================
   WeinBus, Parent app
   ========================================================================== */
(function (WB) {
  const D = WB.data, qs = WB.qs, icon = WB.icon, pick = WB.pick, fmtTime = WB.fmtTime;
  const EMBED = window.self !== window.top;

  WB.addStrings({
    "p.tab.track": { en: "Track", ar: "تتبّع" },
    "p.tab.alerts": { en: "Alerts", ar: "التنبيهات" },
    "p.tab.kids": { en: "Children", ar: "الأبناء" },
    "p.tab.more": { en: "More", ar: "المزيد" },
    "p.morning": { en: "Good morning", ar: "صباح الخير" },
    "p.toStop": { en: "to your stop", ar: "حتى محطتكم" },
    "p.toSchool": { en: "to school", ar: "حتى المدرسة" },
    "p.onboard": { en: "on board", ar: "على الباص" },
    "p.atSchool": { en: "At school", ar: "في المدرسة" },
    "p.arrived": { en: "Arrived safely", ar: "وصل بأمان" },
    "p.onbus": { en: "On the bus", ar: "على الباص" },
    "p.waiting": { en: "Waiting", ar: "بالانتظار" },
    "p.starts": { en: "Trip starts soon", ar: "تبدأ الرحلة قريباً" },
    "p.waitDriver": { en: "Waiting for the driver to start…", ar: "بانتظار أن يبدأ السائق الرحلة…" },
    "p.routeStops": { en: "Route & stops", ar: "المسار والمحطات" },
    "p.crew": { en: "Today's crew", ar: "طاقم اليوم" },
    "p.driver": { en: "Driver", ar: "السائق" },
    "p.chaperone": { en: "Chaperone", ar: "المرافِقة" },
    "p.call": { en: "Call", ar: "اتصال" },
    "p.msg": { en: "Message", ar: "رسالة" },
    "p.next": { en: "Next", ar: "التالي" },
    "p.busNo": { en: "Bus 7", ar: "الباص 7" },
    "p.myKids": { en: "My children", ar: "أبنائي" },
    "p.grade": { en: "Grade", ar: "الصف" },
    "p.addChild": { en: "Add a child", ar: "إضافة طفل" },
    "p.todays": { en: "Today", ar: "اليوم" },
    "p.earlier": { en: "Earlier", ar: "سابقاً" },
    "p.yesterday": { en: "Yesterday", ar: "أمس" },
    "p.approachStop": { en: "Bus approaching your stop", ar: "الباص يقترب من محطتكم" },
    "p.approachStopMsg": { en: "Bus 7 is about {min} min from {stop}. Please head out. 🏃", ar: "الباص 7 على بُعد {min} دقائق من {stop}. الرجاء التوجّه للمحطة. 🏃" },
    "p.profile": { en: "View profile", ar: "عرض الملف" },
    "p.notifs": { en: "Notifications", ar: "الإشعارات" },
    "p.nBoard": { en: "Boarding & drop-off", ar: "الصعود والنزول" },
    "p.nApproach": { en: "Bus approaching", ar: "اقتراب الباص" },
    "p.nDelay": { en: "Delays & changes", ar: "التأخير والتغييرات" },
    "p.language": { en: "Language", ar: "اللغة" },
    "p.schoolL": { en: "School", ar: "المدرسة" },
    "p.help": { en: "Help & support", ar: "المساعدة والدعم" },
    "p.whatsapp": { en: "Message the school on WhatsApp", ar: "راسل المدرسة عبر واتساب" },
    "p.privacy": { en: "Your data is stored in-region · Amman 🇯🇴", ar: "بياناتك مخزَّنة داخل المنطقة · عمّان 🇯🇴" },
    "p.signout": { en: "Sign out", ar: "تسجيل الخروج" },
    "p.min": { en: "min", ar: "دقيقة" }
  });

  const parent = D.parent(D.me.parentId);
  const KIDS = D.kidsOf(D.me.parentId);
  let selKid = KIDS[0].id;
  let pmap = null, R = {}, feed = [], unread = 0, approachFired = false;

  /* seed history so the feed isn't empty */
  function seedFeed() {
    feed = [
      { key: "tripCompleted", ctx: { bus: 7 }, fixed: { en: "Yesterday · 2:34 PM", ar: "أمس · 2:34 م" } },
      { key: "droppedOff", ctx: { bus: 7, sid: "st4", stopIdx: 2, time: "14:31" }, fixed: { en: "Yesterday · 2:31 PM", ar: "أمس · 2:31 م" } },
      { key: "arrivedSchool", ctx: { bus: 7, sid: "st4" }, fixed: { en: "Yesterday · 7:36 AM", ar: "أمس · 7:36 ص" } }
    ];
  }

  function av(p, cls) {
    cls = cls || "";
    if (p.photo) return `<div class="avatar ${cls}"><img src="${p.photo}" alt=""></div>`;
    return `<div class="avatar ${cls}" style="background:${p.color || "#94A3B8"}">${p.initials || ""}</div>`;
  }
  function firstName(p) { return pick(p.name).split(" ")[0]; }

  function notifVarsCtx(c) {
    const vars = { bus: c.bus, min: c.min, eta: c.eta && fmtTime(c.eta), time: c.time && fmtTime(c.time) };
    if (c.sid) vars.name = pick(D.student(c.sid).name);
    if (c.stopIdx != null) vars.stop = pick(D.routeA.stops[c.stopIdx].name);
    return vars;
  }
  function buildNotif(item) {
    if (item.key === "p.approachStop")
      return { icon: "📍", tone: "warn", title: WB.t("p.approachStop"), msg: WB.fmt(WB.t("p.approachStopMsg"), notifVarsCtx(item.ctx)) };
    return WB.notify(item.key, notifVarsCtx(item.ctx));
  }

  /* ---------- TRACK ---------- */
  function kidStatus(kid, st) {
    if (st.status === "completed") return "school";
    if (st.onboardIds && st.onboardIds.has(kid.id)) return "onbus";
    return "waiting";
  }
  function statusBadge(s) {
    if (s === "school") return `<span class="badge badge--info">${icon("building", { width: 13, height: 13 })} ${WB.t("p.atSchool")}</span>`;
    if (s === "onbus") return `<span class="badge badge--ok">${icon("check", { width: 13, height: 13 })} ${WB.t("p.onbus")}</span>`;
    return `<span class="badge badge--muted">${icon("clock", { width: 13, height: 13 })} ${WB.t("p.waiting")}</span>`;
  }

  function renderTrack() {
    const v = qs("#view-track");
    const kid = D.student(selKid);
    const chips = KIDS.map((k) => `<button class="kidchip ${k.id === selKid ? "active" : ""}" data-kid="${k.id}">
        ${av(k, "avatar--sm")}<span class="bold small">${firstName(k)}</span></button>`).join("");
    v.innerHTML = `
      <header class="app-head">
        <div class="row between">
          <div class="row gap2"><span data-brand-logo="30"></span><b data-brand-short>WeinBus</b></div>
          <div class="row gap2">
            <button class="btn btn--pill-icon" style="background:rgba(255,255,255,.22);color:var(--brand-on-primary)" data-go="alerts">${icon("bell", { width: 20, height: 20 })}</button>
            ${av(parent, "")}
          </div>
        </div>
        <div style="margin-top:12px">
          <div class="greet">${WB.t("p.morning")}, ${firstName(parent)} 👋</div>
          <div class="dim small">${pick(D.routeA.shift)} · ${pick(D.routeA.name)}</div>
        </div>
        <div class="kidchips" style="margin-top:14px">${chips}</div>
      </header>
      <div class="stack gap4" style="padding:14px 16px 0">
        <div class="map-card" style="height:220px;box-shadow:var(--sh-md)">
          <div id="pmap" style="position:absolute;inset:0"></div>
          <div class="map-top">
            <span class="map-pill"><span class="live-dot"></span><span class="num" id="m-live">${WB.t("common.live")}</span></span>
            <span class="map-pill">${icon("bus", { width: 16, height: 16, class: "" })}<span>${WB.t("p.busNo")}</span></span>
          </div>
          <div class="map-overlay"><span class="map-pill" style="font-size:var(--fs-xs)">${av(D.staff.chaperone, "avatar--sm")}<span>${pick(D.staff.chaperone.nick)} · ${WB.t("p.chaperone")}</span></span></div>
        </div>

        <div class="card card--pad">
          <div class="row between" style="align-items:flex-start">
            <div>
              <div class="row gap2" style="margin-bottom:4px">${av(kid, "avatar--sm")}<b id="t-kidname">${firstName(kid)}</b><span id="t-kidbadge">${statusBadge("waiting")}</span></div>
              <div class="muted small" id="eta-label">${WB.t("p.toStop")}</div>
              <div class="row" style="align-items:baseline;gap:6px"><span class="eta-num num" id="eta-num">-</span><span class="big bold" id="eta-unit">${WB.t("p.min")}</span></div>
            </div>
            <div class="center-text"><div class="eta-num num" id="ob-num">0</div><div class="muted small">${WB.t("p.onboard")}</div></div>
          </div>
          <div class="progress" style="margin-top:14px"><div class="progress__bar" id="eta-bar"></div></div>
          <div class="row between small" style="margin-top:8px">
            <span class="muted">${pick(D.routeA.stops[0].name)}</span>
            <span class="bold" id="nextstop">-</span>
            <span class="muted">${pick(D.routeA.stops[4].name)}</span>
          </div>
        </div>

        <div class="card card--pad">
          <div class="sec-title" style="margin-top:0">${WB.t("p.routeStops")}</div>
          <div class="timeline" id="timeline">
            ${D.routeA.stops.map((s, i) => `
              <div class="tl-row" data-i="${i}">
                <div class="tl-node"><div class="tl-dot"></div><div class="tl-line"></div></div>
                <div class="tl-body"><div class="row between"><span class="tl-name">${pick(s.name)}</span><span class="muted small num">${fmtTime(s.time)}</span></div>
                ${s.kids.length ? `<div class="muted tiny">${s.kids.map((k) => firstName(D.student(k))).join("، ")}</div>` : ""}</div>
              </div>`).join("")}
          </div>
        </div>

        <div class="card card--pad">
          <div class="sec-title" style="margin-top:0">${WB.t("p.crew")}</div>
          ${crewRow(D.staff.chaperone, WB.t("p.chaperone"))}
          <div class="hr"></div>
          ${crewRow(D.staff.driver, WB.t("p.driver"))}
        </div>
        <div style="height:8px"></div>
      </div>`;

    qs("#pmap") && (pmap = WB.buildMap(qs("#pmap"), { homeStop: 2 }));
    R = {
      eta: qs("#eta-num"), etaLabel: qs("#eta-label"), etaUnit: qs("#eta-unit"),
      ob: qs("#ob-num"), bar: qs("#eta-bar"), next: qs("#nextstop"),
      kidBadge: qs("#t-kidbadge"), kidName: qs("#t-kidname")
    };
    v.querySelectorAll("[data-kid]").forEach((b) => b.addEventListener("click", () => { selKid = b.getAttribute("data-kid"); renderTrack(); pushTick(); }));
    v.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => showView(b.getAttribute("data-go"))));
    pushTick();
  }
  function crewRow(p, role) {
    return `<div class="row between">
      <div class="row gap3">${av(p)}<div><b>${pick(p.name)}</b><div class="muted small">${role} · ${WB.t("p.busNo")}</div></div></div>
      <div class="row gap2">
        <a class="btn btn--soft btn--sm" href="${WB.telHref(p.phone)}">${icon("phone", { width: 16, height: 16 })}<span>${WB.t("p.call")}</span></a>
        <button class="btn btn--ghost btn--sm">${icon("message", { width: 16, height: 16 })}</button>
      </div></div>`;
  }

  function updateTrack(st) {
    if (!R.eta) return;
    const kid = D.student(selKid);
    const status = kidStatus(kid, st);
    R.kidBadge.innerHTML = statusBadge(status);
    R.kidName.textContent = firstName(kid);
    R.ob.textContent = st.onboard;
    R.bar.style.width = Math.round((st.started ? st.progress : 0) * 100) + "%";
    R.next.textContent = WB.t("p.next") + ": " + pick(D.routeA.stops[st.nextStopIndex].name);

    const NOW = WB.lang === "ar" ? "الآن" : "Now";
    const setEta = (v, label) => {
      R.etaLabel.textContent = label;
      if (v === "🎒") { R.eta.textContent = "🎒"; R.etaUnit.style.display = "none"; }
      else if (v <= 0) { R.eta.textContent = NOW; R.etaUnit.style.display = "none"; }
      else { R.eta.textContent = v; R.etaUnit.style.display = ""; }
    };
    if (!st.started) { R.eta.textContent = "-"; R.etaUnit.style.display = ""; R.etaLabel.textContent = WB.t("p.starts"); }
    else if (st.status === "completed") setEta("🎒", WB.t("p.arrived"));
    else if (status === "waiting") setEta(WB.trip.etaToStop(kid.stop), WB.t("p.toStop"));
    else setEta(st.etaSchool, WB.t("p.toSchool"));

    if (pmap) pmap.update(st);
    WB.qsa("#timeline .tl-row").forEach((row, i) => {
      row.classList.toggle("done", st.progress >= (WB.trip.depart[i] - 0.001) && st.started);
      row.classList.toggle("current", i === st.nextStopIndex && st.status === "enroute");
    });

    // parent-local "approaching your stop" one-shot
    if (st.started && !approachFired && status === "waiting") {
      const togo = WB.trip.etaToStop(kid.stop);
      if (st.progress > 0.18 && togo <= 5 && togo > 0) {
        approachFired = true;
        pushNotif({ key: "p.approachStop", ctx: { bus: 7, min: togo, stopIdx: kid.stop } }, true);
      }
    }
  }

  /* ---------- ALERTS ---------- */
  function renderAlerts() {
    unread = 0; paintTabBadge();
    const v = qs("#view-alerts");
    v.innerHTML = `
      <header class="app-head" style="border-radius:0 0 24px 24px">
        <div class="row between"><div class="greet" style="font-size:var(--fs-xl)">${WB.t("p.tab.alerts")}</div>
        ${av(parent, "")}</div>
        <div class="dim small" style="margin-top:4px">${pick(parent.name)} · ${WB.t("p.busNo")}</div>
      </header>
      <div class="stack" style="padding:14px 12px 0"><div class="muted uppercase" style="padding:0 6px 4px">${WB.t("p.todays")}</div>
        <div class="card" style="overflow:hidden"><div class="list" id="feed"></div></div></div>`;
    paintFeed();
  }
  function paintFeed() {
    const f = qs("#feed"); if (!f) return;
    f.innerHTML = feed.map((it, idx) => {
      const n = buildNotif(it); if (!n) return "";
      const tone = { ok: "var(--wb-green-soft)", info: "var(--wb-blue-soft)", warn: "var(--wb-amber-soft)", danger: "var(--wb-coral-soft)" }[n.tone] || "var(--wb-blue-soft)";
      const time = it.fixed ? pick(it.fixed) : WB.ago(it.ago || 0);
      return `<div class="notif-row ${it.unread ? "unread" : ""} ${idx === 0 && it.live ? "notif-new" : ""}">
        <div class="notif-ic" style="background:${tone}">${n.icon}</div>
        <div class="grow"><div class="row between gap2"><b class="small">${n.title}</b><span class="muted tiny nowrap">${time}</span></div>
        <div class="muted small">${n.msg}</div></div></div>`;
    }).join("");
  }
  function pushNotif(item, confetti) {
    item.live = true; item.unread = true; item.ago = 0;
    feed.unshift(item);
    if (currentView !== "alerts") { unread++; paintTabBadge(); } else { item.unread = false; paintFeed(); }
    const n = buildNotif(item);
    if (n) WB.toast(n, 3800);
    if (confetti) WB.confetti(qs("#app"), 40);
  }

  /* ---------- KIDS ---------- */
  function renderKids() {
    const v = qs("#view-kids");
    const st = WB.trip.state();
    v.innerHTML = `
      <header class="app-head" style="border-radius:0 0 24px 24px">
        <div class="greet" style="font-size:var(--fs-xl)">${WB.t("p.myKids")}</div>
        <div class="dim small" style="margin-top:4px">${pick(parent.name)}</div></header>
      <div class="stack gap4" style="padding:16px">
        ${KIDS.map((k) => {
          const s = kidStatus(k, st), stop = D.routeA.stops.find((x) => x.i === k.stop);
          return `<div class="card card--pad">
            <div class="row between"><div class="row gap3">${av(k, "avatar--lg")}
              <div><b class="big">${pick(k.name)}</b><div class="muted small">${WB.t("p.grade")} ${k.grade} · ${pick(D.schools[0].short)}</div></div></div>
              ${statusBadge(s)}</div>
            <div class="hr"></div>
            <div class="row between small"><span class="muted">${icon("route", { width: 15, height: 15, class: "" })} ${WB.t("p.routeStops")}</span><b>${pick(D.routeA.name)}</b></div>
            <div class="row between small" style="margin-top:8px"><span class="muted">${icon("pin", { width: 15, height: 15 })} ${pick(stop.name)}</span><b class="num">${fmtTime(stop.time)}</b></div>
          </div>`;
        }).join("")}
        <button class="btn btn--ghost btn--block">${icon("plus", { width: 18, height: 18 })}<span>${WB.t("p.addChild")}</span></button>
      </div>`;
  }

  /* ---------- MORE ---------- */
  function renderMore() {
    const v = qs("#view-more");
    v.innerHTML = `
      <header class="app-head" style="border-radius:0 0 24px 24px">
        <div class="row gap3">${av(parent, "avatar--lg")}<div><div class="greet" style="font-size:var(--fs-lg)">${pick(parent.name)}</div>
        <div class="dim small num">${parent.phone}</div></div></div></header>
      <div class="stack gap5" style="padding:16px">
        <div class="card card--pad">
          <div class="sec-title" style="margin-top:0">${WB.t("p.notifs")}</div>
          ${toggleRow("bell", WB.t("p.nBoard"), true)}
          ${toggleRow("pin", WB.t("p.nApproach"), true)}
          ${toggleRow("clock", WB.t("p.nDelay"), true)}
        </div>
        <div class="card card--pad">
          <div class="row between"><b>${WB.t("p.language")}</b>
            <div class="seg seg--sm" id="more-lang">
              <button data-l="en" class="${WB.lang === "en" ? "active" : ""}">English</button>
              <button data-l="ar" class="${WB.lang === "ar" ? "active" : ""}">العربية</button></div></div>
          <div class="hr"></div>
          <div class="row between"><span class="row gap2">${icon("building", { width: 18, height: 18 })}<b>${WB.t("p.schoolL")}</b></span><span data-brand-name class="muted small">-</span></div>
        </div>
        <button class="btn btn--ghost btn--block" style="color:var(--wb-coral-deep)">${WB.t("p.signout")}</button>
        <div class="center-text muted tiny" style="padding:8px">${WB.t("common.poweredBy")} · v1.0</div>
      </div>`;
    v.querySelectorAll("#more-lang button").forEach((b) => b.addEventListener("click", () => WB.setLang(b.getAttribute("data-l"))));
    v.querySelectorAll(".switch").forEach((s) => s.addEventListener("click", () => s.classList.toggle("on")));
    WB.applyBrandDom(v);
  }
  function toggleRow(ic, label, on) {
    return `<div class="row between" style="padding:8px 0"><span class="row gap2">${icon(ic, { width: 18, height: 18 })}<span class="bold small">${label}</span></span>
      <div class="switch ${on ? "on" : ""}"></div></div>`;
  }

  /* ---------- tab bar / views ---------- */
  let currentView = "track";
  const TABS = [["track", "home"], ["alerts", "bell"], ["kids", "users"], ["more", "settings"]];
  function renderTabs() {
    qs("#tabbar").innerHTML = TABS.map(([id, ic]) =>
      `<a data-view="${id}" class="${id === currentView ? "active" : ""}">${icon(ic, { width: 23, height: 23 })}
        <span data-i18n="p.tab.${id}">${WB.t("p.tab." + id)}</span>${id === "alerts" ? '<span class="tab-badge" id="tabBadge"></span>' : ""}</a>`).join("");
    qs("#tabbar").querySelectorAll("[data-view]").forEach((a) => a.addEventListener("click", () => showView(a.getAttribute("data-view"))));
    paintTabBadge();
  }
  function paintTabBadge() {
    const b = qs("#tabBadge"); if (!b) return;
    b.textContent = unread || ""; b.style.display = unread ? "grid" : "none";
  }
  function showView(id) {
    currentView = id;
    WB.qsa(".app > .view").forEach((v) => v.classList.toggle("active", v.id === "view-" + id));
    qs("#tabbar").querySelectorAll("[data-view]").forEach((a) => a.classList.toggle("active", a.getAttribute("data-view") === id));
    if (id === "alerts") renderAlerts();
    if (id === "kids") renderKids();
    if (id === "more") renderMore();
  }
  function pushTick() { updateTrack(WB.trip.state()); }

  /* ---------- trip events ---------- */
  WB.trip.onEvent((e) => {
    if (e.type === "started") pushNotif({ key: "tripStarted", ctx: { bus: 7 } });
    else if (e.type === "boarded") {
      if (e.student.parent === D.me.parentId) {
        pushNotif({ key: "boarded", ctx: { bus: 7, sid: e.student.id, time: e.time } }, true);
      }
      if (currentView === "kids") renderKids();
    } else if (e.type === "arrived") { pushNotif({ key: "arrivedSchool", ctx: { bus: 7, sid: selKid } }); if (currentView === "kids") renderKids(); }
    else if (e.type === "completed") pushNotif({ key: "tripCompleted", ctx: { bus: 7 } });
  });
  WB.trip.onTick((st) => updateTrack(st));

  /* ---------- clock ---------- */
  function clock() {
    const d = new Date(), h = d.getHours(), m = String(d.getMinutes()).padStart(2, "0");
    qs("#clock").textContent = ((h % 12) || 12) + ":" + m;
  }

  /* ---------- lang / brand re-render ---------- */
  WB.onLang(() => { renderTabs(); renderTrack(); if (currentView !== "track") showView(currentView); });
  WB.onBrand(() => { if (pmap) pmap.update(WB.trip.state()); });

  /* ---------- init ---------- */
  function init() {
    seedFeed(); renderTabs(); renderTrack(); clock(); setInterval(clock, 20000);
    WB.addBackButton();
    if (!EMBED) { WB.trip.setLoop(true); WB.trip.ensureRunning(); }
  }
  if (document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", init);
})(window.WB);
