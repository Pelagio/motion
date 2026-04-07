import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../../motion";
import styles from "./ParallaxSection.module.css";

/**
 * SVG cog/gear with configurable teeth count.
 * Blueprint style: stroke only, no fill.
 */
function CogSvg({
  teeth = 12,
  strokeColor = "rgba(255,255,255,0.2)",
  strokeWidth = 1,
}: {
  teeth?: number;
  strokeColor?: string;
  strokeWidth?: number;
}) {
  const outerR = 46;
  const innerR = 34;
  const holeR = 16;
  const toothWidth = (Math.PI * 2) / teeth;
  const half = toothWidth * 0.35;

  // Build gear path
  let d = "";
  for (let i = 0; i < teeth; i++) {
    const angle = i * toothWidth;
    // Outer tooth corners
    const o1x = 50 + Math.cos(angle - half) * outerR;
    const o1y = 50 + Math.sin(angle - half) * outerR;
    const o2x = 50 + Math.cos(angle + half) * outerR;
    const o2y = 50 + Math.sin(angle + half) * outerR;
    // Inner valley
    const nextAngle = angle + toothWidth;
    const i1x = 50 + Math.cos(angle + half) * innerR;
    const i1y = 50 + Math.sin(angle + half) * innerR;
    const i2x = 50 + Math.cos(nextAngle - half) * innerR;
    const i2y = 50 + Math.sin(nextAngle - half) * innerR;

    if (i === 0) {
      d += `M${o1x},${o1y} `;
    }
    d += `L${o2x},${o2y} L${i1x},${i1y} L${i2x},${i2y} `;
    // Connect to next tooth
    const n1x = 50 + Math.cos(nextAngle - half) * outerR;
    const n1y = 50 + Math.sin(nextAngle - half) * outerR;
    d += `L${n1x},${n1y} `;
  }
  d += "Z";

  return (
    <svg viewBox="0 0 100 100" className={styles.cogSvg} fill="none">
      {/* Gear outline */}
      <path
        d={d}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Center hole */}
      <circle
        cx={50}
        cy={50}
        r={holeR}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      {/* Axle cross */}
      <line
        x1={50 - holeR * 0.5}
        y1={50}
        x2={50 + holeR * 0.5}
        y2={50}
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.6}
      />
      <line
        x1={50}
        y1={50 - holeR * 0.5}
        x2={50}
        y2={50 + holeR * 0.5}
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.6}
      />
      {/* Spokes */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={50 + Math.cos(rad) * (holeR + 2)}
            y1={50 + Math.sin(rad) * (holeR + 2)}
            x2={50 + Math.cos(rad) * (innerR - 2)}
            y2={50 + Math.sin(rad) * (innerR - 2)}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.4}
          />
        );
      })}
    </svg>
  );
}

interface CogPlacement {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  teeth: number;
  rotateSpeed: number; // degrees per timeline unit
  color: string;
  strokeW: number;
}

// Back layer cogs -- large, faint, slow
const backCogs: CogPlacement[] = [
  {
    size: 500,
    top: "-10%",
    left: "-8%",
    teeth: 20,
    rotateSpeed: 60,
    color: "rgba(255,255,255,0.04)",
    strokeW: 1.5,
  },
  {
    size: 350,
    bottom: "-5%",
    right: "-5%",
    teeth: 16,
    rotateSpeed: -45,
    color: "rgba(255,255,255,0.03)",
    strokeW: 1,
  },
];

// Mid layer cogs -- medium, more visible, interlocking
const midCogs: CogPlacement[] = [
  {
    size: 280,
    top: "15%",
    right: "5%",
    teeth: 14,
    rotateSpeed: -90,
    color: "rgba(255,255,255,0.12)",
    strokeW: 1,
  },
  {
    size: 200,
    top: "55%",
    left: "10%",
    teeth: 10,
    rotateSpeed: 120,
    color: "rgba(255,255,255,0.1)",
    strokeW: 0.8,
  },
  {
    size: 160,
    bottom: "10%",
    right: "25%",
    teeth: 8,
    rotateSpeed: -150,
    color: "rgba(255,255,255,0.08)",
    strokeW: 0.8,
  },
];

// Front layer cogs -- small, bright, fast
const frontCogs: CogPlacement[] = [
  {
    size: 120,
    top: "25%",
    left: "20%",
    teeth: 8,
    rotateSpeed: 180,
    color: "rgba(255,255,255,0.2)",
    strokeW: 1,
  },
  {
    size: 90,
    bottom: "20%",
    left: "35%",
    teeth: 6,
    rotateSpeed: -240,
    color: "rgba(255,255,255,0.15)",
    strokeW: 0.8,
  },
  {
    size: 70,
    top: "10%",
    right: "30%",
    teeth: 6,
    rotateSpeed: 300,
    color: "rgba(255,255,255,0.12)",
    strokeW: 0.6,
  },
];

export function ParallaxSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const backCogsRef = useRef<HTMLDivElement>(null);
  const midCogsRef = useRef<HTMLDivElement>(null);
  const frontCogsRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const midTextRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const cogElements = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;

    const allCogs = [...backCogs, ...midCogs, ...frontCogs];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=250%",
          pin: containerRef.current,
          scrub: 1,
        },
      });

      // Parallax: each layer at different speed
      tl.fromTo(
        gridRef.current,
        { y: 0 },
        { y: -50, duration: 1, ease: "none" },
        0,
      );
      tl.fromTo(
        backCogsRef.current,
        { y: 80 },
        { y: -100, duration: 1, ease: "none" },
        0,
      );
      tl.fromTo(
        bgTextRef.current,
        { y: 150 },
        { y: -200, duration: 1, ease: "none" },
        0,
      );
      tl.fromTo(
        midCogsRef.current,
        { y: 120 },
        { y: -180, duration: 1, ease: "none" },
        0,
      );
      tl.fromTo(
        midTextRef.current,
        { y: 100 },
        { y: -160, duration: 1, ease: "none" },
        0,
      );
      tl.fromTo(
        frontCogsRef.current,
        { y: 180 },
        { y: -280, duration: 1, ease: "none" },
        0,
      );
      tl.fromTo(
        fgRef.current,
        { y: 200 },
        { y: -320, duration: 1, ease: "none" },
        0,
      );

      // Rotate each cog at its own speed
      cogElements.current.forEach((el, i) => {
        if (!el) return;
        tl.fromTo(
          el,
          { rotation: 0 },
          { rotation: allCogs[i].rotateSpeed, duration: 1, ease: "none" },
          0,
        );
      });

      // Text fade in/out
      tl.fromTo(
        midTextRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25 },
        0.15,
      );
      tl.to(midTextRef.current, { opacity: 0, duration: 0.15 }, 0.75);
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  const renderCog = (cog: CogPlacement, globalIndex: number) => (
    <div
      key={globalIndex}
      ref={(el) => {
        cogElements.current[globalIndex] = el;
      }}
      className={styles.cog}
      style={{
        width: cog.size,
        height: cog.size,
        top: cog.top,
        left: cog.left,
        right: cog.right,
        bottom: cog.bottom,
      }}
    >
      <CogSvg
        teeth={cog.teeth}
        strokeColor={cog.color}
        strokeWidth={cog.strokeW}
      />
    </div>
  );

  if (reduced) {
    return (
      <section
        ref={sectionRef}
        className={`${styles.section} ${styles.sectionReduced} grain`}
      >
        {/* Static background matching the animated version */}
        <div className={`${styles.layer} ${styles.bgLayer}`} />

        {/* Static cogs at resting positions */}
        <div className={`${styles.layer} ${styles.cogsLayer}`}>
          {backCogs.map((cog, i) => (
            <div
              key={`b${i}`}
              className={styles.cog}
              style={{
                width: cog.size,
                height: cog.size,
                top: cog.top,
                left: cog.left,
                right: cog.right,
                bottom: cog.bottom,
              }}
            >
              <CogSvg
                teeth={cog.teeth}
                strokeColor={cog.color}
                strokeWidth={cog.strokeW}
              />
            </div>
          ))}
        </div>
        <div className={`${styles.layer} ${styles.cogsMidLayer}`}>
          {midCogs.map((cog, i) => (
            <div
              key={`m${i}`}
              className={styles.cog}
              style={{
                width: cog.size,
                height: cog.size,
                top: cog.top,
                left: cog.left,
                right: cog.right,
                bottom: cog.bottom,
              }}
            >
              <CogSvg
                teeth={cog.teeth}
                strokeColor={cog.color}
                strokeWidth={cog.strokeW}
              />
            </div>
          ))}
        </div>

        {/* Text content */}
        <div className={`${styles.layer} ${styles.textLayer}`}>
          <div className={styles.midText}>
            Engineered layers of motion
            <span className={styles.midTextMuted}>
              Scroll-driven parallax with industrial elements at different
              depths, creating a sense of spatial precision and mechanical
              rhythm.
            </span>
          </div>
        </div>
      </section>
    );
  }

  let cogIndex = 0;

  return (
    <section ref={sectionRef} className={`${styles.section} grain`}>
      <div ref={containerRef} className={styles.pinContainer}>
        <p className={styles.label}>Parallax Depth</p>

        {/* Layer 0: Background gradient */}
        <div className={`${styles.layer} ${styles.bgLayer}`} />

        {/* Layer 1: Grid */}
        <div ref={gridRef} className={`${styles.layer} ${styles.gridLayer}`}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`h${i}`}
              className={`${styles.gridLine} ${styles.gridLineH}`}
              style={{ top: `${(i + 1) * 7.5}%` }}
            />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={`v${i}`}
              className={`${styles.gridLine} ${styles.gridLineV}`}
              style={{ left: `${(i + 1) * 9}%` }}
            />
          ))}
        </div>

        {/* Layer 2: Back cogs -- huge, faint */}
        <div
          ref={backCogsRef}
          className={`${styles.layer} ${styles.cogsLayer}`}
        >
          {backCogs.map((cog) => renderCog(cog, cogIndex++))}
        </div>

        {/* Layer 3: Background text watermark */}
        <div ref={bgTextRef} className={`${styles.layer} ${styles.textLayer}`}>
          <span className={styles.bigText}>Engineering</span>
        </div>

        {/* Layer 4: Mid cogs -- medium */}
        <div
          ref={midCogsRef}
          className={`${styles.layer} ${styles.cogsMidLayer}`}
        >
          {midCogs.map((cog) => renderCog(cog, cogIndex++))}
        </div>

        {/* Layer 5: Main text */}
        <div
          ref={midTextRef}
          className={`${styles.layer} ${styles.textLayer}`}
          style={{ opacity: 0 }}
        >
          <div className={styles.midText}>
            Engineered layers of motion
            <span className={styles.midTextMuted}>
              Industrial-grade parallax with interlocking elements at different
              depths. Every gear turns with purpose. Every layer moves with
              precision.
            </span>
          </div>
        </div>

        {/* Layer 6: Front cogs -- small, bright, fast */}
        <div
          ref={frontCogsRef}
          className={`${styles.layer} ${styles.cogsLayer}`}
        >
          {frontCogs.map((cog) => renderCog(cog, cogIndex++))}
        </div>

        {/* Layer 7: Measurement lines -- engineering details */}
        <div ref={fgRef} className={`${styles.layer} ${styles.fgLayer}`}>
          <div
            className={styles.measureLine}
            style={{ top: "30%", left: "5%", width: 160 }}
          >
            <span className={styles.measureDot} />
            <span className={styles.measureDash} style={{ flex: 1 }} />
            <span className={styles.measureLabel}>R 120mm</span>
          </div>
          <div
            className={styles.measureLine}
            style={{ top: "70%", right: "8%", width: 120 }}
          >
            <span className={styles.measureLabel}>0.003mm</span>
            <span className={styles.measureDash} style={{ flex: 1 }} />
            <span className={styles.measureDot} />
          </div>
          <div
            className={styles.measureLine}
            style={{
              top: "45%",
              right: "15%",
              width: 90,
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
            }}
          >
            <span className={styles.measureLabel}>Tolerance</span>
            <span
              className={styles.measureDash}
              style={{ width: "100%", height: 1 }}
            />
          </div>
          <div
            className={styles.measureLine}
            style={{ bottom: "25%", left: "15%", width: 100 }}
          >
            <span className={styles.measureDot} />
            <span className={styles.measureDash} style={{ flex: 1 }} />
            <span className={styles.measureDot} />
          </div>
        </div>
      </div>
    </section>
  );
}
