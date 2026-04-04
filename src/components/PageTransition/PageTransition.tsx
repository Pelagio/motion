import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_FRICTIONLESS, useReducedMotion } from "../../motion";
import styles from "./PageTransition.module.css";

const pages = [
  {
    id: "overview",
    label: "Overview",
    icon: "\u25C6",
    color: "linear-gradient(135deg, #0000fe, #02115c)",
    title: "Motion System Overview",
    desc: "A unified motion language that ensures consistency across all touchpoints. Every animation serves a purpose \u2014 guiding attention, providing feedback, or creating delight.",
    features: ["Easing Library", "Duration Scale", "Choreography"],
  },
  {
    id: "tokens",
    label: "Tokens",
    icon: "\u25CF",
    color: "linear-gradient(135deg, #02115c, #0000fe)",
    title: "Motion Tokens",
    desc: "Design tokens for animation \u2014 standardized durations, easing curves, and spring configurations that keep motion consistent and maintainable across the system.",
    features: ["Spring Configs", "Easing Curves", "Duration Map"],
  },
  {
    id: "patterns",
    label: "Patterns",
    icon: "\u25B2",
    color: "linear-gradient(135deg, #0000fe, #4f84e0)",
    title: "Animation Patterns",
    desc: "Reusable animation patterns for common UI interactions. Enter, exit, hover, press, drag \u2014 each pattern is tuned for the right feel and performance.",
    features: ["Enter/Exit", "Hover States", "Drag Physics"],
  },
];

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
    scale: 0.97,
  }),
};

export function PageTransition() {
  const reduced = useReducedMotion();
  const [[activeIndex, direction], setActive] = useState([0, 0]);

  const paginate = (newIndex: number) => {
    setActive([newIndex, newIndex > activeIndex ? 1 : -1]);
  };

  const activePage = pages[activeIndex];

  return (
    <section id="transitions" className={`${styles.section} grain`}>
      <div className={styles.inner}>
        <p className={styles.label}>Page Transitions</p>
        <h2 className={styles.heading}>Seamless Navigation</h2>

        <div className={styles.tabs}>
          {pages.map((page, i) => (
            <button
              key={page.id}
              className={`${styles.tab} ${i === activeIndex ? styles.tabActive : ""}`}
              onClick={() => paginate(i)}
            >
              {i === activeIndex && (
                <motion.div
                  className={styles.tabIndicator}
                  layoutId="tabIndicator"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              {page.label}
            </button>
          ))}
        </div>

        <div className={styles.viewport}>
          {reduced ? (
            <div className={styles.page}>
              <div className={styles.pageContent}>
                <div
                  className={styles.pageIcon}
                  style={{ background: activePage.color }}
                >
                  {activePage.icon}
                </div>
                <div>
                  <h3 className={styles.pageTitle}>{activePage.title}</h3>
                  <p className={styles.pageDesc}>{activePage.desc}</p>
                  <div className={styles.features}>
                    {activePage.features.map((f) => (
                      <span key={f} className={styles.feature}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activePage.id}
                className={styles.page}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.4,
                  ease: EASE_FRICTIONLESS,
                }}
              >
                <div className={styles.pageContent}>
                  <motion.div
                    className={styles.pageIcon}
                    style={{ background: activePage.color }}
                    layoutId="page-icon"
                  >
                    {activePage.icon}
                  </motion.div>
                  <div>
                    <h3 className={styles.pageTitle}>{activePage.title}</h3>
                    <p className={styles.pageDesc}>{activePage.desc}</p>
                    <div className={styles.features}>
                      {activePage.features.map((f) => (
                        <span key={f} className={styles.feature}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
