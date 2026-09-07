import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}

/* Scroll-reveal wrapper honoring prefers-reduced-motion */
export function Reveal({ children, delay = 0, className, y = 28 }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

type EyebrowProps = { children: ReactNode; className?: string }

/* Small mono label. Used sparingly — the eyebrow restraint rule applies
   at the section level, not every section gets one. */
export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p
      className={`font-mono text-[11px] uppercase tracking-[0.22em] text-gold ${className}`}
    >
      {children}
    </p>
  )
}

/* Primary pill CTA */
export function PillLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-ink transition-all duration-300 active:translate-y-[-1px] active:scale-[0.98] hover:bg-gold-deep ${className}`}
    >
      {children}
    </a>
  )
}

/* Ghost pill CTA — for use over dark photography / accent backgrounds */
export function GhostLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:border-gold/60 hover:text-gold active:translate-y-[-1px] active:scale-[0.98] ${className}`}
    >
      {children}
    </a>
  )
}

export function Arrow({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}