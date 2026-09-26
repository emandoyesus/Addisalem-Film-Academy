import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { revealProps, useEntranceMotion } from '../lib/motion'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}

/* Scroll-reveal wrapper. Desktop only — phones render the content straight
   away so a column of staggered slide-ups never lags the scroll. */
export function Reveal({ children, delay = 0, className, y = 28 }: RevealProps) {
  const animate = useEntranceMotion()
  if (!animate) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} {...revealProps(true, { delay, y })}>
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
      className={`font-mono text-[11px] uppercase tracking-[0.22em] text-ink ${className}`}
    >
      {children}
    </p>
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