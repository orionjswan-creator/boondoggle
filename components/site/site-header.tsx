"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { WorldClocks } from "@/components/site/world-clocks";

const NAV = [
  { href: "#destinations", index: "01", label: "Destinations" },
  { href: "#events", index: "02", label: "Events" },
  { href: "#method", index: "03", label: "Method" },
  { href: "#business-case", index: "04", label: "Memo" },
  { href: "#hosting", index: "05", label: "Hosting" }
];

export function SiteHeader({ savedCount }: { savedCount: number }) {
  const [overHero, setOverHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { damping: 30, restDelta: 0.001, stiffness: 140 });

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) {
      setOverHero(false);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px"
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const solid = !overHero || menuOpen;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-colors duration-500 ${
        solid ? "border-b border-line/80 bg-paper/90 text-ink backdrop-blur-xl" : "border-b border-transparent bg-gradient-to-b from-ink/55 to-transparent text-paper"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 md:px-8">
        <a aria-label="Boondoggle — back to top" className="font-serif text-[1.45rem] lowercase leading-none" href="#home">
          boondoggle<span className="text-gold">.</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              className="link-swipe pb-0.5 text-[0.82rem] font-medium tracking-wide"
              href={item.href}
              key={item.href}
            >
              <span className={`mr-1.5 font-mono text-[0.6rem] ${solid ? "text-flare-deep" : "text-gold"}`}>{item.index}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {savedCount > 0 ? (
              <motion.span
                animate={{ opacity: 1, scale: 1 }}
                className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] sm:flex ${
                  solid ? "border-line bg-cream" : "border-paper/30 bg-paper/10"
                }`}
                exit={{ opacity: 0, scale: 0.8 }}
                initial={{ opacity: 0, scale: 0.8 }}
              >
                <Star aria-hidden className="size-3 fill-gold text-gold" /> {savedCount} saved
              </motion.span>
            ) : null}
          </AnimatePresence>

          <a
            className={`hidden items-center gap-1.5 rounded-full px-4 py-2 text-[0.82rem] font-semibold transition duration-300 ease-swift hover:-translate-y-0.5 md:inline-flex ${
              solid ? "bg-ink text-paper hover:shadow-soft" : "bg-paper text-ink hover:shadow-lift"
            }`}
            href="#events"
          >
            Plan a trip <ArrowUpRight aria-hidden className="size-3.5" />
          </a>

          <button
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            className="relative flex size-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span
              className={`h-0.5 w-6 rounded-full bg-current transition duration-300 ${menuOpen ? "translate-y-1 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-6 rounded-full bg-current transition duration-300 ${menuOpen ? "-translate-y-1 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      <motion.div aria-hidden className="absolute inset-x-0 bottom-[-1px] h-0.5 origin-left bg-gold" style={{ scaleX: progress }} />
    </header>

    {/* Overlay lives outside <header>: its backdrop-blur would otherwise become
        the containing block for this fixed panel and collapse it. */}
    <AnimatePresence>
      {menuOpen ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="grain fixed inset-0 top-[72px] z-[65] flex flex-col justify-between overflow-y-auto bg-ink px-6 pb-10 pt-12 text-paper lg:hidden"
          exit={{ opacity: 0 }}
          id="mobile-menu"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <nav aria-label="Mobile" className="flex flex-col gap-2">
            {NAV.map((item, index) => (
              <motion.a
                animate={{ opacity: 1, y: 0 }}
                className="display flex items-baseline gap-4 border-b border-paper/10 py-4 text-4xl"
                href={item.href}
                initial={{ opacity: 0, y: 24 }}
                key={item.href}
                onClick={() => setMenuOpen(false)}
                transition={{ delay: 0.05 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="font-mono text-xs text-gold">{item.index}</span>
                {item.label}
              </motion.a>
            ))}
          </nav>
          <div className="mt-12 flex flex-col gap-6">
            <WorldClocks className="text-paper/80" />
            <p className="kicker text-paper/45">Work trips worth taking</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
    </>
  );
}
