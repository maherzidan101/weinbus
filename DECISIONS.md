# DECISIONS — WeinBus

Append-only log of non-trivial choices and why.

- **2026-06-18 — Static, no-build vanilla stack.** Deploys as plain files to GitHub Pages / Cloudflare / `file://` with zero toolchain. Chose hand-written CSS (design tokens + logical properties) over Tailwind for full control of the kid-friendly aesthetic and painless RTL.
- **2026-06-18 — Illustrated SVG map, not a real tile map.** A self-contained stylized navigation map (no Leaflet/Google, no API keys, no network dependency) cannot fail mid-pitch, is on-brand/kid-friendly, and gives full control of smooth bus motion. Bus follows the real drawn path via `getPointAtLength`. Production note: real GPS maps are the obvious upgrade.
- **2026-06-18 — Live sync via shared clock + BroadcastChannel.** Bus position is derived from a single start timestamp in localStorage; surfaces agree without a server. `BroadcastChannel('weinbus')` propagates start/end/lang/brand across iframes & tabs. This powers the cockpit "one tap → all three move" moment.
- **2026-06-18 — White-label via CSS custom properties.** Each tenant overrides `--brand-*` vars; switching is instant and broadcasts to every surface. Logos are SVG lockups (crisp, brandable) rather than generated rasters.
- **2026-06-18 — Numbers always Latin.** Never localize numerals (Jordan preference). Times show Latin digits with ص/م in Arabic; phones use `+962 7X`.
- **2026-06-18 — Landing is JS-rendered from bilingual content objects** (not data-i18n keys) to avoid key/translation drift on a content-heavy page; hero is always-visible (no reveal) for a strong first paint.
- **2026-06-18 — Female chaperone + QR wristband + WhatsApp + in-region data** baked in per MENA/Jordan research (matches local school-transport norms and procurement expectations).
- **2026-06-18 — Default English, default WeinBus brand.** Landing forces the WeinBus brand so a leftover demo tenant doesn't tint the marketing site.
