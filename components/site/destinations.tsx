"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { cityEvents, destinations } from "@/lib/data";

const SPANS = [
  "md:col-span-3 md:aspect-[16/10]",
  "md:col-span-3 md:aspect-[16/10]",
  "md:col-span-2 md:aspect-[4/5]",
  "md:col-span-2 md:aspect-[4/5]",
  "md:col-span-2 md:aspect-[4/5]"
];

export function Destinations({ onExplore }: { onExplore: (city: string) => void }) {
  return (
    <section aria-labelledby="destinations-title" className="scroll-mt-20 bg-paper py-24 md:py-32" id="destinations">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <span className="sr-only" id="destinations-title">
          Destinations
        </span>
        <SectionHeading
          index="01"
          kicker="Destinations"
          lede="Five cities, five moods. Pick the backdrop, and Boondoggle lines up the event weeks, the rooms, and the reasons to be there."
          title="Vegas heat. Paris polish. London trust. Tokyo precision. Hawaiʻi memory."
        />
        <div className="grid gap-4 md:grid-cols-6">
          {destinations.map((destination, index) => {
            const count = cityEvents(destination.city).length;
            return (
              <Reveal className={`${SPANS[index]} aspect-[4/3]`} delay={0.06 * (index % 3)} key={destination.slug}>
                <article className="group relative h-full overflow-hidden rounded-3xl bg-ink text-paper shadow-soft">
                  <Image
                    alt={`Illustrated travel plate of ${destination.city}`}
                    className="object-cover transition duration-700 ease-swift group-hover:scale-[1.05]"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={destination.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/45 transition duration-500 group-hover:from-ink/95" />

                  <div className="absolute left-5 top-5 flex w-[calc(100%-2.5rem)] items-center justify-between">
                    <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-paper/80">
                      0{index + 1} — {destination.country}
                    </span>
                    <span className="rounded-full border border-paper/30 bg-ink/30 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] backdrop-blur">
                      {destination.mood}
                    </span>
                  </div>

                  <div className="absolute inset-x-5 bottom-5">
                    <h3 className="display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-none">{destination.city}</h3>
                    <p className="mt-2 max-w-md text-sm text-paper/80">{destination.whyGo}</p>
                    <p className="mt-3 hidden max-w-md text-sm text-paper/65 opacity-0 transition duration-500 group-hover:opacity-100 md:block">
                      <span className="text-gold">Signature move:</span> {destination.signatureMove}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-glow">
                      {count || "New"} event {count === 1 ? "week" : "weeks"}
                      <ArrowUpRight aria-hidden className="size-3.5 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>

                  <button
                    aria-label={`See event weeks in ${destination.city}`}
                    className="absolute inset-0"
                    onClick={() => onExplore(destination.city)}
                    type="button"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
