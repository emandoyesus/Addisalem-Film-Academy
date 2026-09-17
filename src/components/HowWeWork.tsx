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

export function HowWeWork() {
  return (
    <section className="border-t border-line bg-canvas-soft py-20 md:py-32">
      <div id="how-we-work" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8">
        <Reveal>
          <Eyebrow>How we work</Eyebrow>
          <h2 className="mt-5 max-w-[16ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
            How we work.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {principles.map((principle, i) => (
            <Reveal
              key={principle.title}
              delay={0.08 * i}
              className="group flex flex-col justify-between gap-6 bg-surface p-7 transition-colors duration-300 hover:bg-surface-2 md:p-9"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                {String(i + 1).padStart(2, '0')}
              </p>
              <div>
                <h3 className="font-display text-xl font-bold leading-snug tracking-tight text-ink md:text-2xl">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 max-w-[46ch] border-l-2 border-gold pl-5 font-display text-xl font-bold leading-snug tracking-tight text-ink md:text-2xl">
            We aren&rsquo;t here to study film from a distance. We are here to make it.
          </p>
        </Reveal>
      </div>
    </section>
  )
}