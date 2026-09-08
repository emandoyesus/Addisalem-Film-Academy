import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Play, X, ArrowUpRight, YoutubeLogo } from '@phosphor-icons/react'
import {
  announcements as seed,
  youtubeChannel,
  youtubeThumb,
  youtubeEmbed,
  type Announcement,
} from '../data/content'
import { firebaseConfigured, fetchAnnouncements } from '../lib/firebase'
import { Eyebrow } from './ui'

/* Clickable preview surface. Falls back to a branded poster when the
   thumbnail for a video is not available yet. */
function VideoPreview({
  videoId,
  hq = false,
  label,
  playAlways = true,
}: {
  videoId?: string
  hq?: boolean
  label: string
  playAlways?: boolean
}) {
  const [ok, setOk] = useState(true)

  if (!videoId || !ok) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-surface-2 via-black to-black">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-gold-soft text-gold transition-transform duration-300 group-hover:scale-110">
          <Play size={26} weight="fill" />
        </span>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-faint">
          {label}
        </p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden">
      <img
        src={youtubeThumb(videoId, hq)}
        alt=""
        loading="lazy"
        onError={() => setOk(false)}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <span
        className={`absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/60 text-gold backdrop-blur-sm transition-all duration-300 ${
          playAlways
            ? 'opacity-100'
            : 'opacity-0 group-hover:opacity-100 group-hover:scale-110'
        }`}
      >
        <Play size={26} weight="fill" />
      </span>
    </div>
  )
}

function VideoModal({
  videoId,
  title,
  onClose,
}: {
  videoId: string
  title: string
  onClose: () => void
}) {
  const reduce = useReducedMotion()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={youtubeEmbed(videoId)}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full rounded-2xl border border-line bg-black"
        />
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="font-display text-base font-semibold leading-snug text-white md:text-lg">
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Close video"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-gold hover:text-gold"
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* Opens the in-page player for videos, the channel for links, and is a
   plain div for text-only announcements. */
function CardShell({
  a,
  onOpen,
  className,
  children,
}: {
  a: Announcement
  onOpen: (videoId: string, title: string) => void
  className?: string
  children: ReactNode
}) {
  if (a.videoId) {
    return (
      <a
        href="#announcements"
        onClick={(e) => {
          e.preventDefault()
          onOpen(a.videoId!, a.title)
        }}
        className={className}
        aria-label={`Play ${a.title}`}
      >
        {children}
      </a>
    )
  }
  if (a.href) {
    return (
      <a href={a.href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return <div className={className}>{children}</div>
}

function TagChip({ tag }: { tag: Announcement['tag'] }) {
  return (
    <span className="inline-flex rounded-full border border-gold/50 px-3 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
      {tag}
    </span>
  )
}

export function Announcements() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<{ videoId: string; title: string } | null>(null)
  const [items, setItems] = useState<Announcement[]>(seed)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      if (!(await firebaseConfigured())) return
      try {
        const remote = await fetchAnnouncements()
        if (!cancelled && remote.length) setItems(remote)
      } catch {
        /* keep the seed list if Firestore is unreachable */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const [featured, ...rest] = items

  return (
    <section id="announcements" className="scroll-mt-24 py-20 md:py-32">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[60ch]">
            <Eyebrow>What&rsquo;s new</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink md:text-5xl">
              Sitcoms, edits and news, fresh from the channel.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ash md:text-lg">
              New episodes and student edits are announced here first. Every film school
              needs a screening room, and ours is on YouTube.
            </p>
          </div>
          <a
            href={youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:border-gold/60 hover:text-gold active:translate-y-[-1px] active:scale-[0.98]"
          >
            <YoutubeLogo size={15} weight="fill" />
            Subscribe on YouTube
          </a>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          <motion.div
            className="lg:col-span-3"
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <CardShell
              a={featured}
              onOpen={(id, title) => setActive({ videoId: id, title })}
              className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-gold/40"
            >
              <VideoPreview
                videoId={featured.videoId}
                hq
                label={
                  featured.tag === 'News' ? 'Read the announcement' : 'Watch on the channel'
                }
              />
              <div className="flex items-center justify-between gap-4 p-6 md:p-7">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <TagChip tag={featured.tag} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                      {featured.date}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-ash">
                    {featured.description}
                  </p>
                </div>
                {(featured.videoId || featured.href) && (
                  <span className="hidden shrink-0 rounded-full border border-line-strong p-3 text-ink transition-all duration-300 group-hover:border-gold group-hover:text-gold md:inline-flex">
                    <ArrowUpRight size={16} />
                  </span>
                )}
              </div>
            </CardShell>
          </motion.div>

          <div className="flex flex-col gap-4 lg:col-span-2">
            {rest.map((a, i) => (
              <motion.div
                key={a.id}
                className="flex-1"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <CardShell
                  a={a}
                  onOpen={(id, title) => setActive({ videoId: id, title })}
                  className="group block h-full rounded-2xl border border-line bg-surface p-5 transition-colors duration-300 hover:border-gold/40 md:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <TagChip tag={a.tag} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                      {a.date}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-ink">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{a.description}</p>
                  {(a.videoId || a.href) && (
                    <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold">
                      {a.videoId ? 'Watch here' : 'Open link'}
                      <ArrowUpRight
                        size={12}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </p>
                  )}
                </CardShell>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && <VideoModal {...active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  )
}