"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView } from "motion/react";
import { ArrowUpRight, Building2, CalendarDays, Check, Star, Users, Utensils, Sparkles } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  getCityGuide,
  getCosts,
  getScore,
  getSignalLabel,
  sectorProfiles,
  type EventItem
} from "@/lib/data";
import { useTrip } from "@/lib/trip-store";

function ScoreDial({ score }: { score: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -60px 0px", once: true });
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg aria-hidden className="size-32 -rotate-90" ref={ref} viewBox="0 0 128 128">
      <circle cx="64" cy="64" fill="none" r={radius} stroke="currentColor" strokeOpacity="0.15" strokeWidth="6" />
      <motion.circle
        animate={inView ? { strokeDashoffset: circumference * (1 - score / 100) } : undefined}
        cx="64"
        cy="64"
        fill="none"
        initial={{ strokeDashoffset: circumference }}
        r={radius}
        stroke="#E8A33D"
        strokeDasharray={circumference}
        strokeLinecap="round"
        strokeWidth="6"
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

export function Intelligence({
  event,
  onBuildCase
}: {
  event: EventItem;
  onBuildCase: (event: EventItem) => void;
}) {
  const guide = getCityGuide(event.city);
  const costs = getCosts(event.city);
  const profile = sectorProfiles[event.segment];
  const score = getScore(event);
  const { isSaved, openBooking, toggleSavedEvent } = useTrip();
  const saved = isSaved(event.id);

  return (
    <section aria-labelledby="intelligence-title" className="scroll-mt-24 bg-paper pb-24 md:pb-32" id="intelligence">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex items-center gap-4 text-sea">
          <span className="kicker">Dossier — selected week</span>
          <span aria-hidden className="h-px flex-1 bg-line" />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: 16 }}
            key={event.id}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Event dossier */}
            <article className="grain relative overflow-hidden rounded-[2rem] bg-ink p-7 text-paper shadow-lift md:p-10">
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip border-paper/25 bg-paper/10 text-paper">{event.segmentLabel}</span>
                  <span className="chip border-paper/25 bg-paper/10 text-paper">{event.tier} event</span>
                  {event.sponsorLabel ? <span className="chip border-gold/60 bg-gold/15 text-gold">{event.sponsorLabel}</span> : null}
                </div>

                <h2 className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.95]" id="intelligence-title">
                  {event.name}
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-paper/75">{event.why}</p>

                <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: CalendarDays, label: "Dates", value: event.dates },
                    { icon: Building2, label: "Venue", value: event.venue },
                    { icon: Users, label: "Audience", value: event.audience }
                  ].map(({ icon: Icon, label, value }) => (
                    <div className="rounded-2xl border border-paper/15 bg-paper/5 p-4" key={label}>
                      <dt className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-glow">
                        <Icon aria-hidden className="size-3.5" /> {label}
                      </dt>
                      <dd className="mt-2 line-clamp-3 text-sm text-paper/85">{value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-glow">Best corporate plays</p>
                  <ul className="mt-3 grid gap-2.5">
                    {event.plays.map((play) => (
                      <li className="flex items-start gap-3 text-sm text-paper/85" key={play}>
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                        {play}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <Button onClick={() => onBuildCase(event)} type="button" variant="gold">
                    Build the business case
                  </Button>
                  <Button aria-pressed={saved} onClick={() => toggleSavedEvent(event.id)} type="button" variant="inverse">
                    <Star aria-hidden className={`size-4 ${saved ? "fill-gold text-gold" : ""}`} />
                    {saved ? "Saved" : "Save this week"}
                  </Button>
                  <a
                    className="link-swipe inline-flex items-center gap-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-paper/70 hover:text-paper"
                    href={event.source}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Official site <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                </div>
              </div>
            </article>

            {/* Score + city rail */}
            <div className="grid gap-5">
              <div className="flex items-center gap-6 rounded-[2rem] border border-line bg-cream p-6 shadow-soft">
                <div className="relative grid place-items-center">
                  <ScoreDial score={score} />
                  <span className="display absolute text-4xl">{score}</span>
                </div>
                <div>
                  <p className="kicker text-sea">Planning score</p>
                  <p className="display mt-1 text-3xl">{getSignalLabel(score)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    {event.tier === "Major"
                      ? "Prioritize if this segment is in your pipeline."
                      : "Attend selectively, with named accounts confirmed."}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-line bg-cream p-6 shadow-soft">
                <p className="kicker text-sea">Budget signal — {event.city}</p>
                <dl className="mt-4 grid gap-3">
                  {[
                    ["Hotel", costs.hotel],
                    ["Client dinner", costs.dinner],
                    ["Private room", costs.room],
                    ["Booking pressure", costs.pressure]
                  ].map(([label, value]) => (
                    <div className="flex items-baseline justify-between gap-4 border-b border-line/70 pb-2.5 last:border-0 last:pb-0" key={label}>
                      <dt className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink/55">{label}</dt>
                      <dd className="text-right text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-xs leading-relaxed text-ink/55">
                  Likely buyers in the room: {profile.buyer}.
                </p>
                <Button
                  className="mt-4 w-full justify-center"
                  onClick={() => openBooking({ city: event.city, kind: "room", label: `Private room — ${event.city}` })}
                  type="button"
                  variant="ghost"
                >
                  Request a private room
                </Button>
              </div>

              <div className="group relative overflow-hidden rounded-[2rem] shadow-soft">
                <div className="relative aspect-[16/9]">
                  <Image
                    alt={`Illustrated scene of ${guide.city}`}
                    className="object-cover transition duration-700 ease-swift group-hover:scale-[1.04]"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    src={guide.image ?? event.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
                  <p className="absolute bottom-4 left-5 right-5 font-serif text-xl italic text-paper">
                    {guide.tone ?? guide.positioning}
                  </p>
                </div>
                <div className="bg-ink p-6 text-paper">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-glow">
                    {guide.city} — book this first
                  </p>
                  <ul className="mt-3 grid gap-2.5 text-sm text-paper/85">
                    {guide.picks.slice(0, 2).map((pick) => (
                      <li className="flex items-start justify-between gap-2.5" key={pick.name}>
                        <span className="flex items-start gap-2.5">
                          <Utensils aria-hidden className="mt-0.5 size-3.5 shrink-0 text-flare" />
                          <span>
                            <strong className="font-semibold text-paper">{pick.name}</strong> — {pick.note}
                          </span>
                        </span>
                        <button
                          className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-glow hover:text-gold"
                          onClick={() => openBooking({ city: guide.city, kind: "dining", label: pick.name })}
                          type="button"
                        >
                          Request
                        </button>
                      </li>
                    ))}
                    {guide.activities.slice(0, 1).map((activity) => (
                      <li className="flex items-start justify-between gap-2.5" key={activity.name}>
                        <span className="flex items-start gap-2.5">
                          <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold" />
                          <span>
                            <strong className="font-semibold text-paper">{activity.name}</strong> — {activity.note}
                          </span>
                        </span>
                        <button
                          className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-glow hover:text-gold"
                          onClick={() => openBooking({ city: guide.city, kind: "activity", label: activity.name })}
                          type="button"
                        >
                          Request
                        </button>
                      </li>
                    ))}
                  </ul>
                  <a className="link-swipe mt-4 inline-block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-paper/70 hover:text-paper" href="#hosting">
                    Full hosting playbook ↓
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
