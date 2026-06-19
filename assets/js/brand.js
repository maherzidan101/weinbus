/* ============================================================================
   WeinBus, White-label engine. Swaps theme colors, logo & school name across
   the whole product (and across iframes via BroadcastChannel). This is the
   SaaS "money shot": one platform, every school feels like their own app.
   ========================================================================== */
window.WB = window.WB || {};
(function (WB) {
  const LS = "wb_brand";

  /* Each theme overrides the --brand-* CSS custom properties from tokens.css */
  WB.themes = {
    weinbus: {
      name: { en: "WeinBus", ar: "وين الباص" }, short: { en: "WeinBus", ar: "وين الباص" },
      vars: {
        "--brand-primary": "#FFC727", "--brand-primary-deep": "#F5A623", "--brand-primary-soft": "#FFF1C2",
        "--brand-secondary": "#29B6F6", "--brand-secondary-deep": "#1E88E5", "--brand-accent": "#8B7CF6",
        "--brand-on-primary": "#20304A",
        "--brand-gradient": "linear-gradient(135deg,#FFD23F 0%,#F5A623 100%)"
      }, glyph: "bus"
    },
    manhal: {
      name: { en: "Al-Manhal International School", ar: "مدارس المنهل الدولية" }, short: { en: "Al-Manhal", ar: "المنهل" },
      vars: {
        "--brand-primary": "#13B5A0", "--brand-primary-deep": "#0A8F7C", "--brand-primary-soft": "#D7F5EF",
        "--brand-secondary": "#E0A92E", "--brand-secondary-deep": "#C8902A", "--brand-accent": "#0A8F7C",
        "--brand-on-primary": "#FFFFFF",
        "--brand-gradient": "linear-gradient(135deg,#16C2AB 0%,#0A8F7C 100%)"
      }, glyph: "M"
    },
    rawabi: {
      name: { en: "Rawabi Modern School", ar: "مدارس روابي الحديثة" }, short: { en: "Rawabi", ar: "روابي" },
      vars: {
        "--brand-primary": "#6C5CE7", "--brand-primary-deep": "#5849C4", "--brand-primary-soft": "#E9E5FF",
        "--brand-secondary": "#FF6B6B", "--brand-secondary-deep": "#EF4444", "--brand-accent": "#FF6B6B",
        "--brand-on-primary": "#FFFFFF",
        "--brand-gradient": "linear-gradient(135deg,#7B6BF0 0%,#5849C4 100%)"
      }, glyph: "R"
    },
    bayan: {
      name: { en: "Al-Bayan Academy", ar: "أكاديمية البيان" }, short: { en: "Al-Bayan", ar: "البيان" },
      vars: {
        "--brand-primary": "#2D6CDF", "--brand-primary-deep": "#1F54B8", "--brand-primary-soft": "#DCE8FF",
        "--brand-secondary": "#19C3C3", "--brand-secondary-deep": "#0E9C9C", "--brand-accent": "#19C3C3",
        "--brand-on-primary": "#FFFFFF",
        "--brand-gradient": "linear-gradient(135deg,#3D7BEE 0%,#1F54B8 100%)"
      }, glyph: "B"
    }
  };

  WB.brand = localStorage.getItem(LS) || "weinbus";

  /* SVG logo lockup mark for a theme */
  WB.brandMark = function (id, size) {
    size = size || 40;
    const th = WB.themes[id] || WB.themes.weinbus;
    if (th.glyph === "bus") {
      return `<img src="assets/img/weinbus-icon.png" alt="WeinBus" style="height:${size}px;width:auto;display:block;flex:none;filter:drop-shadow(0 1px 2px rgba(32,48,74,.22))">`;
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#g_${id})"/>
      <defs><linearGradient id="g_${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${th.vars["--brand-primary"]}"/>
        <stop offset="1" stop-color="${th.vars["--brand-primary-deep"]}"/></linearGradient></defs>
      <text x="24" y="24" text-anchor="middle" dominant-baseline="central"
        font-family="Baloo 2, sans-serif" font-weight="800" font-size="22" fill="#fff">${th.glyph}</text>
    </svg>`;
  };

  function applyVars(id) {
    const th = WB.themes[id] || WB.themes.weinbus;
    const root = document.documentElement;
    for (const k in th.vars) root.style.setProperty(k, th.vars[k]);
    root.setAttribute("data-brand", id);
  }

  WB.applyBrandDom = function (root) {
    root = root || document;
    const th = WB.themes[WB.brand] || WB.themes.weinbus;
    root.querySelectorAll("[data-brand-name]").forEach((el) => { el.textContent = WB.pick(th.name); });
    root.querySelectorAll("[data-brand-short]").forEach((el) => { el.textContent = WB.pick(th.short); });
    root.querySelectorAll("[data-brand-logo]").forEach((el) => {
      el.innerHTML = WB.brandMark(WB.brand, +el.getAttribute("data-brand-logo") || 40);
    });
    root.querySelectorAll("[data-brand-opt]").forEach((b) =>
      b.classList.toggle("active", b.getAttribute("data-brand-opt") === WB.brand));
  };

  WB._brandSubs = [];
  WB.onBrand = function (cb) { WB._brandSubs.push(cb); };

  WB.setBrand = function (id, broadcast) {
    if (!WB.themes[id]) return;
    WB.brand = id;
    localStorage.setItem(LS, id);
    applyVars(id);
    WB.applyBrandDom();
    WB._brandSubs.forEach((cb) => { try { cb(id); } catch (e) {} });
    if (broadcast !== false && WB.bc) { try { WB.bc.postMessage({ type: "brand", id }); } catch (e) {} }
  };

  if (WB.bc) WB.bc.addEventListener("message", (e) => {
    if (e.data && e.data.type === "brand" && e.data.id !== WB.brand) WB.setBrand(e.data.id, false);
  });

  /* Apply theme vars immediately (before paint) to avoid a flash */
  applyVars(WB.brand);

  // Landing shows the WeinBus theme for DISPLAY only (no persist / no broadcast).
  WB.applyThemeVars = function (id) { applyVars(id); };
  // The apps are white-labelled per school and must never show the bare WeinBus brand.
  WB.ensureSchoolBrand = function (fallback) { if (WB.brand === "weinbus") WB.setBrand(fallback || "manhal"); };

  function init() {
    WB.applyBrandDom();
    document.querySelectorAll("[data-brand-opt]").forEach((b) =>
      b.addEventListener("click", () => WB.setBrand(b.getAttribute("data-brand-opt"))));
    WB.onLang(() => WB.applyBrandDom()); // re-render school name on language change
  }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})(window.WB);
