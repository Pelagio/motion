import { motion } from "framer-motion";
import { EASE_FRICTIONLESS, EASE_CONTINUOUS } from "../../motion";
import { TextScramble } from "../TextScramble/TextScramble";
import { Magnetic } from "../Magnetic/Magnetic";
import styles from "./Hero.module.css";

const titleWords = ["Motion", "Without", "Friction"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const wordVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: EASE_FRICTIONLESS,
    },
  },
};

const fadeUp = {
  hidden: { y: 30, opacity: 0 },
  visible: (delay: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      delay,
      ease: EASE_FRICTIONLESS,
    },
  }),
};

export function Hero() {
  return (
    <section id="hero" className={`${styles.hero} grain`}>
      {/* Background glow - placeholder for Rive */}
      <div className={styles.geometricBg}>
        <motion.div
          className={styles.shape}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className={styles.content}>
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {titleWords.map((word) => (
            <span key={word} className={styles.titleLine}>
              <motion.span
                variants={wordVariants}
                style={{ display: "inline-block" }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.9}
        >
          <TextScramble
            text="A motion language built for precision engineering."
            delay={1200}
            speed={60}
            triggerOnView={false}
          />
        </motion.p>

        <motion.div
          className={styles.principles}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.2}
        >
          {["Frictionless", "Precise", "Continuous"].map((p) => (
            <Magnetic key={p} strength={0.4}>
              <span className={styles.principle}>{p}</span>
            </Magnetic>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span>Scroll</span>
        <motion.div
          className={styles.scrollLine}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: EASE_CONTINUOUS,
          }}
        />
      </motion.div>
    </section>
  );
}
