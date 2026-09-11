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
      {/* Background plate with video + subtle parallax + Ken Burns entrance */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute inset-[-12%] bg-cover bg-center"
          style={{ backgroundImage: `url(${images.hero})`, y: reduce ? 0 : bgY }}
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        />
        {!reduce && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/media/hero-poster.jpg"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
        )}
        {/* Cinematic scrim stack: bottom + left, so text is readable over the video */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 38%, rgba(0,0,0,0.88) 100%), linear-gradient(96deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0) 80%)',
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

      {/* Hero content — bottom-left, kept compact so it never buries the video */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-5 pb-24 pt-28 md:px-8 md:pt-32">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-gold"
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
          className="mt-5 max-w-[15ch] font-display text-4xl font-bold leading-[1.02] tracking-tight text-ink sm:text-5xl md:text-6xl"
        >
          Turn your story into cinema.
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-[52ch] text-sm leading-relaxed text-ash md:text-base"
        >
          Photography, video, directing, editing, design and more — taught hands-on in
          Dessie. Camera, drone &amp; digital-marketing training included.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <a
            href="#programs"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-ink transition-all duration-300 hover:bg-gold-deep active:translate-y-[-1px] active:scale-[0.98]"
          >
            Explore programs <Arrow />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-canvas/20 px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink backdrop-blur-sm transition-all duration-300 hover:border-gold/60 hover:text-gold active:translate-y-[-1px] active:scale-[0.98]"
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
          Est. {site.founded}
        </span>
      </motion.div>
    </section>
  )
}