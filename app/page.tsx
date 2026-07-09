"use client";

import { MotionConfig } from "motion/react";
import { useMemo, useState } from "react";
import { BookingModal } from "@/components/site/booking-modal";
import { BusinessCase } from "@/components/site/business-case";
import { Cursor } from "@/components/site/cursor";
import { Destinations } from "@/components/site/destinations";
import { EventsBoard } from "@/components/site/events-board";
import { HeroJourney } from "@/components/site/hero-journey";
import { Intelligence } from "@/components/site/intelligence";
import { Manifesto } from "@/components/site/manifesto";
import { Marquee } from "@/components/site/marquee";
import { Phases } from "@/components/site/phases";
import { Playbooks } from "@/components/site/playbooks";
import { Preloader } from "@/components/site/preloader";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { Sponsors } from "@/components/site/sponsors";
import { TripDrawer } from "@/components/site/trip-drawer";
import { events, getScore, type EventItem } from "@/lib/data";
import { deliverables, objectives, roles, type CaseState } from "@/lib/memo";
import { TripProvider } from "@/lib/trip-store";

function getCommercialScore(event: EventItem) {
  return (event.sponsorPriority ?? 0) * 2 + getScore(event);
}

function sortByCommercialPriority(left: EventItem, right: EventItem) {
  return getCommercialScore(right) - getCommercialScore(left);
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("all");
  const [selectedId, setSelectedId] = useState(events[0].id);
  const [caseState, setCaseState] = useState<CaseState>({
    cost: 4500,
    deliverable: deliverables[0],
    eventId: events[0].id,
    meetings: 8,
    notes: "",
    objective: objectives[1],
    opportunities: 3,
    pipeline: 150000,
    role: roles[0]
  });

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return events
      .filter((event) => {
        const blob = `${event.name} ${event.city} ${event.venue} ${event.audience} ${event.segmentLabel}`.toLowerCase();
        return (segment === "all" || event.segment === segment) && (!normalized || blob.includes(normalized));
      })
      .sort(sortByCommercialPriority);
  }, [query, segment]);

  const selected = events.find((event) => event.id === selectedId) ?? events[0];

  const selectEvent = (event: EventItem) => {
    setSelectedId(event.id);
    document.getElementById("intelligence")?.scrollIntoView({ behavior: "smooth" });
  };

  const buildCaseFor = (event: EventItem) => {
    setSelectedId(event.id);
    setCaseState((current) => ({ ...current, eventId: event.id }));
    document.getElementById("business-case")?.scrollIntoView({ behavior: "smooth" });
  };

  const exploreCity = (city: string) => {
    setSegment("all");
    setQuery(city);
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <TripProvider>
      <MotionConfig reducedMotion="user">
        <a
          className="fixed left-4 top-4 z-[99] -translate-y-24 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition focus:translate-y-0"
          href="#events"
        >
          Skip to the event board
        </a>
        <Preloader />
        <Cursor />
        <SiteHeader />
        <TripDrawer onOpenEvent={selectEvent} />
        <BookingModal />

        <main className="bg-paper text-ink">
          <HeroJourney onQueryChange={setQuery} query={query} />

          <Marquee
            items={[
              "Work should feel like a trip",
              "London",
              "Tokyo",
              "Honolulu",
              "Las Vegas",
              "Paris",
              "Plan it",
              "Prove it",
              "Enjoy it"
            ]}
          />

          <Manifesto />
          <Destinations onExplore={exploreCity} />
          <EventsBoard
            events={filtered}
            onSelect={selectEvent}
            query={query}
            segment={segment}
            selectedId={selectedId}
            setQuery={setQuery}
            setSegment={setSegment}
          />
          <Intelligence event={selected} onBuildCase={buildCaseFor} />
          <Phases />
          <BusinessCase caseState={caseState} setCaseState={setCaseState} />
          <Playbooks />
          <Marquee
            duration={40}
            items={["Dinners that close quarters", "Receptions people remember", "Memos managers approve", "Cities that do the persuading"]}
          />
          <Sponsors />
        </main>

        <SiteFooter />
      </MotionConfig>
    </TripProvider>
  );
}
