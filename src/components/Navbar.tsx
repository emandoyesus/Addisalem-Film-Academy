import { useState } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react'
import { Phone } from '@phosphor-icons/react'
import { navLinks, site } from '../data/content'
import { Logo } from './Logo'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  const reduce = useReducedMotion()

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-line bg-canvas/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-8"
          aria-label="Primary"
        >
          <Logo />

          <ul className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-ash transition-colors duration-200 hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={`tel:${site.phone.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm font-medium text-ash transition-colors hover:text-ink"
            >
              <Phone size={15} weight="regular" />
              {site.phone}
            </a>
            <a
              href="#contact"
              className="rounded-full bg-gold px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-ink transition-all duration-300 hover:bg-gold-deep active:translate-y-[-1px] active:scale-[0.98]"
            >
              Enroll
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink lg:hidden"
          >
            <span className="flex flex-col items-center justify-center gap-[5px]">
              <motion.span
                animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-5 bg-current"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-5 bg-current"
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-canvas px-5 pt-28 pb-8 lg:hidden"
          >
            <ul className="flex flex-col divide-y divide-line">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={reduce ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-2xl font-semibold text-ink"
                  >
                    {link.label}
                    <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
                      0{i + 1}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-auto block rounded-full bg-gold px-6 py-4 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-gold-ink"
            >
              Enroll this intake
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}