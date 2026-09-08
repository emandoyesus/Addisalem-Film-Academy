import { Check } from '@phosphor-icons/react'
import { images } from '../data/content'
import { Reveal } from './ui'

const values = [
  'Hands-on from week one, cameras in hand',
  'Taught in Amharic and English',
  'Mentored by working filmmakers',
]

export function About() {
  return (
    <section id="about" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 py-20 md:px-8 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
              The craft school of Northern Ethiopia.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-[58ch] text-base leading-relaxed text-ash md:text-lg">
              Addisalem began as a weekend phone-film workshop in Dessie and grew into a
              full training center. We teach film the way it is really made: in crews,
              on sets, under deadlines, and in Amharic as fluently as English.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ash">
              Students here are making Ethiopian films, not just studying them from
              abroad. Our set days, screening nights and studio crews are built for the
              stories of the Amhara region and the whole country.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <ul className="mt-9 space-y-3">
              {values.map((value) => (
                <li key={value} className="flex items-start gap-3 text-sm text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold">
                    <Check size={12} weight="bold" />
                  </span>
                  <span className="text-ash">{value}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="absolute -right-3 -top-3 h-full w-full rounded-2xl border border-gold/40 md:-right-5 md:-top-5" />
          <img
            src={images.about}
            alt="Professional camera used in training at Addisalem"
            width={1200}
            height={900}
            loading="lazy"
            className="relative aspect-[4/3] w-full rounded-2xl object-cover"
          />
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            <span>Camera kits on loan to students</span>
            <span aria-hidden="true">Take 01 / Keep going</span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}