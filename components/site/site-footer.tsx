"use client";

import { ArrowRight, ArrowUp } from "lucide-react";
import { WorldClocks } from "@/components/site/world-clocks";

const FOOTER_LINKS = [
  {
    heading: "Explore",
    links: [
      { href: "#destinations", label: "Destinations" },
      { href: "#events", label: "The event board" },
      { href: "#method", label: "The method" },
      { href: "#hosting", label: "Hosting playbooks" }
    ]
  },
  {
    heading: "Product",
    links: [
      { href: "#business-case", label: "Approval memo" },
      { href: "#intelligence", label: "Event intelligence" },
      { href: "#sponsors", label: "Sponsor with us" }
    ]
  },
  {
    heading: "Say hello",
    links: [{ href: "mailto:hello@boondoggle.events", label: "hello@boondoggle.events" }]
  }
];

export function SiteFooter() {
  return (
    <footer className="grain relative overflow-hidden bg-ink text-paper" id="footer">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-24 md:px-8 md:pt-32">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-paper/15 pb-14 md:flex-row md:items-end">
          <h2 className="display max-w-2xl text-[clamp(2.4rem,5.6vw,4.8rem)] leading-[0.96]">
            Ready to make work feel like <em>a trip?</em>
          </h2>
          <a
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-4 text-sm font-semibold text-ink transition duration-300 ease-swift hover:-translate-y-0.5 hover:shadow-lift"
            href="#events"
          >
            Find your event week
            <ArrowRight aria-hidden className="size-4 transition duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid gap-10 py-14 md:grid-cols-[1.2fr_repeat(3,auto)] md:gap-16">
          <div className="max-w-sm">
            <p className="font-serif text-2xl lowercase">
              boondoggle<span className="text-gold">.</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-paper/60">
              The conference-intelligence planner for events around the country and the world — where work gets more
              interactive, engaging, and fun.
            </p>
            <WorldClocks className="mt-6 text-paper/75" />
          </div>
          {FOOTER_LINKS.map((column) => (
            <nav aria-label={column.heading} key={column.heading}>
              <p className="kicker text-paper/45">{column.heading}</p>
              <ul className="mt-4 grid gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a className="link-swipe text-sm text-paper/80 hover:text-paper" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p aria-hidden className="display select-none pb-[0.14em] text-center text-[clamp(4rem,17vw,17rem)] leading-[0.8]">
          <span className="text-stroke">boon</span>doggle
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-6 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-paper/50">
          <span>© {new Date().getFullYear()} Boondoggle — work worth traveling for</span>
          <span className="hidden md:inline">London · Tokyo · Honolulu · Las Vegas · Paris</span>
          <button
            className="inline-flex items-center gap-2 text-paper/70 transition hover:text-gold"
            onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
            type="button"
          >
            Back to top <ArrowUp aria-hidden className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
