import { Reveal } from "@/components/site/reveal";

export function SectionHeading({
  dark = false,
  index,
  kicker,
  lede,
  title
}: {
  dark?: boolean;
  index: string;
  kicker: string;
  lede?: string;
  title: string;
}) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <div className={`flex items-center gap-4 ${dark ? "text-glow" : "text-sea"}`}>
        <span className="kicker">
          {index} — {kicker}
        </span>
        <span aria-hidden className={`h-px flex-1 ${dark ? "bg-paper/20" : "bg-line"}`} />
      </div>
      <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <h2 className="display max-w-3xl text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[0.98]">{title}</h2>
        {lede ? (
          <p className={`max-w-md text-sm leading-relaxed md:pb-2 ${dark ? "text-paper/65" : "text-ink/65"}`}>{lede}</p>
        ) : null}
      </div>
    </Reveal>
  );
}
