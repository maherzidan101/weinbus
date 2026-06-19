/* ============================================================================
   WeinBus, School Console (admin). Multi-tenant SaaS back office.
   ========================================================================== */
(function (WB) {
  const D = WB.data, qs = WB.qs, qsa = WB.qsa, icon = WB.icon, pick = WB.pick, fmtTime = WB.fmtTime;
  const EMBED = window.self !== window.top;

  WB.addStrings({
    "a.dashboard": { en: "Dashboard", ar: "الرئيسية" },
    "a.fleet": { en: "Fleet", ar: "الأسطول" },
    "a.routes": { en: "Routes", ar: "المسارات" },
    "a.students": { en: "Students", ar: "الطلاب" },
    "a.parents": { en: "Parents", ar: "أولياء الأمور" },
    "a.branding": { en: "Branding", ar: "الهوية" },
    "a.activeBuses": { en: "Active buses", ar: "الباصات النشطة" },
    "a.riding": { en: "Students riding", ar: "طلاب على المتن" },
    "a.onTime": { en: "On-time", ar: "في الوقت" },
    "a.tripsToday": { en: "Trips today", ar: "رحلات اليوم" },
    "a.liveFleet": { en: "Live fleet monitor", ar: "مراقبة الأسطول المباشرة" },
    "a.liveMap": { en: "Live map · Bus 7", ar: "الخريطة المباشرة · الباص 7" },
    "a.activity": { en: "Recent activity", ar: "النشاط الأخير" },
    "a.route": { en: "Route", ar: "المسار" },
    "a.bus": { en: "Bus", ar: "الباص" },
    "a.statusH": { en: "Status", ar: "الحالة" },
    "a.onboard": { en: "On board", ar: "على المتن" },
    "a.driver": { en: "Driver", ar: "السائق" },
    "a.chaperone": { en: "Chaperone", ar: "المرافِقة" },
    "a.capacity": { en: "Capacity", ar: "السعة" },
    "a.model": { en: "Model", ar: "الطراز" },
    "a.plate": { en: "Plate", ar: "اللوحة" },
    "a.stopsH": { en: "Stops", ar: "المحطات" },
    "a.shift": { en: "Shift", ar: "الفترة" },
    "a.studentH": { en: "Student", ar: "الطالب" },
    "a.grade": { en: "Grade", ar: "الصف" },
    "a.stopH": { en: "Stop", ar: "المحطة" },
    "a.parentH": { en: "Parent", ar: "ولي الأمر" },
    "a.phone": { en: "Phone", ar: "الهاتف" },
    "a.children": { en: "Children", ar: "الأبناء" },
    "a.search": { en: "Search…", ar: "بحث…" },
    "a.add": { en: "Add", ar: "إضافة" },
    "a.morning": { en: "Morning shift · Today", ar: "الفترة الصباحية · اليوم" },
    "st.live": { en: "Live", ar: "مباشر" },
    "st.completed": { en: "Completed", ar: "مكتملة" },
    "st.scheduled": { en: "Scheduled", ar: "مجدولة" },
    "st.maintenance": { en: "Maintenance", ar: "صيانة" },
    "st.waiting": { en: "Waiting", ar: "بالانتظار" },
    "st.onbus": { en: "On bus", ar: "على الباص" },
    "st.atschool": { en: "At school", ar: "في المدرسة" },
    "a.brandTitle": { en: "Make it yours", ar: "اجعلها هويتك" },
    "a.brandSub": { en: "Every school gets a branded workspace, logo, colors and a private subdomain. Pick a tenant and watch the whole platform re-skin instantly.", ar: "كل مدرسة تحصل على مساحة عمل بهويتها, شعار وألوان ونطاق فرعي خاص. اختر مستأجراً وشاهد إعادة تنسيق المنصة فوراً." },
    "a.workspace": { en: "Workspace", ar: "مساحة العمل" },
    "a.subdomain": { en: "Subdomain", ar: "النطاق الفرعي" },
    "a.colors": { en: "Brand colors", ar: "ألوان الهوية" },
    "a.logo": { en: "Logo", ar: "الشعار" },
    "a.applyNote": { en: "Applies instantly to the Parent app, Chaperone app and this console.", ar: "يُطبَّق فوراً على تطبيق ولي الأمر وتطبيق المرافِقة وهذه اللوحة." },
    "a.active": { en: "Active", ar: "نشط" },
    "a.principal": { en: "Principal", ar: "مديرة المدرسة" },
    "a.crew": { en: "Crew", ar: "الطاقم" },
    "a.role": { en: "Role", ar: "الدور" },
    "a.name": { en: "Name", ar: "الاسم" },
    "a.chaperonesN": { en: "chaperones", ar: "مرافِقات" },
    "a.driversN": { en: "drivers", ar: "سائقون" }
  });

  const ROUTES = [
    { l: "A", name: { en: "Khalda → Al-Manhal", ar: "خلدا ← المنهل" }, bus: 7, stops: 5, studs: 8 },
    { l: "B", name: { en: "Abdoun → Al-Manhal", ar: "عبدون ← المنهل" }, bus: 3, stops: 6, studs: 22 },
    { l: "C", name: { en: "Dabouq → Al-Manhal", ar: "دابوق ← المنهل" }, bus: 5, stops: 5, studs: 19 },
    { l: "D", name: { en: "Sweifieh → Al-Manhal", ar: "الصويفية ← المنهل" }, bus: 12, stops: 7, studs: 26 },
    { l: "E", name: { en: "Jubeiha → Al-Manhal", ar: "الجبيهة ← المنهل" }, bus: 9, stops: 6, studs: 21 },
    { l: "F", name: { en: "Deir Ghbar → Al-Manhal", ar: "دير غبار ← المنهل" }, bus: 2, stops: 5, studs: 17 },
    { l: "G", name: { en: "Marj Al-Hamam → Al-Manhal", ar: "مرج الحمام ← المنهل" }, bus: 8, stops: 6, studs: 23 }
  ];
  const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

  function badgeFor(s) {
    const m = { live: ["ok", "st.live"], completed: ["info", "st.completed"], scheduled: ["muted", "st.scheduled"], maintenance: ["warn", "st.maintenance"], waiting: ["muted", "st.waiting"], onbus: ["ok", "st.onbus"], atschool: ["info", "st.atschool"] };
    const [tone, key] = m[s] || ["muted", "st.scheduled"];
    return `<span class="badge badge--${tone}">${s === "live" ? '<span class="live-dot"></span>' : ""}${WB.t(key)}</span>`;
  }
  function av(p, cls) { cls = cls || ""; if (p.photo) return `<div class="avatar ${cls}"><img src="${p.photo}"></div>`; return `<div class="avatar ${cls}" style="background:${p.color || "#94A3B8"}">${p.initials || ""}</div>`; }
  function pageHead(title, sub, right) {
    return `<div class="row between wrap gap4" style="margin-bottom:20px">
      <div><h2>${title}</h2><div class="muted small">${sub || ""}</div></div>
      <div class="row gap3">${right || ""}</div></div>`;
  }
  function searchBox() {
    return `<div class="row gap2" style="background:var(--surface);border:1px solid var(--line);border-radius:var(--r-pill);padding:8px 14px;color:var(--ink-3)">${icon("search", { width: 18, height: 18 })}<span class="small" data-i18n="a.search">Search…</span></div>`;
  }

  /* ---------- DASHBOARD ---------- */
  let amap = null, AR = {}, activity = [];
  function renderDashboard() {
    const st = WB.trip.state();
    const kpi = (num, suf, label, ic, tone) => `<div class="stat"><div class="stat__icon" style="background:${tone}1f;color:${tone}">${icon(ic, { width: 20, height: 20 })}</div>
      <div class="stat__num"><span data-count="${num}" data-suffix="${suf || ""}">0</span></div><div class="stat__label">${label}</div></div>`;
    qs("#main").innerHTML = pageHead(WB.t("a.dashboard"), WB.t("a.morning"),
      `<span class="live" style="font-size:var(--fs-sm)">${WB.t("st.live")} <span class="live-dot"></span></span>` + searchBox()) + `
      <div class="admin-grid cols-4" style="margin-bottom:18px">
        ${kpi(D.kpis.activeNow, "", WB.t("a.activeBuses"), "bus", "#10B981")}
        ${kpi(D.kpis.students, "", WB.t("a.riding"), "users", "#1E88E5")}
        ${kpi(D.kpis.onTime, "%", WB.t("a.onTime"), "clock", "#F59E0B")}
        ${kpi(D.kpis.tripsToday, "", WB.t("a.tripsToday"), "route", "#8B7CF6")}
      </div>
      <div style="display:grid;grid-template-columns:1.5fr 1fr;gap:16px;align-items:start" class="dash-2">
        <div class="card card--pad">
          <div class="sec-title" style="margin-top:0">${WB.t("a.liveFleet")}</div>
          <div class="list" id="fleetmon"></div>
        </div>
        <div class="card card--pad">
          <div class="sec-title" style="margin-top:0">${WB.t("a.liveMap")}</div>
          <div class="map-card mini-map" style="height:240px"><div id="adminmap" style="position:absolute;inset:0"></div>
            <div class="map-top"><span class="map-pill"><span class="live-dot"></span>${WB.t("st.live")}</span></div></div>
        </div>
      </div>
      <div class="card card--pad" style="margin-top:16px">
        <div class="sec-title" style="margin-top:0">${WB.t("a.activity")}</div>
        <div class="list" id="activity"></div>
      </div>`;
    paintFleetMon(st);
    amap = WB.buildMap(qs("#adminmap"), {}); amap.update(st);
    paintActivity();
    qsa("[data-count]").forEach(WB.countUp);
    AR = { mon: qs("#fleetmon") };
  }
  function paintFleetMon(st) {
    const mon = qs("#fleetmon"); if (!mon) return;
    mon.innerHTML = D.todayTrips.map((t) => {
      const isA = t.route === "A";
      const onb = isA ? st.onboard : t.onboard, tot = isA ? st.total : t.total;
      const prog = isA ? (st.started ? st.progress : 0) : t.progress;
      const status = isA ? (st.status === "completed" ? "completed" : st.started ? "live" : "scheduled") : t.status;
      return `<div class="row-item" data-route="${t.route}">
        <div class="avatar avatar--sm" style="background:var(--brand-primary-soft);color:var(--brand-primary-deep)">${t.route}</div>
        <div class="grow"><div class="row between"><b class="small">${WB.t("a.route")} ${t.route} · ${WB.t("a.bus")} ${t.bus}</b>${badgeFor(status)}</div>
          <div class="progress progress--thin" style="margin-top:7px"><div class="progress__bar" style="width:${Math.round(prog * 100)}%"></div></div></div>
        <div class="center-text" style="min-width:46px"><b class="num">${onb}/${tot}</b><div class="muted tiny">${WB.t("a.onboard")}</div></div>
      </div>`;
    }).join("");
  }
  function seedActivity() {
    activity = [
      { icon: "🏫", tone: "ok", title: { en: "Bus 12 arrived at school", ar: "وصل الباص 12 إلى المدرسة" }, t: 4 },
      { icon: "🚌", tone: "info", title: { en: "Bus 3 started Route B", ar: "بدأ الباص 3 المسار B" }, t: 11 },
      { icon: "✅", tone: "ok", title: { en: "18 students boarded on Route B", ar: "صعد 18 طالباً في المسار B" }, t: 12 }
    ];
  }
  function addActivity(it) { it.t = 0; activity.unshift(it); activity = activity.slice(0, 8); paintActivity(); }
  function paintActivity() {
    const a = qs("#activity"); if (!a) return;
    a.innerHTML = activity.map((it) => {
      const tone = { ok: "var(--wb-green-soft)", info: "var(--wb-blue-soft)", warn: "var(--wb-amber-soft)", danger: "var(--wb-coral-soft)" }[it.tone] || "var(--wb-blue-soft)";
      return `<div class="row-item"><div class="notif-ic" style="width:38px;height:38px;font-size:18px;background:${tone}">${it.icon}</div>
        <b class="small grow">${pick(it.title)}</b><span class="muted tiny">${WB.ago(it.t)}</span></div>`;
    }).join("");
  }

  /* ---------- FLEET ---------- */
  function renderFleet() {
    qs("#main").innerHTML = pageHead(WB.t("a.fleet"), `${D.kpis.buses} ${WB.t("a.bus")} · ${D.kpis.activeNow} ${WB.t("st.live")}`,
      searchBox() + `<button class="btn btn--primary btn--sm">${icon("plus", { width: 16, height: 16 })} ${WB.t("a.add")}</button>`) + `
      <div class="card" style="overflow:auto"><table class="data-table"><thead><tr>
        <th>${WB.t("a.bus")}</th><th>${WB.t("a.model")}</th><th>${WB.t("a.plate")}</th><th>${WB.t("a.route")}</th>
        <th>${WB.t("a.capacity")}</th><th>${WB.t("a.driver")}</th><th>${WB.t("a.chaperone")}</th><th>${WB.t("a.statusH")}</th></tr></thead><tbody>
        ${D.fleet.map((b) => `<tr><td><div class="row gap2"><div class="avatar avatar--sm" style="background:var(--brand-primary-soft);color:var(--brand-primary-deep)">${b.no}</div></div></td>
          <td>${pick(b.model)}</td><td class="num">${b.plate}</td><td>${b.route}</td><td class="num">${b.cap}</td>
          <td>${b.driver}</td><td>${b.chap}</td><td>${badgeFor(b.status)}</td></tr>`).join("")}
      </tbody></table></div>`;
  }

  /* ---------- ROUTES ---------- */
  function renderRoutes() {
    const st = WB.trip.state();
    qs("#main").innerHTML = pageHead(WB.t("a.routes"), `${ROUTES.length} ${WB.t("a.routes")} · ${WB.t("a.morning")}`, searchBox()) + `
      <div class="card card--pad" style="margin-bottom:16px">
        <div class="row between"><div><div class="row gap2"><span class="badge badge--brand">${WB.t("a.route")} A</span>${badgeFor(st.started ? (st.status === "completed" ? "completed" : "live") : "scheduled")}</div>
          <h3 style="margin-top:8px">${pick(D.routeA.name)}</h3></div>
          <div class="center-text"><div class="stat__num"><span class="num">${D.roster().length}</span></div><div class="muted small">${WB.t("a.students")}</div></div></div>
        <div class="hr"></div>
        <div class="timeline">${D.routeA.stops.map((s) => `<div class="tl-row ${st.started && st.progress >= WB.trip.depart[s.i] ? "done" : ""}">
          <div class="tl-node"><div class="tl-dot"></div><div class="tl-line"></div></div>
          <div class="tl-body"><div class="row between"><span class="tl-name">${pick(s.name)}</span><span class="muted small num">${fmtTime(s.time)}</span></div>
          <div class="muted tiny">${s.kids.length ? s.kids.length + " " + WB.t("a.students") : "-"}</div></div></div>`).join("")}</div>
      </div>
      <div class="card" style="overflow:auto"><table class="data-table"><thead><tr>
        <th>${WB.t("a.route")}</th><th>${WB.t("a.routes")}</th><th>${WB.t("a.bus")}</th><th>${WB.t("a.stopsH")}</th><th>${WB.t("a.students")}</th></tr></thead><tbody>
        ${ROUTES.map((r) => `<tr><td><span class="badge badge--brand">${r.l}</span></td><td>${pick(r.name)}</td><td class="num">${r.bus}</td><td class="num">${r.stops}</td><td class="num">${r.studs}</td></tr>`).join("")}
      </tbody></table></div>`;
  }

  /* ---------- STUDENTS ---------- */
  function renderStudents() {
    const st = WB.trip.state();
    qs("#main").innerHTML = pageHead(WB.t("a.students"), `${D.kpis.students} ${WB.t("a.students")}`,
      searchBox() + `<button class="btn btn--primary btn--sm">${icon("plus", { width: 16, height: 16 })} ${WB.t("a.add")}</button>`) + `
      <div class="card" style="overflow:auto"><table class="data-table"><thead><tr>
        <th>${WB.t("a.studentH")}</th><th>${WB.t("a.grade")}</th><th>${WB.t("a.route")}</th><th>${WB.t("a.stopH")}</th><th>${WB.t("a.parentH")}</th><th>${WB.t("a.statusH")}</th></tr></thead><tbody id="stud-body">
        ${studentRows(st)}</tbody></table></div>`;
  }
  function studentRows(st) {
    return D.students.map((s) => {
      const stp = D.routeA.stops.find((x) => x.i === s.stop), par = D.parent(s.parent);
      const status = st.status === "completed" ? "atschool" : (st.onboardIds && st.onboardIds.has(s.id)) ? "onbus" : "waiting";
      return `<tr><td><div class="row gap2">${av(s, "avatar--sm")}<b>${pick(s.name)}</b></div></td>
        <td class="num">${s.grade}</td><td>A</td><td>${pick(stp.name)}</td><td>${pick(par.name)}</td><td>${badgeFor(status)}</td></tr>`;
    }).join("");
  }

  /* ---------- PARENTS ---------- */
  function renderParents() {
    qs("#main").innerHTML = pageHead(WB.t("a.parents"), `${D.kpis.parents} ${WB.t("a.parents")}`,
      searchBox() + `<button class="btn btn--primary btn--sm">${icon("plus", { width: 16, height: 16 })} ${WB.t("a.add")}</button>`) + `
      <div class="card" style="overflow:auto"><table class="data-table"><thead><tr>
        <th>${WB.t("a.parentH")}</th><th>${WB.t("a.phone")}</th><th>${WB.t("a.children")}</th></tr></thead><tbody>
        ${D.parents.map((p) => `<tr><td><div class="row gap2">${av(p, "avatar--sm")}<b>${pick(p.name)}</b></div></td>
          <td class="num">${p.phone}</td><td>${p.kids.map((k) => pick(D.student(k).name)).join("، ")}</td></tr>`).join("")}
      </tbody></table></div>`;
  }

  /* ---------- CREW (chaperones + drivers) ---------- */
  function ini(n) { return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(); }
  function genPhone(seed) { let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0; const p = ["77", "78", "79"][h % 3], n = String(h % 10000000).padStart(7, "0"); return `+962 ${p} ${n.slice(0, 3)} ${n.slice(3)}`; }
  function crewList() {
    const ch = D.staff.chaperone, dr = D.staff.driver, rows = [];
    rows.push({ name: pick(ch.name), role: "chaperone", bus: 7, route: "A", phone: ch.phone, status: "live", photo: ch.photo, initials: ch.initials, color: ch.color });
    rows.push({ name: pick(dr.name), role: "driver", bus: 7, route: "A", phone: dr.phone, status: "live", initials: dr.initials, color: dr.color });
    D.fleet.filter((b) => b.no !== 7 && b.chap !== "-").forEach((b) => {
      rows.push({ name: b.chap, role: "chaperone", bus: b.no, route: b.route, phone: genPhone(b.chap), status: b.status, initials: ini(b.chap), color: "#8B7CF6" });
      rows.push({ name: b.driver, role: "driver", bus: b.no, route: b.route, phone: genPhone(b.driver), status: b.status, initials: ini(b.driver), color: "#1E88E5" });
    });
    return rows.sort((a, b) => (a.role === b.role ? a.bus - b.bus : (a.role === "chaperone" ? -1 : 1)));
  }
  function renderCrew() {
    const crew = crewList(), chaps = crew.filter((c) => c.role === "chaperone").length;
    qs("#main").innerHTML = pageHead(WB.t("a.crew"), `${chaps} ${WB.t("a.chaperonesN")} · ${crew.length - chaps} ${WB.t("a.driversN")}`,
      searchBox() + `<button class="btn btn--primary btn--sm">${icon("plus", { width: 16, height: 16 })} ${WB.t("a.add")}</button>`) + `
      <div class="card" style="overflow:auto"><table class="data-table"><thead><tr>
        <th>${WB.t("a.name")}</th><th>${WB.t("a.role")}</th><th>${WB.t("a.bus")}</th><th>${WB.t("a.route")}</th><th>${WB.t("a.phone")}</th><th>${WB.t("a.statusH")}</th></tr></thead><tbody>
        ${crew.map((c) => `<tr>
          <td><div class="row gap2">${c.photo ? `<div class="avatar avatar--sm"><img src="${c.photo}"></div>` : `<div class="avatar avatar--sm" style="background:${c.color}">${c.initials}</div>`}<b>${c.name}</b></div></td>
          <td>${c.role === "chaperone" ? `<span class="badge badge--purple">${WB.t("a.chaperone")}</span>` : `<span class="badge badge--info">${WB.t("a.driver")}</span>`}</td>
          <td class="num">${c.bus}</td><td>${c.route}</td><td class="num">${c.phone}</td><td>${badgeFor(c.status)}</td></tr>`).join("")}
      </tbody></table></div>`;
  }

  /* ---------- BRANDING (white-label) ---------- */
  function renderBranding() {
    const th = WB.themes[WB.brand];
    qs("#main").innerHTML = pageHead(WB.t("a.branding"), WB.t("a.brandTitle"), "") + `
      <div class="card card--pad" style="margin-bottom:16px"><p style="max-width:640px">${WB.t("a.brandSub")}</p></div>
      <div class="admin-grid cols-2" style="align-items:start">
        <div class="stack gap3">
          ${["weinbus", "manhal", "rawabi", "bayan"].map((id) => {
            const t = WB.themes[id];
            return `<div class="brand-card ${id === WB.brand ? "active" : ""}" data-brand-pick="${id}">
              <span>${WB.brandMark(id, 46)}</span>
              <div class="grow"><b>${pick(t.name)}</b><div class="muted small num">${slug(t.short.en)}.weinbus.app</div></div>
              <div class="row gap1"><span class="swatch" style="background:${t.vars["--brand-primary"]}"></span><span class="swatch" style="background:${t.vars["--brand-secondary"]}"></span></div>
              ${id === WB.brand ? `<span class="badge badge--ok">${WB.t("a.active")}</span>` : ""}</div>`;
          }).join("")}
        </div>
        <div class="card card--pad stack gap5">
          <div><div class="muted uppercase">${WB.t("a.workspace")}</div>
            <div class="row gap3" style="margin-top:10px">${WB.brandMark(WB.brand, 56)}<div><b class="big" data-brand-name>-</b>
            <div class="muted small num">${slug(th.short.en)}.weinbus.app</div></div></div></div>
          <div><div class="muted uppercase" style="margin-bottom:8px">${WB.t("a.colors")}</div>
            <div class="row gap2">
              <span class="swatch" style="width:38px;height:38px;background:${th.vars["--brand-primary"]}"></span>
              <span class="swatch" style="width:38px;height:38px;background:${th.vars["--brand-primary-deep"]}"></span>
              <span class="swatch" style="width:38px;height:38px;background:${th.vars["--brand-secondary"]}"></span>
              <span class="swatch" style="width:38px;height:38px;background:${th.vars["--brand-accent"]}"></span>
            </div></div>
          <div class="row gap2 small" style="color:var(--brand-primary-deep)">${icon("sparkles", { width: 18, height: 18 })}<span>${WB.t("a.applyNote")}</span></div>
        </div>
      </div>`;
    qsa("[data-brand-pick]").forEach((c) => c.addEventListener("click", () => WB.setBrand(c.getAttribute("data-brand-pick"))));
    WB.applyBrandDom(qs("#main"));
  }

  /* ---------- nav ---------- */
  let currentView = "dashboard";
  const NAV = [["dashboard", "chart"], ["fleet", "bus"], ["routes", "route"], ["students", "users"], ["parents", "heart"], ["crew", "user"], ["branding", "sparkles"]];
  const RENDER = { dashboard: renderDashboard, fleet: renderFleet, routes: renderRoutes, students: renderStudents, parents: renderParents, crew: renderCrew, branding: renderBranding };
  function renderNav() {
    qs("#nav").innerHTML = NAV.map(([id, ic]) => `<div class="nav-link ${id === currentView ? "active" : ""}" data-nav="${id}">${icon(ic, { width: 20, height: 20 })}<span>${WB.t("a." + id)}</span></div>`).join("");
    qsa("[data-nav]").forEach((n) => n.addEventListener("click", () => go(n.getAttribute("data-nav"))));
  }
  function go(id) { currentView = id; renderNav(); RENDER[id](); }

  /* ---------- live wiring ---------- */
  WB.trip.onEvent((e) => {
    if (e.type === "started") addActivity({ icon: "🚌", tone: "info", title: { en: "Bus 7 started Route A (morning)", ar: "بدأ الباص 7 المسار A (صباحي)" } });
    else if (e.type === "boarded") { addActivity({ icon: "✅", tone: "ok", title: { en: `${pick(e.student.name)} boarded Bus 7`, ar: `صعد ${pick(e.student.name)} إلى الباص 7` } }); if (currentView === "students") qs("#stud-body") && (qs("#stud-body").innerHTML = studentRows(WB.trip.state())); }
    else if (e.type === "arrived") addActivity({ icon: "🏫", tone: "ok", title: { en: "Bus 7 arrived at school", ar: "وصل الباص 7 إلى المدرسة" } });
    else if (e.type === "completed") { addActivity({ icon: "🎉", tone: "ok", title: { en: "Route A complete, all safe", ar: "اكتمل المسار A, الجميع بأمان" } }); if (currentView === "students") qs("#stud-body") && (qs("#stud-body").innerHTML = studentRows(WB.trip.state())); }
  });
  WB.trip.onTick((st) => {
    if (currentView === "dashboard") { paintFleetMon(st); if (amap) amap.update(st); }
  });

  function refreshUser() {
    qs("#admin-user").textContent = WB.lang === "ar" ? "ليلى قاسم" : "Layla Qasem";
    qs("#admin-role").textContent = WB.t("a.principal");
  }
  WB.onLang(() => { renderNav(); RENDER[currentView](); refreshUser(); markSideLang(); });
  WB.onBrand(() => { if (currentView === "branding") renderBranding(); });
  function markSideLang() { qsa("#side-lang button").forEach((b) => b.classList.toggle("active", b.getAttribute("data-l") === WB.lang)); }

  function init() {
    seedActivity(); renderNav(); renderDashboard(); refreshUser(); markSideLang(); WB.addBackButton();
    qsa("#side-lang button").forEach((b) => b.addEventListener("click", () => WB.setLang(b.getAttribute("data-l"))));
    if (!EMBED) { WB.trip.setLoop(true); WB.trip.ensureRunning(); }
  }
  if (document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", init);
})(window.WB);
