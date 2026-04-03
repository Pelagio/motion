import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins once
gsap.registerPlugin(ScrollTrigger);

export * from "./tokens";
export * from "./variants";
export { useReducedMotion } from "./useReducedMotion";
export { AnimateInView } from "./AnimateInView";
