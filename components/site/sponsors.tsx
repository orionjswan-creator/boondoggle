import Image from "next/image";
import { Megaphone, Ticket } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

export function Sponsors() {
  return (
    <section aria-labelledby="sponsors-title" className="grain relative scroll-mt-20 overflow-hidden bg-ink py-24 text-paper md:py-32" id="sponsors">
      <Image
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-screen"
        fill
        sizes="100vw"
        src="/assets/campaign/editorial/texture-atmosphere.png"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <span className="sr-only" id="sponsors-title">
          Sponsors
        </span>
        <SectionHeading
          dark
          index="06"
          kicker="Commercial layer"
          lede="Programmatic stays clearly labeled. Premium inventory — venues, receptions, suites — earns its place by looking like hospitality, not like ads."
          title="Sponsorship that feels like hospitality."
        />

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid content-start gap-5">
            <Reveal>
              <div className="rounded-[2rem] border border-paper/15 bg-paper/5 p-7 backdrop-blur-sm md:p-8">
                <Megaphone aria-hidden className="size-5 text-glow" />
                <h3 className="display mt-4 text-3xl">Programmatic, clearly labeled</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
                  AdSense-style units run for scale — always marked, never disguised as editorial. Trust in the planner
                  is the product; the ads rent space, they don&rsquo;t wear its clothes.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-[2rem] border border-gold/40 bg-gold/10 p-7 backdrop-blur-sm md:p-8">
                <Ticket aria-hidden className="size-5 text-gold" />
                <h3 className="display mt-4 text-3xl">Premium event-week inventory</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">
                  Conferences, venues, restaurants, hotel meeting rooms, and hosted receptions — sold by segment and
                  city, routed straight into the plans people are already building.
                </p>
                <a
                  className="link-swipe mt-5 inline-block font-mono text-[0.7rem] uppercase tracking-[0.18em] text-gold"
                  href="mailto:hello@boondoggle.events?subject=Sponsor%20inventory"
                >
                  Request the media kit →
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <figure className="relative h-full min-h-[320px] overflow-hidden rounded-[2rem] border border-paper/15">
              <Image
                alt="Illustrated banquet hall reception during a conference week"
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                src="/assets/campaign/editorial/scene-banquet-hall.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-4">
                <span className="font-serif text-xl italic">Sponsored receptions with memory.</span>
                <span className="chip border-paper/30 bg-ink/50 text-paper">Advertisement — demo slot</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
