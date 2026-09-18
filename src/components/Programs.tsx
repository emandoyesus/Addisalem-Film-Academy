import { motion, useReducedMotion } from 'motion/react'
import { Arrow, Eyebrow } from './ui'
import { programs, type Program } from '../data/content'
import { unsplashSrcSet } from '../lib/responsive'
import { LoadingImage } from './LoadingImage'

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
        src={program.image}
        srcSet={unsplashSrcSet(program.image, [400, 600, 800, 1000, 1280], 70)}
        sizes="(min-width: 1024px) 33vw, 100vw"
        alt={program.alt ?? program.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-100" />
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
  const reduce = useReducedMotion()

  return (
    <section className="bg-canvas py-20 md:py-32">
      <div id="programs" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8">
        <Eyebrow>Programs</Eyebrow>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="mt-5 max-w-[18ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
            Three ways to learn film.
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
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: 0.08 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <ProgramCard program={program} className="h-full" />
            </motion.div>
          ))}
        </div>

        {(() => {
          const toolkit = programs.find((program) => program.toolkit)?.toolkit
          return toolkit ? (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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