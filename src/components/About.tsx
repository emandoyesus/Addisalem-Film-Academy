import { Check } from '@phosphor-icons/react'
import { images } from '../data/content'
import { localSrcSet, unsplashSrcSet } from '../lib/responsive'
import { LoadingImage } from './LoadingImage'
import { Reveal } from './ui'

const pillars = [
  {
    title: 'Immediate Practical Execution',
    body: 'Hands-on technical mastery over abstract theory.',
  },
  {
    title: 'Real-Set Discipline',
    body: 'Crew-based learning structured around active production environments and strict deadline pressure.',
  },
  {
    title: 'Bilingual Fluency',
    body: 'Industry-grade instruction delivered seamlessly in Amharic and English to foster authentic narrative voices.',
  },
  {
    title: 'Industry Readiness',
    body: 'A curriculum designed to graduate set-ready photographers, script writers, actors, directors, cinematographers, editors and sound engineers.',
  },
]

export function About() {
  return (
    <section className="bg-canvas-soft py-20 md:py-32">
      <div id="about" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-5xl">
              The craft school of Northern Ethiopia.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-7 max-w-[58ch] text-base leading-relaxed text-ash md:text-lg">
              Addisalem Film Academy is a premier media training institute founded in
              2011 E.C. (2018 G.C.) in Dessie, Ethiopia, dedicated to bridging local
              storytelling talent with international industry standards.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ash">
              Our philosophy is simple: Learn Filmmaking from the Source
              <span className="block font-mono text-sm tracking-[0.06em] text-gold">
                &ldquo;ፊልምን ከምንጩ ይማሩ&rdquo;
              </span>
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <p className="mt-9 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
              Our core pillars
            </p>
            <ul className="mt-4 space-y-4">
              {pillars.map((pillar) => (
                <li key={pillar.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold">
                    <Check size={12} weight="bold" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{pillar.title}</span>
                    <span className="block text-sm leading-relaxed text-ash">{pillar.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative">
          <div className="absolute -right-3 -top-3 h-full w-full rounded-2xl border border-gold/40 md:-right-5 md:-top-5" />
          <LoadingImage
            src={images.about}
            srcSet={
              images.about.startsWith('/media')
                ? localSrcSet('/media/about-camera', [480, 720, 960, 1200], 'webp')
                : unsplashSrcSet(images.about, [480, 720, 960, 1200], 72)
            }
            sizes="(min-width: 1024px) 45vw, 100vw"
            alt="A modern cinema camera held in a student's hand"
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className="relative aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl"
          />
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            <span>Modern cinema camera on student hands</span>
            <span aria-hidden="true">Take 01 / Keep going</span>
          </div>
        </Reveal>
      </div>
      </div>
    </section>
  )
}