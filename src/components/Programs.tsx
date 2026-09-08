import { motion, useReducedMotion } from 'motion/react'
import { Arrow, Eyebrow } from './ui'
import { programs, type Program } from '../data/content'

function ImageCard({
  program,
  className = '',
}: {
  program: Program
  className?: string
}) {
  return (
    <a
      href="#contact"
      aria-label={`Enquire about ${program.title}`}
      className={`group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl border border-line bg-surface ${className}`}
    >
      <img
        src={program.image}
        alt={program.alt ?? program.title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative p-6 md:p-7">
        <h3 className="font-display text-2xl font-bold tracking-tight text-gold">
          {program.title}
        </h3>
        <p className="mt-2 max-w-[44ch] text-sm leading-relaxed text-white/85">
          {program.tagline}
        </p>
        {program.note && (
          <p className="mt-4 border-l-2 border-gold pl-4 font-mono text-[11px] leading-relaxed text-white/70">
            {program.note}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
            {program.level}
          </span>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Enquire <Arrow className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  )
}

export function Programs() {
  const reduce = useReducedMotion()
  const [directing, cinematography, screenwriting, editing, sound, producing] = programs

  return (
    <section id="programs" className="scroll-mt-24 bg-canvas-soft py-20 md:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        <Eyebrow>Programs</Eyebrow>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="mt-5 max-w-[18ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
            Six crafts. One finished film.
          </h2>
          <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-ash md:text-lg">
            Every program ends in screen time. Start from zero in any discipline, or
            sharpen a craft you already practice.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <motion.div
            className="md:col-span-2 lg:col-span-3"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageCard program={directing} className="h-full" />
          </motion.div>
          <motion.div
            className="md:col-span-2 lg:col-span-3"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageCard program={cinematography} className="h-full" />
          </motion.div>
          <motion.div
            className="md:col-span-1 lg:col-span-2"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageCard program={screenwriting} className="h-full" />
          </motion.div>
          <motion.div
            className="md:col-span-1 lg:col-span-2"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageCard program={editing} className="h-full" />
          </motion.div>
          <motion.div
            className="md:col-span-2 lg:col-span-2"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageCard program={sound} className="h-full" />
          </motion.div>
          <motion.div
            className="md:col-span-2 lg:col-span-6"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <ImageCard program={producing} className="min-h-[300px]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}