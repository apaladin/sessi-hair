# Sessi Hair — The Boutique (Next.js)

A virtual luxury store experience: instead of a website, the visitor steps inside a
bright, daylight boutique and walks between the five Sessi Hair collections — Pure
Donor, Vogue, I'ME, Mystique & Secrets, and Lustre — the way they would in a
Mayfair store.

Next.js 14 (App Router) + Three.js. All textures are generated procedurally in the
browser — no image assets.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — add `?autoplay=1` to skip the entry screen, and
`&stop=N` (0–6) to jump to a tour stop.

## Deploy to Vercel

```bash
npm i -g vercel
vercel        # detects Next.js automatically
vercel --prod
```

Or import the repo at https://vercel.com/new and set the project root to this
folder. Framework preset: **Next.js** (auto-detected). No environment variables.

## Controls

- **Scroll the mouse wheel** to walk the tour — the easiest way to move
- **Named room menu** at the bottom, arrow buttons, or **← →** keys
- **▶ button** starts a hands-free guided tour
- **Drag** to glance around (the view gently re-centres when released)
- **Tap a display** to walk up to that collection
- **The Mirror** (tap it in the room, or "Try It On" in any product card):
  upload a photo — or pick a sample model — and see the hair drawn on, with
  collection shade, length and volume controls, and "Save my look".
  All processing happens on-device.
- **Add to bag** is a concept interaction — checkout is not connected

Deep links for demos: `?autoplay=1&stop=N` (0–4) and `&tryon=N` (collection 0–4).

## Two views

- `/` — the 3D boutique (walkable store)
- `/editorial` — the editorial view: the same collections, reviews and
  Try It On mirror as one elegant scrolling page, no 3D. Each view links
  to the other from its header.

## Structure

- `app/layout.js` — fonts (Cormorant Garamond + Jost via next/font), metadata
- `app/page.js` — renders the boutique
- `components/Boutique.jsx` — client component: UI overlay + scene lifecycle
- `lib/createScene.js` — the Three.js boutique (daylight gallery, skylight,
  collection displays, "The Crown" installation, camera tour)
- `lib/data.js` — collections and tour stops
