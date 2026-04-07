# Proposal: SKF Vertevo Motion System

**Submitted to:** Forsman&Bodenfors  
**Submitted by:** Pelagio  
**Date:** 2026-04-11  
**Re:** SKF Vertevo — Component-Driven Motion System (Phase 1: Proof of Concept)

---

## Introduction

We've built a working Proof of Concept — not a slide deck — that implements both Layer 1 and Layer 2 motion in React. The SKF Vertevo Dev Team can clone it, run it, and evaluate the feel on real devices today.

This document covers our tech stack, what we've built, and our plan for Phase 1.

---

## About Pelagio

We're a digital consultancy focused on frontend development for brand-driven web experiences. We've delivered component-based motion systems in React, scroll-driven storytelling with GSAP, and accessibility-first animation work across several industries. The PoC speaks for itself — it demonstrates everything we're proposing as running code.

---

## Proposed Tech Stack

| Library                           | Role                                                  | Why                                                                                                                                |
| --------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Framer Motion** (v12+)          | UI animations, micro-interactions, layout transitions | Best React integration available. Declarative, spring-based, with built-in reduced-motion support via `MotionConfig`.              |
| **GSAP** (v3.14+) + ScrollTrigger | Scroll-pinned narrative sequences, scrub timelines    | The standard for timeline-based scroll animation. Nothing else delivers frame-perfect scrub with reliable pinning across browsers. |
| **Lenis** (v1.3+)                 | Smooth scroll                                         | Normalizes scroll across platforms, syncs with GSAP's ticker. ~3KB gzipped. Off when reduced motion is active.                     |
| **Rive** (reserved for Phase 2)   | Complex vector animations                             | GPU-accelerated, state machine support. Ready for hero/brand moments in Phase 2.                                                   |

**Why two animation libraries?** UI micro-interactions (hover, toggle, modal) and scroll-driven sequences (pinned sections, scrubbed timelines) are different problems. Framer Motion owns state-driven UI. GSAP owns scroll-linked timelines. They share one token system. It's specialization, not overlap.

**ContentStack integration:** The motion system lives in a self-contained `src/motion/` directory with a single barrel export. The Dev Team imports components and tokens like any internal library — no special setup beyond a `ReducedMotionProvider` wrapper.

---

## The Motion System

### Tokens

Three easing curves mapped to the Motion Principles:

- `EASE_FRICTIONLESS` — `cubic-bezier(0.25, 0.1, 0.25, 1)` — default UI
- `EASE_PRECISE` — `cubic-bezier(0.4, 0, 0.2, 1)` — snappy interactions
- `EASE_CONTINUOUS` — `cubic-bezier(0.65, 0, 0.35, 1)` — looping motion

Plus duration scales (100ms-1200ms), 6 spring presets, and 4 stagger presets. Available as both TypeScript constants and CSS custom properties.

### Variant Library

Pre-built animation presets: `fadeIn`, `fadeUp`, `fadeDown`, `fadeLeft`, `fadeRight`, `scaleIn`, `slideIn(direction)`, `textReveal`, `staggerContainer`, `shake`. All reference the shared tokens.

### Reduced Motion (Four Layers)

1. **Framer Motion `MotionConfig`** — global animation toggle
2. **React Context** — reads OS `prefers-reduced-motion` + exposes an in-app override toggle
3. **CSS `@media`** — safety net killing all CSS animations
4. **Per-component fallbacks** — every GSAP module renders a static layout when motion is off

Lenis is not instantiated at all when reduced motion is active.

### Component Library (21 Primitives)

`Pressable`, `Presence`, `Collapse`, `Stagger`, `SwapText`, `Shake`, `Toggle`, `Card`, `AnimatedTabs`, `Accordion`, `Toast`, `Tooltip`, `Modal`, `Badge`, `ProgressBar`, `Counter`, `ChipList`, `CopyButton`, `Spinner`, `Skeleton`, `DragSlider`

Plus `AnimateInView` for scroll-triggered reveals. All self-contained, configured through props.

---

## What the PoC Covers

### Layer 1: Core Motion

- Page loader with branded progress bar
- Smooth scroll (Lenis + GSAP ticker sync)
- Scroll progress bar
- Nav section tracking with animated underline
- Mobile hamburger morph
- Custom cursor (dual-element, differential springs)
- Magnetic hover on interactive elements
- Text scramble reveal
- Page transitions (direction-aware, shared element)
- 18 micro-interaction demos with inline code snippets

### Layer 2: Narrative Motion (7 Modules)

- **Hero** — word-by-word mask reveal, scramble subtitle, magnetic tags, looping background
- **StorySequence** — pinned 4x viewport, canvas particle system (120 particles, chaos-to-grid), animated counter, phased reveals
- **BearingShowcase** — pinned 3x viewport, SVG bearing cross-section, ball orbit (720deg), counter-rotating outer race, staggered callouts
- **ExplodedView** — pinned 3x viewport, isometric SVG bearing with metallic gradients, assembly/disassembly sequence
- **ScrollSequence** — pinned 2x viewport, principle cards with progress line
- **ParallaxSection** — pinned 2.5x viewport, 8 layers at different speeds, SVG cogs rotating independently
- **VideoReveal** — scroll-scrubbed clipPath reveal with scale

### Also Included

- Live FPS overlay (sparkline, frame budget color coding)
- 3D CSS demos (flip card, mouse-tracked cube, parallax depth)
- Reduced motion toggle in the nav
- Code snippets for every micro-interaction

---

## Performance

- All animations on `transform` and `opacity` only — nothing that triggers layout
- Lenis and GSAP share a single RAF loop
- GSAP `context()` cleanup on every unmount — no orphaned ScrollTriggers
- Canvas rendering is DPR-aware
- All RAF loops properly cancelled on unmount
- `AnimateInView` triggers once by default
- Total motion dependency footprint: ~45KB gzipped
- When reduced motion is on, the animation layer is essentially off — near-zero overhead

---

## Handoff

The PoC already works as documentation — the ComponentShowcase has code snippets for every interaction, and the `src/motion/` directory is structured for drop-in use.

For the final Phase 1 delivery we'll add:

- Storybook with controls and usage examples per component
- Package-ready structure (extractable as internal NPM package)
- Integration testing alongside the SKF Dev Team in the ContentStack environment

---

## Phase 1 Scope & Timeline

### Scope

**Layer 1:** Page load animation, smooth scroll, scroll reveals, nav transitions, button/hover/focus states, form validation feedback, loading states, page transitions, full reduced-motion support.

**Layer 2 (5-10 modules):** Hero, 1-2 scroll-pinned storytelling sequences, parallax section, video reveal, counter sequence, card reveals. Additional modules scoped with the team.

**Deliverables:** Motion prototypes (.mp4) for creative sign-off, production React components (TypeScript), token system, Storybook docs, integration guide + handoff session.

### Team

| Role                                     | Allocation |
| ---------------------------------------- | ---------- |
| Motion Lead / Senior Frontend Developer  | 100%       |
| Creative Developer (GSAP / Canvas / SVG) | 80%        |
| Project Lead                             | 20%        |

### Timeline (6 weeks)

| Week                   | Focus                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------- |
| **1** (Apr 20-24)      | Kickoff, environment setup, ContentStack integration test, token finalization, .mp4 prototypes |
| **2** (Apr 27 - May 1) | Layer 1 core motion. Creative review of prototypes.                                            |
| **3** (May 4-8)        | Layer 2 first batch (hero, 2 scroll sequences). Storybook setup.                               |
| **4** (May 11-15)      | Layer 2 remaining modules. Device testing.                                                     |
| **5** (May 18-22)      | Integration testing with SKF Dev Team. Refinement. Documentation.                              |
| **6** (May 25-29)      | Buffer/polish. Final handoff. Phase 2 scoping.                                                 |

### Budget

**Phase 1 (Fixed Price):** 396 000 SEK

- Motion Lead: 180h x 1 100 SEK/h = 198 000 SEK
- Creative Developer: 144h x 1 100 SEK/h = 158 400 SEK
- Project Lead: 36h x 1 100 SEK/h = 39 600 SEK

Includes all deliverables, integration testing with the SKF Dev Team, and one revision round based on creative feedback.

---

## Why Pelagio

**We built the thing.** The PoC is a working React app with 21 animated components, 7 scroll-driven modules, a complete token system, and four-layer a11y support. Run it. Read the code.

**Plug and Play, for real.** The SKF Dev Team imports components and tokens — they don't need to understand spring physics or ScrollTrigger internals. Props in, motion out.

**We work with React, not around it.** No global side effects, no imperative scripts. The system fits naturally into a component-based ContentStack architecture.

**Accessible by default.** Not a compliance checkbox. Four layers of reduced-motion support, tested with a live toggle.

---

## Contact

**Erik Nordmark**  
Senior Developer  
Pelagio  
erik.nordmark@pelagio.se

---

_Confidential. Submitted in response to the SKF Vertevo Motion Brief, 2026-04-01._
