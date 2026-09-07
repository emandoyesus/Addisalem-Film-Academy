import { motion, useReducedMotion } from 'motion/react'
import { instructors } from '../data/content'
import { Eyebrow } from './ui'

export function Instructors() {
  const reduce = useReducedMotion()
  return (
    <section id="instructors" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 py-20 md:px-8 md:py-32">
      <div className="flex items-end justify-between gap-6">
        <div>
          <Eyebrow>The bench</Eyebrow>
          <h2 className="mt-5 max-w-[20ch] font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
            Taught by people who shoot for a living.
          </h2>
        </div>
        <p className="hidden max-w-[30ch] pb-2 text-sm leading-relaxed text-ash md:block">
          Instructors stay active in the industry, and the industry comes back into
          the classroom as ongoing work for students.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {instructors.map((person, i) => (
          <motion.article
            key={person.name}
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group overflow-hidden rounded-2xl border border-line bg-surface"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={person.image}
                alt={person.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                {`0${i + 1}`}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {person.name}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                {person.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ash">{person.bio}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}