import { Eyebrow, Reveal } from './ui'

const pillars = [
  {
    index: '01',
    title: 'AFA Objective',
    body: 'The main objective of Addisalem Film Academy (AFA) is to develop students\u2019 creative thinking in the art and craft of filmmaking, equipping them with the technical skills and industry knowledge necessary to succeed.',
  },
  {
    index: '02',
    title: 'AFA Mission',
    body: 'Our mission is to cultivate a dynamic learning environment where students can discover their artistic voice, master industry-standard technology, and transform their passion for film into a professional reality.',
  },
  {
    index: '03',
    title: 'AFA Goal',
    body: 'The goal of Addisalem Film Academy is to empower the next generation of visual storytellers and elevate the standard of cinema by producing highly skilled, industry-ready professionals.',
  },
]

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

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={0.1 + i * 0.1}
              className="group flex flex-col justify-between border border-line bg-surface p-7 transition-colors duration-300 hover:border-gold/40"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
                  {pillar.index}
                </p>
                <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">{pillar.body}</p>
              </div>
              <span className="mt-7 block h-px w-10 bg-gold/60 transition-all duration-300 group-hover:w-full group-hover:bg-gold" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}