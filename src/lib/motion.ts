import { useReducedMotion } from 'motion/react'
import { useMediaQuery } from './useMediaQuery'

/* Entrance/scroll-reveal animations run on desktop only. On phones a page
   full of staggered slide-ups reads as lag while scrolling, so small screens
   get the content immediately. Always off for reduced-motion users. */
export function useEntranceMotion(): boolean {
  const desktop = useMediaQuery('(min-width: 768px)')
  const reduce = useReducedMotion()
  return desktop && !reduce
}

type RevealOptions = {
  amount?: number
  delay?: number
  y?: number
  duration?: number
}

/* Spreadable props for a reveal <motion.*>. Returns {} when animations are
   disabled, so the element renders at rest with no transition to run. */
export function revealProps(enabled: boolean, opts: RevealOptions = {}) {
  if (!enabled) return {}
  const { amount = 0.3, delay = 0, y = 24, duration = 0.7 } = opts
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount },
    transition: { duration, delay, ease: [0.16, 1, 0.3, 1] as const },
  }
}
