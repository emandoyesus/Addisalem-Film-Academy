import { Eyebrow, Reveal } from './ui'

const principles = [
  {
    title: 'Real Sets, Real Deadlines',
    body: 'We teach film the way it is actually made in the industry.',
  },
  {
    title: 'Cameras in Hand from Week One',
    body: 'Theory is important, but practical execution is everything.',
  },
  {
    title: 'Authentic Voices',
    body: 'Our set days and screening nights are built to elevate the stories of the Amhara region and all of Ethiopia.',
  },
  {
    title: 'Crew-Based Learning',
    body: 'Taught fluently in both Amharic and English, preparing you for local and global collaborations.',
  },
]

/* "How we work" — an open step column, not a card grid. Each principle is a
   step on a hairline: a ghost take-number in the corner, a mono "Step" tag and
   the text underneath. Deliberately the opposite of the statement rows in
   "Why AFA exists". */
export function HowWeWork() {
  return (
    <section className="bg-canvas-soft py-20 md:py-32">
      <div id="how-we-work" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8">
        <Reveal>
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-5 max-w-[16ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
            How we work.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle, i) => (
            <Reveal
              key={principle.title}
              delay={0.08 * i}
              className="relative border-t border-line pt-10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 select-none font-display text-[64px] font-bold leading-[0.8] text-gold/15 transition-colors duration-300 group-hover:text-gold/30"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                Step {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-4 max-w-[24ch] font-display text-xl font-bold leading-snug tracking-tight text-ink">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ash">{principle.body}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.15}>
          <p className="mt-14 max-w-[46ch] border-l-2 border-gold pl-5 font-display text-xl font-bold leading-snug tracking-tight text-ink md:text-2xl">
            We aren&rsquo;t here to study film from a distance. We are here to make it.
          </p>
        </Reveal>
      </div>
    </section>
  )
}