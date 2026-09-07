import { motion, useReducedMotion } from 'motion/react'
import { stories, type Story } from '../data/content'

function QuoteCard({
  quote,
  name,
  role,
  featured = false,
}: Story & { featured?: boolean }) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl border border-line bg-surface p-7 ${
        featured ? 'md:p-9' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className="font-display text-5xl font-bold leading-none text-gold"
      >
        &ldquo;
      </span>
      <blockquote
        className={`mt-3 max-w-[62ch] font-display font-medium tracking-tight text-ink ${
          featured ? 'text-xl leading-snug md:text-2xl' : 'text-base leading-snug'
        }`}
      >
        {quote}
      </blockquote>
      <footer className="mt-auto pt-6">
        <p className="font-display text-sm font-semibold text-ink">{name}</p>
        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          {role}
        </p>
      </footer>
    </div>
  )
}

export function Stories() {
  const reduce = useReducedMotion()
  const [first, second, third] = stories
  return (
    <section id="stories" className="scroll-mt-24 bg-canvas-soft py-20 md:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        <div className="max-w-[60ch]">
          <h2 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
            Graduates, in their own words.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ash md:text-lg">
            Alumni who moved from a first idea to a first film on our floor.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          <motion.div
            className="lg:col-span-3"
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <QuoteCard {...first} featured />
          </motion.div>
          <div className="flex flex-col gap-4 lg:col-span-2">
            <motion.div
              className="flex-1"
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <QuoteCard {...second} />
            </motion.div>
            <motion.div
              className="flex-1"
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <QuoteCard {...third} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}