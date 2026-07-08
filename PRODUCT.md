# Product

## Register

product

> Note: the root route `/` is a marketing landing and is treated under **brand**
> rules when worked on directly; the authenticated app (`/dashboard`, `/settings`)
> is the product default.

## Users

Spanish-speaking individuals (primary market Paraguay — PYG currency default,
multi-currency aware) who want to understand and improve their personal
finances. They are not finance professionals: they track income/expenses,
set savings goals, and want plain-language guidance. Context of use: evenings
on a phone or laptop at home, quick check-ins during the day.

## Product Purpose

Breezkit is an AI-powered personal finance advisor. Users record transactions,
budgets, and goals; an AI advisor (Claude) analyzes their profile and recent
movements and answers questions in Spanish with concrete, actionable
recommendations. Success = users return weekly, keep their data current, and
act on at least one recommendation.

## Brand Personality

Warm, clear, trustworthy. "Un asesor cercano" — approachable expertise, not
banker formality and not fintech hype. Three words: **cálido, claro, confiable**.
The visual identity is a warm ivory ground with terracotta accents and a
serif display voice (Lora) over a humanist sans body (Bricolage Grotesque).

## Anti-references

- Generic dark-purple-gradient fintech SaaS (Stripe-clone heroes, glassmorphism).
- Crypto-bro dashboards: neon glows, dense tickers, aggressive urgency.
- Bank-grade sterility: navy + gray, legalese tone, walls of disclaimers.
- AI-slop scaffolding: uppercase tracked eyebrows above every section,
  identical icon-card grids, gradient text.

## Design Principles

1. **Money feels calmer here** — generous whitespace, warm neutrals, and
   unhurried motion; never urgency mechanics.
2. **Numbers are the interface** — amounts, deltas, and progress get the
   strongest type; decoration never competes with data.
3. **Spanish first, human tone** — copy reads like a capable friend
   (voseo used in product copy), never machine-translated.
4. **Advice must be traceable** — AI output is visually distinct, cites the
   user's own numbers, and is labeled educational, not prescriptive.
5. **One identity everywhere** — landing, auth, and dashboard share the same
   ivory/terracotta system; the landing is the expressive end, the dashboard
   the quiet end of the same scale.

## Accessibility & Inclusion

WCAG 2.1 AA: ≥4.5:1 body-text contrast (≥3:1 large text), visible
`:focus-visible` states on every interactive element, full keyboard
navigation, `prefers-reduced-motion` alternatives for all animation,
touch targets ≥44px on mobile.
