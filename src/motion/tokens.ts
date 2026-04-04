import type { EasingDefinition } from "framer-motion";

/**
 * Motion Tokens
 *
 * Centralized animation constants for the motion system.
 * Import these instead of defining inline values.
 */

/* ── Easing Curves ── */

/** Smooth, natural feel. Default for most UI transitions. */
export const EASE_FRICTIONLESS: EasingDefinition = [0.25, 0.1, 0.25, 1];

/** Snappy, responsive. For interactions that need precision. */
export const EASE_PRECISE: EasingDefinition = [0.4, 0, 0.2, 1];

/** Symmetric in/out. For looping or continuous animations. */
export const EASE_CONTINUOUS: EasingDefinition = [0.65, 0, 0.35, 1];

/* ── Duration Scale (seconds) ── */

export const DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

/* ── Spring Presets ── */

export const SPRING = {
  /** Snappy button/toggle response */
  snappy: { type: "spring" as const, stiffness: 500, damping: 30 },
  /** Default UI interactions */
  default: { type: "spring" as const, stiffness: 400, damping: 25 },
  /** Buttons, tabs */
  button: { type: "spring" as const, stiffness: 400, damping: 17 },
  /** Card hovers, layout shifts */
  gentle: { type: "spring" as const, stiffness: 300, damping: 20 },
  /** Large element transitions */
  soft: { type: "spring" as const, stiffness: 200, damping: 25 },
  /** Progress bars, slow reveals */
  lazy: { type: "spring" as const, stiffness: 100, damping: 20 },
} as const;

/* ── Stagger Presets ── */

export const STAGGER = {
  fast: 0.03,
  default: 0.05,
  slow: 0.1,
  dramatic: 0.15,
} as const;
