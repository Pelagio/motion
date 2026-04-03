import type { Variants } from "framer-motion";
import { EASE_FRICTIONLESS, DURATION, STAGGER } from "./tokens";

/**
 * SKF Vertevo Reusable Animation Variants
 *
 * Plug these into any Motion component via the `variants` prop.
 * Designed to degrade gracefully when reduced motion is preferred.
 */

/* ── Fade ── */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.normal, ease: EASE_FRICTIONLESS },
  },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

/* ── Fade + Translate ── */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slower, ease: EASE_FRICTIONLESS },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slower, ease: EASE_FRICTIONLESS },
  },
};

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slower, ease: EASE_FRICTIONLESS },
  },
};

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.slower, ease: EASE_FRICTIONLESS },
  },
};

/* ── Scale ── */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.normal, ease: EASE_FRICTIONLESS },
  },
};

/* ── Stagger Containers ── */

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.default,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.dramatic,
      delayChildren: 0.2,
    },
  },
};

/* ── Slide (for page transitions) ── */

export const slideIn = (
  direction: "left" | "right" | "up" | "down" = "right",
): Variants => {
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "right" || direction === "down" ? 1 : -1;

  return {
    enter: { [axis]: sign * 200, opacity: 0, scale: 0.97 },
    center: { [axis]: 0, opacity: 1, scale: 1 },
    exit: { [axis]: sign * -200, opacity: 0, scale: 0.97 },
  };
};

/* ── Text Reveal (word-by-word) ── */

export const textRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: STAGGER.dramatic,
      delayChildren: 0.3,
    },
  },
};

export const textRevealWord: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: DURATION.slower, ease: EASE_FRICTIONLESS },
  },
};

/* ── Shake (for form validation errors) ── */

export const shake: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: { duration: 0.5 },
  },
};
