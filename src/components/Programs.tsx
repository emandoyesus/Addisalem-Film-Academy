import { motion } from 'motion/react'
import { Arrow, Eyebrow } from './ui'
import { images, programs, skillBoost, type Program } from '../data/content'
import { localSrcSet, unsplashSrcSet } from '../lib/responsive'
import { LoadingImage } from './LoadingImage'
import { revealProps, useEntranceMotion } from '../lib/motion'

function ProgramCard({
  program,
  className = '',
}: {
  program: Program
  className?: string
}) {
  return (
    <a
      href="#contact"
      aria-label={`Enquire about the ${program.title}`}
      className={`group relative flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-line bg-surface ${className}`}
    >
      <LoadingImage
        src={images.programs}
        srcSet={
          images.programs.startsWith('/media')
            ? localSrcSet('/media/programs-bg', [400, 600, 800, 1000, 1280], 'webp')
            : unsplashSrcSet(images.programs, [400, 600, 800, 1000, 1280], 70)
        }
        sizes="(min-width: 1024px) 33vw, 100vw"
        alt="Film production set at Addisalem"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-[1.2] object-cover blur-[16px]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/35" />
      <div className="relative flex flex-1 flex-col p-6 md:p-7">
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
            {program.duration}
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-gold">
            {program.title}
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
            Focus: {program.focus}
          </p>
          <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-white/85">
            <span className="text-white/60">Covers: </span>
            {program.tagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {program.courses.map((course) => (
              <span
                key={course}
                className="rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/80 backdrop-blur-sm"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-auto pt-8">
          <p className="font-mono text-[11px] leading-relaxed text-white/75">
            <span className="uppercase tracking-[0.18em] text-gold">Best for: </span>
            {program.bestFor}
          </p>
          <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Enquire <Arrow className="h-3 w-3" />
          </div>
        </div>
      </div>
    </a>
  )
}

export function Programs() {
  const animate = useEntranceMotion()

  return (
    <section className="bg-canvas py-20 md:py-32">
      <div id="programs" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8">
        <Eyebrow>Programs</Eyebrow>
        <motion.div {...revealProps(animate, { amount: 0.4, delay: 0.1 })}>
          <h2 className="mt-5 max-w-[18ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-gold md:text-5xl">
            Four ways to learn film.
          </h2>
          <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-ash md:text-lg">
            Choose the timeline that fits your schedule. Whether you need a quick skills
            boost or a comprehensive cinematic education, AFA has a path for you.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program, i) => (
            <motion.div
              key={program.title}
              className="md:col-span-2 lg:col-span-1"
              {...revealProps(animate, {
                amount: 0.2,
                delay: 0.08 * i,
                duration: 0.6,
              })}
            >
              <ProgramCard program={program} className="h-full" />
            </motion.div>
          ))}
        </div>

        <motion.div
          {...revealProps(animate, { amount: 0.4, delay: 0.1, y: 16, duration: 0.6 })}
          className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[120px] font-bold leading-none text-gold/10"
          >
            04
          </div>
          <div className="relative grid gap-6 p-7 md:grid-cols-[minmax(0,12rem)_1fr] md:gap-10 md:p-9">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                Also offered
              </p>
              <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-ink">
                {skillBoost.title}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
                {skillBoost.duration} &middot; {skillBoost.focus}
              </p>
            </div>
            <div className="grid gap-5 border-t border-line pt-5 md:border-l md:border-t-0 md:pt-0 md:pl-10">
              <p className="text-sm leading-relaxed text-ash">
                {skillBoost.tagline}
              </p>
              <a
                href="#contact"
                className="inline-flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-gold transition-colors hover:text-white"
              >
                Enquire <Arrow className="h-3 w-3" />
              </a>
            </div>
          </div>
        </motion.div>

        {(() => {
          const toolkit = programs.find((program) => program.toolkit)?.toolkit
          return toolkit ? (
            <motion.p
              {...revealProps(animate, { amount: 0.4, delay: 0.1, y: 16, duration: 0.6 })}
              className="mt-8 max-w-[80ch] border-l-2 border-gold pl-5 font-mono text-[11px] leading-relaxed text-ash"
            >
              <span className="uppercase tracking-[0.18em] text-gold">
                The toolkit:{' '}
              </span>
              {toolkit}
            </motion.p>
          ) : null
        })()}
      </div>
    </section>
  )
}