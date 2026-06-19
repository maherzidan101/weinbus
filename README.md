# 🚌 WeinBus, *Always know where the bus is*

**WeinBus** (وين الباص, *"where's the bus?"* in Jordanian Arabic) is a **white-label school‑bus tracking platform** built as a polished, fully‑interactive **concept demo** to pitch to school principals.

One SaaS, three connected experiences, plus a marketing site and a live demo cockpit, all bilingual **Arabic / English**, kid‑friendly, and built for **Jordan** (Latin numerals, +962 phones, female chaperone roles, in‑region data, WhatsApp, AM/PM & Ramadan schedules).

> Everything is **dummy data** and runs **100% client‑side**, no backend, no API keys, no build step.

## What's inside

| Surface | File | For |
|---|---|---|
| 🏠 **Landing / pitch** | `index.html` | School heads, the story, features, white‑label, pricing |
| 🧭 **Live demo cockpit** | `demo.html` | All three apps in device frames, synced live |
| 👨‍👩‍👧 **Parent app** | `parent.html` | Live map, ETA to your stop, boarding alerts, multi‑child |
| 🚌 **Chaperone app** | `chaperone.html` | Start/end trip, roster check‑in (tap or QR), SOS |
| 🏫 **School Console** | `admin.html` | Fleet, routes, students, parents, live monitor, **branding** |

## The "wow" moment
Open **`demo.html`** and tap **Start morning trip** (or hit Start inside the Chaperone phone). The bus starts moving on the Parent's map, the boarding alerts fire, and the School Console's live monitor updates, **all three in sync**, from one tap. Switch the **school** (white‑label re‑skin) or **language** (instant RTL flip) any time.

The sync is real: each surface derives the bus position from a shared start timestamp and they talk over the browser's `BroadcastChannel`, so opening the apps in separate tabs stays in sync too.

## Built for Jordan 🇯🇴
- Full **Arabic / English** with right‑to‑left layout mirroring
- **Numbers always in Latin digits** (0–9), even in Arabic
- Jordanian phone format `+962 7X XXX XXXX`
- Separate **driver** and **female chaperone** roles
- "Data stored in‑region (Amman)", WhatsApp broadcasts, AM/PM + Ramadan aware

## White‑label
Every school is an isolated, re‑brandable workspace, logo, colors and a private subdomain (e.g. `al-manhal.weinbus.app`). The **Branding** panel in the School Console re‑skins the entire platform instantly. Try `manhal`, `rawabi`, `bayan`, `weinbus`.

## Tech
- Vanilla **HTML + CSS + JS**, no framework, no build, deploys as static files anywhere
- Design tokens + CSS logical properties (painless RTL)
- Self‑contained **SVG navigation map** with a bus that follows the real path (`getPointAtLength`)
- Hero / mascot / chaperone artwork generated with Higgsfield

## Run locally
```bash
python3 -m http.server 4178
# open http://localhost:4178
```

## Structure
```
index.html  demo.html  parent.html  chaperone.html  admin.html  favicon.svg
assets/
  css/  tokens · base · components · apps · site
  js/   i18n · data · ui · brand · trip-sim · map · parent · chaperone · admin · demo · landing
  img/  hero.png · mascot.png · chaperone.png
```

---
© 2026 WeinBus, concept demo. Made with care in Amman.
