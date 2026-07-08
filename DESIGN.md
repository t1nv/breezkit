# Design

Visual system captured from `src/styles.css` (Tailwind CSS v4, CSS-first tokens).

## Theme

Light-first warm ivory with a full dark mode (`.dark` class on `<html>`,
persisted in `localStorage.theme`). Both modes share the terracotta accent
family.

## Color

Two-tier terracotta: `--brand #D97757` is decorative/large-scale only;
`--primary #AE5630` is the fill/link tone that passes AA with white text.

| Token                | Light                  | Dark                   |
| -------------------- | ---------------------- | ---------------------- |
| `--background`       | `#FAF9F5` (warm ivory) | `#1F1E1D`              |
| `--foreground`       | `#141413` (warm ink)   | `#F5F4EF`              |
| `--card`             | `#FFFFFF`              | `#2A2927`              |
| `--primary`          | `#AE5630`              | `#D97757`              |
| `--secondary`        | `#D97757`              | `#C15F3C`              |
| `--accent`           | `#C15F3C`              | `#D97757`              |
| `--muted`            | `#F0EEE6`              | `#33322F`              |
| `--muted-foreground` | `#5E5D59`              | `#A5A29A`              |
| `--destructive`      | `#B42318`              | `#E5484D`              |
| `--border`           | `rgba(20,20,19,.1)`    | `rgba(245,244,239,.1)` |
| `--ring`             | `#C15F3C`              | `#D97757`              |

Gradients: `--gradient-hero` (ivory → muted vertical), `--gradient-accent`
(terracotta 135°), `--gradient-soft` (radial terracotta tints over ivory).
Shadows: `--shadow-soft`, `--shadow-elevated`, `--shadow-glow` (terracotta).

## Typography

- Display (`--font-display`): **Lora** (serif), used on h1–h4,
  `letter-spacing: -0.015em`, `text-wrap: balance` on h1–h3.
- Body (`--font-body`): **Bricolage Grotesque** (humanist sans).
- Loaded from Google Fonts (preconnected in `__root.tsx`).

## Radii & Spacing

`--radius: 1rem` base; derived `sm/md/lg/xl/2xl` steps. Pills (`9999px`) for
tabs and small actions. Dashboard grid gaps use `clamp(0.85rem, 2vw, 1.4rem)`.

## Motion

Eases: `--ease-spring cubic-bezier(0.22,1,0.36,1)`, `--ease-out-expo`,
`--ease-in-out-expo`. Motion (Framer API) for entrances; CSS keyframes for
ambient effects (`bk-shimmer`, `bk-float`, `bk-pulse-glow`, `bk-bubble-in`).
Global `prefers-reduced-motion` kill-switch in `@layer base`.
Landing scroll reveals via `IntersectionObserver` (`Reveal` component).

## Components

- shadcn/ui primitives in `src/components/ui/` (Radix-based).
- Dashboard system classes in `styles.css` `@layer components`:
  `bk-panel`, `bk-stat-card`, `bk-topbar`, `bk-tab`, `bk-primary-action`,
  `bk-danger-action`, `bk-icon-action`, `bk-chat-bubble--user/assistant`,
  `bk-progress-bar`, `bk-move-mark--income/expense`, `bk-ai-orb`.
- Landing sections in `src/components/landing/` (hero, features,
  how-it-works, stats-bar, use-cases, integrations, security, comparison,
  pricing, dashboard-preview, faq, cta, footer, header, decor).

## Layout

- Landing: full-bleed sections, `max-w-*` centered containers.
- Dashboard: `max-w-[1500px]` shell, sticky glass topbar
  (`backdrop-filter: blur(18px)`), pill tab nav, responsive stat grid
  (2-col → 4-col at `lg`).

## Voice

Spanish (voseo in product copy: "Registrá", "Empezá"). i18n via react-i18next
with es/en/fr/pt locales; es is the source of truth.
