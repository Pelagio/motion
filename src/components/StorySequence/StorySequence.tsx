import { useRef, useLayoutEffect, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../../motion";
import styles from "./StorySequence.module.css";

const PARTICLE_COUNT = 120;
const GRID_COLS = 12;
const GRID_ROWS = 10;

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  size: number;
  alpha: number;
}

const milestones = [
  { year: "01", text: "Frictionless easing" },
  { year: "02", text: "Precise timing" },
  { year: "03", text: "Continuous flow" },
];

export function StorySequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const reduced = useReducedMotion();

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const cellW = w / GRID_COLS;
    const cellH = h / GRID_ROWS;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const gridI = i % GRID_COLS;
      const gridJ = Math.floor(i / GRID_COLS) % GRID_ROWS;
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        originX: Math.random() * w,
        originY: Math.random() * h,
        targetX: cellW * gridI + cellW / 2,
        targetY: cellH * gridJ + cellH / 2,
        size: 1.5 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }
    particlesRef.current = particles;
  }, []);

  const dprRef = useRef(1);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = dprRef.current;
    const w = canvas.width;
    const h = canvas.height;
    const p = progressRef.current.value;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.scale(dpr, dpr);

    particlesRef.current.forEach((particle) => {
      const lerpP = Math.min(1, Math.max(0, (p - 0.1) / 0.5));
      particle.x =
        particle.originX + (particle.targetX - particle.originX) * lerpP;
      particle.y =
        particle.originY + (particle.targetY - particle.originY) * lerpP;

      const alpha = particle.alpha * (0.3 + lerpP * 0.7);
      const r = particle.size;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 254, ${alpha})`;
      ctx.fill();

      // Soft glow around each dot
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, r * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 254, ${alpha * 0.15})`;
      ctx.fill();
    });

    rafRef.current = requestAnimationFrame(renderCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      initParticles(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(renderCanvas);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initParticles, renderCanvas, reduced]);

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=400%",
          pin: containerRef.current,
          scrub: 1,
        },
      });

      // Phase 1: Counter 0 → 100
      tl.fromTo(
        counterRef.current,
        { opacity: 1 },
        { opacity: 1, duration: 1 },
      );
      tl.to(
        progressRef.current,
        {
          value: 0.6,
          duration: 1,
          onUpdate: () => {
            if (counterRef.current) {
              const num = Math.round(progressRef.current.value * 167); // 0.6 * 167 ≈ 100
              counterRef.current.textContent = String(num);
            }
          },
        },
        0,
      );

      // Phase 2: Fade out counter, show headline
      tl.to(counterRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
      });
      tl.fromTo(
        headlineRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.1",
      );
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.2",
      );

      // Phase 3: Particles fully organized, timeline appears
      tl.to(progressRef.current, { value: 1, duration: 0.5 });
      tl.fromTo(
        timelineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.2",
      );

      // Phase 4: Everything fades out
      tl.to(
        [headlineRef.current, subtitleRef.current, timelineRef.current],
        { opacity: 0, y: -30, duration: 0.3 },
        "+=0.3",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <section
        ref={sectionRef}
        className={`${styles.section} grain`}
        style={{
          padding: "8rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div className={styles.content} style={{ margin: "0 auto" }}>
          <h2 className={styles.headline}>From Chaos to Precision</h2>
          <p className={styles.subtitle}>
            Raw energy becomes refined motion. Every transition, every easing
            curve — designed to eliminate friction and create seamless flow.
          </p>
          <div className={styles.timeline}>
            {milestones.map((m) => (
              <div key={m.year} className={styles.milestone}>
                <div className={styles.milestoneYear}>{m.year}</div>
                <div className={styles.milestoneText}>{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={`${styles.section} grain`}>
      <div ref={containerRef} className={styles.pinContainer}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          style={{ width: "100%", height: "100%" }}
        />
        <div className={styles.content}>
          <div>
            <span ref={counterRef} className={styles.counter}>
              0
            </span>
            <span className={styles.counterSuffix}>%</span>
          </div>

          <h2
            ref={headlineRef}
            className={styles.headline}
            style={{ opacity: 0 }}
          >
            From Friction
            <br />
            to Precision
          </h2>
          <p
            ref={subtitleRef}
            className={styles.subtitle}
            style={{ opacity: 0 }}
          >
            From chaos to order. Every transition refined, every curve
            calculated — motion designed to feel impossibly smooth.
          </p>

          <div
            ref={timelineRef}
            className={styles.timeline}
            style={{ opacity: 0 }}
          >
            {milestones.map((m) => (
              <div key={m.year} className={styles.milestone}>
                <div className={styles.milestoneYear}>{m.year}</div>
                <div className={styles.milestoneText}>{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
