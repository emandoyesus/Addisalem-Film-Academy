import { motion, useReducedMotion } from 'motion/react'
import { stats } from '../data/content'

export function StatsBand() {
  const reduce = useReducedMotion()
  return (
    <section
      className="mx-auto w-full max-w-[1400px] px-5 py-14 md:px-8 md:py-20"
      aria-label="The center in numbers"
    >
      <div className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="border-r border-b border-line px-4 py-8 text-center lg:py-10"
          >
            <p className="font-display text-4xl font-bold tracking-tight text-gold md:text-5xl">
              {stat.value}
            </p>
            <p className="mx-auto mt-2 max-w-[22ch] font-mono text-[10px] uppercase tracking-[0.18em] text-ash">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}