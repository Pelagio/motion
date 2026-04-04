import { useRef, useState, useEffect, useCallback } from "react";

export interface PerfMetrics {
  fps: number;
  frameTime: number;
  fpsHistory: number[];
}

const HISTORY_SIZE = 120;
const UPDATE_INTERVAL = 6; // update React state every N frames

export function usePerfMetrics(enabled: boolean): PerfMetrics {
  const [metrics, setMetrics] = useState<PerfMetrics>({
    fps: 0,
    frameTime: 0,
    fpsHistory: [],
  });

  const rafRef = useRef(0);
  const timesRef = useRef<number[]>([]);
  const historyRef = useRef<number[]>([]);
  const frameCountRef = useRef(0);

  const tick = useCallback((now: number) => {
    const times = timesRef.current;
    times.push(now);
    if (times.length > 61) times.shift();

    frameCountRef.current++;

    if (times.length > 1) {
      const frameTime = times[times.length - 1] - times[times.length - 2];
      const elapsed = times[times.length - 1] - times[0];
      const fps = Math.round(((times.length - 1) / elapsed) * 1000);

      // Update history
      if (frameCountRef.current % 2 === 0) {
        historyRef.current.push(fps);
        if (historyRef.current.length > HISTORY_SIZE) {
          historyRef.current.shift();
        }
      }

      // Throttle React state updates
      if (frameCountRef.current % UPDATE_INTERVAL === 0) {
        setMetrics({
          fps,
          frameTime: Math.round(frameTime * 10) / 10,
          fpsHistory: [...historyRef.current],
        });
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!enabled) {
      timesRef.current = [];
      historyRef.current = [];
      frameCountRef.current = 0;
      return;
    }

    rafRef.current = requestAnimationFrame(tick);

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        timesRef.current = [];
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [enabled, tick]);

  return metrics;
}
