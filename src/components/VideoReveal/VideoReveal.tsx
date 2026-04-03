import { useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  EASE_FRICTIONLESS,
  SPRING,
  useReducedMotion,
  AnimateInView,
} from "../../motion";
import styles from "./VideoReveal.module.css";

export function VideoReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();

  // Scroll-triggered clip-path reveal
  useLayoutEffect(() => {
    if (reduced || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        {
          clipPath: "inset(20% 20% 20% 20% round 12px)",
          scale: 0.85,
          opacity: 0.5,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 12px)",
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="video" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        <AnimateInView>
          <p className={styles.label}>Dynamic Media</p>
          <h2 className={styles.heading}>Video Reveal</h2>
        </AnimateInView>

        <div ref={wrapperRef} className={styles.videoWrapper}>
          {/* Video embed (placeholder) */}
          <div className={styles.videoEmbed}>
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, #02115c 0%, #0a1a4a 40%, #0000fe 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.15)",
                fontSize: "1.5rem",
                fontFamily: "var(--font-display)",
              }}
            >
              VIDEO CONTENT
            </div>
          </div>

          {/* Play overlay */}
          <AnimatePresence>
            {!playing && (
              <motion.div
                className={styles.videoPlaceholder}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE_FRICTIONLESS }}
                onClick={() => setPlaying(true)}
              >
                <motion.div
                  className={styles.playButton}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING.button}
                >
                  <div className={styles.playIcon} />
                  <motion.div
                    className={styles.pulse}
                    animate={
                      reduced
                        ? {}
                        : {
                            boxShadow: [
                              "0 0 0 0px rgba(0, 0, 254, 0.4)",
                              "0 0 0 20px rgba(0, 0, 254, 0)",
                            ],
                          }
                    }
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                </motion.div>

                <span className={styles.playLabel}>Watch the story</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className={styles.caption}>
          Scroll-triggered clip-path reveal with animated play controls
        </p>
      </div>
    </section>
  );
}
