/* ============================================================================
   WeinBus — Demo cockpit controller. Drives the three embedded apps in sync.
   ========================================================================== */
(function (WB) {
  const qs = WB.qs, qsa = WB.qsa, pick = WB.pick;

  WB.addStrings({
    "demo.live": { en: "Live demo", ar: "عرض مباشر" },
    "demo.brandLabel": { en: "School:", ar: "المدرسة:" },
    "demo.hint": { en: "Tap <b>Start morning trip</b> and watch the bus move and alerts pop across all three apps — live and in sync. Switch the <b>school</b> or <b>language</b> any time.", ar: "اضغط <b>ابدأ الرحلة الصباحية</b> وشاهد الباص يتحرّك والتنبيهات تظهر في التطبيقات الثلاثة — مباشرةً وبالتزامن. غيّر <b>المدرسة</b> أو <b>اللغة</b> في أي وقت." },
    "demo.chaperone": { en: "Chaperone app", ar: "تطبيق المرافِقة" },
    "demo.parent": { en: "Parent app", ar: "تطبيق ولي الأمر" },
    "demo.school": { en: "School Console", ar: "لوحة المدرسة" },
    "demo.start": { en: "Start morning trip", ar: "ابدأ الرحلة الصباحية" },
    "demo.reset": { en: "Reset demo", ar: "إعادة الضبط" },
    "demo.restart": { en: "Restart trip", ar: "إعادة التشغيل" },
    "demo.open": { en: "Open in a new tab", ar: "فتح في تبويب جديد" }
  });

  const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");

  /* brand mini-switcher */
  function renderBrands() {
    qs("#demo-brands").innerHTML = ["weinbus", "manhal", "rawabi", "bayan"].map((id) => {
      const t = WB.themes[id];
      return `<button class="demo-brand ${id === WB.brand ? "active" : ""}" data-bp="${id}" title="${pick(t.short)}"
        style="width:26px;height:26px;border-radius:50%;background:${t.vars["--brand-primary"]};border:2.5px solid ${id === WB.brand ? "var(--ink)" : "transparent"};box-shadow:var(--sh-xs)"></button>`;
    }).join("");
    qsa("#demo-brands [data-bp]").forEach((b) => b.addEventListener("click", () => WB.setBrand(b.getAttribute("data-bp"))));
  }
  function updateUrl() {
    const t = WB.themes[WB.brand];
    qs("#demo-url").textContent = slug(t.short.en) + ".weinbus.app";
  }

  /* start / reset button reflects trip state */
  function updateBtn(st) {
    const b = qs("#demo-start");
    if (!st.started) { b.innerHTML = "▶ " + WB.t("demo.start"); b.className = "btn btn--green btn--sm pulse-btn"; }
    else if (st.status === "completed") { b.innerHTML = "↻ " + WB.t("demo.restart"); b.className = "btn btn--primary btn--sm"; }
    else { b.innerHTML = "↻ " + WB.t("demo.reset"); b.className = "btn btn--ghost btn--sm"; }
  }
  qs("#demo-start").addEventListener("click", () => {
    const st = WB.trip.state();
    if (!st.started || st.status === "completed") { WB.trip.reset(); WB.trip.start(); }
    else WB.trip.reset();
  });

  WB.trip.onTick(updateBtn);
  WB.onBrand(() => { renderBrands(); updateUrl(); });
  WB.onLang(() => { renderBrands(); updateBtn(WB.trip.state()); });

  function init() {
    WB.trip.reset();          // start the demo clean; idle until the presenter taps Start
    renderBrands(); updateUrl(); updateBtn(WB.trip.state());
  }
  if (document.readyState !== "loading") init(); else document.addEventListener("DOMContentLoaded", init);
})(window.WB);
