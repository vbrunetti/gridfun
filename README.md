# gridFun

UX portfolio scaffold — **Next.js**, **Vercel**, **Vimeo**.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + CSS grid tokens |
| Content | MDX for case study writeups |
| Video | Vimeo embeds (9:16 default) |
| Hosting | Vercel |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design docs

- **[Phase 1 — Chrome](./docs/phase-1-chrome.md)** — inspiration synthesis, tokens, IA, and build order (shell before content).

## Project structure

```
src/
  app/              # Routes and layouts
  components/
    layout/         # Grid shell
    media/          # Figure, VimeoEmbed
  content/          # Case study MDX (add when ready)
```

## Vimeo workflow

1. Upload **1080×1920** (9:16) masters to Vimeo.
2. Copy the numeric video ID from the URL (`vimeo.com/123456789`).
3. Use `<VimeoEmbed videoId="123456789" title="…" />` in pages or MDX.

Embed chrome (title, byline, avatar) is hidden by default for a clean inline look.

## Vercel deploy

1. Push this repo to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel auto-detects Next.js — no extra config needed.
4. Point your domain in Vercel → **Settings → Domains**.

## Case studies (next step)

Add MDX files under `src/content/case-studies/` and route them via the App Router. MDX can use `<Figure />` and `<Vimeo />` components out of the box.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
# gridfun
