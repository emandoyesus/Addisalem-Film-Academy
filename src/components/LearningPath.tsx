import { motion, useReducedMotion } from 'motion/react'
import { path } from '../data/content'

export function LearningPath() {
  const reduce = useReducedMotion()
  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-20 md:px-8 md:py-32">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[60ch]"
      >
        <h2 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
          Pick the pace that fits your week.
        </h2>
        <p className="mt-6 text-base leading-relaxed text-ash md:text-lg">
          The two-month program is a focused stretch in photography, video, editing and
          design. The five- and ten-month programs carry the full curriculum — the
          difference between them is the weekly schedule.
        </p>
      </motion.div>

      <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-line">
        {path.map((stage, i) => (
          <motion.article
            key={stage.step}
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="group lg:px-10 lg:first:pl-0 lg:last:pr-0"
          >
            <span className="block h-px w-12 bg-gold transition-all duration-500 group-hover:w-20" />
            <p className="mt-6 font-mono text-sm tracking-[0.2em] text-gold">
              {stage.step}
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
              {stage.title}
            </h3>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              {stage.length}
            </p>
            <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-ash">
              {stage.copy}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {stage.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-faint"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  )
}