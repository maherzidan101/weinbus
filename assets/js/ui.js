/* ============================================================================
   WeinBus, Shared UI helpers: icons, toasts, confetti, formatting, reveals.
   ========================================================================== */
window.WB = window.WB || {};
(function (WB) {
  const D = () => WB.data;

  /* ---- tiny DOM helpers ----------------------------------------------- */
  WB.qs  = (s, r) => (r || document).querySelector(s);
  WB.qsa = (s, r) => Array.from((r || document).querySelectorAll(s));
  WB.el  = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  /* ---- string / number / time formatting (digits stay LATIN) ---------- */
  WB.fmt = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (_, k) => (vars && vars[k] != null ? vars[k] : ""));

  WB.fmtTime = function (t) {
    const [h, m] = String(t).split(":").map(Number);
    const period = WB.lang === "ar" ? (h < 12 ? "ص" : "م") : (h < 12 ? "AM" : "PM");
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  };

  WB.ago = function (min) {
    if (min <= 0) return WB.lang === "ar" ? "الآن" : "now";
    return WB.lang === "ar" ? `قبل ${min} د` : `${min} min ago`;
  };

  WB.telHref = (p) => "tel:" + String(p).replace(/\s/g, "");

  /* ---- Icon set (24x24, currentColor) --------------------------------- */
  const FILLED = new Set(["play", "sos", "star", "sparkles", "heart", "bolt", "pinFill"]);
  const PATHS = {
    home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/>',
    map: '<path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z"/><path d="M9 4v14M15 6v14"/>',
    pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    pinFill: '<path d="M12 22s7.5-6 7.5-11.5a7.5 7.5 0 1 0-15 0C4.5 16 12 22 12 22z"/><circle cx="12" cy="10.5" r="2.7" fill="#fff"/>',
    bell: '<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M9.5 20a2.5 2.5 0 0 0 5 0"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5a3.2 3.2 0 0 1 0 6.2"/><path d="M17 14.5a6.5 6.5 0 0 1 4.5 5.5"/>',
    bus: '<rect x="3" y="4" width="18" height="13" rx="3.5"/><path d="M3 11h18"/><circle cx="7.5" cy="17.5" r="1.7"/><circle cx="16.5" cy="17.5" r="1.7"/><path d="M3.5 20h2M18.5 20h2"/>',
    route: '<circle cx="5.5" cy="5.5" r="2.2"/><circle cx="18.5" cy="18.5" r="2.2"/><path d="M7.7 5.5H13a3.5 3.5 0 0 1 0 7H8a3.5 3.5 0 0 0 0 7h3.3"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.6"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    chart: '<path d="M3 21h18"/><rect x="5" y="11" width="3.2" height="8" rx="1.2"/><rect x="10.4" y="5.5" width="3.2" height="13.5" rx="1.2"/><rect x="15.8" y="14" width="3.2" height="5" rx="1.2"/>',
    shield: '<path d="M12 3l7.5 3v5c0 4.6-3.2 8.4-7.5 10.4C7.7 19.4 4.5 15.6 4.5 11V6z"/><path d="M8.8 12l2.2 2.2L15.4 9.6"/>',
    phone: '<path d="M5 4h3l1.8 4.6-2 1.4a11 11 0 0 0 5.2 5.2l1.4-2L19 16v3a1.5 1.5 0 0 1-1.6 1.5A15.5 15.5 0 0 1 3.5 6 1.5 1.5 0 0 1 5 4z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.6 2.6L16 9.4"/>',
    qr: '<rect x="4" y="4" width="6" height="6" rx="1.2"/><rect x="14" y="4" width="6" height="6" rx="1.2"/><rect x="4" y="14" width="6" height="6" rx="1.2"/><path d="M14 14h2.5v2.5M20 14v6M14 20h2M18 18h2v2"/>',
    sos: '<path d="M12 3.2 2 20.5h20z"/><path d="M12 10v4.5" stroke="#fff"/><circle cx="12" cy="17.6" r="0.4" fill="#fff" stroke="#fff"/>',
    play: '<path d="M7 4.5 19.5 12 7 19.5z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="3"/>',
    settings: '<circle cx="16" cy="8" r="2.2"/><path d="M3 8h10M19 8h2"/><circle cx="8" cy="16" r="2.2"/><path d="M3 16h2M11 16h10"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-3.6-3.6"/>',
    chevronR: '<path d="M9 5l7 7-7 7"/>',
    chevronL: '<path d="M15 5l-7 7 7 7"/>',
    chevronD: '<path d="M5 9l7 7 7-7"/>',
    sparkles: '<path d="M12 3l1.7 4.8L18.5 9l-4.8 1.2L12 15l-1.7-4.8L5.5 9l4.8-1.2z"/><path d="M19 14l.8 2.3L22 17l-2.2.7L19 20l-.8-2.3L16 17l2.2-.7z"/>',
    building: '<path d="M4 21V6.5L12 3l8 3.5V21"/><path d="M9 21v-5h6v5"/><path d="M8 8.5h1.5M8 12h1.5M14.5 8.5H16M14.5 12H16"/><path d="M2.5 21h19"/>',
    broadcast: '<circle cx="12" cy="12" r="2.2"/><path d="M8 8a5.6 5.6 0 0 0 0 8M16 8a5.6 5.6 0 0 1 0 8M5 5a9 9 0 0 0 0 14M19 5a9 9 0 0 1 0 14"/>',
    star: '<path d="M12 3.5l2.7 5.4 6 .9-4.3 4.2 1 6L12 17.6 6.6 20l1-6L3.3 9.8l6-.9z"/>',
    leaf: '<path d="M5 19C5 9.5 12 5 20 5c0 8-4.5 14.5-14.5 14z"/><path d="M9 15c2-3 5-5.2 8.5-6.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    heart: '<path d="M12 20.5S3.5 14.8 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9C20.5 14.8 12 20.5 12 20.5z"/>',
    bolt: '<path d="M13 2.5 4 14h6.5l-1.5 7.5L20 10h-7z"/>',
    message: '<path d="M5 5h14a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 16H9.5L5 20.5V6.5A1.5 1.5 0 0 1 6.5 5z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18M16.5 14.5h.01"/>',
    headset: '<path d="M5 13a7 7 0 0 1 14 0"/><rect x="3" y="13" width="4" height="6" rx="2"/><rect x="17" y="13" width="4" height="6" rx="2"/><path d="M19 19a4 4 0 0 1-4 4h-2"/>',
    truck: '<rect x="2" y="6" width="13" height="10" rx="2"/><path d="M15 9h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>'
  };
  WB.icon = function (name, attrs) {
    const inner = PATHS[name] || PATHS.pin;
    const filled = FILLED.has(name);
    const a = Object.assign({ width: 22, height: 22, class: "" }, attrs || {});
    const fillStroke = filled ? `fill="currentColor" stroke="none"` : `fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
    return `<svg viewBox="0 0 24 24" width="${a.width}" height="${a.height}" class="${a.class}" ${fillStroke} aria-hidden="true">${inner}</svg>`;
  };

  /* ---- Toasts (render into nearest .toast-wrap or body) --------------- */
  function toastWrap() {
    let w = document.querySelector(".toast-wrap");
    if (!w) { w = WB.el('<div class="toast-wrap"></div>'); document.body.appendChild(w); }
    return w;
  }
  const TONE = {
    ok:    { bg: "var(--wb-green-soft)",  fg: "var(--wb-green-deep)" },
    info:  { bg: "var(--wb-blue-soft)",   fg: "var(--wb-blue-deep)" },
    warn:  { bg: "var(--wb-amber-soft)",  fg: "#C2410C" },
    danger:{ bg: "var(--wb-coral-soft)",  fg: "var(--wb-coral-deep)" }
  };
  WB.toast = function (o, ms) {
    const tone = TONE[o.tone] || TONE.info;
    const node = WB.el(`<div class="toast" role="status">
      <div class="toast__icon" style="background:${tone.bg}">${o.icon || "🔔"}</div>
      <div class="grow"><div class="toast__title">${o.title || ""}</div>
      <div class="toast__msg">${o.msg || ""}</div></div></div>`);
    toastWrap().appendChild(node);
    setTimeout(() => { node.classList.add("leaving"); setTimeout(() => node.remove(), 320); }, ms || 4200);
    return node;
  };

  /* Build a filled notification object from the taxonomy */
  WB.notify = function (key, vars) {
    const n = D().notif[key];
    if (!n) return null;
    return {
      key, icon: n.icon, tone: n.tone,
      title: WB.fmt(WB.pick(n.title), vars),
      msg: WB.fmt(WB.pick(n.msg), vars)
    };
  };

  /* ---- Confetti ------------------------------------------------------- */
  const CONF = ["#FFC727", "#29B6F6", "#34D399", "#FF6B6B", "#8B7CF6", "#FB923C"];
  WB.confetti = function (container, n) {
    container = container || document.body;
    const wrap = WB.el('<div class="confetti"></div>');
    container.appendChild(wrap);
    n = n || 36;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.style.insetInlineStart = Math.random() * 100 + "%";
      p.style.background = CONF[i % CONF.length];
      p.style.animationDuration = (0.9 + Math.random() * 0.9) + "s";
      p.style.animationDelay = (Math.random() * 0.25) + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      p.style.opacity = 0.9;
      wrap.appendChild(p);
    }
    setTimeout(() => wrap.remove(), 2200);
  };

  /* ---- Floating "back to site" button (standalone apps only) ---------- */
  WB.addBackButton = function () {
    if (window.self !== window.top) return;            // hide inside the demo cockpit iframes
    if (document.getElementById("wb-back")) return;
    const a = WB.el(`<a id="wb-back" class="wb-back" href="index.html#apps">
      <span class="wb-back__ic flipX">${WB.icon("chevronL", { width: 16, height: 16 })}</span>
      <span class="wb-back__t">${WB.t("common.backToSite")}</span></a>`);
    a.addEventListener("click", (e) => { if (document.referrer && history.length > 1) { e.preventDefault(); history.back(); } });
    document.body.appendChild(a);
    WB.onLang(() => { const t = a.querySelector(".wb-back__t"); if (t) t.textContent = WB.t("common.backToSite"); });
  };

  /* ---- Scroll reveal + count-up (auto-init) --------------------------- */
  function initReveal() {
    const els = WB.qsa(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.15 });
    els.forEach((e) => io.observe(e));
  }
  WB.countUp = function (elm) {
    const target = parseFloat(elm.getAttribute("data-count"));
    const suffix = elm.getAttribute("data-suffix") || "";
    const dur = 1100, t0 = performance.now();
    function step(t) {
      const k = Math.min(1, (t - t0) / dur);
      const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
      elm.textContent = v + suffix;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };
  function initCount() {
    const els = WB.qsa("[data-count]");
    if (!("IntersectionObserver" in window)) { els.forEach(WB.countUp); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (e.isIntersecting) { WB.countUp(e.target); io.unobserve(e.target); }
    }), { threshold: 0.6 });
    els.forEach((e) => io.observe(e));
  }
  WB.initReveal = initReveal;
  WB.initCount = initCount;
  function init() { initReveal(); initCount(); }
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})(window.WB);
