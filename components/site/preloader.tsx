"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const CITIES = ["London", "Tokyo", "Honolulu", "Las Vegas", "Paris"];
const SESSION_KEY = "boondoggle-intro-seen";

export function Preloader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }

    if (seen || reduceMotion) {
      setVisible(false);
      return;
    }

    const start = performance.now();
    const duration = 1400;
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(progress * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* private mode */
        }
        setVisible(false);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  useEffect(() => {
    document.documentElement.style.overflow = visible ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          aria-hidden
          className="grain fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-6 py-8 text-paper md:px-10"
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-2xl lowercase">
              boondoggle<span className="text-gold">.</span>
            </span>
            <span className="kicker text-paper/50">Work trips worth taking</span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="overflow-hidden">
              <span className="kicker block text-glow">Now boarding</span>
              <span className="display mt-3 block text-[clamp(2.2rem,6vw,4.4rem)] leading-none">
                {CITIES[Math.min(Math.floor(count / (100 / CITIES.length)), CITIES.length - 1)]}
              </span>
            </div>
            <span className="display text-[clamp(4rem,12vw,9rem)] leading-none text-paper/90">{count}</span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
