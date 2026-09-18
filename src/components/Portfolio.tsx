import { useEffect, useState } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'
import { fetchPortfolio, firebaseConfigured, type PortfolioItem } from '../lib/firebase'
import { Eyebrow, Reveal } from './ui'

/* Owner-managed portfolio. Images are uploaded from /admin to Firebase
   Storage and listed in the Firestore `portfolio` collection, so the studio
   can add poster art, illustration and set photography without a deploy.
   The section renders nothing until there is something to show. */
export function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      if (!(await firebaseConfigured())) {
        if (!cancelled) setReady(true)
        return
      }
      try {
        const remote = await fetchPortfolio()
        if (!cancelled) setItems(remote)
      } catch {
        /* Stay empty when Firestore is unreachable. */
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready || items.length === 0) return null

  return (
    <section className="bg-canvas py-20 md:py-32">
      <div id="portfolio" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 md:px-8">
        <Reveal className="max-w-[60ch]">
          <Eyebrow>Studio portfolio</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
            Work made on our floor.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ash md:text-lg">
            Poster art, illustration and set photography from our students and
            instructors, added straight from the studio.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 columns-2 gap-4 md:columns-3">
          {items.map((item) => (
            <figure
              key={item.id}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-line bg-surface"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.caption ? `Open ${item.caption}` : 'Open image'}
              >
                <img
                  src={item.url}
                  alt={item.caption || 'Studio work'}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {item.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent px-4 pb-3 pt-10">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                      {item.caption}
                    </span>
                    <ArrowUpRight size={13} className="text-white/70" />
                  </figcaption>
                )}
              </a>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
