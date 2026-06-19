/* ============================================================================
   WeinBus, i18n engine + cross-frame sync
   - Central dictionary, pages contribute via WB.addStrings({...})
   - data-i18n / data-i18n-html / data-i18n-ph / data-i18n-aria attributes
   - WB.pick({en,ar}) for data-driven bilingual content
   - Numbers are NEVER converted, Latin digits everywhere (Jordan preference)
   - BroadcastChannel('weinbus') keeps language in sync across iframes
   ========================================================================== */
window.WB = window.WB || {};
(function (WB) {
  const LS = "wb_lang";
  WB.dict = WB.dict || {};

  WB.lang = localStorage.getItem(LS) || "en";
  WB.isRTL = () => WB.lang === "ar";

  WB.addStrings = function (obj) {
    for (const k in obj) WB.dict[k] = obj[k];
    if (WB._ready) WB.applyI18n();
  };

  WB.pick = function (v) {
    if (v == null) return "";
    if (typeof v === "object") return v[WB.lang] ?? v.en ?? v.ar ?? "";
    return v;
  };

  WB.t = function (key) {
    const e = WB.dict[key];
    if (e == null) return key;
    return typeof e === "object" ? (e[WB.lang] ?? e.en ?? key) : e;
  };

  WB.applyI18n = function (root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = WB.t(el.getAttribute("data-i18n")); });
    root.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = WB.t(el.getAttribute("data-i18n-html")); });
    root.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.setAttribute("placeholder", WB.t(el.getAttribute("data-i18n-ph"))); });
    root.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", WB.t(el.getAttribute("data-i18n-aria"))); });
  };

  WB._subs = [];
  WB.onLang = function (cb) { WB._subs.push(cb); };
  function emit() { WB._subs.forEach((cb) => { try { cb(WB.lang); } catch (e) {} }); }

  function applyDir() {
    const h = document.documentElement;
    h.setAttribute("lang", WB.lang);
    h.setAttribute("dir", WB.lang === "ar" ? "rtl" : "ltr");
  }

  WB.setLang = function (lang, broadcast) {
    if (lang !== "ar" && lang !== "en") return;
    WB.lang = lang;
    localStorage.setItem(LS, lang);
    applyDir();
    WB.applyI18n();
    markToggles();
    emit();
    if (broadcast !== false && WB.bc) { try { WB.bc.postMessage({ type: "lang", lang }); } catch (e) {} }
  };
  WB.toggleLang = function () { WB.setLang(WB.lang === "ar" ? "en" : "ar"); };

  function markToggles() {
    document.querySelectorAll("[data-lang-opt]").forEach((b) =>
      b.classList.toggle("active", b.getAttribute("data-lang-opt") === WB.lang));
  }

  /* Cross-frame channel (also used by brand.js + trip-sim.js) */
  try { WB.bc = new BroadcastChannel("weinbus"); } catch (e) { WB.bc = null; }
  if (WB.bc) WB.bc.addEventListener("message", (e) => {
    if (e.data && e.data.type === "lang" && e.data.lang !== WB.lang) WB.setLang(e.data.lang, false);
  });

  function init() {
    WB._ready = true;
    applyDir();
    WB.applyI18n();
    markToggles();
    document.querySelectorAll("[data-lang-opt]").forEach((b) =>
      b.addEventListener("click", () => WB.setLang(b.getAttribute("data-lang-opt"))));
    document.querySelectorAll("[data-lang-toggle]").forEach((b) =>
      b.addEventListener("click", () => WB.toggleLang()));
    emit();
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

  /* ---- Common strings shared everywhere ------------------------------- */
  WB.addStrings({
    "brand.name":    { en: "WeinBus", ar: "وين الباص" },
    "brand.tagline": { en: "Always know where the bus is.", ar: "اعرف دايماً وين الباص." },
    "common.start":   { en: "Start", ar: "ابدأ" },
    "common.end":     { en: "End", ar: "إنهاء" },
    "common.save":    { en: "Save", ar: "حفظ" },
    "common.saved":   { en: "Saved", ar: "تم الحفظ" },
    "common.cancel":  { en: "Cancel", ar: "إلغاء" },
    "common.close":   { en: "Close", ar: "إغلاق" },
    "common.confirm": { en: "Confirm", ar: "تأكيد" },
    "common.back":    { en: "Back", ar: "رجوع" },
    "common.next":    { en: "Next", ar: "التالي" },
    "common.search":  { en: "Search", ar: "بحث" },
    "common.today":   { en: "Today", ar: "اليوم" },
    "common.live":    { en: "Live", ar: "مباشر" },
    "common.settings":{ en: "Settings", ar: "الإعدادات" },
    "common.viewAll": { en: "View all", ar: "عرض الكل" },
    "common.minutes": { en: "min", ar: "دقيقة" },
    "common.arabic":  { en: "العربية", ar: "العربية" },
    "common.english": { en: "English", ar: "English" },
    "common.demo":    { en: "Demo", ar: "تجريبي" },
    "common.poweredBy": { en: "Powered by WeinBus", ar: "مدعوم من وين الباص" },
    "common.language": { en: "Language", ar: "اللغة" },
    "common.signout":  { en: "Sign out", ar: "تسجيل الخروج" }
  });
})(window.WB);
