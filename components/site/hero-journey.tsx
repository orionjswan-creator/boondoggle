"use client";

import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue
} from "motion/react";
import { ArrowDown, ArrowRight, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const SCENES = [
  {
    city: "London",
    kicker: "Chapter 01 — London",
    plate: "/assets/campaign/city-london.png",
    text: "Big Ben becomes the signal tower: trust, capital rooms, breakfast briefings, and the first spark of the trip plan.",
    title: (
      <>
        Start where business <em>gets serious.</em>
      </>
    )
  },
  {
    city: "Tokyo",
    kicker: "Chapter 02 — Tokyo",
    plate: "/assets/campaign/city-tokyo.png",
    text: "Cherry blossoms flood the screen, then the city locks into focus: meetings, media energy, meticulous follow-through.",
    title: (
      <>
        Precision, <em>in bloom.</em>
      </>
    )
  },
  {
    city: "Hawaiʻi",
    kicker: "Chapter 03 — Hawaiʻi",
    plate: "/assets/campaign/city-hawaii.png",
    text: "The wave carries the story into resort trust-building, oceanfront breakfasts, and conversations that finally have room.",
    title: (
      <>
        Meetings become <em>memory.</em>
      </>
    )
  },
  {
    city: "Las Vegas",
    kicker: "Chapter 04 — Las Vegas",
    plate: "/assets/campaign/city-las-vegas.png",
    text: "The sun becomes the Strip, and a week of demos, dinners, and sponsor heat cuts across the page at full speed.",
    title: (
      <>
        Speed is the <em>meeting engine.</em>
      </>
    )
  },
  {
    city: "Paris",
    kicker: "Chapter 05 — Paris",
    plate: "/assets/campaign/city-paris.png",
    text: "Through the jet window and into Paris — where the plan becomes a room, a dinner, and a reason to love the work.",
    title: (
      <>
        Land where work becomes <em>a trip worth taking.</em>
      </>
    )
  }
];

const CHAPTER_BANDS = [0.11, 0.29, 0.47, 0.65, 1];
const QUICK_SEARCHES = ["Paris", "Las Vegas", "Finance", "Medical", "Tokyo"];

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

export function HeroJourney({ onQueryChange, query }: { onQueryChange: (value: string) => void; query: string }) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Swap variants only after hydration so client HTML matches the server render.
  if (mounted && reduceMotion) {
    return <StaticHero onQueryChange={onQueryChange} query={query} />;
  }

  return <ScrollJourney onQueryChange={onQueryChange} query={query} />;
}

function SearchCard({
  onQueryChange,
  query
}: {
  onQueryChange: (value: string) => void;
  query: string;
}) {
  return (
    <div className="pointer-events-auto mt-8 max-w-2xl [text-shadow:none]">
      <form
        action="#events"
        className="flex flex-col gap-3 rounded-3xl border border-paper/25 bg-ink/35 p-3 shadow-lift backdrop-blur-xl md:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
        }}
        role="search"
      >
        <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl bg-paper px-4 text-ink">
          <Search aria-hidden className="size-4 shrink-0 text-ink/45" />
          <span className="sr-only">Search events, cities, or industries</span>
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/45"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Paris, Vegas, finance, medical…"
            type="search"
            value={query}
          />
        </label>
        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gold px-6 text-sm font-semibold text-ink transition duration-300 ease-swift hover:bg-[#f0b356]"
          type="submit"
        >
          Explore the board <ArrowRight aria-hidden className="size-4" />
        </button>
      </form>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/55">Try</span>
        {QUICK_SEARCHES.map((term) => (
          <button
            className="rounded-full border border-paper/30 px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-paper/85 transition hover:border-gold hover:text-gold"
            key={term}
            onClick={() => {
              onQueryChange(term);
              document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
            }}
            type="button"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}

function StaticHero({ onQueryChange, query }: { onQueryChange: (value: string) => void; query: string }) {
  return (
    <section className="relative min-h-screen bg-ink text-paper" id="home">
      <Image
        alt="Illustrated evening skyline of Paris with warm lights along the Seine"
        className="object-cover opacity-70"
        fill
        priority
        sizes="100vw"
        src="/assets/campaign/city-paris.png"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-5 pb-20 pt-32 md:px-8">
        <p className="kicker text-glow">Boondoggle — the event travel planner</p>
        <h1 className="display mt-5 max-w-4xl text-[clamp(2.8rem,8vw,7rem)] leading-[0.95]">
          Land where work becomes <em>a trip worth taking.</em>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-paper/80">
          Find the conferences around the world where work is more interactive, engaging, and fun — in London, Tokyo,
          Hawaiʻi, Las Vegas, and Paris.
        </p>
        <SearchCard onQueryChange={onQueryChange} query={query} />
      </div>
    </section>
  );
}

function ScrollJourney({ onQueryChange, query }: { onQueryChange: (value: string) => void; query: string }) {
  const journeyRef = useRef<HTMLElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    target: journeyRef
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = CHAPTER_BANDS.findIndex((band) => value <= band);
    setActiveChapter(next === -1 ? SCENES.length - 1 : next);
  });

  const plateOpacities = [
    useTransform(scrollYProgress, (value) => clampedStops(value, [0, 0.13, 0.22], [1, 1, 0])),
    useTransform(scrollYProgress, (value) => clampedStops(value, [0.16, 0.25, 0.36], [0, 1, 0])),
    useTransform(scrollYProgress, (value) => clampedStops(value, [0.32, 0.43, 0.54], [0, 1, 0])),
    useTransform(scrollYProgress, (value) => clampedStops(value, [0.5, 0.61, 0.73], [0, 1, 0])),
    useTransform(scrollYProgress, (value) => clampedStops(value, [0.68, 0.82, 1], [0, 1, 1]))
  ];
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);

  const bigBenOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0, 0.05, 0.18, 0.25], [1, 1, 1, 0]));
  const bigBenY = useTransform(scrollYProgress, [0, 0.2, 0.28], ["0vh", "-2vh", "-28vh"]);
  const bigBenScale = useTransform(scrollYProgress, [0, 0.2, 0.28], [0.82, 1.06, 1.28]);
  const bigBenRotate = useTransform(scrollYProgress, [0, 0.22], [-4, 3]);

  const sakuraOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.16, 0.25, 0.38], [0, 1, 0]));
  const sakuraY = useTransform(scrollYProgress, [0.16, 0.25, 0.38], ["34vh", "0vh", "-30vh"]);
  const sakuraRotate = useTransform(scrollYProgress, [0.16, 0.38], [-16, 26]);

  const waveOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.31, 0.42, 0.57], [0, 1, 0]));
  const waveX = useTransform(scrollYProgress, [0.31, 0.48, 0.57], ["-18vw", "0vw", "10vw"]);
  const waveY = useTransform(scrollYProgress, [0.31, 0.48, 0.57], ["36vh", "-4vh", "-20vh"]);
  const waveScale = useTransform(scrollYProgress, [0.31, 0.48, 0.57], [0.9, 1.15, 1.32]);

  const sunOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.38, 0.5, 0.63], [0, 1, 0.15]));
  const sunScale = useTransform(scrollYProgress, [0.38, 0.52, 0.63], [0.6, 1.2, 2.25]);
  const sunX = useTransform(scrollYProgress, [0.38, 0.58], ["18vw", "0vw"]);
  const carOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.53, 0.59, 0.7, 0.76], [0, 1, 1, 0]));
  const carX = useTransform(scrollYProgress, [0.53, 0.76], ["-42vw", "42vw"]);
  const carY = useTransform(scrollYProgress, [0.53, 0.76], ["8vh", "-8vh"]);

  const jetOpacity = useTransform(scrollYProgress, (value) => clampedStops(value, [0.68, 0.75, 0.92, 1], [0, 1, 1, 0.2]));
  const jetX = useTransform(scrollYProgress, [0.68, 0.84, 1], ["-34vw", "14vw", "118vw"]);
  const jetScale = useTransform(scrollYProgress, [0.68, 0.84, 1], [0.85, 1.75, 5.4]);

  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const sakuraPetals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        left: `${(index * 23) % 96}%`,
        rotate: index * 24,
        scale: 0.7 + (index % 5) * 0.12,
        top: `${6 + ((index * 31) % 84)}%`
      })),
    []
  );

  const jumpToChapter = (index: number) => {
    const journey = journeyRef.current;
    if (!journey) return;
    const targetProgress = [0.02, 0.25, 0.43, 0.61, 0.84][index];
    const top = journey.offsetTop + targetProgress * (journey.offsetHeight - window.innerHeight);
    window.scrollTo({ behavior: "smooth", top });
  };

  return (
    <section className="relative h-[520vh] bg-ink text-paper md:h-[560vh]" id="home" ref={journeyRef}>
      <div className="sticky top-0 min-h-screen overflow-hidden">
        {/* City plates */}
        <div aria-hidden className="absolute inset-0">
          {SCENES.map((scene, index) => (
            <motion.div
              className="absolute inset-0 will-change-transform"
              key={scene.city}
              style={{ opacity: plateOpacities[index], scale: sceneScale }}
            >
              <Image
                alt=""
                className="object-cover"
                fill
                priority={index === 0}
                sizes="100vw"
                src={scene.plate}
              />
            </motion.div>
          ))}
        </div>

        {/* Color grade */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_33%,rgba(155,231,255,0.18),transparent_26%),linear-gradient(90deg,rgba(9,20,30,0.88),rgba(9,20,30,0.3),rgba(9,20,30,0.5))]" />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,rgba(232,163,61,0.45),transparent_16%),linear-gradient(90deg,rgba(228,87,46,0.16),transparent_55%)]"
          style={{ opacity: plateOpacities[3] }}
        />

        {/* Scene cutouts */}
        <motion.img
          alt=""
          className="absolute bottom-[-8vh] right-[5vw] z-10 h-[62vh] w-auto select-none drop-shadow-[0_42px_80px_rgba(0,0,0,0.45)] will-change-transform md:h-[78vh] md:max-h-[780px]"
          src="/assets/cutouts/big-ben.png"
          style={{ opacity: bigBenOpacity, rotate: bigBenRotate, scale: bigBenScale, y: bigBenY }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-0 z-20 will-change-transform"
          style={{ opacity: sakuraOpacity, rotate: sakuraRotate, y: sakuraY }}
        >
          {sakuraPetals.map((petal, index) => (
            <img
              alt=""
              className="absolute w-16 select-none opacity-80 drop-shadow-[0_16px_24px_rgba(0,0,0,0.28)] md:w-28"
              key={index}
              src="/assets/cutouts/sakura.png"
              style={{
                left: petal.left,
                top: petal.top,
                transform: `rotate(${petal.rotate}deg) scale(${petal.scale})`
              }}
            />
          ))}
        </motion.div>
        <motion.img
          alt=""
          className="absolute bottom-[-13vh] left-[-12vw] z-20 w-[120vw] max-w-none select-none drop-shadow-[0_30px_70px_rgba(0,0,0,0.38)] will-change-transform"
          src="/assets/cutouts/wave.png"
          style={{ opacity: waveOpacity, scale: waveScale, x: waveX, y: waveY }}
        />
        <motion.div
          aria-hidden
          className="absolute right-[12vw] top-[14vh] z-10 size-44 rounded-full bg-gold shadow-[0_0_150px_rgba(232,163,61,0.65)] will-change-transform md:size-72"
          style={{ opacity: sunOpacity, scale: sunScale, x: sunX }}
        />
        <motion.div
          className="absolute bottom-[4vh] right-[-6vw] z-20 w-[64vw] min-w-[340px] max-w-none select-none will-change-transform md:w-[49vw] md:min-w-[480px]"
          style={{ opacity: carOpacity, x: carX, y: carY }}
        >
          <img alt="" className="w-full drop-shadow-[0_34px_54px_rgba(0,0,0,0.46)]" src="/assets/cutouts/race-car.png" />
        </motion.div>
        <motion.div
          aria-hidden
          className="absolute bottom-[30vh] left-0 z-20 h-2.5 w-[46vw] rounded-full bg-[linear-gradient(90deg,transparent,#9be7ff,#e4572e,#e8a33d,transparent)] blur-[1px]"
          style={{ opacity: carOpacity, x: carX }}
        />
        <motion.img
          alt=""
          className="absolute left-[-10vw] top-[16vh] z-20 w-[76vw] max-w-none select-none drop-shadow-[0_40px_80px_rgba(0,0,0,0.45)] will-change-transform md:w-[56vw]"
          src="/assets/cutouts/jet.png"
          style={{ opacity: jetOpacity, scale: jetScale, x: jetX }}
        />

        {/* Copy */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-30 w-full max-w-7xl -translate-x-1/2 [text-shadow:0_4px_28px_rgba(0,0,0,0.72)]">
          <SceneCopy progress={scrollYProgress} range={[0, 0.04, 0.15, 0.23]} scene={SCENES[0]} startVisible isHeadline />
          <SceneCopy align="right" progress={scrollYProgress} range={[0.17, 0.23, 0.32, 0.39]} scene={SCENES[1]} />
          <SceneCopy align="center" progress={scrollYProgress} range={[0.34, 0.4, 0.5, 0.58]} scene={SCENES[2]} />
          <SceneCopy progress={scrollYProgress} range={[0.52, 0.58, 0.69, 0.77]} scene={SCENES[3]} />
          <SceneCopy align="center" holdEnd progress={scrollYProgress} range={[0.72, 0.8, 0.98, 1]} scene={SCENES[4]}>
            <SearchCard onQueryChange={onQueryChange} query={query} />
          </SceneCopy>
        </div>

        {/* Chapter rail */}
        <nav
          aria-label="Journey chapters"
          className="absolute left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
        >
          {SCENES.map((scene, index) => (
            <button
              className={`group flex items-center gap-3 text-left transition ${
                activeChapter === index ? "text-paper" : "text-paper/40 hover:text-paper/75"
              }`}
              key={scene.city}
              onClick={() => jumpToChapter(index)}
              type="button"
            >
              <span
                className={`h-px transition-all duration-500 ease-swift ${
                  activeChapter === index ? "w-10 bg-gold" : "w-5 bg-paper/40 group-hover:bg-paper/70"
                }`}
              />
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em]">
                0{index + 1} {scene.city}
              </span>
            </button>
          ))}
        </nav>

        {/* Scroll hint */}
        <p
          aria-hidden
          className={`absolute bottom-24 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.26em] text-paper/70 transition-opacity duration-700 md:bottom-8 md:left-auto md:right-8 md:translate-x-0 ${
            activeChapter === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          Scroll the journey
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}>
            <ArrowDown className="size-3.5" />
          </motion.span>
        </p>

        {/* Journey progress */}
        <div className="absolute bottom-6 left-1/2 z-40 flex w-[min(520px,calc(100vw-40px))] -translate-x-1/2 items-center gap-3 rounded-full border border-paper/18 bg-ink/40 px-4 py-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper/80 backdrop-blur-xl">
          <span>London</span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-paper/20">
            <motion.div className="h-full origin-left rounded-full bg-gold" style={{ scaleX: progressScale }} />
          </div>
          <span>Paris</span>
        </div>
      </div>
    </section>
  );
}

function SceneCopy({
  align = "end",
  children,
  holdEnd = false,
  isHeadline = false,
  progress,
  range,
  scene,
  startVisible = false
}: {
  align?: "center" | "end" | "right";
  children?: ReactNode;
  holdEnd?: boolean;
  isHeadline?: boolean;
  progress: MotionValue<number>;
  range: [number, number, number, number];
  scene: (typeof SCENES)[number];
  startVisible?: boolean;
}) {
  const opacity = useTransform(progress, (value) =>
    clampedStops(value, range, [startVisible ? 1 : 0, 1, 1, holdEnd ? 1 : 0])
  );
  const y = useTransform(progress, (value) => clampedStops(value, range, [startVisible ? 0 : 42, 0, 0, holdEnd ? 0 : -42]));

  const alignment =
    align === "right"
      ? "items-end justify-center text-right"
      : align === "center"
        ? "items-start justify-center"
        : "items-start justify-end pb-32 md:pb-24";

  const Title = isHeadline ? "h1" : "h2";

  return (
    <motion.div
      className={`absolute inset-0 flex flex-col ${alignment} px-5 py-24 md:px-8 lg:pl-32 lg:pr-10`}
      style={{ opacity, y }}
    >
      <div className="max-w-4xl">
        <p className="kicker text-glow">{scene.kicker}</p>
        <Title className="display mt-4 text-[clamp(2.6rem,8.6vw,7.6rem)] leading-[0.92]">
          {isHeadline ? <span className="sr-only">Boondoggle — </span> : null}
          {scene.title}
        </Title>
        <p className="mt-6 max-w-xl text-base font-medium text-paper/80 md:text-lg">{scene.text}</p>
        {children}
      </div>
    </motion.div>
  );
}
