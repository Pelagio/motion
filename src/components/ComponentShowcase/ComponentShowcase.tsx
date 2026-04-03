import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  AnimateInView,
  EASE_FRICTIONLESS,
  SPRING,
  useReducedMotion,
} from "../../motion";
import styles from "./ComponentShowcase.module.css";

/* ---- Button ---- */
function ButtonDemo() {
  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Button Micro-interaction</span>
      <motion.button
        className={styles.button}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={SPRING.button}
      >
        <span className={styles.buttonGlow} />
        Get Started
      </motion.button>
    </div>
  );
}

/* ---- Card ---- */
function CardDemo() {
  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Spring Physics Card</span>
      <motion.div
        className={styles.card}
        whileHover={{
          scale: 1.04,
          rotateX: -5,
          rotateY: 5,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
        transition={SPRING.gentle}
        style={{ transformPerspective: 800 }}
      >
        <div className={styles.cardInner}>
          <p className={styles.cardTitle}>Hover me</p>
          <p>Spring-based 3D tilt with physics</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ---- Menu ---- */
const menuItems = ["Dashboard", "Analytics", "Settings", "Log out"];

function MenuDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Menu Reveal</span>
      <div>
        <button
          className={styles.menuTrigger}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Close menu" : "Open menu"}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={styles.menu}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_FRICTIONLESS }}
              style={{ overflow: "hidden" }}
            >
              {menuItems.map((item, i) => (
                <motion.button
                  key={item}
                  className={styles.menuItem}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.3,
                    ease: EASE_FRICTIONLESS,
                  }}
                  whileHover={{
                    backgroundColor: "rgba(0, 0, 254, 0.06)",
                    color: "#02115c",
                  }}
                >
                  {item}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---- Bearing Spinner ---- */
function SpinnerDemo() {
  const reduced = useReducedMotion();
  const c = 50;
  const outerOuter = 46;
  const outerInner = 37;
  const innerOuter = 24;
  const innerInner = 15;
  const orbitR = 30.5;
  const ballR = 6;
  const ballCount = 6;
  const bp = "rgba(100,107,120,";

  // Progress arc: circumference of the mid-outer-race circle
  const progressR = (outerOuter + outerInner) / 2;
  const circumference = 2 * Math.PI * progressR;

  const balls = Array.from({ length: ballCount }, (_, i) => {
    const angle = (i / ballCount) * Math.PI * 2 - Math.PI / 2;
    return {
      cx: c + Math.cos(angle) * orbitR,
      cy: c + Math.sin(angle) * orbitR,
    };
  });

  const loopDuration = 3;

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Bearing Loader</span>
      <div className={styles.spinnerContainer}>
        <svg
          viewBox="0 0 100 100"
          width="120"
          height="120"
          fill="none"
          style={{ shapeRendering: "geometricPrecision" }}
        >
          {/* Outer race */}
          <circle
            cx={c}
            cy={c}
            r={outerOuter}
            stroke={`${bp}0.4)`}
            strokeWidth="1"
          />
          <circle
            cx={c}
            cy={c}
            r={outerInner}
            stroke={`${bp}0.4)`}
            strokeWidth="1"
          />
          {/* Outer race track (clean background for arc) */}
          <circle
            cx={c}
            cy={c}
            r={progressR}
            stroke={`${bp}0.06)`}
            strokeWidth={outerOuter - outerInner - 2}
          />

          {/* Progress arc -- fills the outer race */}
          <motion.circle
            cx={c}
            cy={c}
            r={progressR}
            stroke="#0040ff"
            strokeWidth={10}
            strokeLinecap="round"
            opacity="0.65"
            strokeDasharray={circumference}
            style={{
              originX: "50%",
              originY: "50%",
            }}
            animate={
              reduced
                ? {}
                : {
                    strokeDashoffset: [circumference, 0, 0, circumference],
                    rotate: [-90, 270, 270, 630],
                  }
            }
            transition={{
              duration: loopDuration,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.45, 0.55, 1],
            }}
          />

          {/* Inner race - counter-rotates */}
          <motion.g
            style={{ originX: "50%", originY: "50%" }}
            animate={reduced ? {} : { rotate: -360 }}
            transition={{
              duration: loopDuration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <circle
              cx={c}
              cy={c}
              r={innerOuter}
              stroke={`${bp}0.4)`}
              strokeWidth="1"
            />
            <circle
              cx={c}
              cy={c}
              r={innerInner}
              stroke={`${bp}0.4)`}
              strokeWidth="1"
            />
            <circle
              cx={c}
              cy={c}
              r={(innerOuter + innerInner) / 2}
              stroke={`${bp}0.08)`}
              strokeWidth={innerOuter - innerInner - 2}
              strokeDasharray="1.5 3"
            />
          </motion.g>

          {/* Cage */}
          <motion.circle
            cx={c}
            cy={c}
            r={orbitR}
            stroke={`${bp}0.2)`}
            strokeWidth="1"
            strokeDasharray="6 3 1.5 3"
            style={{ originX: "50%", originY: "50%" }}
            animate={reduced ? {} : { rotate: 360 }}
            transition={{
              duration: loopDuration,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Balls -- orbit only, no fill */}
          <motion.g
            style={{ originX: "50%", originY: "50%" }}
            animate={reduced ? {} : { rotate: 360 }}
            transition={{
              duration: loopDuration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {balls.map((ball, i) => (
              <g key={i}>
                <circle
                  cx={ball.cx}
                  cy={ball.cy}
                  r={ballR}
                  stroke={`${bp}0.5)`}
                  strokeWidth="1"
                />
                <line
                  x1={ball.cx - ballR * 0.35}
                  y1={ball.cy}
                  x2={ball.cx + ballR * 0.35}
                  y2={ball.cy}
                  stroke={`${bp}0.25)`}
                  strokeWidth="0.75"
                />
                <line
                  x1={ball.cx}
                  y1={ball.cy - ballR * 0.35}
                  x2={ball.cx}
                  y2={ball.cy + ballR * 0.35}
                  stroke={`${bp}0.25)`}
                  strokeWidth="0.75"
                />
              </g>
            ))}
          </motion.g>

          {/* Bore */}
          <circle
            cx={c}
            cy={c}
            r={innerInner - 3}
            stroke={`${bp}0.2)`}
            strokeWidth="0.75"
          />
          {/* Center point */}
          <circle
            cx={c}
            cy={c}
            r={1.5}
            stroke={`${bp}0.25)`}
            strokeWidth="0.75"
          />
        </svg>
      </div>
    </div>
  );
}

/* ---- Toggle Switch ---- */
function ToggleDemo() {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Toggle Switch</span>
      <button
        className={`${styles.toggle} ${isOn ? styles.toggleOn : ""}`}
        onClick={() => setIsOn(!isOn)}
      >
        <motion.div
          className={styles.toggleKnob}
          layout
          transition={SPRING.snappy}
        />
      </button>
      <span className={styles.toggleLabel}>{isOn ? "Active" : "Inactive"}</span>
    </div>
  );
}

/* ---- Accordion ---- */
const accordionItems = [
  {
    title: "What is Frictionless motion?",
    content:
      "Smooth easing curves that feel natural. Animations never jar or interrupt the user flow.",
  },
  {
    title: "What are Motion Tokens?",
    content:
      "Standardized values for duration, easing, and spring configs that keep animation consistent across the system.",
  },
  {
    title: "How is Continuous applied?",
    content:
      "Elements flow seamlessly between states. Exit animations inform enter animations, creating an unbroken visual narrative.",
  },
];

function AccordionDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Accordion</span>
      <div className={styles.accordion}>
        {accordionItems.map((item, i) => (
          <div key={i} className={styles.accordionItem}>
            <button
              className={styles.accordionTrigger}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>{item.title}</span>
              <motion.span
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.3, ease: EASE_FRICTIONLESS }}
                className={styles.accordionIcon}
              >
                &#x25BE;
              </motion.span>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_FRICTIONLESS }}
                  style={{ overflow: "hidden" }}
                >
                  <p className={styles.accordionContent}>{item.content}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Toast Notification ---- */
function ToastDemo() {
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);
  const counter = useRef(0);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const addToast = () => {
    const messages = [
      "Changes saved",
      "File uploaded",
      "Action completed",
      "Settings updated",
    ];
    const id = counter.current++;
    setToasts((prev) => [
      ...prev,
      { id, text: messages[id % messages.length] },
    ]);
    const timer = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
    timersRef.current.push(timer);
  };

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Toast Notification</span>
      <motion.button
        className={styles.buttonOutline}
        onClick={addToast}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Trigger toast
      </motion.button>
      <div className={styles.toastStack}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={styles.toast}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={SPRING.default}
            >
              <span className={styles.toastIcon}>&#x2713;</span>
              {toast.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---- Skeleton Loader ---- */
function SkeletonDemo() {
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Skeleton Loader</span>
      <motion.button
        className={styles.buttonOutline}
        onClick={() => {
          setLoaded(false);
          clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => setLoaded(true), 1800);
        }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {loaded ? "Reload" : "Simulate load"}
      </motion.button>
      <div className={styles.skeletonCard}>
        <AnimatePresence mode="wait">
          {!loaded ? (
            <motion.div
              key="skeleton"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`${styles.skeletonLine} ${styles.skeletonShimmer}`}
                style={{ width: "60%", height: 14 }}
              />
              <div
                className={`${styles.skeletonLine} ${styles.skeletonShimmer}`}
                style={{ width: "100%", height: 10 }}
              />
              <div
                className={`${styles.skeletonLine} ${styles.skeletonShimmer}`}
                style={{ width: "80%", height: 10 }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_FRICTIONLESS }}
            >
              <p className={styles.cardTitle}>Data loaded</p>
              <p className={styles.skeletonText}>
                Skeleton fades out, real content fades up with a spring.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---- Progress Bar ---- */
function ProgressDemo() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number>(0);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const runProgress = () => {
    if (running) return;
    setProgress(0);
    setRunning(true);
    let p = 0;
    intervalRef.current = window.setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(intervalRef.current);
        setRunning(false);
      }
      setProgress(p);
    }, 300);
  };

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Progress Bar</span>
      <motion.button
        className={styles.buttonOutline}
        onClick={runProgress}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {running ? "Loading..." : progress >= 100 ? "Again" : "Start"}
      </motion.button>
      <div className={styles.progressTrack}>
        <motion.div
          className={styles.progressBar}
          animate={{ width: `${progress}%` }}
          transition={SPRING.lazy}
        />
      </div>
      <motion.span
        className={styles.progressValue}
        key={Math.round(progress)}
        initial={{ y: 4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        {Math.round(progress)}%
      </motion.span>
    </div>
  );
}

/* ---- Draggable ---- */
function DragDemo() {
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["#eb202a", "#0000fe", "#009e2d"],
  );

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Drag Interaction</span>
      <div className={styles.dragArea}>
        <motion.div
          className={styles.dragHandle}
          drag="x"
          dragConstraints={{ left: -100, right: 100 }}
          dragElastic={0.1}
          style={{ x, background }}
          whileDrag={{ scale: 1.1 }}
        />
      </div>
      <span className={styles.dragHint}>Drag left or right</span>
    </div>
  );
}

/* ---- Tabs ---- */
function TabsDemo() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Overview", "Details", "Activity"];

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Animated Tabs</span>
      <div className={styles.tabBar}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`${styles.tabItem} ${i === activeTab ? styles.tabItemActive : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {i === activeTab && (
              <motion.div
                className={styles.tabUnderline}
                layoutId="showcase-tab"
                transition={SPRING.snappy}
              />
            )}
            {tab}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className={styles.tabContent}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE_FRICTIONLESS }}
        >
          Content for {tabs[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---- Form Validation ---- */
function FormDemo() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "success">("idle");
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const validate = () => {
    if (!email || !email.includes("@")) {
      setState("error");
      clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setState("idle"), 1500);
    } else {
      setState("success");
    }
  };

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Form Validation</span>
      <motion.div
        className={styles.formGroup}
        animate={state === "error" ? "shake" : "idle"}
        variants={{
          idle: { x: 0 },
          shake: {
            x: [0, -8, 8, -8, 8, -4, 4, 0],
            transition: { duration: 0.4 },
          },
        }}
      >
        <input
          className={`${styles.input} ${state === "error" ? styles.inputError : ""} ${state === "success" ? styles.inputSuccess : ""}`}
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle") setState("idle");
          }}
          onKeyDown={(e) => e.key === "Enter" && validate()}
        />
        <AnimatePresence>
          {state === "success" && (
            <motion.span
              className={styles.inputCheck}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={SPRING.snappy}
            >
              &#x2713;
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {state === "error" && (
          <motion.p
            className={styles.errorMsg}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_FRICTIONLESS }}
          >
            Please enter a valid email
          </motion.p>
        )}
      </AnimatePresence>
      <motion.button
        className={styles.buttonOutline}
        onClick={validate}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Submit
      </motion.button>
    </div>
  );
}

/* ---- Tooltip ---- */
function TooltipDemo() {
  const [hovered, setHovered] = useState<number | null>(null);
  const items = ["Bearings", "Seals", "Lubrication"];

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Tooltip</span>
      <div className={styles.tooltipRow}>
        {items.map((item, i) => (
          <div
            key={item}
            className={styles.tooltipTarget}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {item}
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  className={styles.tooltip}
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={SPRING.snappy}
                >
                  SKF {item} solutions
                  <span className={styles.tooltipArrow} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Number Counter ---- */
function CounterDemo() {
  const [value, setValue] = useState(0);
  const [key, setKey] = useState(0);

  const trigger = () => {
    setValue(Math.floor(Math.random() * 9000) + 1000);
    setKey((k) => k + 1);
  };

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Number Counter</span>
      <div className={styles.counterDisplay}>
        {String(value)
          .padStart(4, "0")
          .split("")
          .map((digit, i) => (
            <div key={i} className={styles.digitSlot}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${key}-${i}`}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: i * 0.05,
                  }}
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
      </div>
      <motion.button
        className={styles.buttonOutline}
        onClick={trigger}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Randomize
      </motion.button>
    </div>
  );
}

/* ---- Chip/Tag List ---- */
const allChips = [
  "Bearings",
  "Seals",
  "Grease",
  "Housings",
  "Tools",
  "Services",
];

function ChipDemo() {
  const [chips, setChips] = useState(allChips.slice(0, 3));

  const addChip = () => {
    const available = allChips.filter((c) => !chips.includes(c));
    if (available.length > 0) {
      setChips([...chips, available[0]]);
    }
  };

  const removeChip = (chip: string) => {
    setChips(chips.filter((c) => c !== chip));
  };

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Chip / Tag List</span>
      <div className={styles.chipList}>
        <AnimatePresence>
          {chips.map((chip) => (
            <motion.button
              key={chip}
              className={styles.chip}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={SPRING.default}
              onClick={() => removeChip(chip)}
            >
              {chip}
              <span className={styles.chipX}>&times;</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <motion.button
        className={styles.buttonOutline}
        onClick={addChip}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        style={{ opacity: chips.length >= allChips.length ? 0.4 : 1 }}
      >
        Add tag
      </motion.button>
    </div>
  );
}

/* ---- Modal/Dialog ---- */
function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Modal / Dialog</span>
      <motion.button
        className={styles.buttonOutline}
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Open modal
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className={styles.modalCard}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={SPRING.default}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={styles.modalTitle}>Dialog Title</h3>
              <p className={styles.modalBody}>
                Spring-animated modal with backdrop blur and scale entrance.
              </p>
              <motion.button
                className={styles.button}
                onClick={() => setOpen(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---- Notification Badge ---- */
function BadgeDemo() {
  const [count, setCount] = useState(3);

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Notification Badge</span>
      <div className={styles.badgeWrap}>
        <div className={styles.badgeIcon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-text-muted)"
            strokeWidth="1.5"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            className={styles.badge}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={SPRING.snappy}
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className={styles.badgeButtons}>
        <motion.button
          className={styles.buttonOutline}
          onClick={() => setCount((c) => c + 1)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          +1
        </motion.button>
        <motion.button
          className={styles.buttonOutline}
          onClick={() => setCount(0)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Clear
        </motion.button>
      </div>
    </div>
  );
}

/* ---- Copy Button ---- */
function CopyDemo() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number>(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleCopy = () => {
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.demoCell}>
      <span className={styles.demoLabel}>Copy Button</span>
      <motion.button
        className={styles.copyButton}
        onClick={handleCopy}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.svg
              key="check"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-success)"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={SPRING.snappy}
            >
              <path d="M20 6L9 17l-5-5" />
            </motion.svg>
          ) : (
            <motion.svg
              key="copy"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={SPRING.snappy}
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </motion.svg>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {copied ? "Copied!" : "Copy code"}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

/* ---- Export ---- */
export function ComponentShowcase() {
  return (
    <section id="showcase" className={styles.section}>
      <div className={styles.inner}>
        <AnimateInView>
          <p className={styles.label}>Interactive Components</p>
          <h2 className={styles.heading}>Micro-interactions</h2>
        </AnimateInView>
        <div className={styles.grid}>
          <ButtonDemo />
          <CardDemo />
          <ToggleDemo />
          <TabsDemo />
          <MenuDemo />
          <AccordionDemo />
          <ToastDemo />
          <SkeletonDemo />
          <ProgressDemo />
          <DragDemo />
          <FormDemo />
          <TooltipDemo />
          <CounterDemo />
          <ChipDemo />
          <ModalDemo />
          <BadgeDemo />
          <CopyDemo />
          <SpinnerDemo />
        </div>
      </div>
    </section>
  );
}
