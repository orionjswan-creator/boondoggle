export function Marquee({
  className = "border-y border-line bg-cream text-ink",
  duration = 34,
  items
}: {
  className?: string;
  duration?: number;
  items: string[];
}) {
  const sequence = (
    <span className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <span className="flex items-center" key={`${item}-${index}`}>
          <span className="display whitespace-nowrap px-6 text-[clamp(1.6rem,3.2vw,2.8rem)] leading-none">
            {index % 2 === 0 ? item : <em>{item}</em>}
          </span>
          <span aria-hidden className="text-gold">
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className={`marquee overflow-hidden py-5 ${className}`}>
      <p className="sr-only">{items.join(". ")}.</p>
      <div aria-hidden className="marquee-track flex w-max" style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        {sequence}
        {sequence}
      </div>
    </div>
  );
}
