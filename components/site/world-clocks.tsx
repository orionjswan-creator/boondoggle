"use client";

import { useEffect, useState } from "react";

const ZONES = [
  { city: "LDN", zone: "Europe/London" },
  { city: "PAR", zone: "Europe/Paris" },
  { city: "TYO", zone: "Asia/Tokyo" },
  { city: "LAS", zone: "America/Los_Angeles" },
  { city: "HNL", zone: "Pacific/Honolulu" }
];

export function WorldClocks({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] ${className}`}>
      {ZONES.map(({ city, zone }) => (
        <span className="flex items-center gap-2" key={city}>
          <span className="opacity-55">{city}</span>
          <span suppressHydrationWarning>
            {now
              ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, minute: "2-digit", timeZone: zone }).format(now)
              : "--:--"}
          </span>
        </span>
      ))}
    </div>
  );
}
