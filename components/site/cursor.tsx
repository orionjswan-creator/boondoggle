"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], label, summary";
const FIELDS = "input, textarea, select";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 26, stiffness: 300, mass: 0.6 });
  const ringY = useSpring(y, { damping: 26, stiffness: 300, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setHidden(false);
      const target = event.target as Element | null;
      setHovering(Boolean(target?.closest(INTERACTIVE)));
      // Native caret stays over form fields; get out of the way there.
      if (target?.closest(FIELDS)) setHidden(true);
    };
    const onLeave = () => setHidden(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{ opacity: hidden ? 0 : 1, x, y }}
      />
      <motion.div
        aria-hidden
        animate={{ scale: hovering ? 2.1 : 1 }}
        className="pointer-events-none fixed left-0 top-0 z-[95] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white mix-blend-difference"
        style={{ opacity: hidden ? 0 : 1, x: ringX, y: ringY }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
