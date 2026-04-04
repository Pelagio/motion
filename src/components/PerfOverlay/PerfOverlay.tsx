import { motion, AnimatePresence } from "framer-motion";
import { SPRING } from "../../motion";
import { usePerfMetrics } from "./usePerfMetrics";
import styles from "./PerfOverlay.module.css";

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const w = 200;
  const h = 40;
  const max = Math.max(...data, 70);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={styles.sparkline}
      preserveAspectRatio="none"
    >
      {/* 60fps reference line */}
      <line
        x1="0"
        y1={h - ((60 - min) / range) * h}
        x2={w}
        y2={h - ((60 - min) / range) * h}
        stroke="rgba(255,255,255,0.1)"
        strokeDasharray="4 4"
      />
      <polyline
        fill="none"
        stroke="var(--color-skf-blue)"
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

function FrameBudgetBar({ frameTime }: { frameTime: number }) {
  const pct = Math.min((frameTime / 33.3) * 100, 100);
  const color =
    frameTime <= 16.67
      ? "var(--color-success)"
      : frameTime <= 25
        ? "#e8a85a"
        : "var(--color-error)";

  return (
    <div className={styles.budgetTrack}>
      <div
        className={styles.budgetFill}
        style={{ width: `${pct}%`, background: color }}
      />
      <div
        className={styles.budgetMark}
        style={{ left: `${(16.67 / 33.3) * 100}%` }}
      />
    </div>
  );
}

interface PerfOverlayProps {
  visible: boolean;
}

export function PerfOverlay({ visible }: PerfOverlayProps) {
  const { fps, frameTime, fpsHistory } = usePerfMetrics(visible);

  const fpsColor =
    fps >= 55
      ? "var(--color-success)"
      : fps >= 30
        ? "#e8a85a"
        : "var(--color-error)";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={SPRING.snappy}
        >
          <div className={styles.header}>
            <span className={styles.title}>Performance</span>
          </div>

          <div className={styles.fpsRow}>
            <span className={styles.fpsNumber} style={{ color: fpsColor }}>
              {fps}
            </span>
            <span className={styles.fpsUnit}>FPS</span>
          </div>

          <Sparkline data={fpsHistory} />

          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Frame time</span>
            <span className={styles.metricValue}>{frameTime}ms</span>
          </div>

          <FrameBudgetBar frameTime={frameTime} />

          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Budget</span>
            <span className={styles.metricValue}>16.67ms</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
