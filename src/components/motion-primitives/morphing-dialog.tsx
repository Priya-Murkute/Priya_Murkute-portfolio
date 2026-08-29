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
};

const MorphingDialogContext = createContext<MorphingDialogContextValue | null>(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error("MorphingDialog parts must be used inside <MorphingDialog>");
  }
  return context;
}

export function MorphingDialog({
  children,
  transition = DEFAULT_TRANSITION,
}: {
  children: ReactNode;
  transition?: Transition;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLDivElement>(null);

  const value = useMemo(
    () => ({ isOpen, setIsOpen, uniqueId, triggerRef }),
    [isOpen, uniqueId],
  );

  return (
    <MorphingDialogContext.Provider value={value}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

export function MorphingDialogTrigger({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog();

  return (
    <motion.div
      ref={triggerRef as never}
      layoutId={`dialog-${uniqueId}`}
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
  const { setIsOpen, uniqueId, triggerRef } = useMorphingDialog();
  const containerRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, [setIsOpen, triggerRef]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const firstFocusable = containerRef.current?.querySelector<HTMLElement>(
      'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("overflow-hidden", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`dialog-title-${uniqueId}`}
      aria-describedby={`dialog-description-${uniqueId}`}
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
