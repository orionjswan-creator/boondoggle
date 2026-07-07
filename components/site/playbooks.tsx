"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Sparkles, Utensils } from "lucide-react";
import { useRef, useState } from "react";
import { SectionHeading } from "@/components/site/section-heading";
import { cityGuides } from "@/lib/data";

export function Playbooks() {
  const railRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState(0);

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const width = card ? card.getBoundingClientRect().width + 20 : 420;
    rail.scrollBy({ behavior: "smooth", left: direction * width });
  };

  const onScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const card = rail.querySelector("li");
    const width = card ? card.getBoundingClientRect().width + 20 : 420;
    setPosition(max <= 0 ? 0 : Math.min(cityGuides.length - 1, Math.round(rail.scrollLeft / width)));
  };

  return (
    <section aria-labelledby="hosting-title" className="scroll-mt-20 overflow-hidden bg-paper py-24 md:py-32" id="hosting">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <span className="sr-only" id="hosting-title">
          Hosting playbooks
        </span>
        <SectionHeading
          index="05"
          kicker="Hosting playbooks"
          lede="The sessions are only half the trip. Every city ships with the rooms to book, the tables to claim, and the moves that make clients remember the week."
          title="Where the business happens after sessions."
        />
      </div>

      <div className="relative">
        <ul
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-4 md:scroll-px-8 md:px-8 lg:scroll-px-[max(2rem,calc((100vw-80rem)/2+2rem))] lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
          onScroll={onScroll}
          ref={railRef}
        >
          {cityGuides.map((guide, index) => (
            <li
              className="w-[min(86vw,420px)] shrink-0 snap-start overflow-hidden rounded-[2rem] border border-line bg-cream shadow-soft"
              key={guide.city}
            >
              <div className="relative aspect-[16/9]">
                <Image
                  alt={`Illustrated hosting scene for ${guide.city}`}
                  className="object-cover"
                  fill
                  sizes="420px"
                  src={guide.image ?? "/assets/campaign/business-global-hero.png"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper backdrop-blur">
                  {String(index + 1).padStart(2, "0")} / {String(cityGuides.length).padStart(2, "0")}
                </span>
                <h3 className="display absolute bottom-4 left-5 text-4xl text-paper">{guide.city}</h3>
              </div>
              <div className="grid gap-4 p-6">
                <p className="text-sm leading-relaxed text-ink/70">{guide.businessEnergy ?? guide.positioning}</p>
                <div className="flex flex-wrap gap-1.5">
                  {guide.neighborhoods.slice(0, 4).map((neighborhood) => (
                    <span className="chip" key={neighborhood}>
                      {neighborhood}
                    </span>
                  ))}
                </div>
                <div className="border-t border-line pt-4">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-sea">Book this first</p>
                  <ul className="mt-2.5 grid gap-2 text-sm">
                    {guide.picks.slice(0, 2).map((pick) => (
                      <li className="flex items-start gap-2.5" key={pick.name}>
                        <Utensils aria-hidden className="mt-0.5 size-3.5 shrink-0 text-flare-deep" />
                        <span className="text-ink/80">
                          <strong className="font-semibold text-ink">{pick.name}</strong> — {pick.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-line pt-4">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-sea">Relationship moves</p>
                  <ul className="mt-2.5 grid gap-2 text-sm">
                    {guide.activities.slice(0, 2).map((activity) => (
                      <li className="flex items-start gap-2.5" key={activity.name}>
                        <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold-deep" />
                        <span className="text-ink/80">
                          <strong className="font-semibold text-ink">{activity.name}</strong> — {activity.note}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between px-5 md:px-8">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink/50">
            {String(position + 1).padStart(2, "0")} — {cityGuides[position]?.city}
          </p>
          <div className="flex gap-2">
            <button
              aria-label="Previous city"
              className="grid size-11 place-items-center rounded-full border border-line text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
              onClick={() => scrollByCard(-1)}
              type="button"
            >
              <ArrowLeft aria-hidden className="size-4" />
            </button>
            <button
              aria-label="Next city"
              className="grid size-11 place-items-center rounded-full border border-line text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
              onClick={() => scrollByCard(1)}
              type="button"
            >
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
