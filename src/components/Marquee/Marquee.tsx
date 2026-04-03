import { useReducedMotion } from "../../motion";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  items?: string[];
  separator?: string;
}

const defaultItems = [
  "Frictionless",
  "Precise",
  "Continuous",
  "Engineered",
  "Reliable",
];

export function Marquee({
  items = defaultItems,
  separator = " \u2014 ",
}: MarqueeProps) {
  const reduced = useReducedMotion();

  const content = items.join(separator) + separator;

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={`${styles.track} ${reduced ? styles.trackStatic : ""}`}>
        <span className={styles.text}>{content}</span>
        <span className={styles.text}>{content}</span>
        <span className={styles.text}>{content}</span>
      </div>
    </div>
  );
}
