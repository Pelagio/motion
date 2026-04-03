import { useEffect, useState, useRef } from "react";
import { useReducedMotion } from "../../motion";

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

interface TextScrambleProps {
  text: string;
  className?: string;
  /** Delay before starting (ms) */
  delay?: number;
  /** Speed of reveal (ms per character) */
  speed?: number;
  /** Trigger on scroll into view */
  triggerOnView?: boolean;
}

export function TextScramble({
  text,
  className,
  delay = 0,
  speed = 40,
  triggerOnView = true,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const [started, setStarted] = useState(!triggerOnView);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  // IntersectionObserver to trigger on scroll
  useEffect(() => {
    if (!triggerOnView || started || reduced) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOnView, started, reduced]);

  useEffect(() => {
    if (reduced || !started) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const totalFrames = text.length;
    let rafId: number;

    const timer = window.setTimeout(() => {
      const animate = () => {
        frame++;
        const revealed = Math.floor((frame / totalFrames) * text.length);

        const result = text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < revealed) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");

        setDisplay(result);

        if (frame < totalFrames * 2) {
          rafId = window.setTimeout(
            () => requestAnimationFrame(animate),
            speed,
          );
        } else {
          setDisplay(text);
        }
      };

      animate();
    }, delay);

    return () => {
      clearTimeout(timer);
      clearTimeout(rafId);
    };
  }, [text, delay, speed, reduced, started]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  );
}
