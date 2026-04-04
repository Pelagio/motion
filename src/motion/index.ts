import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins once
gsap.registerPlugin(ScrollTrigger);

export * from "./tokens";
export * from "./variants";
export { useReducedMotion } from "./useReducedMotion";
export { AnimateInView } from "./AnimateInView";
export {
  ReducedMotionProvider,
  useReducedMotionOverride,
} from "./ReducedMotionContext";
export {
  Pressable,
  Presence,
  Collapse,
  Stagger,
  SwapText,
  Shake,
  Toggle,
  Card,
  AnimatedTabs,
  Accordion,
  Toast,
  Tooltip,
  Modal,
  Badge,
  ProgressBar,
  Counter,
  ChipList,
  CopyButton,
  Spinner,
  Skeleton,
  DragSlider,
} from "./components";
