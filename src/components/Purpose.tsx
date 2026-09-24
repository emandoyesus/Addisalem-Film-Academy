import { Eyebrow, Reveal } from './ui'

const pillars = [
  {
    word: 'Objective',
    body: 'To develop students\u2019 creative thinking in the art and craft of filmmaking, equipping them with the technical skills and industry knowledge they need to succeed.',
  },
  {
    word: 'Mission',
    body: 'To cultivate a dynamic learning environment where students discover their artistic voice, master industry-standard technology, and turn a passion for film into a professional reality.',
  },
  {
    word: 'Goal',
    body: 'To empower the next generation of visual storytellers and elevate the standard of cinema by producing highly skilled, industry-ready professionals.',
  },
]

/* "Why AFA exists" — a centered manifesto. One column, breathing room, the
   three pillars stacked on hairlines with a mono word as their only label.
   The headline and prose stay centered like a statement, not a catalogue. */
export function Purpose() {
  return (
    <section className="bg-canvas py-20 md:py-32">
      <div id="purpose" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8">
        <Reveal>
          <div className="text-center">
            <Eyebrow>Why AFA exists</Eyebrow>
            <h2 className="mx-auto mt-5 max-w-[24ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
              Built to turn passion into practice.
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 max-w-[62ch]">
          {pillars.map((pillar, i) => (
            <Reveal
              key={pillar.word}
              delay={0.08 * i}
              className="border-t border-line py-10 text-center md:py-12"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                {pillar.word}
              </p>
              <p className="mx-auto mt-6 max-w-[56ch] text-base leading-relaxed text-ash md:text-lg">
                {pillar.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}