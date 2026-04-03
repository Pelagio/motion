import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_FRICTIONLESS, DURATION } from "../../motion";
import styles from "./PageLoader.module.css";

export function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.overlay}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_FRICTIONLESS }}
        >
          <motion.div
            className={styles.logoText}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.slower, ease: EASE_FRICTIONLESS }}
          >
            Motion
          </motion.div>

          <div className={styles.bar}>
            <motion.div
              className={styles.barFill}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 1.8,
                ease: EASE_FRICTIONLESS,
                delay: 0.3,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
