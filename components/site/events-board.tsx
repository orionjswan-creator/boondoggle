"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowDownRight, Search, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/site/section-heading";
import { getScore, getSignalLabel, segments, type EventItem } from "@/lib/data";
import { useTrip } from "@/lib/trip-store";

export function EventsBoard({
  events,
  onSelect,
  query,
  segment,
  selectedId,
  setQuery,
  setSegment
}: {
  events: EventItem[];
  onSelect: (event: EventItem) => void;
  query: string;
  segment: string;
  selectedId: string;
  setQuery: (value: string) => void;
  setSegment: (value: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const [previewEvent, setPreviewEvent] = useState<EventItem | null>(null);
  const [canPreview, setCanPreview] = useState(false);
  const reduceMotion = useReducedMotion();
  const { isSaved, toggleSavedEvent } = useTrip();

  const previewX = useMotionValue(0);
  const previewY = useMotionValue(0);
  const springX = useSpring(previewX, { damping: 28, mass: 0.5, stiffness: 260 });
  const springY = useSpring(previewY, { damping: 28, mass: 0.5, stiffness: 260 });

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const update = () => setCanPreview(media.matches && !reduceMotion);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [reduceMotion]);

  const handleMove = (event: React.MouseEvent) => {
    const bounds = listRef.current?.getBoundingClientRect();
    if (!bounds) return;
    previewX.set(event.clientX - bounds.left + 28);
    previewY.set(event.clientY - bounds.top - 90);
  };

  return (
    <section aria-labelledby="events-title" className="scroll-mt-20 bg-paper pb-24 pt-4 md:pb-32" id="events">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <span className="sr-only" id="events-title">
          The event board
        </span>
        <SectionHeading
          index="02"
          kicker="The event board"
          lede="Every listing blends event tier, city demand, and segment depth into one planning score — so the calendar argument is already made."
          title="Conferences worth defending on a calendar."
        />

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-full border border-line bg-cream px-5 transition focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/25">
            <Search aria-hidden className="size-4 shrink-0 text-ink/40" />
            <span className="sr-only">Search events</span>
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by event, city, venue, or audience…"
              type="search"
              value={query}
            />
            {query ? (
              <button className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink/50 hover:text-ink" onClick={() => setQuery("")} type="button">
                Clear
              </button>
            ) : null}
          </label>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 md:pb-0" role="group" aria-label="Filter by segment">
            {segments.map((item) => (
              <button
                aria-pressed={segment === item.id}
                className={`whitespace-nowrap rounded-full border px-4 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] transition duration-300 ${
                  segment === item.id ? "border-ink bg-ink text-paper" : "border-line bg-transparent text-ink/70 hover:border-ink hover:text-ink"
                }`}
                key={item.id}
                onClick={() => setSegment(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <p aria-live="polite" className="mt-6 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink/50">
          {events.length} event {events.length === 1 ? "week" : "weeks"} on the board
        </p>

        <div className="relative mt-4 border-t border-line" onMouseMove={canPreview ? handleMove : undefined} ref={listRef}>
          {canPreview ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-30 w-[300px] overflow-hidden rounded-2xl shadow-lift"
              style={{ x: springX, y: springY }}
            >
              <AnimatePresence mode="wait">
                {previewEvent ? (
                  <motion.div
                    animate={{ opacity: 1, rotate: 2, scale: 1 }}
                    className="relative aspect-[4/3]"
                    exit={{ opacity: 0, scale: 0.94 }}
                    initial={{ opacity: 0, rotate: -2, scale: 0.94 }}
                    key={previewEvent.id}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image alt="" className="object-cover" fill sizes="300px" src={previewEvent.image} />
                    <span className="absolute bottom-2 left-2 rounded-full bg-ink/70 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-paper backdrop-blur">
                      {previewEvent.city}
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : null}

          <AnimatePresence initial={false} mode="popLayout">
            {events.map((event, index) => {
              const score = getScore(event);
              const saved = isSaved(event.id);
              const active = selectedId === event.id;
              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-line"
                  exit={{ opacity: 0, y: -10 }}
                  initial={{ opacity: 0, y: 14 }}
                  key={event.id}
                  layout
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div
                    className={`group relative grid grid-cols-[2.4rem_1fr_auto] items-center gap-3 py-5 transition duration-300 md:grid-cols-[3.4rem_1.25fr_0.9fr_auto_auto] md:gap-6 md:py-6 ${
                      active ? "bg-cream" : "hover:bg-cream/70"
                    }`}
                    onMouseEnter={() => setPreviewEvent(event)}
                    onMouseLeave={() => setPreviewEvent(null)}
                  >
                    <span className="font-mono text-xs text-ink/40 md:text-sm">{String(index + 1).padStart(2, "0")}</span>

                    <div className="min-w-0">
                      <h3 className="display truncate text-[clamp(1.5rem,3vw,2.6rem)] leading-tight transition duration-300 ease-swift group-hover:translate-x-1.5">
                        {event.name}
                      </h3>
                      <p className="mt-1 truncate font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink/55">
                        {event.city} · {event.dates}
                      </p>
                    </div>

                    <div className="hidden min-w-0 flex-wrap items-center gap-2 md:flex">
                      <span className="chip">{event.segmentLabel}</span>
                      {event.sponsorLabel ? <span className="chip border-flare/40 bg-flare/10 text-flare-deep">Sponsor</span> : null}
                    </div>

                    <div className="hidden items-baseline gap-1.5 md:flex">
                      <span className="display text-3xl leading-none">{score}</span>
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink/50">{getSignalLabel(score)}</span>
                    </div>

                    <div className="relative z-10 flex items-center gap-1.5">
                      <button
                        aria-label={saved ? `Remove ${event.name} from saved` : `Save ${event.name}`}
                        aria-pressed={saved}
                        className={`grid size-10 place-items-center rounded-full border transition duration-300 ${
                          saved ? "border-gold bg-gold/15 text-gold-deep" : "border-line text-ink/50 hover:border-ink hover:text-ink"
                        }`}
                        onClick={() => toggleSavedEvent(event.id)}
                        type="button"
                      >
                        <Star aria-hidden className={`size-4 ${saved ? "fill-gold" : ""}`} />
                      </button>
                      <span
                        aria-hidden
                        className="hidden size-10 place-items-center rounded-full border border-line text-ink/50 transition duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper md:grid"
                      >
                        <ArrowDownRight className="size-4" />
                      </span>
                    </div>

                    <button
                      aria-label={`Open intelligence for ${event.name}`}
                      className="absolute inset-0"
                      onClick={() => onSelect(event)}
                      type="button"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {events.length === 0 ? (
            <div className="flex flex-col items-start gap-4 py-16">
              <p className="display text-3xl">No weeks match that view.</p>
              <button
                className="link-swipe font-mono text-[0.7rem] uppercase tracking-[0.18em] text-sea"
                onClick={() => {
                  setQuery("");
                  setSegment("all");
                }}
                type="button"
              >
                Clear the filters
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
