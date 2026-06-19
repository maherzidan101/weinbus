# STATE — WeinBus

**Branch:** main
**Last action:** Custom domain LIVE. Created Cloudflare CNAME `weinbus → maherzidan101.github.io` (DNS-only) on neuro52.com, added repo CNAME file, set GitHub Pages custom domain + HTTPS enforced (cert approved). Verified HTTP 200 over HTTPS via curl against the Pages IP.
**Next step:** None blocking. User should REVOKE the Cloudflare token now (DNS record is in place). Optional future: wire real GPS/backend; Cloudflare-Pages migration if desired.

## Live URLs
- Custom domain: https://weinbus.neuro52.com  (built, https_enforced, cert approved)
- Pages mirror: https://maherzidan101.github.io/weinbus/

## Status
- ✅ All 5 surfaces (landing, demo cockpit, parent, chaperone, admin) — bilingual AR/EN, RTL, white-label, live sim
- ✅ Real WeinBus logo wired (nav lockup + mascot brand mark + mascot as the live map bus)
- ✅ Landing trimmed per feedback (no pricing / stat strip / Jordan section; reworded problem cards; short CTA)
- ✅ No dashes anywhere; phones/plates LTR-isolated; Cairo Arabic; back-to-site button
- ✅ Asset cache-busting `?v=7` (bump on each change so browsers refresh)
- ✅ Deployed: GitHub repo + Pages + Cloudflare custom domain (HTTPS)

## Security note
- CF token lives in `CLOUDFLARE TOKEN FOR NEURO52 FOR SCHOOL BUS .rtf` (git-ignored, never committed). Tell user to revoke it in Cloudflare.

## Notes
- Other neuro52 subdomains (clothes, jorakeb, sourcing) were untouched — only `weinbus` CNAME added.
- Local/playwright DNS had negative-cache lag; public resolvers (1.1.1.1/8.8.8.8) resolve fine.
