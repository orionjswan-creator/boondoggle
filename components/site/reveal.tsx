"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Transform animation is dropped automatically for reduced-motion users via
// the app-level <MotionConfig reducedMotion="user">; opacity still fades in.
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ margin: "0px 0px -80px 0px", once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
