# Vertevo Motion Showcase

A motion design prototype demonstrating the Vertevo motion language: **Frictionless**, **Precise**, and **Continuous** animation principles for a modern engineering brand.

**Live demo:** [vertevo-motion.netlify.app](https://vertevo-motion.netlify.app)

---

## Motion Stack

| Library                  | Role                                                                            |
| ------------------------ | ------------------------------------------------------------------------------- |
| **Framer Motion**        | Component animations, micro-interactions, layout transitions, `AnimatePresence` |
| **GSAP + ScrollTrigger** | Scroll-driven sequences, pinned sections, scrub-based transforms                |
| **Lenis**                | Smooth inertia scrolling, synced with GSAP ScrollTrigger                        |
| **CSS Modules**          | Scoped styling with design tokens via CSS custom properties                     |

This stack was selected for maximum flexibility: Framer Motion handles component-level interactions with spring physics and layout animations, while GSAP drives scroll-choreographed narratives that require precise timeline control. Lenis provides the foundational scroll feel that elevates everything.

---

## Motion Principles (The "Feel")

### Frictionless

Easing feels impossibly smooth, mimicking a perfectly engineered bearing. No abrupt stops or jagged starts. Implemented via custom cubic-bezier `[0.25, 0.1, 0.25, 1]` (`EASE_FRICTIONLESS`).

### Precise

Timing and spatial movements feel exact and calculated, reflecting high-end engineering. Spring configs tuned with specific stiffness/damping ratios (`SPRING.snappy`, `SPRING.button`, etc.).

### Continuous

Transitions and scroll-based motion feel like an ongoing evolution. Exit animations inform enter animations, creating unbroken visual narrative. Implemented via `AnimatePresence`, `layoutId`, and GSAP scrub timelines.

---

## Architecture

### Reusable Motion System (`src/motion/`)

The motion layer is designed for easy integration by a dev team. No hard-coded, page-specific monolithic scripts.

```
src/motion/
  tokens.ts          # Easing curves, duration scale, spring presets, stagger values
  variants.ts        # Reusable animation variants (fadeUp, slideIn, scaleIn, etc.)
  useReducedMotion.ts # Hook for prefers-reduced-motion
  AnimateInView.tsx   # Scroll-triggered entrance wrapper component
  index.ts           # Barrel export + GSAP plugin registration
```

**Usage in components:**

```tsx
import { EASE_FRICTIONLESS, SPRING, useReducedMotion, AnimateInView } from "../../motion";

// Spring-animated button
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
  transition={SPRING.button}
>

// Scroll-triggered entrance
<AnimateInView>
  <h2>Appears on scroll</h2>
</AnimateInView>

// Reduced motion guard
const reduced = useReducedMotion();
<motion.div animate={reduced ? {} : { rotate: 360 }} />
```

### Motion Tokens (`src/motion/tokens.ts`)

All animation values are centralized. Update once, applies everywhere.

| Token               | Value                         | Use                           |
| ------------------- | ----------------------------- | ----------------------------- |
| `EASE_FRICTIONLESS` | `[0.25, 0.1, 0.25, 1]`        | Default UI transitions        |
| `EASE_PRECISE`      | `[0.4, 0, 0.2, 1]`            | Snappy interactions           |
| `EASE_CONTINUOUS`   | `[0.65, 0, 0.35, 1]`          | Looping/continuous animations |
| `SPRING.snappy`     | `stiffness: 500, damping: 30` | Toggles, badges               |
| `SPRING.button`     | `stiffness: 400, damping: 17` | Buttons, tabs                 |
| `SPRING.gentle`     | `stiffness: 300, damping: 20` | Cards, hover states           |
| `SPRING.lazy`       | `stiffness: 100, damping: 20` | Progress bars, slow reveals   |
| `DURATION.fast`     | `0.2s`                        | Micro-interactions            |
| `DURATION.normal`   | `0.35s`                       | Standard transitions          |
| `DURATION.slow`     | `0.5s`                        | Page transitions              |

---

## Layers of Motion

### Layer 1: Core Motion & Micro-interactions (Site Generic)

Baseline brand feel, interface guidance, tactile feedback.

| Pattern                 | Implementation                                                        | Demo                   |
| ----------------------- | --------------------------------------------------------------------- | ---------------------- |
| Page loading            | `PageLoader` -- logo scale + progress bar with `AnimatePresence` exit | Loading screen         |
| Smooth scrolling        | `SmoothScroll` -- Lenis with GSAP sync                                | Entire page            |
| Scroll progress         | `Nav` -- spring-driven `scaleX` progress bar                          | Top of page            |
| Active section tracking | `Nav` -- `IntersectionObserver` + `layoutId` sliding indicator        | Navigation             |
| Nav link entrance       | `Nav` -- staggered fade-in on load                                    | Navigation             |
| Mobile menu             | `Nav` -- hamburger morph + staggered link reveal                      | Mobile viewport        |
| Button hover/tap        | `ButtonDemo` -- spring scale + glow                                   | Component showcase     |
| Toggle switch           | `ToggleDemo` -- `layout` animation for knob                           | Component showcase     |
| Tabs                    | `TabsDemo` -- `layoutId` shared underline                             | Component showcase     |
| Menu reveal             | `MenuDemo` -- height animation + staggered items                      | Component showcase     |
| Accordion               | `AccordionDemo` -- expand/collapse + chevron rotation                 | Component showcase     |
| Toast notification      | `ToastDemo` -- spring enter, slide exit, auto-dismiss                 | Component showcase     |
| Skeleton loader         | `SkeletonDemo` -- CSS shimmer + crossfade                             | Component showcase     |
| Progress bar            | `ProgressDemo` -- spring-driven width                                 | Component showcase     |
| Form validation         | `FormDemo` -- shake on error, check on success                        | Component showcase     |
| Tooltip                 | `TooltipDemo` -- spring hover reveal with arrow                       | Component showcase     |
| Modal/Dialog            | `ModalDemo` -- scale + backdrop blur entrance                         | Component showcase     |
| Notification badge      | `BadgeDemo` -- spring bounce on count change                          | Component showcase     |
| Copy button             | `CopyDemo` -- icon morphs clipboard to checkmark                      | Component showcase     |
| Drag interaction        | `DragDemo` -- drag with color interpolation                           | Component showcase     |
| Bearing loader          | `SpinnerDemo` -- blueprint SVG bearing with progress arc              | Component showcase     |
| Number counter          | `CounterDemo` -- staggered digit roll animation                       | Component showcase     |
| Chip/tag list           | `ChipDemo` -- layout reflow on add/remove                             | Component showcase     |
| Magnetic elements       | `Magnetic` -- cursor-attracted hover effect                           | Nav links, Hero badges |
| Text scramble           | `TextScramble` -- decode through random glyphs                        | Hero subtitle          |

### Layer 2: Narrative Motion (Module / Class Specific)

Storytelling, brand building, high-impact "wow" effect.

| Pattern            | Implementation                                                                            | Demo                              |
| ------------------ | ----------------------------------------------------------------------------------------- | --------------------------------- |
| Hero text reveal   | `Hero` -- staggered word-by-word entrance                                                 | Hero section                      |
| Narrative scroll   | `StorySequence` -- canvas particle field + counter + typography reveal, GSAP pinned 400vh | Story section                     |
| Bearing scroll     | `BearingShowcase` -- SVG blueprint bearing rotates on scroll, GSAP pinned 300vh           | Bearing section                   |
| Scroll card reveal | `ScrollSequence` -- GSAP scrub staggered card entrance                                    | Principles section                |
| Video reveal       | `VideoReveal` -- scroll-triggered `clip-path` reveal + play button pulse                  | Video section                     |
| Page transitions   | `PageTransition` -- `AnimatePresence` + `layoutId` shared icon                            | Transitions section               |
| Noise texture      | CSS `feTurbulence` overlay on dark sections                                               | Hero, Story, Bearing, Transitions |

---

## Accessibility

### prefers-reduced-motion (Strict Support)

Every animated component respects the user's motion preference:

- **`useReducedMotion()` hook** -- consumed by all components with JS-driven animation
- **Global CSS** -- `@media (prefers-reduced-motion: reduce)` kills all CSS animations/transitions
- **GSAP sections** -- check `reduced` flag, render static fallback with all content visible (no pinning, no scrub)
- **Framer Motion** -- all `repeat: Infinity` animations guarded with `reduced ? {} : { ... }`
- **Lenis** -- disabled entirely when reduced motion is preferred
- **Marquee, TextScramble, Magnetic** -- all bypass animation and render static content

Degradation is graceful: users see all content in a clean static layout with simple opacity fades via `AnimateInView`.

---

## Performance

- **Transform/opacity only** for all JS-driven animations (no layout thrashing)
- **Lenis** synced with GSAP ticker (single rAF loop)
- **`requestAnimationFrame`** loops tracked in refs and cleaned up on unmount
- **`setInterval`/`setTimeout`** tracked in refs with cleanup effects
- **GSAP contexts** properly reverted on unmount (no leaked ScrollTriggers)
- **CSS `will-change`** applied via Framer Motion's internal optimization
- **Noise overlay** is pure CSS (SVG filter inlined as data URI, zero JS cost)
- **`shapeRendering: geometricPrecision`** on SVG for crisp rendering

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Netlify Deployment

The project deploys to Netlify with zero configuration:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18+

---

## Project Structure

```
src/
  motion/                    # Reusable motion system
    tokens.ts                # Easing, duration, spring, stagger constants
    variants.ts              # Animation variant presets
    useReducedMotion.ts      # Reduced motion hook
    AnimateInView.tsx         # Scroll-triggered entrance component
    index.ts                 # Barrel export + GSAP registration
  components/
    Layout/Nav               # Sticky nav, progress bar, mobile menu
    PageLoader/              # Full-screen loading animation
    SmoothScroll/            # Lenis smooth scroll wrapper
    Hero/                    # Text reveal, text scramble, glow
    StorySequence/           # Canvas particle narrative scroll
    BearingShowcase/         # SVG blueprint bearing scroll
    ScrollSequence/          # GSAP card reveal scroll
    ComponentShowcase/       # 18 interactive micro-interaction demos
    VideoReveal/             # Clip-path video reveal
    PageTransition/          # AnimatePresence page transitions
    Magnetic/                # Cursor-attracted hover effect
    TextScramble/            # Character decode effect
    Marquee/                 # Infinite scrolling ticker
    CustomCursor/            # Custom cursor (available but not active)
  styles/
    variables.css            # Design tokens (colors, spacing, easing, fonts)
    global.css               # Reset, fonts, grain overlay, reduced motion
```
