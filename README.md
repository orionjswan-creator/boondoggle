# Boondoggle

Boondoggle is now a Next.js conference-intelligence MVP for discovering business events, planning client engagement, and generating internal approval memos.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn-style local UI primitives
- Radix Slot
- Motion
- Lucide icons
- Three.js
- React Three Fiber
- Drei

The earlier static prototype is preserved in `legacy-static/`.

## Current Features

- Searchable event intelligence by segment, city, audience, and venue.
- Major/minor event scoring with `Must-plan`, `High-value`, `Selective`, and `Watchlist` labels.
- Event detail intelligence: audience, budget signal, corporate plays, and city hosting guide.
- City playbooks with private dining and things-to-do recommendations.
- Saved-event interaction state.
- Manager-ready business-case generator with ROI metrics.
- Copy and print-ready approval memo.
- Clearly labeled sponsor/ad inventory sections.
- Full-bleed React Three Fiber hero scene with orbital event nodes and animated market signal geometry.

## Visual Direction

The current visual system is inspired by high-end interactive/editorial web references rather than copied from a single site:

- Awwwards 3D and interactive site galleries for immersive visual ambition.
- Siteinspire for editorial restraint and cleaner layout scanning.
- React Three Fiber and Three.js examples for declarative WebGL scene structure.
- Globe/data-viz patterns for event-city signal mapping.

## Run Locally

Use the Node/npm runtime available in this Codex environment:

```powershell
$nodeBin = "C:\Users\Ron Swanson\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin"
$npmBin = "C:\Users\Ron Swanson\AppData\Local\OpenAI\Codex\runtimes\cua_node\1b23c930bdf84ed6\bin"
$env:Path = "$nodeBin;$npmBin;$env:Path"
& "$npmBin\npm.cmd" run dev
```

If port `3000` is already in use, run:

```powershell
& "$npmBin\npm.cmd" exec next dev -- --hostname 127.0.0.1 --port 3021
```

Current preview URL:

```text
http://127.0.0.1:3021/
```

## Validate

```powershell
& "$npmBin\npm.cmd" run build
```

The production build currently passes.

The 3D layer has been verified in-browser:

- Canvas renders in the first viewport.
- Canvas spans the hero area.
- Screenshot frame-diff confirms the scene is moving.
- Production build passes after the Three.js upgrade.

## Next Product Steps

- Move event, city, venue, and sponsor data into Payload CMS or Supabase.
- Add real auth and persistent saved watchlists.
- Add event submission and venue-claim workflows.
- Add admin moderation for submitted conferences and sponsor listings.
- Add generated SEO pages for `/events/[slug]`, `/cities/[slug]`, and `/segments/[slug]`.
- Add AdSense only after final privacy policy, content depth, and publisher approval are ready.
