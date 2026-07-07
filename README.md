# Boondoggle

**Work trips worth taking.** Boondoggle is a conference-intelligence one-pager for finding the events around the country and the world where work is more interactive, engaging, and fun — then generating the manager-ready memo that gets the trip approved.

## The experience

The site is designed to award-site standards: one coherent art direction, expressive typography, choreographed motion, and full accessibility fallbacks.

- **Opening journey** — a five-chapter scroll story (London → Tokyo → Hawaiʻi → Las Vegas → Paris) with crossfading city plates, animated cutouts, a clickable chapter rail, and a search handoff into the event board. Falls back to a static hero for `prefers-reduced-motion`.
- **Manifesto** — mission statement with staggered word reveal and animated stat counters.
- **Destinations** — editorial grid of the five city moods, wired to the event search.
- **The event board** — searchable, segment-filtered index list with planning scores, a cursor-following image preview (desktop), and save-to-watchlist.
- **Dossier** — per-event intelligence: score dial, budget signals, corporate plays, and the city hosting rail.
- **The method** — five sticky-stacking phase cards.
- **The approval memo** — business-case generator with live ROI metrics, a 3× break-even meter, and copy/print-ready output.
- **Hosting playbooks** — horizontal snap-scroll city guides.
- **Commercial layer** — clearly-labeled ad strategy and premium sponsor inventory.
- **Footer** — oversized wordmark, world clocks, and full navigation.

Craft details: page-load preloader (once per session), custom blend-mode cursor (fine pointers only), scroll progress bar, marquee bands, film-grain overlays, sweeping link underlines, and `MotionConfig reducedMotion="user"` so every animation respects OS motion preferences.

## Design system

- **Type**: [Fraunces](https://fonts.google.com/specimen/Fraunces) (display serif, optical sizing + WONK italics), Space Grotesk (UI/body), IBM Plex Mono (data labels) — all self-hosted via `next/font`.
- **Palette**: `ink #101D28` · `paper #F4EDE0` · `cream #FBF7EC` · `gold #E8A33D` · `flare #E4572E` · `sea #14586C` · `glow #9BE7FF`.
- **Imagery**: local illustrated campaign plates in `public/assets` (no remote image dependencies), served through `next/image`.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS
- Motion (`motion/react`) for scroll choreography and micro-interactions
- shadcn-style local UI primitives, Radix Slot, Lucide icons
- Playwright (dev dependency) for visual verification

## Run locally

```bash
npm install
npm run dev     # http://127.0.0.1:3000
```

## Validate

```bash
npm run build   # production build + type check
npm run start   # serve the production build
```

## Structure

```
app/            layout, fonts, global styles, page orchestrator
components/site tailored sections (hero journey, event board, memo, …)
components/ui   button + badge primitives
lib/            event/city/destination data, memo builder, utils
public/assets   illustrated campaign plates and cutouts
```

## Next product steps

- Move event, city, venue, and sponsor data into a CMS (Payload/Supabase).
- Real auth and persistent saved watchlists.
- Event submission and venue-claim workflows.
- Generated SEO pages for `/events/[slug]`, `/cities/[slug]`, `/segments/[slug]`.
- Set `NEXT_PUBLIC_SITE_URL` and replace the placeholder contact address (`hello@boondoggle.events`) before launch.
- AdSense only after privacy policy, content depth, and publisher approval are ready.
