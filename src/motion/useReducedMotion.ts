import { useState, useEffect } from "react";
import { useReducedMotionContext } from "./ReducedMotionContext";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Returns `true` when the user prefers reduced motion.
 * Checks the ReducedMotionContext override first (for simulated toggle),
 * then falls back to the OS media query.
 */
export function useReducedMotion(): boolean {
  const override = useReducedMotionContext();

  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  if (override !== null) return override;
  return reduced;
}
