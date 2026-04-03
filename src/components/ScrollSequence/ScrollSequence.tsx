import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "../../motion";
import styles from "./ScrollSequence.module.css";

const cards = [
  {
    icon: "\u2192",
    title: "Frictionless",
    desc: "Smooth easing curves that feel natural. No jarring stops or abrupt state changes.",
  },
  {
    icon: "\u25CE",
    title: "Precise",
    desc: "Exact timing and calculated movement. Every pixel moves with purpose and intent.",
  },
  {
    icon: "\u221E",
    title: "Continuous",
    desc: "Seamless flow between states. Animations connect rather than interrupt.",
  },
];

export function ScrollSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          pin: containerRef.current,
          scrub: 1,
        },
      });

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
      );
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.3 },
        "-=0.15",
      );

      cardsRef.current.forEach((card) => {
        tl.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          `-=0.2`,
        );
      });

      tl.fromTo(
        progressRef.current,
        { scaleY: 0 },
        { scaleY: 1, duration: 1 },
        0,
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  // Reduced motion: show everything visible, no pinning
  if (reduced) {
    return (
      <section
        id="scroll-sequence"
        ref={sectionRef}
        className={styles.section}
        style={{ padding: "8rem 2rem" }}
      >
        <div className={styles.inner}>
          <p className={styles.label}>Scroll-Driven Animation</p>
          <h2 className={styles.heading}>Motion Principles</h2>
          <div className={styles.cards}>
            {cards.map((card) => (
              <div
                key={card.title}
                className={styles.card}
                style={{ opacity: 1, transform: "none" }}
              >
                <div className={styles.cardIcon}>{card.icon}</div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="scroll-sequence" ref={sectionRef} className={styles.section}>
      <div ref={containerRef} className={styles.pinContainer}>
        <div className={styles.inner}>
          <p ref={labelRef} className={styles.label} style={{ opacity: 0 }}>
            Scroll-Driven Animation
          </p>
          <h2
            ref={headingRef}
            className={styles.heading}
            style={{ opacity: 0 }}
          >
            Motion Principles
          </h2>
          <div className={styles.cards}>
            {cards.map((card, i) => (
              <div
                key={card.title}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
                }}
                className={styles.card}
              >
                <div className={styles.cardIcon}>{card.icon}</div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
          <div className={styles.progressLine}>
            <div
              ref={progressRef}
              className={styles.progressFill}
              style={{ height: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
