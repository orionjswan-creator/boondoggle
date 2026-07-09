"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { events, costProfiles, segments } from "@/lib/data";

const STATEMENT =
  "Boondoggle exists to take teams to the events — around the country and around the world — where work gets more interactive, more engaging, and more fun.";

function Counter({ label, suffix = "", value }: { label: string; suffix?: string; value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -60px 0px", once: true });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest))
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return (
    <div className="border-t border-line pt-5">
      <span className="display block text-[clamp(2.6rem,5vw,4.4rem)] leading-none" ref={ref}>
        {display}
        {suffix}
      </span>
      <span className="mt-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink/60">{label}</span>
    </div>
  );
}

export function Manifesto() {
  const words = STATEMENT.split(" ");

  return (
    <section aria-labelledby="manifesto-title" className="relative overflow-hidden bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="kicker text-sea">The mission</p>
        <h2 className="sr-only" id="manifesto-title">
          Our mission
        </h2>
        <motion.p
          aria-label={STATEMENT}
          className="display mt-8 max-w-5xl text-[clamp(1.9rem,4.6vw,4rem)] leading-[1.12]"
          initial="hidden"
          transition={{ staggerChildren: 0.014 }}
          viewport={{ margin: "0px 0px -140px 0px", once: true }}
          whileInView="visible"
        >
          {words.map((word, index) => (
            <motion.span
              aria-hidden
              className="inline-block"
              key={`${word}-${index}`}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              variants={{ hidden: { opacity: 0.08, y: 6 }, visible: { opacity: 1, y: 0 } }}
            >
              {word === "fun." ? <em className="text-flare-deep">{word}</em> : word}
              {index < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </motion.p>

        <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <p className="max-w-md text-base leading-relaxed text-ink/70">
            The catch: someone has to approve the trip. So Boondoggle pairs the wanderlust with the receipts — event
            intelligence, city playbooks, cost signals, and a manager-ready memo — until the best week of the year is
            also the most defensible line on the budget.
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            <Counter label="Flagship events tracked" value={events.length} />
            <Counter label="Cities with cost intel" value={Object.keys(costProfiles).length} />
            <Counter label="Industry segments" value={segments.length - 1} />
            <Counter label="Seconds to a memo" suffix="s" value={60} />
          </div>
        </div>
      </div>
    </section>
  );
}
