# STATE — WeinBus

**Branch:** main
**Last action:** Built + verified all 5 surfaces (landing, demo cockpit, parent, chaperone, admin). Bilingual AR/EN + RTL, white-label, live trip sim all working with zero console errors.
**Next step:** Push to GitHub → enable GitHub Pages (instant live URL) → wire `weinbus.euro52.com` on Cloudflare (needs CF API token from user).

## Status
- ✅ Design system (tokens/base/components/apps/site), i18n engine, white-label brand engine
- ✅ Trip simulation (time-derived position + BroadcastChannel cross-frame sync)
- ✅ Self-contained illustrated SVG map with animated bus
- ✅ Parent app, Chaperone app, School Console — verified in EN + AR
- ✅ Demo cockpit (3 live iframes, one-tap Start syncs all)
- ✅ Landing / pitch page (hero art, features, white-label, JOD pricing, footer)
- ✅ Higgsfield art (hero, mascot, chaperone) downloaded to assets/img
- ⬜ GitHub repo + Pages deploy
- ⬜ Cloudflare subdomain weinbus.euro52.com (blocked: needs CF token)

## Blockers / open
- Cloudflare API token not present in env → custom subdomain pending user token.

## Notes
- All client-side, no backend, no build. Relative paths (works on Pages subpath, CF, file://).
- Default lang = English; default brand = WeinBus (yellow).
