import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../../motion";
import styles from "./BearingShowcase.module.css";

/*
 * Realistic ball bearing cross-section proportions:
 * - Outer race: thick ring at the outside
 * - Inner race: thick ring around the bore
 * - Balls sit in the groove between the two races
 * - Cage connects the balls
 */
const C = 200; // center
const VB = 400; // viewBox size

// Radii (from center outward)
const BORE_R = 60; // inner hole
const INNER_RACE_INNER = 60;
const INNER_RACE_OUTER = 95;
const BALL_ORBIT_R = 122; // center of balls
const BALL_R = 24; // ball radius
const OUTER_RACE_INNER = 149;
const OUTER_RACE_OUTER = 185;
const BALL_COUNT = 8;

function BearingSvg({
  bearingGroupRef,
  ballGroupRef,
}: {
  bearingGroupRef: React.RefObject<SVGGElement | null>;
  ballGroupRef: React.RefObject<SVGGElement | null>;
}) {
  const balls = Array.from({ length: BALL_COUNT }, (_, i) => {
    const angle = (i / BALL_COUNT) * Math.PI * 2 - Math.PI / 2;
    return {
      cx: C + Math.cos(angle) * BALL_ORBIT_R,
      cy: C + Math.sin(angle) * BALL_ORBIT_R,
    };
  });

  return (
    <svg
      className={styles.bearingSvg}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blueprint line color */}
      {/* All geometry is stroke-only, no fills */}

      <g ref={bearingGroupRef}>
        {/* Outer race */}
        <circle
          cx={C}
          cy={C}
          r={OUTER_RACE_OUTER}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
        />
        <circle
          cx={C}
          cy={C}
          r={OUTER_RACE_INNER}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
        />
        {/* Outer race hatching */}
        <circle
          cx={C}
          cy={C}
          r={(OUTER_RACE_OUTER + OUTER_RACE_INNER) / 2}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={OUTER_RACE_OUTER - OUTER_RACE_INNER - 4}
          strokeDasharray="2 4"
        />

        {/* Inner race */}
        <circle
          cx={C}
          cy={C}
          r={INNER_RACE_OUTER}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
        />
        <circle
          cx={C}
          cy={C}
          r={INNER_RACE_INNER}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
        />
        {/* Inner race hatching */}
        <circle
          cx={C}
          cy={C}
          r={(INNER_RACE_OUTER + INNER_RACE_INNER) / 2}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={INNER_RACE_OUTER - INNER_RACE_INNER - 4}
          strokeDasharray="2 4"
        />

        {/* Cage / retainer - dashed center line */}
        <circle
          cx={C}
          cy={C}
          r={BALL_ORBIT_R}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="0.75"
          strokeDasharray="16 6 4 6"
        />

        {/* Bore */}
        <circle
          cx={C}
          cy={C}
          r={BORE_R}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />
        {/* Center lines (crosshair) */}
        <line
          x1={C - OUTER_RACE_OUTER - 10}
          y1={C}
          x2={C + OUTER_RACE_OUTER + 10}
          y2={C}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          strokeDasharray="12 4 2 4"
        />
        <line
          x1={C}
          y1={C - OUTER_RACE_OUTER - 10}
          x2={C}
          y2={C + OUTER_RACE_OUTER + 10}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
          strokeDasharray="12 4 2 4"
        />

        {/* Dimension line hint -- ball orbit radius */}
        <line
          x1={C}
          y1={C}
          x2={C + BALL_ORBIT_R}
          y2={C - 1}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.5"
        />
      </g>

      {/* Ball bearings -- stroke-only circles */}
      <g ref={ballGroupRef}>
        {balls.map((ball, i) => (
          <g key={i}>
            <circle
              cx={ball.cx}
              cy={ball.cy}
              r={BALL_R}
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1"
              fill="none"
            />
            {/* Cross mark inside ball */}
            <line
              x1={ball.cx - BALL_R * 0.4}
              y1={ball.cy}
              x2={ball.cx + BALL_R * 0.4}
              y2={ball.cy}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.75"
            />
            <line
              x1={ball.cx}
              y1={ball.cy - BALL_R * 0.4}
              x2={ball.cx}
              y2={ball.cy + BALL_R * 0.4}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.75"
            />
          </g>
        ))}
      </g>

      {/* Center point */}
      <circle
        cx={C}
        cy={C}
        r={2}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

const callouts = [
  "Frictionless easing",
  "Precise timing",
  "Continuous transitions",
];

export function BearingShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const bearingGroupRef = useRef<SVGGElement>(null);
  const ballGroupRef = useRef<SVGGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const calloutsRef = useRef<HTMLDivElement[]>([]);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: containerRef.current,
          scrub: 1,
        },
      });

      // Phase 1: Fade in the whole bearing + text
      tl.fromTo(
        svgWrapRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
      );
      tl.fromTo(
        textRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.3 },
        "-=0.2",
      );

      // Phase 2: Rotate -- balls orbit, bearing group counter-rotates subtly
      tl.to(ballGroupRef.current, {
        rotation: 720,
        svgOrigin: `${C} ${C}`,
        duration: 2,
        ease: "none",
      });
      tl.to(
        bearingGroupRef.current,
        { rotation: -120, svgOrigin: `${C} ${C}`, duration: 2, ease: "none" },
        "<",
      );

      // Phase 2b: Callouts stagger in during rotation
      calloutsRef.current.forEach((el, i) => {
        tl.fromTo(
          el,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.2 },
          0.6 + i * 0.5,
        );
      });

      // Phase 3: Fade out
      tl.to(svgWrapRef.current, { opacity: 0, scale: 0.85, duration: 0.4 });
      tl.to(textRef.current, { opacity: 0, x: -30, duration: 0.3 }, "<");
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  const bearingContent = (
    <div className={styles.bearingWrap} ref={reduced ? undefined : svgWrapRef}>
      <BearingSvg
        bearingGroupRef={bearingGroupRef}
        ballGroupRef={ballGroupRef}
      />
    </div>
  );

  const textContent = (isStatic: boolean) => (
    <div
      ref={isStatic ? undefined : textRef}
      className={styles.textSide}
      style={isStatic ? undefined : { opacity: 0 }}
    >
      <p className={styles.label}>Scroll-Driven Mechanics</p>
      <h2 className={styles.heading}>Engineered Motion</h2>
      <p className={styles.description}>
        Every rotation visualized. Scroll-driven animation that responds to user
        input — reducing friction, maximizing precision, delivering continuous
        feedback.
      </p>
      <div className={styles.callouts}>
        {callouts.map((text, i) => (
          <div
            key={i}
            className={styles.callout}
            ref={
              isStatic
                ? undefined
                : (el) => {
                    if (el) calloutsRef.current[i] = el;
                  }
            }
          >
            <div className={styles.calloutDot} />
            <span className={styles.calloutText}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (reduced) {
    return (
      <section
        ref={sectionRef}
        className={`${styles.section} grain`}
        style={{ padding: "8rem 2rem" }}
      >
        <div className={styles.staticLayout}>
          {bearingContent}
          {textContent(true)}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={`${styles.section} grain`}>
      <div ref={containerRef} className={styles.pinContainer}>
        <div className={styles.layout}>
          {bearingContent}
          {textContent(false)}
        </div>
      </div>
    </section>
  );
}
