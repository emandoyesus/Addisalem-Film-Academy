import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { images, site } from '../data/content'
import { Arrow } from './ui'

export function Hero() {
  const { scrollY } = useScroll()
  const reduce = useReducedMotion()
  const bgY = useTransform(scrollY, [0, 900], [0, 160])
  const shade = useTransform(scrollY, [0, 900], [0, 0.35])

  return (
    <section id="top" className="relative isolate flex min-h-[100dvh] flex-col">
      {/* Background plate with subtle parallax + Ken Burns entrance */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-[-12%] bg-cover bg-center"
          style={{ backgroundImage: `url(${images.hero})`, y: reduce ? 0 : bgY }}
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Cinematic scrim stack over pure black */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 42%, #000000 96%)',
            opacity: shade,
          }}
        />
        {/* Warm gold-orange key light, like a projector beam */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 18% 42%, rgba(255,186,33,0.13) 0%, rgba(255,186,33,0.04) 42%, transparent 70%)',
          }}
        />
      </div>

      {/* Hero content */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-5 pt-28 md:px-8 md:pt-32">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-gold"
        >
          <span className="flex h-2 w-2 items-center justify-center">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
          </span>
          {site.name} · {site.city}
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-[16ch] font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl md:text-7xl"
        >
          Turn your story into cinema.
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-[58ch] text-base leading-relaxed text-ash md:text-lg"
        >
          Hands-on training in photography, videography, directing, cinematography, writing, editing, sound, graphic design and more,
          taught in Dessie.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <a
            href="#programs"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-ink transition-all duration-300 hover:bg-gold-deep active:translate-y-[-1px] active:scale-[0.98]"
          >
            Explore programs <Arrow />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-canvas/20 px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:text-gold active:translate-y-[-1px] active:scale-[0.98]"
          >
            Talk to admissions
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="mx-auto flex w-full max-w-[1400px] items-end justify-between px-5 pb-8 md:px-8"
        aria-hidden="true"
      >
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
          <span className="block h-10 w-px bg-line-strong" />
          Scroll
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-faint sm:block">
          Est. {site.founded} · {site.region}
        </span>
      </motion.div>
    </section>
  )
}