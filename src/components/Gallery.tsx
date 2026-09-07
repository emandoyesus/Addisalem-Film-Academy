import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react'
import { gallery, img } from '../data/content'

export function Gallery() {
  const track = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    track.current?.scrollBy({ left: dir * 560, behavior: 'smooth' })
  }

  return (
    <section id="gallery" className="scroll-mt-24 py-20 md:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[60ch]">
            <h2 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
              The lot, between take one and wrap.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ash md:text-lg">
              Set days, edit bays and screening nights from inside the center.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll gallery left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-gold/60 hover:text-gold"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll gallery right"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-gold/60 hover:text-gold"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="film-strip mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 md:px-8 lg:px-[max(2rem,calc((100vw-1400px)/2))]"
      >
        {gallery.map((item, i) => (
          <figure
            key={item.id}
            className="group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-line sm:w-[420px]"
          >
            <a href={img(item.id, 2400, 80)} aria-label={`Open ${item.caption} photo`}>
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={img(item.id, 900, 75)}
                  alt={item.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent px-5 pb-4 pt-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                  {item.caption}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </figcaption>
            </a>
          </figure>
        ))}
      </div>
    </section>
  )
}