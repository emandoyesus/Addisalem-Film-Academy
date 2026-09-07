import { marqueeWords } from '../data/content'

export function MarqueeStrip() {
  const row = [...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords]
  return (
    <section
      className="relative overflow-hidden border-y border-line bg-canvas-soft"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max py-4">
        {row.map((word, i) => (
          <span
            key={i}
            className="flex items-center gap-8 whitespace-nowrap pr-8 font-mono text-[11px] uppercase tracking-[0.28em] text-faint"
          >
            {word}
            <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
          </span>
        ))}
      </div>
    </section>
  )
}