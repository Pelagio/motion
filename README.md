# Motion Showcase

A motion design prototype demonstrating a motion language built on three principles: **Frictionless**, **Precise**, and **Continuous** animation for a modern engineering brand.

---

## Motion Stack

| Library                  | Role                                                                            |
| ------------------------ | ------------------------------------------------------------------------------- |
| **Framer Motion**        | Component animations, micro-interactions, layout transitions, `AnimatePresence` |
| **GSAP + ScrollTrigger** | Scroll-driven sequences, pinned sections, scrub-based transforms                |
| **Lenis**                | Smooth inertia scrolling, synced with GSAP ScrollTrigger                        |
| **CSS Modules**          | Scoped styling with design tokens via CSS custom properties                     |

---

## Component Library (`src/motion/components.tsx`)

High-level animated components with a clean, developer-friendly API. Every component uses the motion token system internally -- developers never touch raw animation config.

### Primitives

| Component     | Usage                                                        |
| ------------- | ------------------------------------------------------------ |
| `<Pressable>` | `<Pressable hover="lift"><button>Click</button></Pressable>` |
| `<Presence>`  | `<Presence visible={show} preset="pop">...</Presence>`       |
| `<Collapse>`  | `<Collapse open={isOpen}>...</Collapse>`                     |
| `<Stagger>`   | `<Stagger from="left">{items}</Stagger>`                     |
| `<SwapText>`  | `<SwapText id={key}>Content</SwapText>`                      |
| `<Shake>`     | `<Shake trigger={hasError}><input /></Shake>`                |

### Components

| Component        | Usage                                                      |
| ---------------- | ---------------------------------------------------------- |
| `<Toggle>`       | `<Toggle checked={isOn} onChange={setIsOn} />`             |
| `<Card>`         | `<Card hover="lift">Content</Card>`                        |
| `<AnimatedTabs>` | `<AnimatedTabs tabs={[...]} active={i} onSelect={setI} />` |
| `<Accordion>`    | `<Accordion items={[{ title, content }]} />`               |
| `<Toast>`        | `<Toast message="Saved" visible={show} />`                 |
| `<Tooltip>`      | `<Tooltip content="Details"><span>Hover</span></Tooltip>`  |
| `<Modal>`        | `<Modal open={isOpen} onClose={close}>...</Modal>`         |
| `<Badge>`        | `<Badge count={3}><BellIcon /></Badge>`                    |
| `<ProgressBar>`  | `<ProgressBar value={75} />`                               |
| `<Counter>`      | `<Counter value={1234} />`                                 |
| `<ChipList>`     | `<ChipList items={chips} onRemove={fn} />`                 |
| `<CopyButton>`   | `<CopyButton text={code} />`                               |
| `<Spinner>`      | `<Spinner />`                                              |
| `<Skeleton>`     | `<Skeleton loaded={done}>{content}</Skeleton>`             |
| `<DragSlider>`   | `<DragSlider />`                                           |

### Hover Presets

Named presets instead of raw numbers:

| Preset   | Scale | Use case                |
| -------- | ----- | ----------------------- |
| `subtle` | 1.03  | Small interactive items |
| `lift`   | 1.05  | Buttons, cards          |
| `bounce` | 1.08  | Playful interactions    |

### Presence Presets

| Preset    | Effect                        |
| --------- | ----------------------------- |
| `fade`    | Opacity only                  |
| `pop`     | Scale + fade + slight y-shift |
| `slideUp` | Slide from below + fade       |
| `scaleIn` | Scale from 0 + fade           |

---

## Motion Tokens (`src/motion/tokens.ts`)

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

---

## Features

### Code Snippets

Every micro-interaction demo has a `</>` toggle button that reveals the component API code with syntax highlighting. Shows developers exactly how to use each component.

### Performance Overlay

Real-time FPS counter toggled from the nav bar. Measures actual rendering performance using `requestAnimationFrame` timing. Shows FPS sparkline, frame time, and frame budget bar.

### Reduced Motion Support

Every animated component respects `prefers-reduced-motion`:

- **`useReducedMotion()` hook** -- consumed by all components
- **`ReducedMotionProvider`** -- React context allowing programmatic override for demos
- **Global CSS** -- `@media (prefers-reduced-motion: reduce)` disables all CSS animations
- **GSAP sections** -- render static fallback layouts (no pinning, no scrub)
- **Lenis** -- disabled entirely when reduced motion is preferred

---

## Accessibility

- `Modal` -- `role="dialog"`, `aria-modal`, Escape key to close
- `Toggle` -- `role="switch"`, `aria-checked`
- `Tooltip` -- `role="tooltip"`, `aria-describedby`, keyboard support via `onFocus`/`onBlur`
- `Badge` -- hidden when count is 0
- All components accept `className` for custom styling

---

## Getting Started

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
  motion/                    # Reusable motion system
    tokens.ts                # Easing, duration, spring, stagger constants
    variants.ts              # Animation variant presets
    components.tsx           # High-level component library (21 components)
    useReducedMotion.ts      # Reduced motion hook
    ReducedMotionContext.tsx  # Context provider for programmatic override
    AnimateInView.tsx         # Scroll-triggered entrance component
    index.ts                 # Barrel export
  components/
    Layout/Nav               # Sticky nav, progress bar, FPS toggle, mobile menu
    PageLoader/              # Full-screen loading animation
    SmoothScroll/            # Lenis smooth scroll wrapper
    Hero/                    # Text reveal, text scramble, glow
    StorySequence/           # Canvas particle narrative scroll
    BearingShowcase/         # SVG blueprint bearing scroll
    ScrollSequence/          # GSAP card reveal scroll
    ComponentShowcase/       # 18 interactive demos with code snippets
    VideoReveal/             # Clip-path video reveal
    ParallaxSection/         # Multi-layer parallax with cog SVGs
    PageTransition/          # AnimatePresence page transitions
    PerfOverlay/             # Real-time FPS performance overlay
    Magnetic/                # Cursor-attracted hover effect
    TextScramble/            # Character decode effect
    Marquee/                 # Infinite scrolling ticker
  styles/
    variables.css            # Design tokens (colors, spacing, easing, fonts)
    global.css               # Reset, fonts, grain overlay, reduced motion
```
