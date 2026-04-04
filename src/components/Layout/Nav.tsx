import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  SPRING,
  EASE_FRICTIONLESS,
  DURATION,
  useReducedMotion,
  useReducedMotionOverride,
} from "../../motion";
import { Magnetic } from "../Magnetic/Magnetic";
import { PerfOverlay } from "../PerfOverlay/PerfOverlay";
import perfStyles from "../PerfOverlay/PerfOverlay.module.css";
import styles from "./Nav.module.css";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "scroll-sequence", label: "Scroll" },
  { id: "showcase", label: "Components" },
  { id: "video", label: "Video" },
  { id: "transitions", label: "Transitions" },
];

function useActiveSection() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

const linkVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.8 + i * 0.08,
      duration: DURATION.normal,
      ease: EASE_FRICTIONLESS,
    },
  }),
};

const mobileMenuVariants = {
  closed: { opacity: 0, height: 0 },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.35,
      ease: EASE_FRICTIONLESS,
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: EASE_FRICTIONLESS },
  },
};

const mobileLinkVariants = {
  closed: { opacity: 0, x: -16 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_FRICTIONLESS },
  },
};

function ReducedMotionToggle() {
  const reduced = useReducedMotion();
  const { setOverride } = useReducedMotionOverride();

  return (
    <motion.div
      className={styles.motionToggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.4 }}
    >
      <span className={styles.motionToggleLabel}>Motion</span>
      <button
        role="switch"
        aria-checked={!reduced}
        aria-label={reduced ? "Motion off" : "Motion on"}
        className={`${styles.motionSwitch} ${!reduced ? styles.motionSwitchOn : ""}`}
        onClick={() => setOverride(reduced ? false : true)}
      >
        <motion.div
          className={styles.motionSwitchKnob}
          layout
          transition={SPRING.snappy}
        />
      </button>
    </motion.div>
  );
}

export function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const active = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPerf, setShowPerf] = useState(false);

  return (
    <>
      <motion.div className={styles.progressBar} style={{ scaleX }} />
      <nav className={styles.nav}>
        <motion.a
          href="#hero"
          className={styles.logo}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.5,
            duration: DURATION.slow,
            ease: EASE_FRICTIONLESS,
          }}
        >
          <span className={styles.logoText}>Motion</span>
        </motion.a>

        {/* Desktop links */}
        <ul className={styles.links}>
          {sections.map((s, i) => (
            <motion.li
              key={s.id}
              custom={i}
              variants={linkVariants}
              initial="hidden"
              animate="visible"
            >
              <Magnetic strength={0.25}>
                <a
                  href={`#${s.id}`}
                  className={`${styles.link} ${active === s.id ? styles.linkActive : ""}`}
                  aria-current={active === s.id ? "true" : undefined}
                >
                  {s.label}
                  {active === s.id && (
                    <motion.span
                      className={styles.linkIndicator}
                      layoutId="nav-indicator"
                      transition={SPRING.snappy}
                    />
                  )}
                </a>
              </Magnetic>
            </motion.li>
          ))}
        </ul>

        <div className={styles.navTools}>
          <ReducedMotionToggle />

          <motion.button
            className={`${perfStyles.perfToggle} ${showPerf ? perfStyles.perfToggleActive : ""}`}
            onClick={() => setShowPerf(!showPerf)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            <span className={perfStyles.perfDot} />
            FPS
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className={styles.hamburgerLine}
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={SPRING.snappy}
          />
          <motion.span
            className={styles.hamburgerLine}
            animate={mobileOpen ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className={styles.hamburgerLine}
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={SPRING.snappy}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileMenu}
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="exit"
          >
            {sections.map((s) => (
              <motion.a
                key={s.id}
                href={`#${s.id}`}
                className={`${styles.mobileLink} ${active === s.id ? styles.mobileLinkActive : ""}`}
                variants={mobileLinkVariants}
                onClick={() => setMobileOpen(false)}
              >
                {s.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <PerfOverlay visible={showPerf} />
    </>
  );
}
