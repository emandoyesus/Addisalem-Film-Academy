import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

/* Shared page chrome (skip link, navbar, footer) so the landing page and the
   standalone /portfolio page stay visually identical. */
export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="grain min-h-[100dvh] bg-canvas text-ink">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.16em] focus:text-gold-ink"
      >
        Skip to content
      </a>

      <Navbar />

      <main>{children}</main>

      <Footer />
    </div>
  )
}
