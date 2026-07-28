# Tenevue

Marketing site for **Tenevue**, an AI employment firm that designs, builds, and manages AI employees for founder-led service businesses.

One static page: what the offer is, how it's delivered, pricing, and FAQ. The only call to action is a mailto link.

## Running it

```bash
npm install
npm run dev
```

## Stack

- **Next.js 16** (App Router) — fully static
- **Plain CSS** with an OKLCH token system in `app/globals.css` — no framework, no build step beyond Next
- **Fonts** self-hosted at build time via `next/font` — no external requests, no layout shift

## Design

The direction, palette, and type rationale live in `.impeccable.md`. In short: Libre Caslon (the historical face of legal and government printing) with Public Sans (the US federal design system's face), one oxblood accent, and neutrals tinted toward it. The governing idea is that **the identity is the paperwork** — role scorecards, offer letters, standup reports.

Verified: WCAG AA contrast on all text pairs, 44px minimum touch targets, keyboard focus throughout, `prefers-reduced-motion` respected, light and dark themes.

## Not done yet

- No analytics, no form capture. The only call to action is a mailto.
- `npm audit` reports advisories in `postcss` and `sharp`, both transitive inside Next itself. The suggested "fix" downgrades Next to v9; leave them until Next ships updated deps.
