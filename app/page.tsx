"use client";

import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "motion/react";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardCopy,
  MapPin,
  Printer,
  Search,
  Sparkles,
  Star,
  Ticket,
  Users,
  Utensils,
  type LucideIcon
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cityGuides,
  costProfiles,
  destinations,
  events,
  getScore,
  getSignalLabel,
  sectorProfiles,
  segments,
  type EventItem
} from "@/lib/data";
import { money } from "@/lib/utils";

type CaseState = {
  eventId: string;
  role: string;
  objective: string;
  deliverable: string;
  meetings: number;
  opportunities: number;
  cost: number;
  pipeline: number;
  notes: string;
};

const roles = ["Sales / Business Development", "Founder / Executive", "Marketing / Events", "Partnerships", "Investor Relations", "Product / Strategy"];
const objectives = [
  "Meet current customers and expand accounts",
  "Build qualified new pipeline",
  "Evaluate market trends and competitors",
  "Launch or promote a product",
  "Recruit partners, sponsors, or investors"
];
const deliverables = [
  "Post-event pipeline and meeting report",
  "Market intelligence and competitor brief",
  "Customer expansion plan",
  "Partner or sponsor target list",
  "Product feedback and buyer insight summary"
];

const defaultCosts = { dinner: "$150-$350/person", hotel: "$220-$650/night", pressure: "High during major event weeks", room: "$1.5k-$15k" };

const campaignCityImages: Record<string, string> = {
  Honolulu: "/assets/campaign/city-hawaii.png",
  "Hawaiʻi Island": "/assets/campaign/city-hawaii.png",
  "Hawaii Island": "/assets/campaign/city-hawaii.png",
  "Las Vegas": "/assets/campaign/city-las-vegas.png",
  London: "/assets/campaign/city-london.png",
  Paris: "/assets/campaign/city-paris.png",
  Tokyo: "/assets/campaign/city-tokyo.png"
};

const campaignSegmentImages: Record<string, string> = {
  finance: "/assets/campaign/segment-finance.png",
  insurance: "/assets/campaign/segment-insurance.png",
  medical: "/assets/campaign/segment-medical.png",
  petrochemical: "/assets/campaign/segment-petrochemical.png",
  power: "/assets/campaign/segment-power.png",
  technology: "/assets/campaign/segment-technology.png"
};

const editorialScenes = [
  {
    city: "London",
    image: "/assets/campaign/editorial/scene-palazzo-hero.png",
    title: "Private rooms with institutional gravity",
    text: "Board-level breakfasts, Mayfair dinners, and investor rooms that make attendance feel defensible."
  },
  {
    city: "Paris",
    image: "/assets/campaign/editorial/scene-courtyard.png",
    title: "Hospitality staged like a salon",
    text: "Aerospace, innovation, and luxury-adjacent meetings need rooms that feel curated instead of improvised."
  },
  {
    city: "Global",
    image: "/assets/campaign/editorial/scene-banquet-hall.png",
    title: "Sponsored receptions with memory",
    text: "Premium sponsors need event-week moments that look editorial and still route demand back into the planner."
  }
];

const campaignPhases = [
  {
    image: "/assets/campaign/segment-technology.png",
    label: "Phase 1",
    steps: ["Map the industry segment", "Find the major and minor events", "Prioritize sponsor-ready weeks"],
    text: "Search by sector, city, and commercial priority so teams can see which conferences actually deserve calendar space.",
    title: "Discover the event signal"
  },
  {
    image: "/assets/campaign/segment-finance.png",
    label: "Phase 2",
    steps: ["Estimate trip cost", "Name accounts and meetings", "Generate the manager memo"],
    text: "Turn the trip from a vague expense into a defendable business case with meetings, pipeline, and expected return.",
    title: "Justify the trip"
  },
  {
    image: "/assets/campaign/city-las-vegas.png",
    label: "Phase 3",
    steps: ["Reserve private rooms", "Build client hosting moves", "Layer sponsor inventory"],
    text: "Connect event demand to the city layer: dinners, rooms, receptions, hotels, and relationship-building experiences.",
    title: "Book the room around the room"
  },
  {
    image: "/assets/campaign/boondoggle-work-celebration.png",
    label: "Phase 4",
    steps: ["Host the dinner", "Run the reception", "Capture attendee intent"],
    text: "Make work feel worth celebrating: curated hospitality, premium city context, and event-week moments people remember.",
    title: "Celebrate the work"
  },
  {
    image: "/assets/campaign/editorial/scene-banquet-hall.png",
    label: "Phase 5",
    steps: ["Report meetings", "Compare pipeline to cost", "Retarget next-year sponsors"],
    text: "Close the loop with a post-event recap that proves the trip had business value and feeds the next campaign.",
    title: "Prove the return"
  }
];

function getCityGuide(city: string) {
  if (city.includes("Hawaii")) return cityGuides.find((guide) => guide.city === "Honolulu") ?? cityGuides[0];
  return cityGuides.find((guide) => guide.city === city) ?? cityGuides[0];
}

function getCosts(city: string) {
  if (city.includes("Hawaii")) return costProfiles["Hawaii Island"] ?? costProfiles.Honolulu ?? defaultCosts;
  return costProfiles[city] ?? defaultCosts;
}

function buildMemo(caseState: CaseState, event: EventItem) {
  const profile = sectorProfiles[event.segment];
  const city = getCityGuide(event.city);
  const costs = getCosts(event.city);
  const score = getScore(event);
  const roi = caseState.cost > 0 ? (caseState.pipeline / caseState.cost).toFixed(1) : "N/A";
  const breakEven = caseState.cost * 3;
  const dinner = city.picks[0];
  const activity = city.activities[0];

  return `Subject: Business justification to attend ${event.name}

Recommendation
I recommend attending ${event.name} in ${event.city} (${event.dates}) because it is a ${getSignalLabel(score).toLowerCase()} ${event.segmentLabel.toLowerCase()} event with a Boondoggle planning score of ${score}/100. The event aligns with my role in ${caseState.role} and supports the objective to ${caseState.objective.toLowerCase()}.

Why this event matters
${event.why}

Relevant audience
The expected audience includes ${event.audience}. The likely buyer and stakeholder set for this segment includes ${profile.buyer}.

Expected business value
- Expected meetings: ${caseState.meetings}
- Target opportunities: ${caseState.opportunities}
- Estimated pipeline or strategic value: ${money(caseState.pipeline)}
- Estimated trip cost: ${money(caseState.cost)}
- Potential pipeline-to-cost multiple: ${roi}x

Trip plan
- Venue: ${event.venue}
- City booking pressure: ${costs.pressure}
- Typical hotel range: ${costs.hotel}
- Typical client dinner range: ${costs.dinner}
- Recommended client hosting: ${dinner.name} (${dinner.note})
- Recommended relationship activity: ${activity.name} (${activity.note})

Best corporate plays
${event.plays.map((play) => `- ${play}`).join("\n")}

Approval conditions
- Minimum target before final approval: ${caseState.meetings} scheduled meetings or ${caseState.opportunities} named opportunities.
- Break-even hurdle: at least ${money(breakEven)} in qualified pipeline, expansion value, or documented strategic benefit.
- Required post-event artifact: ${caseState.deliverable}.

Risk control
- Meetings should be pre-booked before travel is approved.
- Attendance should be tied to named accounts, customers, partners, or sponsors.
- Client dinners should be capped by attendee value and expected relationship impact.
- A post-event recap should be delivered within five business days.

Additional notes
${caseState.notes || "No additional notes provided yet."}`;
}

function cityEvents(city: string) {
  return events.filter((event) => event.city === city || (city === "Honolulu" && event.city.includes("Hawaii")));
}

function getCommercialScore(event: EventItem) {
  return (event.sponsorPriority ?? 0) * 2 + getScore(event);
}

function sortByCommercialPriority(left: EventItem, right: EventItem) {
  return getCommercialScore(right) - getCommercialScore(left);
}

function getCityVisual(city: string, fallback?: string) {
  if (city.includes("Hawaii") || city.includes("Hawai")) return campaignCityImages.Honolulu;
  return campaignCityImages[city] ?? fallback ?? "/assets/campaign/business-global-hero.png";
}

function getEventVisual(event: EventItem) {
  return campaignCityImages[event.city] ?? campaignSegmentImages[event.segment] ?? event.image;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState("all");
  const [selectedId, setSelectedId] = useState(events[0].id);
  const [saved, setSaved] = useState<string[]>([]);
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
    const normalized = query.toLowerCase();
    return events
      .filter((event) => {
        const blob = `${event.name} ${event.city} ${event.venue} ${event.audience} ${event.segmentLabel}`.toLowerCase();
        return (segment === "all" || event.segment === segment) && (!normalized || blob.includes(normalized));
      })
      .sort(sortByCommercialPriority);
  }, [query, segment]);

  const selected = events.find((event) => event.id === selectedId) ?? events[0];
  const selectedCity = getCityGuide(selected.city);
  const selectedCosts = getCosts(selected.city);
  const selectedProfile = sectorProfiles[selected.segment];
  const score = getScore(selected);
  const commercialEvents = useMemo(() => [...events].sort(sortByCommercialPriority), []);
  const topGlobalEvents = commercialEvents.slice(0, 6);
  const featuredEvents = commercialEvents.filter((event) => event.sponsorPriority).slice(0, 6);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const spotlight = featuredEvents[spotlightIndex % Math.max(featuredEvents.length, 1)] ?? topGlobalEvents[0];
  const caseEvent = events.find((event) => event.id === caseState.eventId) ?? events[0];
  const memo = buildMemo(caseState, caseEvent);
  const roi = caseState.cost > 0 ? caseState.pipeline / caseState.cost : 0;

  useEffect(() => {
    if (featuredEvents.length < 2) return;
    const timer = window.setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % featuredEvents.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [featuredEvents.length]);

  const selectForCase = (event: EventItem) => {
    setSelectedId(event.id);
    setCaseState((current) => ({ ...current, eventId: event.id }));
    document.getElementById("business-case")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#eefaff] text-ink">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#b8e3f2] bg-[#f6fcff]/94 text-ink shadow-[0_12px_35px_rgba(28,101,132,0.1)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
          <a className="flex items-center gap-3 font-black" href="#home">
            <span className="grid size-9 place-items-center rounded-lg bg-[#178fbd] text-white">b</span>
            <span>boondoggle</span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-bold text-[#123347] md:flex">
            <a href="#destinations">Destinations</a>
            <a href="#events">Events</a>
            <a href="#business-case">Business Case</a>
            <a href="#sponsors">Sponsors</a>
          </nav>
        </div>
      </header>

      <OpeningJourney query={query} onQueryChange={setQuery} />

      <EditorialHospitalityBand />

      <section id="destinations" className="scroll-mt-24 bg-[#eefaff] py-16">
        <div className="mx-auto max-w-7xl px-5">
          <SectionIntro
            kicker="Destination layer"
            title="Vegas heat, Paris polish, London trust, Tokyo precision, Hawaii memory."
            text="The product has to help people choose the event and the room around the event. These city pages are the emotional hook and the booking surface."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {destinations.map((destination) => {
              const guide = getCityGuide(destination.city);
              const count = cityEvents(destination.city).length;
              return (
                <article className="group overflow-hidden rounded-2xl border border-line bg-panel shadow-soft" key={destination.slug}>
                  <div className="relative min-h-52 bg-cover bg-center" style={{ backgroundImage: `url(${getCityVisual(destination.city, guide.image)})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-black uppercase text-[#f2c866]">{destination.mood}</p>
                      <h3 className="text-3xl font-black text-white">{destination.city}</h3>
                    </div>
                  </div>
                  <div className="grid gap-4 p-5">
                    <p className="text-sm font-bold text-ink/72">{destination.whyGo}</p>
                    <div className="h-px bg-line" />
                    <p className="text-xs font-black uppercase text-oxide">{destination.visualTone}</p>
                    <p className="text-sm text-ink/62">{destination.signatureMove}</p>
                    <div className="flex items-center justify-between">
                      <Badge>{count || "New"} events</Badge>
                      <Button onClick={() => setQuery(destination.city)} type="button" variant="ghost">
                        Search
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#dff5ff] py-16 text-ink">
        <div className="mx-auto max-w-7xl px-5">
          <SectionIntro
            kicker="World event atlas"
            title="The biggest business weeks in one place."
            text="This is the layer people come back for: searchable, current, segmented by industry, and connected to what to book when everyone lands."
          />
          <div className="grid gap-3 md:grid-cols-3">
            {topGlobalEvents.map((event, index) => (
              <button
                className="grid overflow-hidden rounded-2xl border border-[#43b7de]/35 bg-white text-left shadow-[0_18px_50px_rgba(28,101,132,0.12)] transition hover:border-[#178fbd]/70 hover:bg-white"
                key={event.id}
                onClick={() => setSelectedId(event.id)}
                type="button"
              >
                <div className="min-h-36 bg-cover bg-center" style={{ backgroundImage: `url(${getEventVisual(event)})` }} />
                <div className="grid gap-3 p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs font-black uppercase text-[#178fbd]">0{index + 1} / {event.city}</span>
                    {event.sponsorLabel ? <Badge className="bg-[#ef3340] text-white">{event.sponsorLabel}</Badge> : null}
                  </div>
                  <strong className="font-serif text-3xl font-medium leading-none">{event.name}</strong>
                  <span className="text-sm font-bold text-[#26556a]">{event.segmentLabel} / {event.dates}</span>
                  <span className="text-sm text-[#26556a]">{event.plays[0]}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid scroll-mt-24 max-w-7xl gap-6 px-5 py-16 lg:grid-cols-[320px_1fr]" id="events">
        <aside className="h-fit rounded-2xl border border-line bg-panel p-4 shadow-soft lg:sticky lg:top-24">
          <p className="text-xs font-black uppercase tracking-wide text-oxide">Find your week</p>
          <div className="mt-4 grid gap-2">
            {segments.map((item) => (
              <button
                className={`rounded-xl border px-3 py-2 text-left text-sm font-bold ${segment === item.id ? "border-ink bg-ink text-white" : "border-line bg-paper"}`}
                key={item.id}
                onClick={() => setSegment(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-dashed border-line bg-paper p-4">
            <p className="text-xs font-black uppercase text-ink/50">Sponsor surface</p>
            <p className="mt-8 text-sm font-bold text-ink/70">Premium venues, events, hotels, and hosted reception ads fit here.</p>
          </div>
          <div className="mt-4 rounded-xl border border-[#43b7de]/35 bg-[#f3fbff] p-4">
            <p className="text-xs font-black uppercase text-[#178fbd]">Priority queue</p>
            <div className="mt-3 grid gap-2">
              {featuredEvents.slice(0, 4).map((event) => (
                <button
                  className="rounded-lg border border-[#b8e3f2] bg-white/80 p-3 text-left text-sm transition hover:border-[#178fbd]"
                  key={event.id}
                  onClick={() => setSelectedId(event.id)}
                  type="button"
                >
                  <span className="block text-[0.68rem] font-black uppercase text-[#178fbd]">{event.sponsorLabel}</span>
                  <strong>{event.name}</strong>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-oxide">Event market</p>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">Conferences worth defending on a calendar.</h2>
            </div>
            <p className="max-w-md text-sm text-ink/60">{filtered.length} events match your view. Scores blend event tier, city demand, and segment depth.</p>
          </div>
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((event) => (
                <motion.article
                  className={`grid overflow-hidden rounded-2xl border bg-panel shadow-soft md:grid-cols-[240px_1fr] ${selected.id === event.id ? "border-gold" : "border-line"}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  key={event.id}
                  layout
                >
                  <div className="min-h-56 bg-cover bg-center" style={{ backgroundImage: `url(${getEventVisual(event)})` }} />
                  <div className="grid gap-4 p-5">
                    <div className="flex flex-wrap gap-2">
                      {event.sponsorLabel ? <Badge className="bg-[#ef3340] text-white">{event.sponsorLabel}</Badge> : null}
                      <Badge className={event.tier === "Major" ? "bg-oxide text-white" : "bg-steel text-white"}>{event.tier}</Badge>
                      <Badge>{event.segmentLabel}</Badge>
                      <Badge>{getSignalLabel(getScore(event))} {getScore(event)}</Badge>
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl font-medium leading-none">{event.name}</h3>
                      <p className="mt-1 text-sm text-ink/60">{event.dates} / {event.venue} / {event.city}</p>
                    </div>
                    <p className="max-w-3xl text-ink/72">{event.why}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setSelectedId(event.id)} type="button" variant="forest">Open intelligence</Button>
                      <Button onClick={() => selectForCase(event)} type="button" variant="gold">Build business case</Button>
                      <Button
                        onClick={() => setSaved((current) => (current.includes(event.id) ? current.filter((id) => id !== event.id) : [...current, event.id]))}
                        type="button"
                        variant="ghost"
                      >
                        <Star className="size-4" /> {saved.includes(event.id) ? "Saved" : "Save"}
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="bg-[#f3fbff] py-16 text-ink">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[1fr_420px]">
          <div className="rounded-2xl border border-[#43b7de]/35 bg-white p-6 shadow-[0_22px_70px_rgba(28,101,132,0.14)]">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-gold text-ink">{selected.segmentLabel}</Badge>
              <Badge className="bg-[#178fbd] text-white">{getSignalLabel(score)} {score}</Badge>
            </div>
            <h2 className="mt-5 text-4xl font-black md:text-6xl">{selected.name}</h2>
            <p className="mt-4 max-w-3xl text-[#26556a]">{selected.why}</p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <Signal icon={CalendarDays} text={selected.dates} />
              <Signal icon={Building2} text={selected.venue} />
              <Signal icon={Users} text={selected.audience} />
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <InfoBlock title="Should I go?">
                <div className="text-5xl font-black text-[#178fbd]">{score}</div>
                <p className="mt-2 text-[#26556a]">{selected.tier === "Major" ? "Prioritize if this segment is in pipeline." : "Attend selectively if named accounts are confirmed."}</p>
              </InfoBlock>
              <InfoBlock title="Attendee intelligence">
                <p className="text-[#26556a]">{selectedProfile.buyer}</p>
              </InfoBlock>
              <InfoBlock title="Budget signal">
                <ul className="grid gap-2 text-[#26556a]">
                  <li>Hotel: {selectedCosts.hotel}</li>
                  <li>Dinner: {selectedCosts.dinner}</li>
                  <li>Private room: {selectedCosts.room}</li>
                </ul>
              </InfoBlock>
              <InfoBlock title="Corporate plays">
                <ul className="grid gap-2 text-[#26556a]">
                  {selected.plays.map((play) => <li key={play}>- {play}</li>)}
                </ul>
              </InfoBlock>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-2xl border border-[#43b7de]/35 bg-white shadow-[0_18px_50px_rgba(28,101,132,0.12)]">
              <div className="min-h-52 bg-cover bg-center" style={{ backgroundImage: `url(${getCityVisual(selected.city, selectedCity.image)})` }} />
              <div className="p-5">
                <p className="text-xs font-black uppercase text-[#178fbd]">{selected.city} client playbook</p>
                <h3 className="mt-2 text-2xl font-black">{selectedCity.tone ?? selectedCity.positioning}</h3>
                <p className="mt-3 text-[#26556a]">{selectedCity.businessEnergy ?? selectedCity.positioning}</p>
              </div>
            </div>
            <InfoBlock title="Book this first">
              <div className="grid gap-3">
                {selectedCity.picks.slice(0, 3).map((pick) => (
                  <div className="flex gap-3" key={pick.name}>
                    <Utensils className="mt-1 size-4 shrink-0 text-[#ef3340]" />
                    <p className="text-sm text-[#26556a]"><strong className="text-ink">{pick.name}</strong> / {pick.type}: {pick.note}</p>
                  </div>
                ))}
              </div>
            </InfoBlock>
            <InfoBlock title="Relationship moves">
              <div className="grid gap-3">
                {selectedCity.activities.slice(0, 2).map((activity) => (
                  <div className="flex gap-3" key={activity.name}>
                    <Sparkles className="mt-1 size-4 shrink-0 text-[#ef3340]" />
                    <p className="text-sm text-[#26556a]"><strong className="text-ink">{activity.name}</strong> / {activity.note}</p>
                  </div>
                ))}
              </div>
            </InfoBlock>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16" id="business-case">
        <SectionIntro
          kicker="Approval workflow"
          title="Generate the memo that gets the trip approved."
          text="The one-stop shop needs to justify the spend, identify the business return, and force pre-booked meetings before anyone buys a flight."
        />
        <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
          <div className="grid gap-4 rounded-2xl border border-line bg-panel p-5 shadow-soft">
            <Field label="Event">
              <select className="input" value={caseState.eventId} onChange={(event) => setCaseState({ ...caseState, eventId: event.target.value })}>
                {events.map((event) => <option key={event.id} value={event.id}>{event.name} - {event.city}</option>)}
              </select>
            </Field>
            <Field label="Role">
              <select className="input" value={caseState.role} onChange={(event) => setCaseState({ ...caseState, role: event.target.value })}>
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
            </Field>
            <Field label="Objective">
              <select className="input" value={caseState.objective} onChange={(event) => setCaseState({ ...caseState, objective: event.target.value })}>
                {objectives.map((objective) => <option key={objective}>{objective}</option>)}
              </select>
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Meetings"><input className="input" type="number" value={caseState.meetings} onChange={(event) => setCaseState({ ...caseState, meetings: Number(event.target.value) })} /></Field>
              <Field label="Opportunities"><input className="input" type="number" value={caseState.opportunities} onChange={(event) => setCaseState({ ...caseState, opportunities: Number(event.target.value) })} /></Field>
              <Field label="Trip cost"><input className="input" type="number" value={caseState.cost} onChange={(event) => setCaseState({ ...caseState, cost: Number(event.target.value) })} /></Field>
              <Field label="Pipeline value"><input className="input" type="number" value={caseState.pipeline} onChange={(event) => setCaseState({ ...caseState, pipeline: Number(event.target.value) })} /></Field>
            </div>
            <Field label="Deliverable">
              <select className="input" value={caseState.deliverable} onChange={(event) => setCaseState({ ...caseState, deliverable: event.target.value })}>
                {deliverables.map((deliverable) => <option key={deliverable}>{deliverable}</option>)}
              </select>
            </Field>
            <Field label="Strategic notes">
              <textarea className="input min-h-28" value={caseState.notes} onChange={(event) => setCaseState({ ...caseState, notes: event.target.value })} />
            </Field>
          </div>
          <div className="rounded-2xl border border-line bg-panel p-5 shadow-soft">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-black">Manager-ready approval packet</h3>
              <div className="flex gap-2">
                <Button onClick={() => navigator.clipboard?.writeText(memo)} type="button" variant="ghost"><ClipboardCopy className="size-4" /> Copy</Button>
                <Button onClick={() => window.print()} type="button" variant="ghost"><Printer className="size-4" /> Print</Button>
              </div>
            </div>
            <div className="mb-4 grid gap-2 md:grid-cols-4">
              {[
                ["Trip cost", money(caseState.cost)],
                ["Pipeline", money(caseState.pipeline)],
                ["Pipeline / cost", `${roi.toFixed(1)}x`],
                ["Cost / meeting", money(caseState.meetings ? caseState.cost / caseState.meetings : 0)]
              ].map(([label, value]) => (
                <div className="rounded-xl border border-line bg-paper p-3" key={label}>
                  <span className="text-xs font-black uppercase text-ink/50">{label}</span>
                  <strong className="mt-1 block text-xl">{value}</strong>
                </div>
              ))}
            </div>
            <pre id="approval-memo" className="max-h-[720px] overflow-auto whitespace-pre-wrap rounded-xl border border-line bg-white p-5 text-sm leading-6">
              {memo}
            </pre>
          </div>
        </div>
      </section>

      <section id="cities" className="scroll-mt-24 bg-panel py-16">
        <div className="mx-auto max-w-7xl px-5">
          <SectionIntro
            kicker="Client hosting"
            title="Where the business happens after sessions."
            text="Each city page can become its own monetizable surface: premium restaurant listings, hotel meeting rooms, sponsor receptions, and locally relevant experiences."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cityGuides.map((city) => (
              <article className="overflow-hidden rounded-2xl border border-line bg-paper shadow-soft" key={city.city}>
                <div className="min-h-44 bg-cover bg-center" style={{ backgroundImage: `url(${getCityVisual(city.city, city.image)})` }} />
                <div className="p-5">
                  <MapPin className="mb-4 text-oxide" />
                  <h3 className="text-2xl font-black">{city.city}</h3>
                  <p className="mt-3 text-sm text-ink/62">{city.businessEnergy ?? city.positioning}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {city.neighborhoods.slice(0, 4).map((hood) => <Badge key={hood}>{hood}</Badge>)}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative scroll-mt-24 overflow-hidden bg-[#116b8c] py-16 text-white" id="sponsors">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.24] mix-blend-overlay"
          style={{ backgroundImage: "url('/assets/campaign/editorial/scene-banquet-hall.png')" }}
        />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#9be7ff]">Commercial layer</p>
            <h2 className="mt-2 text-4xl font-black md:text-5xl">AdSense for scale. Sponsor inventory for trust.</h2>
            <p className="mt-4 max-w-2xl text-white/78">
              Boondoggle can keep Google AdSense clearly labeled while selling premium placements to conferences, venues, restaurants, hotel meeting rooms, and hosted receptions by segment and city.
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-white/38 bg-white/12 p-6">
            <p className="text-xs font-black uppercase text-white/62">Advertisement</p>
            <div className="mt-12 grid place-items-center rounded-xl border border-white/20 bg-[#ef3340]/18 p-8 text-center">
              <Ticket className="mb-4 text-[#9be7ff]" />
              <p className="font-black text-white/80">Responsive ad unit / sponsored event card / featured city booking</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionIntro({ dark = false, kicker, text, title }: { dark?: boolean; kicker: string; text: string; title: string }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-4xl">
        <p className={`text-xs font-black uppercase tracking-wide ${dark ? "text-gold" : "text-oxide"}`}>{kicker}</p>
        <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">{title}</h2>
      </div>
      <p className={`max-w-md text-sm ${dark ? "text-paper/62" : "text-ink/62"}`}>{text}</p>
    </div>
  );
}

function ElectricRings({ color = "#7ee7ff" }: { color?: string }) {
  return (
    <div className="pointer-events-none absolute inset-0">
      {[0, 1, 2, 3].map((index) => (
        <motion.span
          animate={{ opacity: [0.22, 0.9, 0.22], rotate: [index * 34, index * 34 + 360] }}
          className="absolute left-1/2 top-1/2 h-[34vmin] w-[58vmin] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border"
          key={index}
          style={{
            borderColor: color,
            boxShadow: `0 0 ${18 + index * 10}px ${color}`,
            transform: `translate(-50%, -50%) rotate(${index * 28}deg) scale(${0.72 + index * 0.12})`
          }}
          transition={{ duration: 7 + index, ease: "linear", repeat: Infinity }}
        />
      ))}
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.span
          animate={{ x: ["-12vw", "12vw", "-12vw"], opacity: [0, 1, 0] }}
          className="absolute left-1/2 h-px w-[34vw] origin-left"
          key={`bolt-${index}`}
          style={{
            background: `linear-gradient(90deg, transparent, ${color}, white, transparent)`,
            top: `${30 + index * 9}%`,
            transform: `rotate(${-22 + index * 11}deg)`
          }}
          transition={{ duration: 2.2 + index * 0.18, ease: "easeInOut", repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function clampedStops(value: number, input: number[], output: number[]) {
  if (value <= input[0]) return output[0];
  const last = input.length - 1;
  if (value >= input[last]) return output[last];

  for (let index = 0; index < last; index += 1) {
    const start = input[index];
    const end = input[index + 1];
    if (value >= start && value <= end) {
      const progress = (value - start) / Math.max(end - start, 0.0001);
      return output[index] + (output[index + 1] - output[index]) * progress;
    }
  }

  return output[last];
}

function OpeningJourney({ onQueryChange, query }: { onQueryChange: (value: string) => void; query: string }) {
  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start start", "end end"]
  });

  const londonOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0, 0.13, 0.22], [1, 1, 0]));
  const tokyoOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.16, 0.25, 0.36], [0, 1, 0]));
  const hawaiiOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.32, 0.43, 0.54], [0, 1, 0]));
  const vegasOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.5, 0.61, 0.73], [0, 1, 0]));
  const parisOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.68, 0.82, 1], [0, 1, 1]));

  const sceneScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);
  const bigBenOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0, 0.05, 0.18, 0.25], [1, 1, 1, 0]));
  const bigBenY = useTransform(scrollYProgress, [0, 0.2, 0.28], ["0vh", "-2vh", "-28vh"]);
  const bigBenScale = useTransform(scrollYProgress, [0, 0.2, 0.28], [0.82, 1.06, 1.28]);
  const bigBenRotate = useTransform(scrollYProgress, [0, 0.22], [-4, 3]);

  const electricOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0, 0.05, 0.2, 0.28, 0.36], [1, 1, 1, 0, 0]));
  const tokyoBloomOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.16, 0.25, 0.38], [0, 1, 0]));
  const tokyoBloomY = useTransform(scrollYProgress, [0.16, 0.25, 0.38], ["34vh", "0vh", "-30vh"]);
  const tokyoBloomRotate = useTransform(scrollYProgress, [0.16, 0.38], [-20, 34]);

  const waveOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.31, 0.42, 0.57], [0, 1, 0]));
  const waveX = useTransform(scrollYProgress, [0.31, 0.48, 0.57], ["-18vw", "0vw", "10vw"]);
  const waveY = useTransform(scrollYProgress, [0.31, 0.48, 0.57], ["36vh", "-4vh", "-20vh"]);
  const waveScale = useTransform(scrollYProgress, [0.31, 0.48, 0.57], [0.9, 1.15, 1.32]);

  const sunOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.38, 0.5, 0.63], [0, 1, 0.15]));
  const sunScale = useTransform(scrollYProgress, [0.38, 0.52, 0.63], [0.6, 1.2, 2.25]);
  const sunX = useTransform(scrollYProgress, [0.38, 0.58], ["18vw", "0vw"]);
  const orbOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.5, 0.59, 0.74], [0, 1, 0]));
  const orbScale = useTransform(scrollYProgress, [0.5, 0.64, 0.74], [0.65, 1.08, 1.7]);
  const orbRotate = useTransform(scrollYProgress, [0.5, 0.74], [0, 180]);
  const carOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.53, 0.59, 0.7, 0.76], [0, 1, 1, 0]));
  const carX = useTransform(scrollYProgress, [0.53, 0.76], ["-42vw", "42vw"]);
  const carY = useTransform(scrollYProgress, [0.53, 0.76], ["8vh", "-8vh"]);

  const jetOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.68, 0.75, 0.92, 1], [0, 1, 1, 0.2]));
  const jetX = useTransform(scrollYProgress, [0.68, 0.84, 1], ["-34vw", "14vw", "118vw"]);
  const jetScale = useTransform(scrollYProgress, [0.68, 0.84, 1], [0.85, 1.75, 5.4]);
  const windowOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.76, 0.86, 1], [0, 1, 0.45]));
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="home" ref={journeyRef} className="relative h-[620vh] bg-[#061925] text-white">
      <div className="sticky top-0 min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          {[
            { image: "/assets/campaign/city-london.png", opacity: londonOpacity, position: "center" },
            { image: "/assets/campaign/city-tokyo.png", opacity: tokyoOpacity, position: "center" },
            { image: "/assets/campaign/city-hawaii.png", opacity: hawaiiOpacity, position: "center" },
            { image: "/assets/campaign/city-las-vegas.png", opacity: vegasOpacity, position: "center" },
            { image: "/assets/campaign/city-paris.png", opacity: parisOpacity, position: "center" }
          ].map((plate) => (
            <motion.div
              className="absolute inset-0 bg-cover"
              key={plate.image}
              style={{
                backgroundImage: `url('${plate.image}')`,
                backgroundPosition: plate.position,
                opacity: plate.opacity,
                scale: sceneScale
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_33%,rgba(126,231,255,0.22),transparent_24%),linear-gradient(90deg,rgba(3,16,26,0.9),rgba(3,16,26,0.32),rgba(3,16,26,0.52))]" />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(255,194,14,0.5),transparent_15%),linear-gradient(90deg,rgba(255,61,87,0.18),transparent_55%)]"
          style={{ opacity: vegasOpacity }}
        />
        <motion.div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,34,0.82),rgba(5,18,34,0.18),rgba(238,250,255,0.16))]"
          style={{ opacity: parisOpacity }}
        />

        <motion.img
          alt=""
          className="absolute bottom-[-8vh] right-[5vw] z-10 h-[78vh] max-h-[780px] w-auto drop-shadow-[0_42px_80px_rgba(0,0,0,0.45)]"
          src="/assets/cutouts/big-ben.png"
          style={{ opacity: bigBenOpacity, y: bigBenY, scale: bigBenScale, rotate: bigBenRotate }}
        />
        <motion.div className="absolute bottom-[1vh] right-[4vw] z-20 h-[78vh] w-[44vw] min-w-[360px]" style={{ opacity: electricOpacity }}>
          <ElectricRings />
        </motion.div>
        <motion.div className="absolute inset-0 z-20" style={{ opacity: tokyoBloomOpacity, y: tokyoBloomY, rotate: tokyoBloomRotate }}>
          {Array.from({ length: 26 }).map((_, index) => (
            <img
              alt=""
              className="absolute w-20 opacity-82 drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)] md:w-32"
              key={index}
              src="/assets/cutouts/sakura.png"
              style={{
                left: `${(index * 17) % 96}%`,
                top: `${6 + ((index * 19) % 84)}%`,
                transform: `rotate(${index * 21}deg) scale(${0.7 + (index % 5) * 0.1})`
              }}
            />
          ))}
        </motion.div>

        <motion.img
          alt=""
          className="absolute bottom-[-13vh] left-[-12vw] z-20 w-[120vw] max-w-none drop-shadow-[0_30px_70px_rgba(0,0,0,0.38)]"
          src="/assets/cutouts/wave.png"
          style={{ opacity: waveOpacity, x: waveX, y: waveY, scale: waveScale }}
        />
        <motion.div
          className="absolute right-[12vw] top-[14vh] z-10 size-44 rounded-full bg-[#ffc20e] shadow-[0_0_150px_rgba(255,194,14,0.68)] md:size-72"
          style={{ opacity: sunOpacity, scale: sunScale, x: sunX }}
        />
        <motion.div
          className="absolute left-1/2 top-[23vh] z-20 size-[38vmin] -translate-x-1/2 rounded-full border-[10px] border-[#ffc20e] bg-[radial-gradient(circle,rgba(255,194,14,0.32),rgba(23,143,189,0.24),transparent_68%)] shadow-[0_0_110px_rgba(255,194,14,0.55)]"
          style={{ opacity: orbOpacity, scale: orbScale, rotate: orbRotate }}
        />
        <motion.div
          className="absolute bottom-[4vh] right-[-6vw] z-20 w-[49vw] min-w-[480px] max-w-none drop-shadow-[0_34px_54px_rgba(0,0,0,0.46)]"
          style={{ opacity: carOpacity, x: carX, y: carY }}
        >
          <img alt="" className="w-full" src="/assets/cutouts/race-car.png" />
        </motion.div>
        <motion.div
          className="absolute bottom-[30vh] left-0 z-20 h-3 w-[46vw] rounded-full bg-[linear-gradient(90deg,transparent,#9be7ff,#ff3d57,#ffc20e,transparent)] blur-[1px]"
          style={{ opacity: carOpacity, x: carX }}
        />
        <motion.img
          alt=""
          className="absolute left-[-10vw] top-[16vh] z-20 w-[56vw] max-w-none drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
          src="/assets/cutouts/jet.png"
          style={{ opacity: jetOpacity, x: jetX, scale: jetScale }}
        />
        <motion.div
          className="absolute right-[7vw] top-[12vh] z-10 hidden h-[66vh] w-[28vw] rounded-t-full border-[14px] border-white/70 bg-white/10 shadow-[0_0_100px_rgba(255,255,255,0.28)] backdrop-blur-[2px] lg:block"
          style={{ opacity: windowOpacity }}
        />

        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-full max-w-7xl -translate-x-1/2 px-5 [text-shadow:0_4px_28px_rgba(0,0,0,0.72)]">
          <ScrollSceneCopy
            align="end"
            kicker="Opening journey / London"
            progress={scrollYProgress}
            range={[0, 0.04, 0.15, 0.23]}
            startVisible
            text="Big Ben becomes the signal tower: trust, capital rooms, breakfast briefings, and the first spark of the trip plan."
            title="Start where business feels serious."
          />
          <ScrollSceneCopy
            align="right"
            kicker="Cut scene / Tokyo"
            progress={scrollYProgress}
            range={[0.17, 0.23, 0.32, 0.39]}
            text="Cherry blossoms flood the screen, then the city locks into focus: meetings, media energy, and meticulous follow-through."
            title="Precision in bloom."
          />
          <ScrollSceneCopy
            align="center"
            kicker="Crashing waves / Hawaii"
            progress={scrollYProgress}
            range={[0.34, 0.4, 0.5, 0.58]}
            text="The wave carries the story into resort trust-building, oceanfront breakfasts, and longer conversations."
            title="The trip turns into memory."
          />
          <ScrollSceneCopy
            align="end"
            kicker="Zoom through the sun / Vegas"
            progress={scrollYProgress}
            range={[0.52, 0.58, 0.69, 0.77]}
            text="The orb becomes the Strip, and cars cut across the page like a week of demos, dinners, and sponsor heat."
            title="Speed becomes the meeting engine."
          />
          <ScrollSceneCopy
            align="center"
            holdEnd
            kicker="Private jet / Paris"
            progress={scrollYProgress}
            range={[0.72, 0.8, 0.98, 1]}
            text="Zoom through the jet window into Paris: aerospace, innovation, salons, and the place where the planner becomes action."
            title="Land where the campaign becomes a room."
          >
            <div className="pointer-events-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/24 bg-white/18 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl md:flex-row">
              <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-white/88 px-4 text-[#102c3d] [text-shadow:none]">
                <Search className="size-5 text-[#102c3d]/50" />
                <input
                  className="w-full bg-transparent outline-none"
                  onChange={(event) => onQueryChange(event.target.value)}
                  placeholder="Search Paris, Vegas, finance, medical..."
                  value={query}
                />
              </div>
              <Button asChild className="bg-[#ffc20e] text-[#102c3d] [text-shadow:none] hover:bg-[#ffd95a]" variant="gold">
                <a href="#events">Enter Boondoggle <ArrowRight className="size-4" /></a>
              </Button>
            </div>
          </ScrollSceneCopy>
        </div>

        <div className="absolute bottom-6 left-1/2 z-40 flex w-[min(520px,calc(100vw-40px))] -translate-x-1/2 items-center gap-3 rounded-full border border-white/18 bg-white/12 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/78 backdrop-blur-xl">
          <span>London</span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/22">
            <motion.div className="h-full origin-left rounded-full bg-[#9be7ff]" style={{ scaleX: progressScale }} />
          </div>
          <span>Paris</span>
        </div>
      </div>
    </section>
  );
}

function ScrollSceneCopy({
  align,
  children,
  holdEnd = false,
  kicker,
  progress,
  range,
  startVisible = false,
  text,
  title
}: {
  align: "center" | "end" | "right";
  children?: ReactNode;
  kicker: string;
  holdEnd?: boolean;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  startVisible?: boolean;
  text: string;
  title: string;
}) {
  const opacity = useTransform(progress, (value) => clampedStops(value, range, [startVisible ? 1 : 0, 1, 1, holdEnd ? 1 : 0]));
  const y = useTransform(progress, (value) => clampedStops(value, range, [startVisible ? 0 : 42, 0, 0, holdEnd ? 0 : -42]));

  const alignment =
    align === "right"
      ? "items-end justify-center text-right"
      : align === "center"
        ? "items-start justify-center"
        : "items-start justify-end pb-24";

  return (
    <motion.div className={`absolute inset-0 flex flex-col ${alignment} py-24`} style={{ opacity, y }}>
      <div className="max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#9be7ff]">{kicker}</p>
        {title.startsWith("Start") ? (
          <h1 className="mt-4 font-serif text-6xl font-medium leading-[0.82] md:text-8xl">{title}</h1>
        ) : (
          <h2 className="mt-4 font-serif text-6xl font-medium leading-[0.84] md:text-8xl">{title}</h2>
        )}
        <p className="mt-6 max-w-xl text-lg font-semibold text-white/78">{text}</p>
        {children}
      </div>
    </motion.div>
  );
}

function CampaignProcessSection() {
  return (
    <section className="relative overflow-hidden bg-[#f6f7f4] text-[#241b28]">
      <div className="mx-auto grid min-h-[95vh] max-w-7xl items-center gap-10 px-5 py-24 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#178fbd]">Build your event campaign</p>
          <h2 className="mt-4 max-w-4xl text-6xl font-black leading-[0.84] tracking-tight md:text-8xl">
            Work deserves a better reason to travel.
          </h2>
        </div>
        <div className="grid gap-6">
          <p className="max-w-xl text-2xl font-semibold leading-tight text-[#342a38]">
            Boondoggle turns conference planning into a campaign journey: choose the right event,
            justify it, book the city, host the clients, prove the return.
          </p>
          <a className="w-fit rounded-full bg-[#ffc20e] px-6 py-4 text-sm font-black uppercase tracking-wide text-[#241b28] shadow-[0_18px_40px_rgba(255,194,14,0.25)]" href="#campaign-phases">
            Scroll to phase 1
          </a>
        </div>
      </div>

      <div id="campaign-phases" className="mx-auto grid max-w-7xl gap-8 px-5 pb-24 lg:grid-cols-[290px_1fr]">
        <aside className="top-24 hidden h-fit rounded-3xl border border-[#d8e6ec] bg-white/84 p-5 shadow-[0_20px_60px_rgba(28,101,132,0.12)] backdrop-blur lg:sticky lg:block">
          <p className="text-xs font-black uppercase tracking-wide text-[#178fbd]">Campaign menu</p>
          <div className="mt-5 grid gap-3">
            {campaignPhases.map((phase, index) => (
              <a className="rounded-2xl border border-[#d8e6ec] bg-[#f6fbfd] p-4 transition hover:border-[#178fbd] hover:bg-white" href={`#phase-${index + 1}`} key={phase.title}>
                <span className="text-xs font-black uppercase text-[#ef3340]">{phase.label}</span>
                <strong className="mt-1 block font-serif text-2xl font-medium leading-none">{phase.title}</strong>
              </a>
            ))}
          </div>
        </aside>

        <div className="grid gap-6">
          {campaignPhases.map((phase, index) => (
            <article
              className="grid min-h-[620px] overflow-hidden rounded-[2rem] border border-[#d8e6ec] bg-white shadow-[0_26px_80px_rgba(28,101,132,0.14)] md:grid-cols-[0.94fr_1.06fr]"
              id={`phase-${index + 1}`}
              key={phase.title}
            >
              <div className="relative min-h-[320px] overflow-hidden bg-[#102c3d]">
                <div className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-[1.04]" style={{ backgroundImage: `url(${phase.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102c3d]/84 via-[#102c3d]/16 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-[#ffc20e] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#241b28]">
                  {phase.label}
                </span>
              </div>
              <div className="grid content-between gap-8 p-7 md:p-10">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#178fbd]">Step 0{index + 1}</p>
                  <h3 className="mt-3 font-serif text-5xl font-medium leading-[0.88] md:text-7xl">{phase.title}</h3>
                  <p className="mt-6 max-w-xl text-lg font-medium text-[#53616b]">{phase.text}</p>
                </div>
                <div className="grid gap-3">
                  {phase.steps.map((step, stepIndex) => (
                    <div className="flex items-start gap-4 rounded-2xl border border-[#d8e6ec] bg-[#f6fbfd] p-4" key={step}>
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#178fbd] text-xs font-black text-white">
                        {stepIndex + 1}
                      </span>
                      <p className="font-black text-[#241b28]">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Signal({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="rounded-xl border border-[#43b7de]/35 bg-[#f3fbff] p-4">
      <Icon className="mb-4 text-[#178fbd]" />
      <p className="text-sm text-[#26556a]">{text}</p>
    </div>
  );
}

function EditorialHospitalityBand() {
  return (
    <section className="relative overflow-hidden bg-[#102c3d] py-20 text-white">
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-screen"
        style={{ backgroundImage: "url('/assets/campaign/editorial/texture-atmosphere.png')" }}
      />
      <motion.img
        alt=""
        animate={{ rotate: [-8, 4, -8], y: [0, -16, 0] }}
        className="pointer-events-none absolute right-[6%] top-8 hidden w-48 opacity-70 drop-shadow-[0_28px_44px_rgba(0,0,0,0.26)] md:block"
        src="/assets/campaign/editorial/sprite-sunglasses.png"
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.img
        alt=""
        animate={{ rotate: [5, -5, 5], y: [0, 18, 0] }}
        className="pointer-events-none absolute bottom-8 left-[4%] hidden w-48 opacity-72 drop-shadow-[0_28px_44px_rgba(0,0,0,0.28)] lg:block"
        src="/assets/campaign/editorial/sprite-handbag.png"
        transition={{ duration: 10, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f2c866]">Luxury layer</p>
            <h2 className="mt-3 max-w-2xl font-serif text-5xl font-medium leading-[0.86] md:text-7xl">
              Make the trip feel worth approving before anyone books a flight.
            </h2>
          </div>
          <p className="max-w-lg text-base font-medium text-white/72">
            The old app was the right spine. This layer makes it feel like a destination: generated scene plates,
            premium hospitality cues, and sponsor surfaces that look valuable instead of bolted on.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {editorialScenes.map((scene) => (
            <article className="group overflow-hidden rounded-2xl border border-white/18 bg-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.22)] backdrop-blur" key={scene.title}>
              <div className="relative min-h-72 bg-cover bg-center transition duration-700 group-hover:scale-[1.03]" style={{ backgroundImage: `url(${scene.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#102c3d]/90 via-[#102c3d]/18 to-transparent" />
                <p className="absolute left-4 top-4 rounded-full border border-white/24 bg-white/14 px-3 py-1 text-xs font-black uppercase tracking-wide text-white backdrop-blur">
                  {scene.city}
                </p>
              </div>
              <div className="grid gap-3 p-5">
                <h3 className="font-serif text-3xl font-medium leading-none">{scene.title}</h3>
                <p className="text-sm text-white/70">{scene.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoBlock({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="rounded-2xl border border-[#43b7de]/35 bg-[#f3fbff] p-5">
      <h3 className="text-lg font-black text-ink">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="grid gap-2 text-sm font-black text-ink/60">
      {label}
      {children}
    </label>
  );
}
