import { Eyebrow, Reveal } from './ui'

const pillars = [
  {
    index: '01',
    word: 'Objective',
    body: 'The main objective of Addisalem Film Academy (AFA) is to develop students\u2019 creative thinking in the art and craft of filmmaking, equipping them with the technical skills and industry knowledge necessary to succeed.',
  },
  {
    index: '02',
    word: 'Mission',
    body: 'Our mission is to cultivate a dynamic learning environment where students can discover their artistic voice, master industry-standard technology, and transform their passion for film into a professional reality.',
  },
  {
    index: '03',
    word: 'Goal',
    body: 'The goal of Addisalem Film Academy is to empower the next generation of visual storytellers and elevate the standard of cinema by producing highly skilled, industry-ready professionals.',
  },
]

/* "Why AFA exists" — an editorial statement, not a card grid. Each pillar is a
   quiet row: a big word on the left, the reasoning in prose on the right,
   separated by hairlines. Deliberately the opposite of the step tiles in
   HowWeWork. */
export function Purpose() {
  return (
    <section className="bg-canvas py-20 md:py-32">
      <div id="purpose" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8">
        <Reveal>
          <Eyebrow>Why AFA exists</Eyebrow>
          <h2 className="mt-5 max-w-[20ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
            Built to turn passion into practice.
          </h2>
        </Reveal>

        <div className="mt-14 border-t border-line">
          {pillars.map((pillar, i) => (
            <Reveal
              key={pillar.word}
              delay={0.08 * i}
              className="group grid gap-4 border-b border-line py-10 md:grid-cols-[240px_1fr] md:items-baseline md:gap-10 md:py-12"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  {pillar.index}
                </p>
                <h3 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink transition-colors duration-300 group-hover:text-gold md:text-4xl">
                  {pillar.word}
                </h3>
              </div>
              <p className="max-w-[62ch] text-base leading-relaxed text-ash md:text-lg">
                {pillar.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}