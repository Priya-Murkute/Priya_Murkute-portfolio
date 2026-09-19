"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Transition,
  type Variant,
} from "motion/react";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  bounce: 0.05,
  duration: 0.35,
};

type MorphingDialogContextValue = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  morph: boolean;
};

const MorphingDialogContext = createContext<MorphingDialogContextValue | null>(null);

/** The `morph={false}` entrance and exit: a soft grow and lift, no stretching. */
const GROW_FROM_TRIGGER = {
  initial: { opacity: 0, scale: 0.86, y: 18 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.25, ease: "easeOut" },
      default: { type: "spring", bounce: 0.14, duration: 0.55 },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 10,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
} as const;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Visible, focusable descendants, in DOM order. */
function focusableWithin(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.offsetParent !== null || element === document.activeElement,
  );
}

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error("MorphingDialog parts must be used inside <MorphingDialog>");
  }
  return context;
}

/**
 * `morph` (the upstream behaviour) stretches the trigger into the dialog with
 * a shared layout animation. That suits a dialog shaped like its trigger; when
 * the two differ a lot — a small card opening a large gallery — the stretch
 * squashes the content mid-flight. `morph={false}` instead grows the dialog
 * out of the trigger's position with no distortion. (Local addition.)
 */
export function MorphingDialog({
  children,
  transition = DEFAULT_TRANSITION,
  morph = true,
}: {
  children: ReactNode;
  transition?: Transition;
  morph?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);

  const value = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef, morph }),
    [isOpen, uniqueId, morph],
  );

  return (
    <MorphingDialogContext.Provider value={value}>
      {/* "user": under reduced motion, transforms and layout animations are
          skipped and only opacity animates. */}
      <MotionConfig transition={transition} reducedMotion="user">
        {children}
      </MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

export function MorphingDialogTrigger({
  children,
  className,
  style,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** A short accessible name, when the trigger's own text would be too long to read out. */
  ariaLabel?: string;
}) {
  const { setIsOpen, isOpen, uniqueId, triggerRef, morph } = useMorphingDialog();

  return (
    <motion.div
      ref={triggerRef as never}
      layoutId={morph ? `dialog-${uniqueId}` : undefined}
      className={cn("relative cursor-pointer", className)}
      onClick={() => setIsOpen(true)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsOpen(true);
        }
      }}
      style={style}
      role="button"
      aria-label={ariaLabel}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      tabIndex={0}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogContent({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setIsOpen, uniqueId, triggerRef, morph } = useMorphingDialog();
  const containerRef = useRef<HTMLDivElement>(null);

  // Without the morph, grow out of the trigger: anchor the scale at the
  // trigger's centre, measured before the first paint so the entrance starts there.
  useLayoutEffect(() => {
    if (morph) return;
    const container = containerRef.current;
    const trigger = triggerRef.current;
    if (!container || !trigger) return;
    const from = trigger.getBoundingClientRect();
    // offsetLeft/Top are untouched by the entrance transform, unlike getBoundingClientRect.
    const box = container.getBoundingClientRect();
    const left = box.left + box.width / 2 - container.offsetWidth / 2;
    const top = box.top + box.height / 2 - container.offsetHeight / 2;
    container.style.transformOrigin = `${from.left + from.width / 2 - left}px ${from.top + from.height / 2 - top}px`;
  }, [morph, triggerRef]);

  // Focus return lives in the unmount cleanup below — every close path ends
  // there, and it has to happen after `inert` comes off the app root.
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      // Without this, Tab walks straight out into the page behind.
      if (event.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusables = focusableWithin(container);
      if (focusables.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      const isInside = active instanceof Node && container.contains(active);

      if (event.shiftKey && (active === first || !isInside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !isInside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The dialog is portalled to <body>, so the app is a sibling. `inert`
    // takes it out of both the tab order and the accessibility tree.
    const appRoot = document.getElementById("root");
    appRoot?.setAttribute("inert", "");

    const trigger = triggerRef.current;
    const container = containerRef.current;
    const focusables = container ? focusableWithin(container) : [];
    (focusables[0] ?? container)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      // Order matters: focusing inside an inert subtree silently does nothing.
      appRoot?.removeAttribute("inert");
      trigger?.focus();
    };
  }, [triggerRef]);

  return (
    <motion.div
      ref={containerRef}
      layoutId={morph ? `dialog-${uniqueId}` : undefined}
      {...(morph ? {} : GROW_FROM_TRIGGER)}
      className={cn("overflow-hidden", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`dialog-title-${uniqueId}`}
      aria-describedby={`dialog-description-${uniqueId}`}
      tabIndex={-1}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogContainer({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen } = useMorphingDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <div
          /* Mouse convenience only — Escape and the Close button are the
             keyboard path, so this advertises no interactive semantics. */
          role="presentation"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-ink/25 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {children}
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function MorphingDialogTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.h2 layout="position" id={`dialog-title-${uniqueId}`} className={className}>
      {children}
    </motion.h2>
  );
}

export function MorphingDialogSubtitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div layout="position" className={className}>
      {children}
    </motion.div>
  );
}

const DESCRIPTION_VARIANTS: { initial: Variant; animate: Variant; exit: Variant } = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
};

export function MorphingDialogDescription({
  children,
  className,
  disableLayoutAnimation,
  variants = DESCRIPTION_VARIANTS,
}: {
  children: ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: { initial: Variant; animate: Variant; exit: Variant };
}) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      id={`dialog-description-${uniqueId}`}
      layout={disableLayoutAnimation ? undefined : "position"}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MorphingDialogClose({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { setIsOpen } = useMorphingDialog();

  return (
    <motion.button
      type="button"
      onClick={() => setIsOpen(false)}
      className={cn("absolute right-4 top-4", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children ?? <span aria-hidden="true">×</span>}
      <span className="sr-only">Close</span>
    </motion.button>
  );
}
