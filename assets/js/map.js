/* ============================================================================
   WeinBus, Stylized live map (self-contained SVG, no tiles/keys/network).
   Reads trip-sim's segIndex/segT and moves the bus along the REAL drawn path
   using getPointAtLength, so motion follows the road curve exactly.
   ========================================================================== */
window.WB = window.WB || {};
(function (WB) {
  const VBW = 720, VBH = 460;
  // Stop anchor points (S0 depot … S4 school)
  const PTS = [[78, 384], [208, 250], [352, 322], [520, 198], [638, 104]];

  // Smooth Catmull-Rom → cubic-bezier path through the stops (passes through each)
  function smoothPath(p) {
    let d = `M ${p[0][0]} ${p[0][1]}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }
  const ROUTE_D = smoothPath(PTS);

  function deco() {
    // soft city blocks, a park, a roundabout, a mosque & houses, muted so route pops
    return `
      <rect x="20" y="40" width="150" height="120" rx="18" fill="#FFFFFF" opacity=".7"/>
      <rect x="250" y="30" width="180" height="90" rx="18" fill="#FFFFFF" opacity=".7"/>
      <rect x="470" y="250" width="210" height="150" rx="20" fill="#FFFFFF" opacity=".7"/>
      <rect x="30" y="200" width="120" height="150" rx="18" fill="#FFFFFF" opacity=".55"/>
      <g opacity=".9">
        <rect x="250" y="160" width="150" height="120" rx="22" fill="#CFEBD6"/>
        <circle cx="285" cy="210" r="16" fill="#A7DCB4"/><circle cx="330" cy="240" r="20" fill="#9AD3A8"/>
        <circle cx="370" cy="200" r="14" fill="#A7DCB4"/>
      </g>
      <circle cx="150" cy="120" r="26" fill="#BFE3F5"/>
      <!-- mosque -->
      <g transform="translate(560,300)" opacity=".95">
        <rect x="0" y="14" width="44" height="34" rx="6" fill="#EAD9B8"/>
        <path d="M0 18 a22 12 0 0 1 44 0 z" fill="#D8C39A"/>
        <rect x="50" y="2" width="8" height="46" rx="3" fill="#EAD9B8"/>
        <circle cx="54" cy="0" r="5" fill="#D8C39A"/>
      </g>
      <!-- little houses -->
      <g opacity=".9">
        <g transform="translate(70,300)"><rect width="26" height="20" y="8" rx="4" fill="#FBD7B5"/><path d="M-3 9 13 -2 29 9z" fill="#F0A878"/></g>
        <g transform="translate(420,90)"><rect width="26" height="20" y="8" rx="4" fill="#CFE3FB"/><path d="M-3 9 13 -2 29 9z" fill="#9FC2EE"/></g>
        <g transform="translate(120,70)"><rect width="24" height="18" y="8" rx="4" fill="#E7DAF7"/><path d="M-3 9 12 -2 27 9z" fill="#C4ADEC"/></g>
      </g>`;
  }

  // minor roads (decorative street grid)
  function streets() {
    return `<g stroke="#FFFFFF" stroke-width="9" stroke-linecap="round" opacity=".85" fill="none">
        <path d="M-10 150 H 740"/><path d="M-10 300 H 740"/>
        <path d="M180 -10 V 470"/><path d="M440 -10 V 470"/>
      </g>
      <g stroke="#E6ECF3" stroke-width="11" stroke-linecap="round" opacity=".5" fill="none">
        <path d="M-10 150 H 740"/><path d="M-10 300 H 740"/>
        <path d="M180 -10 V 470"/><path d="M440 -10 V 470"/>
      </g>`;
  }

  WB.buildMap = function (container, opts) {
    opts = opts || {};
    const homeStop = opts.homeStop != null ? opts.homeStop : -1;
    const showLabels = opts.labels !== false;

    const svg = WB.el(`<svg class="wb-map" viewBox="0 0 ${VBW} ${VBH}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mapbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#E8F1F8"/><stop offset="1" stop-color="#EDF4EC"/>
        </linearGradient>
        <filter id="mshadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#1b2a44" flood-opacity="0.18"/>
        </filter>
      </defs>
      <rect width="${VBW}" height="${VBH}" fill="url(#mapbg)"/>
      ${deco()}
      ${streets()}
      <path d="${ROUTE_D}" fill="none" stroke="#FFFFFF" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
      <path id="wb-route" d="${ROUTE_D}" fill="none" style="stroke:var(--brand-secondary-deep)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${ROUTE_D}" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="2 12" opacity=".9"/>
      <g id="wb-stops"></g>
      <g id="wb-bus"></g>
    </svg>`);
    container.innerHTML = "";
    container.appendChild(svg);

    const routeEl = svg.querySelector("#wb-route");
    const total = routeEl.getTotalLength();
    const SAMP = 600;
    function nearestFrac(pt) {
      let best = 0, bd = Infinity;
      for (let i = 0; i <= SAMP; i++) {
        const L = (i / SAMP) * total, q = routeEl.getPointAtLength(L);
        const dd = (q.x - pt[0]) ** 2 + (q.y - pt[1]) ** 2;
        if (dd < bd) { bd = dd; best = L / total; }
      }
      return best;
    }
    const stopAt = PTS.map(nearestFrac);

    // ---- stop markers + labels ----
    const stopsG = svg.querySelector("#wb-stops");
    const stopEls = PTS.map((pt, i) => {
      const isSchool = i === PTS.length - 1, isHome = i === homeStop;
      const g = WB.el(`<g class="wb-stop" data-i="${i}" transform="translate(${pt[0]},${pt[1]})"></g>`);
      if (isSchool) {
        g.innerHTML = `<g filter="url(#mshadow)"><rect x="-17" y="-17" width="34" height="34" rx="11" fill="#fff"/>
          <rect x="-17" y="-17" width="34" height="34" rx="11" style="fill:var(--brand-primary)" opacity=".18"/></g>
          <g transform="translate(0,1)" style="color:var(--brand-primary-deep)">${WB.icon("building", { width: 21, height: 21 })}</g>`;
      } else if (isHome) {
        g.innerHTML = `<circle r="13" fill="#fff" filter="url(#mshadow)"/><circle r="13" fill="#34D399" opacity=".16"/>
          <g transform="translate(-9,-9)" style="color:#0E9C7A">${WB.icon("home", { width: 18, height: 18 })}</g>`;
      } else {
        g.innerHTML = `<circle class="wb-dot-ring" r="13" fill="#fff" filter="url(#mshadow)"/>
          <circle class="wb-dot" r="6" style="fill:var(--brand-secondary-deep)"/>`;
      }
      stopsG.appendChild(g);
      return g;
    });

    let labelEls = [];
    function drawLabels() {
      labelEls.forEach((l) => l.remove()); labelEls = [];
      if (!showLabels) return;
      PTS.forEach((pt, i) => {
        const s = WB.data.routeA.stops[i];
        const above = pt[1] > 150;
        const ly = above ? -34 : 26;
        const lab = WB.el(`<g transform="translate(${pt[0]},${pt[1] + ly})" text-anchor="middle" style="pointer-events:none">
          <text class="wb-lbl" y="0" font-family="Nunito,Cairo,sans-serif" font-weight="800" font-size="13" fill="#243349">${WB.pick(s.name)}</text>
          <text class="wb-lbl2" y="15" font-family="Nunito,sans-serif" font-weight="700" font-size="11" fill="#7C8AA0">${WB.fmtTime(s.time)}</text>
        </g>`);
        svg.appendChild(lab); labelEls.push(lab);
      });
    }
    drawLabels();

    // ---- bus marker ----
    const busG = svg.querySelector("#wb-bus");
    busG.innerHTML = `
      <circle class="wb-accuracy" r="26" style="fill:var(--brand-secondary)" opacity=".16"/>
      <g class="wb-heading"><path d="M0 -30 L 9 -16 L -9 -16 Z" style="fill:var(--brand-secondary-deep)" opacity=".9"/></g>
      <g class="wb-busbadge" filter="url(#mshadow)">
        <circle r="17" style="fill:var(--brand-secondary-deep)"/><circle r="17" fill="#fff" opacity=".0"/>
        <g transform="translate(-11,-11)" style="color:#fff">${WB.icon("bus", { width: 22, height: 22 })}</g>
      </g>`;
    const headingG = busG.querySelector(".wb-heading");

    function place(frac) {
      const len = Math.max(0, Math.min(total, frac * total));
      const p = routeEl.getPointAtLength(len);
      const a = routeEl.getPointAtLength(Math.min(total, len + 2));
      const ang = Math.atan2(a.y - p.y, a.x - p.x) * 180 / Math.PI;
      busG.setAttribute("transform", `translate(${p.x},${p.y})`);
      headingG.setAttribute("transform", `rotate(${ang + 90})`);
    }
    function setBus(seg, segT) {
      const a = stopAt[seg], b = stopAt[Math.min(seg + 1, stopAt.length - 1)];
      place(a + (b - a) * segT);
    }
    setBus(0, 0);

    function markStops(st) {
      stopEls.forEach((g, i) => {
        const passed = st.progress >= (WB.trip.arrive[i] - 0.001);
        const isNext = i === st.nextStopIndex && st.status === "enroute";
        g.classList.toggle("passed", passed);
        g.classList.toggle("next", isNext);
      });
    }

    WB.onLang(() => drawLabels());

    return {
      el: svg, total, stopAt,
      update(st) {
        if (st && st.started) setBus(st.segIndex, st.segT); else setBus(0, 0);
        if (st) markStops(st);
      }
    };
  };
})(window.WB);
