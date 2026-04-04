import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPRING } from "../../motion";
import styles from "./CodeSnippet.module.css";

const KEYWORDS =
  /\b(motion|animate|initial|exit|transition|whileHover|whileTap|whileDrag|variants|layout|layoutId|drag|dragConstraints|dragElastic|AnimatePresence|useMotionValue|useTransform|useReducedMotion|const|let|return|key|mode|style|type)\b/g;
const JSX_TAGS = /(&lt;\/?)([\w.]+)/g;
const STRINGS = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
const NUMBERS = /\b(\d+\.?\d*)\b/g;
const COMMENTS = /(\/\/.*$)/gm;

/** Escape HTML entities. Code input must be from trusted hardcoded sources. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function tokenize(code: string): string {
  const placeholders: string[] = [];
  const PH_START = "\uE000";
  const PH_END = "\uE001";
  const ph = (html: string) => {
    const idx = placeholders.length;
    placeholders.push(html);
    // Use private-use Unicode chars + alpha index to avoid digit matching
    return `${PH_START}${String.fromCharCode(0xe010 + idx)}${PH_END}`;
  };

  let result = escapeHtml(code);

  // Comments
  result = result.replace(COMMENTS, (m) =>
    ph(`<span class="${styles.comment}">${m}</span>`),
  );
  // JSX tags: <motion.div, </AnimatePresence, etc.
  result = result.replace(
    JSX_TAGS,
    (_, bracket, tag) =>
      `${ph(`<span class="${styles.tag}">${bracket}</span>`)}${ph(`<span class="${styles.keyword}">${tag}</span>`)}`,
  );
  // Strings
  result = result.replace(STRINGS, (m) =>
    ph(`<span class="${styles.string}">${m}</span>`),
  );
  // Keywords
  result = result.replace(KEYWORDS, (m) =>
    ph(`<span class="${styles.keyword}">${m}</span>`),
  );
  // Numbers (only match digits not adjacent to placeholder chars)
  result = result.replace(NUMBERS, (m) =>
    ph(`<span class="${styles.number}">${m}</span>`),
  );

  // Restore placeholders
  const phRegex = new RegExp(`${PH_START}([\\uE010-\\uEFFF])${PH_END}`, "g");
  result = result.replace(
    phRegex,
    (_, ch: string) => placeholders[ch.charCodeAt(0) - 0xe010],
  );

  return result;
}

interface CodeSnippetProps {
  code: string;
  visible: boolean;
  onClose: () => void;
}

export function CodeSnippet({ code, visible, onClose }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (non-secure context or iframe)
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.panel}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={SPRING.snappy}
        >
          <div className={styles.panelHeader}>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close code panel"
            >
              &times;
            </button>
          </div>
          <pre className={styles.code}>
            <code dangerouslySetInnerHTML={{ __html: tokenize(code) }} />
          </pre>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
