# Tenevue

Marketing site and live candidate interview for **Tenevue**, an AI employment firm that designs, hires, trains, and manages AI employees for US immigration law firms.

One page. Its job is to get a managing attorney into the interview panel, where the candidate — an AI Intake Coordinator — asks about their firm and shows how it would run their intake. The offer of employment beside the transcript fills itself in as they talk.

## Running it

```bash
npm install
cp .env.local.example .env.local   # add your Anthropic API key
npm run dev
```

Without `ANTHROPIC_API_KEY` the page still renders and the interview panel explains that it isn't connected yet — nothing crashes.

Get a key at <https://console.anthropic.com>. It is read server-side only and never reaches the browser.

## Stack

- **Next.js 16** (App Router) — the page is static, `/api/interview` is dynamic and streams
- **Anthropic SDK** — `claude-opus-5`, streamed, at `low` effort for conversational latency
- **Plain CSS** with an OKLCH token system in `app/globals.css` — no framework, no build step beyond Next
- **Fonts** self-hosted at build time via `next/font` — no external requests, no layout shift

## How the interview works

`app/api/interview/route.js` holds the candidate's system prompt: who it is, how it speaks, and the boundary it will not cross (it qualifies and schedules; it never gives legal advice, assesses eligibility, or estimates outcomes — that would be unauthorized practice of law).

The offer letter fills itself in through a small protocol. When the attorney tells the candidate something that belongs on an offer, the model appends a line to its reply:

```
::field firm=Cardenas & Ruiz LLP
```

`app/Interview.js` reads those lines, strips them from what the attorney sees, and writes the values into the letter. If the model omits them the letter simply stays blank — nothing breaks.

## Design

The direction, palette, and type rationale live in `.impeccable.md`. In short: Libre Caslon (the historical face of legal and government printing) with Public Sans (the US federal design system's face), one oxblood accent, and neutrals tinted toward it. The governing idea is that **the identity is the paperwork** — role scorecards, offer letters, standup reports.

Verified: WCAG AA contrast on all text pairs, 44px minimum touch targets, keyboard focus throughout, `prefers-reduced-motion` respected, light and dark themes.

## Not done yet

- The live model path has not been exercised against the real API — add a key and run one interview end to end before showing anyone.
- No analytics, no form capture. The only call to action is a mailto.
- `npm audit` reports advisories in `postcss` and `sharp`, both transitive inside Next itself. The suggested "fix" downgrades Next to v9; leave them until Next ships updated deps.
