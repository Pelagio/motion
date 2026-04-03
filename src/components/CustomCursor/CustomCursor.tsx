import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "../../motion";
import styles from "./CustomCursor.module.css";

export function CustomCursor() {
  const reduced = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });
  const outerX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const outerY = useSpring(cursorY, { stiffness: 150, damping: 20 });
  const scale = useMotionValue(1);
  const outerScale = useSpring(scale, { stiffness: 300, damping: 20 });
  const isHovering = useRef(false);

  useEffect(() => {
    if (reduced) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-magnetic]")
      ) {
        scale.set(2.5);
        isHovering.current = true;
      }
    };

    const handleOut = () => {
      if (isHovering.current) {
        scale.set(1);
        isHovering.current = false;
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [cursorX, cursorY, scale, reduced]);

  if (reduced) return null;

  return (
    <>
      <motion.div
        className={styles.dot}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        className={styles.ring}
        style={{
          x: outerX,
          y: outerY,
          scale: outerScale,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
