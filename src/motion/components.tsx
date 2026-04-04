import React, { type ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { SPRING, EASE_FRICTIONLESS, STAGGER } from "./tokens";

/* ── Hover Presets ──────────────────────────────────────── */

const hoverScales = {
  subtle: 1.03,
  lift: 1.05,
  bounce: 1.08,
} as const;

type HoverPreset = keyof typeof hoverScales;

/* ── Pressable ──────────────────────────────────────────── */

interface PressableProps {
  children: ReactNode;
  hover?: HoverPreset;
  className?: string;
}

export function Pressable({
  children,
  hover = "lift",
  className,
}: PressableProps) {
  return (
    <motion.div
      whileHover={{ scale: hoverScales[hover] }}
      whileTap={{ scale: 0.97 }}
      transition={SPRING.button}
      className={className}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
}

/* ── Presence ───────────────────────────────────────────── */

const presets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  pop: {
    initial: { opacity: 0, scale: 0.95, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 4 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  },
} as const;

interface PresenceProps {
  children: ReactNode;
  visible: boolean;
  preset?: keyof typeof presets;
  spring?: keyof typeof SPRING;
  className?: string;
}

export function Presence({
  children,
  visible,
  preset = "pop",
  spring = "snappy",
  className,
}: PresenceProps) {
  const p = presets[preset];
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={p.initial}
          animate={p.animate}
          exit={p.exit}
          transition={SPRING[spring]}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Collapse ───────────────────────────────────────────── */

interface CollapseProps {
  children: ReactNode;
  open: boolean;
  className?: string;
}

export function Collapse({ children, open, className }: CollapseProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_FRICTIONLESS }}
          style={{ overflow: "hidden" }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Stagger ────────────────────────────────────────────── */

interface StaggerProps {
  children: ReactNode;
  delay?: number;
  from?: "left" | "right" | "bottom";
  className?: string;
}

const staggerOrigin = {
  left: { x: -20, opacity: 0 },
  right: { x: 20, opacity: 0 },
  bottom: { y: 20, opacity: 0 },
};

export function Stagger({
  children,
  delay = STAGGER.default,
  from = "left",
  className,
}: StaggerProps) {
  const initial = staggerOrigin[from];
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: delay } },
      }}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: initial,
                visible: {
                  x: 0,
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.3, ease: EASE_FRICTIONLESS },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

/* ── SwapText ───────────────────────────────────────────── */

interface SwapTextProps {
  children: ReactNode;
  id: string | number;
  className?: string;
}

export function SwapText({ children, id, className }: SwapTextProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: EASE_FRICTIONLESS }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Shake ──────────────────────────────────────────────── */

interface ShakeProps {
  children: ReactNode;
  trigger: boolean;
  className?: string;
}

export function Shake({ children, trigger, className }: ShakeProps) {
  return (
    <motion.div
      animate={trigger ? "shake" : "idle"}
      variants={{
        idle: { x: 0 },
        shake: {
          x: [0, -8, 8, -8, 8, -4, 4, 0],
          transition: { duration: 0.4 },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
 * High-Level Components
 * Clean API wrappers for the motion component library.
 * ══════════════════════════════════════════════════════════ */

/* ── Toggle ─────────────────────────────────────────────── */

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export function Toggle({ checked, onChange, className }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={className}
      style={{
        width: 56,
        height: 30,
        borderRadius: 9999,
        background: checked ? "var(--color-skf-blue)" : "var(--color-disabled)",
        padding: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
        cursor: "pointer",
        border: "none",
        transition: "background 0.3s",
      }}
    >
      <motion.div
        layout
        transition={SPRING.snappy}
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        }}
      />
    </button>
  );
}

/* ── Card ───────────────────────────────────────────────── */

interface CardProps {
  children: ReactNode;
  hover?: HoverPreset;
  className?: string;
}

export function Card({ children, hover = "lift", className }: CardProps) {
  return (
    <motion.div
      whileHover={{
        scale: hoverScales[hover],
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
      }}
      transition={SPRING.gentle}
      className={className}
      style={{ cursor: "pointer" }}
    >
      {children}
    </motion.div>
  );
}

/* ── AnimatedTabs ───────────────────────────────────────── */

interface AnimatedTabsProps {
  tabs: string[];
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function AnimatedTabs({
  tabs,
  active,
  onSelect,
  className,
}: AnimatedTabsProps) {
  const id = React.useId();
  return (
    <div className={className}>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => onSelect(i)}
            style={{
              flex: 1,
              padding: "0.5rem",
              fontSize: "0.8rem",
              color:
                i === active
                  ? "var(--color-skf-blue)"
                  : "var(--color-text-muted)",
              background: "none",
              border: "none",
              position: "relative",
              cursor: "pointer",
            }}
          >
            {i === active && (
              <motion.div
                layoutId={`tabs-indicator-${id}`}
                transition={SPRING.snappy}
                style={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "var(--color-skf-blue)",
                }}
              />
            )}
            {tab}
          </button>
        ))}
      </div>
      <SwapText id={active}>
        <div
          style={{
            padding: "1rem 0",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
          }}
        >
          {tabs[active]}
        </div>
      </SwapText>
    </div>
  );
}

/* ── Accordion ──────────────────────────────────────────── */

interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export function Accordion({ items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  return (
    <div className={className}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            borderBottom:
              i < items.length - 1 ? "1px solid var(--color-border)" : "none",
          }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              padding: "0.5rem 0",
              fontSize: "0.85rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text)",
            }}
          >
            {item.title}
            <motion.span
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.3, ease: EASE_FRICTIONLESS }}
            >
              &#x25BE;
            </motion.span>
          </button>
          <Collapse open={openIndex === i}>
            <div
              style={{
                padding: "0 0 0.5rem",
                fontSize: "0.8rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.5,
              }}
            >
              {item.content}
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  );
}

/* ── Toast ──────────────────────────────────────────────── */

interface ToastProps {
  message: string;
  visible: boolean;
  className?: string;
}

export function Toast({ message, visible, className }: ToastProps) {
  return (
    <Presence
      visible={visible}
      preset="slideUp"
      spring="default"
      className={className}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid var(--color-border)",
          borderRadius: 4,
          fontSize: "0.8rem",
          boxShadow: "0 2px 16px rgba(2,17,92,0.08)",
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "var(--color-success)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            flexShrink: 0,
          }}
        >
          &#x2713;
        </span>
        {message}
      </div>
    </Presence>
  );
}

/* ── Tooltip ────────────────────────────────────────────── */

interface TooltipProps {
  children: ReactNode;
  content: string;
  className?: string;
}

export function Tooltip({ children, content, className }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);
  const id = React.useId();
  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      aria-describedby={visible ? id : undefined}
      className={className}
    >
      {children}
      <Presence visible={visible} preset="pop" spring="snappy">
        <div
          id={id}
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "0.25rem 0.5rem",
            background: "var(--color-text)",
            color: "white",
            fontSize: "0.7rem",
            borderRadius: 4,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {content}
        </div>
      </Presence>
    </div>
  );
}

/* ── Modal ──────────────────────────────────────────────── */

interface ModalProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function Modal({ children, open, onClose, className }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          className={className}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(2,17,92,0.3)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={SPRING.default}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 8,
              padding: "2rem",
              maxWidth: 320,
              width: "90%",
              boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Badge ──────────────────────────────────────────────── */

interface BadgeProps {
  children: ReactNode;
  count: number;
  className?: string;
}

export function Badge({ children, count, className }: BadgeProps) {
  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      className={className}
    >
      {children}
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={SPRING.snappy}
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              minWidth: 18,
              height: 18,
              padding: "0 5px",
              background: "var(--color-error)",
              color: "white",
              fontSize: "0.65rem",
              fontWeight: 700,
              borderRadius: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── ProgressBar ────────────────────────────────────────── */

interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: 6,
        background: "var(--color-disabled)",
        borderRadius: 9999,
        overflow: "hidden",
      }}
    >
      <motion.div
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={SPRING.lazy}
        style={{
          height: "100%",
          background: "var(--color-skf-blue)",
          borderRadius: 9999,
        }}
      />
    </div>
  );
}

/* ── Counter ────────────────────────────────────────────── */

interface CounterProps {
  value: number;
  digits?: number;
  className?: string;
}

export function Counter({ value, digits = 4, className }: CounterProps) {
  return (
    <div className={className} style={{ display: "flex", gap: 2 }}>
      {String(value)
        .padStart(digits, "0")
        .split("")
        .map((digit, i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 44,
              background: "white",
              border: "1px solid var(--color-border)",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              overflow: "hidden",
            }}
          >
            <SwapText id={`${i}-${digit}`}>{digit}</SwapText>
          </div>
        ))}
    </div>
  );
}

/* ── ChipList ───────────────────────────────────────────── */

interface ChipListProps {
  items: string[];
  onRemove: (item: string) => void;
  className?: string;
}

export function ChipList({ items, onRemove, className }: ChipListProps) {
  return (
    <div
      className={className}
      style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
    >
      <AnimatePresence>
        {items.map((item) => (
          <motion.button
            key={item}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={SPRING.default}
            onClick={() => onRemove(item)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.25rem 0.5rem",
              background: "white",
              border: "1px solid var(--color-border)",
              borderRadius: 9999,
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            {item} <span style={{ opacity: 0.5 }}>&times;</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── CopyButton ─────────────────────────────────────────── */

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<number>(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (non-secure context)
    }
  };

  return (
    <Pressable hover="subtle" className={className}>
      <button
        onClick={handleCopy}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          background: "white",
          border: "1px solid var(--color-border)",
          borderRadius: 4,
          fontSize: "0.85rem",
          cursor: "pointer",
        }}
      >
        <SwapText id={copied ? "copied" : "copy"}>
          {copied ? "Copied!" : "Copy code"}
        </SwapText>
      </button>
    </Pressable>
  );
}

/* ── Spinner ────────────────────────────────────────────── */

export function Spinner() {
  const c = 50;
  const r = 41.5;
  const circumference = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" width="48" height="48" fill="none">
      <circle
        cx={c}
        cy={c}
        r={46}
        stroke="rgba(100,107,120,0.2)"
        strokeWidth="1"
      />
      <circle
        cx={c}
        cy={c}
        r={37}
        stroke="rgba(100,107,120,0.2)"
        strokeWidth="1"
      />
      <motion.circle
        cx={c}
        cy={c}
        r={r}
        stroke="var(--color-skf-blue)"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.6"
        strokeDasharray={circumference}
        style={{ originX: "50%", originY: "50%" }}
        animate={{
          strokeDashoffset: [circumference, 0, 0, circumference],
          rotate: [-90, 270, 270, 630],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.45, 0.55, 1],
        }}
      />
    </svg>
  );
}

/* ── Skeleton ───────────────────────────────────────────── */

interface SkeletonProps {
  children: ReactNode;
  loaded: boolean;
  className?: string;
}

export function Skeleton({ children, loaded, className }: SkeletonProps) {
  return (
    <AnimatePresence mode="wait">
      {loaded ? (
        <motion.div
          key="content"
          className={className}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_FRICTIONLESS }}
        >
          {children}
        </motion.div>
      ) : (
        <motion.div
          key="skeleton"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            style={{
              width: "60%",
              height: 14,
              borderRadius: 4,
              background: "var(--color-disabled)",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              width: "100%",
              height: 10,
              borderRadius: 4,
              background: "var(--color-disabled)",
              marginBottom: "0.5rem",
            }}
          />
          <div
            style={{
              width: "80%",
              height: 10,
              borderRadius: 4,
              background: "var(--color-disabled)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── DragSlider ─────────────────────────────────────────── */

export function DragSlider() {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["#eb202a", "#0000fe", "#009e2d"],
  );
  return (
    <div
      style={{
        width: 220,
        height: 48,
        background: "white",
        border: "1px solid var(--color-border)",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.1}
        style={{
          x,
          background,
          width: 40,
          height: 32,
          borderRadius: 4,
          cursor: "grab",
        }}
        whileDrag={{ scale: 1.1 }}
      />
    </div>
  );
}
