# STATE — WeinBus

**Branch:** main
**Last action:** Deployed to GitHub + GitHub Pages — LIVE at https://maherzidan101.github.io/weinbus/ (all 5 surfaces + css/js/img return 200).
**Next step:** Wire weinbus.euro52.com — user is creating a Cloudflare API token (Zone DNS:Edit for euro52.com). Then: add CNAME weinbus→maherzidan101.github.io, set GH Pages custom domain + CNAME file, wait for TLS.

## Status
- ✅ Design system (tokens/base/components/apps/site), i18n engine, white-label brand engine
- ✅ Trip simulation (time-derived position + BroadcastChannel cross-frame sync)
- ✅ Self-contained illustrated SVG map with animated bus
- ✅ Parent app, Chaperone app, School Console — verified in EN + AR
- ✅ Demo cockpit (3 live iframes, one-tap Start syncs all)
- ✅ Landing / pitch page (hero art, features, white-label, JOD pricing, footer)
- ✅ Higgsfield art (hero, mascot, chaperone) downloaded to assets/img
- ✅ GitHub repo + Pages deploy — LIVE https://maherzidan101.github.io/weinbus/
- ⬜ Cloudflare subdomain weinbus.euro52.com (awaiting CF API token from user)

## Blockers / open
- Cloudflare API token not present in env → custom subdomain pending user token.

## Notes
- All client-side, no backend, no build. Relative paths (works on Pages subpath, CF, file://).
- Default lang = English; default brand = WeinBus (yellow).
