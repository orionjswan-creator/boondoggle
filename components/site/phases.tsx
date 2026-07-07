import Image from "next/image";
import { SectionHeading } from "@/components/site/section-heading";

const PHASES = [
  {
    image: "/assets/campaign/segment-technology.png",
    steps: ["Map the industry segment", "Find the major and minor weeks", "Prioritize sponsor-ready dates"],
    text: "Search by sector, city, and commercial priority so the team sees which conferences actually deserve calendar space.",
    title: "Discover the signal"
  },
  {
    image: "/assets/campaign/segment-finance.png",
    steps: ["Estimate the trip cost", "Name accounts and meetings", "Generate the manager memo"],
    text: "Turn the trip from a vague expense into a defendable business case with meetings, pipeline, and expected return.",
    title: "Justify the trip"
  },
  {
    image: "/assets/campaign/city-las-vegas.png",
    steps: ["Reserve the private rooms", "Design the client hosting moves", "Layer in sponsor moments"],
    text: "Connect event demand to the city layer: dinners, suites, receptions, and the relationship time that makes it count.",
    title: "Book the room around the room"
  },
  {
    image: "/assets/campaign/boondoggle-work-celebration.png",
    steps: ["Host the dinner", "Run the reception", "Capture what people cared about"],
    text: "Make work feel worth celebrating — curated hospitality and event-week moments people still talk about in Q3.",
    title: "Celebrate the work"
  },
  {
    image: "/assets/campaign/editorial/scene-banquet-hall.png",
    steps: ["Report the meetings", "Compare pipeline to cost", "Queue next year's campaign"],
    text: "Close the loop with a recap that proves the trip had business value — and pre-approves the next one.",
    title: "Prove the return"
  }
];

const CARD_THEMES = [
  { card: "bg-ink text-paper", divider: "border-paper/15" },
  { card: "border border-line bg-cream text-ink", divider: "border-ink/10" },
  { card: "bg-sea text-paper", divider: "border-paper/15" },
  { card: "bg-gold text-ink", divider: "border-ink/15" },
  { card: "bg-ink text-paper", divider: "border-paper/15" }
];

export function Phases() {
  return (
    <section aria-labelledby="method-title" className="scroll-mt-20 bg-paper py-24 md:py-32" id="method">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <span className="sr-only" id="method-title">
          The method
        </span>
        <SectionHeading
          index="03"
          kicker="The method"
          lede="Five phases, one loop: the trip gets chosen, defended, booked, enjoyed — and then it argues for the next one."
          title="Work deserves a better reason to travel."
        />

        <div>
          {PHASES.map((phase, index) => (
            <div className="sticky mb-6" key={phase.title} style={{ top: `calc(84px + ${index * 14}px)` }}>
              <article
                className={`grid min-h-[420px] overflow-hidden rounded-[2rem] shadow-lift md:grid-cols-[1.05fr_0.95fr] ${CARD_THEMES[index].card}`}
              >
                <div className="flex flex-col justify-between gap-8 p-7 md:p-10">
                  <div>
                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] opacity-70">
                      Phase 0{index + 1} / 05
                    </p>
                    <h3 className="display mt-4 text-[clamp(2rem,4.4vw,3.8rem)] leading-[0.96]">{phase.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed opacity-75 md:text-base">{phase.text}</p>
                  </div>
                  <ol className="grid gap-2">
                    {phase.steps.map((step, stepIndex) => (
                      <li className={`flex items-center gap-3 border-t pt-2.5 text-sm font-medium ${CARD_THEMES[index].divider}`} key={step}>
                        <span className="font-mono text-[0.64rem] opacity-60">{stepIndex + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="relative min-h-[240px] md:min-h-0">
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={phase.image}
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
