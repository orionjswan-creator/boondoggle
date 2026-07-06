"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const regions = [
  {
    accent: "#c83f46",
    background: "rgba(200,63,70,0.14)",
    city: "London",
    label: "Finance, insurance, enterprise trust",
    secondary: "#6fb7d6",
    type: "big-ben"
  },
  {
    accent: "#e75480",
    background: "rgba(231,84,128,0.16)",
    city: "Tokyo",
    label: "Precision, technology, media energy",
    secondary: "#72c7dc",
    type: "sakura"
  },
  {
    accent: "#1e9bb7",
    background: "rgba(30,155,183,0.16)",
    city: "Hawaii",
    label: "Pacific trust, incentives, executive retreats",
    secondary: "#f26b5e",
    type: "waves"
  },
  {
    accent: "#d22f37",
    background: "rgba(210,47,55,0.15)",
    city: "Las Vegas",
    label: "High-speed meetings, launches, deal flow",
    secondary: "#61b9df",
    type: "race"
  },
  {
    accent: "#4179d6",
    background: "rgba(65,121,214,0.14)",
    city: "Paris",
    label: "Aerospace, innovation, polished hospitality",
    secondary: "#d2474f",
    type: "jet"
  }
] as const;

function BigBen({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 320" role="img" aria-label="Big Ben wireframe">
      <path d="M180 282h96M194 282V126l18-34 18 34v156M166 126h136M198 92h64M210 64h40M230 64V38" stroke={accent} />
      <path d="M212 142h38M212 166h38M212 190h38M212 214h38M212 238h38" stroke={secondary} />
      <circle cx="230" cy="116" r="18" stroke={accent} />
      <path d="M230 104v12l10 7M126 282c30-64 56-64 86 0M250 282c34-74 64-74 100 0" stroke={secondary} />
    </svg>
  );
}

function Sakura({ accent, secondary }: { accent: string; secondary: string }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg className="h-full w-full" viewBox="0 0 420 320" role="img" aria-label="Japanese flower wireframe">
      <path d="M70 252C132 186 180 138 320 80" stroke={secondary} />
      <path d="M98 224c40-10 76-28 108-58M164 168c40 6 82-4 126-30" stroke={secondary} />
      {[
        [300, 92, 1],
        [222, 154, 0.74],
        [152, 204, 0.58]
      ].map(([cx, cy, scale]) => (
        <g key={`${cx}-${cy}`} transform={`translate(${cx} ${cy}) scale(${scale})`}>
          {petals.map((angle) => (
            <ellipse key={angle} cx="0" cy="-28" rx="13" ry="29" transform={`rotate(${angle})`} stroke={accent} />
          ))}
          <circle r="6" stroke={secondary} />
        </g>
      ))}
    </svg>
  );
}

function Waves({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 320" role="img" aria-label="Ocean wave wireframe">
      <path d="M34 218c46-42 86-42 130 0s84 42 126 0 68-38 98-10" stroke={accent} />
      <path d="M46 246c42-30 80-30 122 0s80 30 122 0 62-28 92-8" stroke={secondary} />
      <path d="M122 198c24-54 76-96 132-70 46 22 54 74 22 106 0-44-34-58-74-42-24 10-46 12-80 6Z" stroke={accent} />
      <path d="M218 126c18 36 4 70-40 82" stroke={secondary} />
    </svg>
  );
}

function Race({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 320" role="img" aria-label="Racing car wireframe">
      <path d="M58 216h250c34 0 52-14 64-42l-84-18-44-42h-86l-54 56-46 46Z" stroke={accent} />
      <path d="M142 156h104M156 132h70M74 238h300M50 188h54M30 166h88M304 154h64" stroke={secondary} />
      <circle cx="128" cy="222" r="30" stroke={accent} />
      <circle cx="306" cy="222" r="30" stroke={accent} />
      <circle cx="128" cy="222" r="10" stroke={secondary} />
      <circle cx="306" cy="222" r="10" stroke={secondary} />
    </svg>
  );
}

function Jet({ accent, secondary }: { accent: string; secondary: string }) {
  return (
    <svg className="h-full w-full" viewBox="0 0 420 320" role="img" aria-label="Jet wireframe">
      <path d="M48 204 354 82c14-6 24 12 12 22L244 204l18 82-46 20-38-74-78 32-28-24 76-52-74-48 44-20 104 44 108-74" stroke={accent} />
      <path d="M82 220c50-2 82 8 122 34M48 252c72-8 120 0 170 38M254 110c34 10 66 26 96 50" stroke={secondary} />
    </svg>
  );
}

function Motif({ accent, secondary, type }: { accent: string; secondary: string; type: (typeof regions)[number]["type"] }) {
  const props = { accent, secondary };
  if (type === "big-ben") return <BigBen {...props} />;
  if (type === "sakura") return <Sakura {...props} />;
  if (type === "waves") return <Waves {...props} />;
  if (type === "race") return <Race {...props} />;
  return <Jet {...props} />;
}

export function RegionMotifScene() {
  const [index, setIndex] = useState(0);
  const region = regions[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % regions.length);
    }, 4400);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ backgroundColor: region.background }}
        className="absolute right-0 top-16 h-[68%] w-[54%] rounded-l-[4rem] blur-3xl"
        transition={{ duration: 1.2 }}
      />
      <motion.div
        animate={{ borderColor: region.accent }}
        className="absolute bottom-12 right-8 z-[3] hidden rounded-full border bg-white/76 px-4 py-3 shadow-[0_16px_40px_rgba(73,52,33,0.14)] backdrop-blur md:block"
      >
        <motion.p key={`${region.city}-label`} animate={{ opacity: 1, y: 0 }} className="text-xs font-black uppercase text-[#5d4630]" initial={{ opacity: 0, y: 8 }}>
          {region.city} / {region.label}
        </motion.p>
      </motion.div>
    </div>
  );
}
