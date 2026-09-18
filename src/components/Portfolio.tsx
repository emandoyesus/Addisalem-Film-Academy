import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react'
import { type PortfolioItem } from '../lib/firebase'
import { cloudinarySrcSet, cloudinaryUrl } from '../lib/responsive'
import { usePortfolio } from '../lib/usePortfolio'
import { LoadingImage } from './LoadingImage'
import { Eyebrow, Reveal } from './ui'

/* Owner-managed portfolio. Images are uploaded from /admin to Cloudinary and
   listed in the Firestore `portfolio` collection, so the studio can add poster
   art, illustration and set photography without a deploy. The landing section
   renders nothing until there is something to show, and shows at most three
   pieces with a link to the full /portfolio page. */
const LANDING_LIMIT = 3

/* Cloudinary renders each tile at the width the layout actually needs, in
   AVIF/WebP, so phones download a fraction of the original upload. */
const TILE_WIDTHS = [400, 600, 800, 1200, 1600]

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="columns-2 gap-4 md:columns-3">
      {items.map((item) => {
        const src = cloudinaryUrl(item.url, 800)
        const srcSet = cloudinarySrcSet(item.url, TILE_WIDTHS)
        const ratio = item.width && item.height ? `${item.width} / ${item.height}` : undefined
        return (
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
              <LoadingImage
                src={src}
                srcSet={srcSet}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                width={item.width}
                height={item.height}
                style={ratio ? { aspectRatio: ratio } : undefined}
                alt={item.caption || 'Studio work'}
                loading="lazy"
                decoding="async"
                className="w-full bg-surface-2 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
        )
      })}
    </div>
  )
}

export function Portfolio() {
  const { items, ready } = usePortfolio()

  if (!ready || items.length === 0) return null

  const shown = items.slice(0, LANDING_LIMIT)

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

        <Reveal delay={0.1} className="mt-12">
          <PortfolioGrid items={shown} />
        </Reveal>

        {items.length > LANDING_LIMIT && (
          <Reveal delay={0.15} className="mt-10 flex justify-center">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:border-gold/60 hover:text-gold active:translate-y-[-1px] active:scale-[0.98]"
            >
              See more work <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  )
}
