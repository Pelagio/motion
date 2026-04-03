import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { fadeUp, fadeIn } from "./variants";
import { useReducedMotion } from "./useReducedMotion";

interface AnimateInViewProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  /** Viewport margin for triggering (default "-80px") */
  margin?: string;
  /** Only animate once (default true) */
  once?: boolean;
}

/**
 * Wraps children in a scroll-triggered entrance animation.
 * Respects `prefers-reduced-motion` by falling back to a simple fade.
 *
 * Usage:
 *   <AnimateInView>
 *     <h2>Appears on scroll</h2>
 *   </AnimateInView>
 */
export function AnimateInView({
  children,
  variants = fadeUp,
  className,
  margin = "-80px",
  once = true,
}: AnimateInViewProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduced ? fadeIn : variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
    >
      {children}
    </motion.div>
  );
}
