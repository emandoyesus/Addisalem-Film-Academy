import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowsClockwise,
  CaretDown,
  CaretUp,
  Check,
  DotsSixVertical,
  Images,
  LinkSimple,
  Megaphone,
  Phone,
  SignOut,
  Trash,
  Trophy,
  UsersThree,
  YoutubeLogo,
  type Icon,
} from '@phosphor-icons/react'
import {
  createAnnouncement,
  deleteAnnouncement,
  deleteLead,
  fetchAnnouncements,
  fetchLeads,
  firebaseConfigured,
  saveAnnouncementOrder,
  signIn,
  signOut,
  updateAnnouncement,
  type AnnouncementPatch,
  type Lead,
} from '../lib/firebase'
import { useAuthStatus, markAdminVisit } from '../lib/useAdmin'
import { AwardsPanel } from '../components/AwardsPanel'
import { PortfolioPanel } from '../components/PortfolioPanel'
import {
  toVideoId,
  youtubeThumb,
  youtubeWatch,
  type Announcement,
  type AnnouncementTag,
} from '../data/content'

const MAX_ANNOUNCEMENTS = 4

const TAG_OPTIONS: AnnouncementTag[] = [
  'Showcase & Portfolio',
  'Education & Tips',
  'Social Proof & Stories',
  'Behind-the-Scenes',
  'Academy Updates & Ads',
]

type Tab = 'announcements' | 'applications' | 'portfolio' | 'awards'

type FormState = {
  title: string
  videoUrl: string
  href: string
  tag: AnnouncementTag
  description: string
}

const emptyForm: FormState = {
  title: '',
  videoUrl: '',
  href: '',
  tag: 'Showcase & Portfolio',
  description: '',
}

/* Field styling shared by the publish form and the in-place rows, so a post
   looks identical whether it is being created or edited. */
const fieldLabel =
  'font-mono text-[10px] uppercase tracking-[0.18em] text-faint'
const boxInput =
  'w-full rounded-xl border border-line-strong bg-black px-4 py-3 text-sm text-ink outline-none placeholder:text-faint focus:border-gold/70'
const bareInput =
  'w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint'

const enterToBlur = (e: { key: string; currentTarget: HTMLInputElement }) => {
  if (e.key === 'Enter') e.currentTarget.blur()
}

/* A labelled field whose input sits inside a bordered dark box, optionally
   with a leading glyph (the YouTube and external-link rows). */
function IconField({
  label,
  icon,
  className = '',
  children,
}: {
  label: string
  icon: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <label className={`block ${className}`}>
      <span className={fieldLabel}>{label}</span>
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-line-strong bg-black px-4 py-3 focus-within:border-gold/70">
        <span className="shrink-0">{icon}</span>
        {children}
      </div>
    </label>
  )
}

/* YouTube link input with a live thumbnail of whatever it parses to, plus an
   inline warning when the pasted text holds no video ID. */
function VideoField({
  value,
  onChange,
  onCommit,
  invalid,
  className = 'mt-5',
}: {
  value: string
  onChange: (value: string) => void
  onCommit?: () => void
  invalid?: boolean
  className?: string
}) {
  const videoId = toVideoId(value)
  return (
    <div className={className}>
      <IconField
        label="YouTube link"
        icon={<YoutubeLogo size={16} className="text-gold" />}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onCommit}
          onKeyDown={enterToBlur}
          placeholder="https://www.youtube.com/watch?v=..."
          aria-label="YouTube link"
          className={bareInput}
        />
      </IconField>
      {videoId && (
        <div className="mt-3 flex items-center gap-3">
          <img
            src={youtubeThumb(videoId)}
            alt=""
            className="h-16 w-28 rounded-lg border border-line object-cover"
          />
          <p className="font-mono text-[11px] text-gold">Video ID: {videoId}</p>
        </div>
      )}
      {invalid && !videoId && (
        <p className="mt-3 font-mono text-[11px] text-gold">
          No video ID in that link — paste the full watch URL, or leave it empty
          for a text-only post.
        </p>
      )}
    </div>
  )
}

export default function AdminPage() {
  /* Seed the navbar "Admin Portal" button for this browser so it appears the
     moment the admin navigates back to the site, before the auth listener
     answers. */
  useEffect(() => {
    markAdminVisit()
  }, [])

  return (
    <div className="min-h-screen bg-black text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-gold-soft font-mono text-xs font-semibold text-gold">
              AF
            </span>
            <div>
              <p className="font-display text-sm font-semibold leading-none text-ink">
                Addisalem
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Admin console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-gold/70 bg-gold-soft px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
              Admin Portal
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-gold/60 hover:text-gold"
            >
              <ArrowLeft size={14} />
              Back to site
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-10">
        <LoginGate>
          <Manager />
        </LoginGate>
      </main>
    </div>
  )
}

function LoginGate({ children }: { children: ReactNode }) {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const { pending, signedIn } = useAuthStatus()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    void firebaseConfigured().then((ok) => {
      if (!cancelled) setConfigured(ok)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (configured === null || pending) {
    return (
      <p className="text-sm text-ash">
        {configured === null ? 'Checking configuration...' : 'Checking access...'}
      </p>
    )
  }

  if (configured === false) {
    return (
      <div className="rounded-2xl border border-line-strong bg-surface p-6">
        <h2 className="font-display text-xl font-semibold text-ink">Not configured</h2>
        <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-ash">
          No Firebase keys in this build. Copy <code>.env.example</code> to a{' '}
          <code>.env</code>, paste your web-app keys, restart{' '}
          <code>npm run dev</code>, then enable email/password auth and create a
          user in the Firebase console. The section keeps showing the seed
          announcements until then.
        </p>
      </div>
    )
  }

  if (signedIn) return <>{children}</>

  return (
    <form
      className="rounded-2xl border border-line-strong bg-surface p-6"
      onSubmit={(e) => {
        e.preventDefault()
        setBusy(true)
        setError('')
        signIn(email, password)
          .catch(() => setError('Wrong email or password'))
          .finally(() => setBusy(false))
      }}
    >
      <h2 className="font-display text-xl font-semibold text-ink">Sign in</h2>
      <p className="mt-2 text-sm text-ash">
        The email/password user you created in Firebase Authentication signs in here.
      </p>
      <label className="mt-5 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-line-strong bg-black px-4 py-3 text-sm text-ink outline-none focus:border-gold/70"
        />
      </label>
      <label className="mt-4 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          Password
        </span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-line-strong bg-black px-4 py-3 text-sm text-ink outline-none focus:border-gold/70"
        />
      </label>
      {error && <p className="mt-4 text-sm text-gold">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="mt-5 w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {busy ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}

function AnnouncementsPanel() {
  const [items, setItems] = useState<Announcement[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const savedTimer = useRef<number | undefined>(undefined)

  const load = () => {
    void fetchAnnouncements()
      .then(setItems)
      .catch(() => setNotice('Could not load announcements'))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(
    () => () => {
      if (savedTimer.current) window.clearTimeout(savedTimer.current)
    },
    [],
  )

  const flashSaved = (id: string) => {
    setSavedId(id)
    if (savedTimer.current) window.clearTimeout(savedTimer.current)
    savedTimer.current = window.setTimeout(() => setSavedId(null), 1600)
  }

  /* Saves one field of a published post in place, the way the portfolio rows
     re-caption an image: the row keeps its draft until the write resolves, and
     a failed write reloads the list so the inputs snap back to what Firestore
     actually holds. */
  const save = (id: string, patch: AnnouncementPatch, message: string) => {
    /* Firestore rejects undefined, so an empty field is written as '' — that is
       how a video or link is cleared there. The local copy mirrors what the
       public feed reads back out ('' becomes "no video" again). */
    const applied: AnnouncementPatch = { ...patch }
    if (patch.videoId !== undefined) applied.videoId = patch.videoId || undefined
    if (patch.href !== undefined) applied.href = patch.href || undefined
    void updateAnnouncement(id, patch)
      .then(() => {
        setItems((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...applied } : a)),
        )
        setNotice(message)
        flashSaved(id)
      })
      .catch(() => {
        setNotice('Save failed. Check the console error.')
        load()
      })
  }

  const videoId = toVideoId(form.videoUrl)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (items.length >= MAX_ANNOUNCEMENTS) {
      setNotice(
        `Announcement limit reached — delete one first (max ${MAX_ANNOUNCEMENTS}).`,
      )
      return
    }
    setBusy(true)
    setNotice('')
    void createAnnouncement({
      title: form.title.trim(),
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      tag: form.tag,
      description: form.description.trim(),
      videoId: videoId ?? undefined,
      href: form.href.trim() || undefined,
    })
      .then(() => {
        setForm(emptyForm)
        setNotice('Published. It now leads the announcement feed.')
        load()
      })
      .catch(() => setNotice('Publish failed. Check the console error.'))
      .finally(() => setBusy(false))
  }

  const remove = async (id: string) => {
    try {
      await deleteAnnouncement(id)
      setNotice('Deleted.')
    } catch {
      setNotice('Delete failed.')
    } finally {
      load()
    }
  }

  const persistOrder = (next: Announcement[]) => {
    void saveAnnouncementOrder(next).catch(() =>
      setNotice('Could not save the new order.'),
    )
  }

  const move = (a: Announcement, dir: number) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === a.id)
      const to = index + dir
      if (index === -1 || to < 0 || to >= prev.length) return prev
      const next = [...prev]
      ;[next[index], next[to]] = [next[to], next[index]]
      persistOrder(next)
      return next
    })
  }

  const dropOn = (targetId: string) => {
    const sourceId = dragId
    setDragId(null)
    if (!sourceId || sourceId === targetId) return
    setItems((prev) => {
      const from = prev.findIndex((item) => item.id === sourceId)
      const to = prev.findIndex((item) => item.id === targetId)
      if (from === -1 || to === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      persistOrder(next)
      return next
    })
  }

  return (
    <div>
      <p className="mb-6 max-w-[60ch] text-sm text-ash">
        Paste a YouTube link to publish it. The newest entry leads the
        announcement feed on the home page — edit any published post in place
        below, the changes save as you click away from a field.
      </p>

      {notice && (
        <p className="mb-6 rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm text-gold">
          {notice}
        </p>
      )}

      <form
        onSubmit={submit}
        className="rounded-2xl border border-line-strong bg-surface p-6"
      >
        <h2 className="font-display text-lg font-semibold text-ink">
          New announcement
        </h2>

        <VideoField
          value={form.videoUrl}
          onChange={(videoUrl) => setForm((f) => ({ ...f, videoUrl }))}
        />

        <label className="mt-5 block">
          <span className={fieldLabel}>Title</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={boxInput}
          />
        </label>

        <label className="mt-5 block">
          <span className={fieldLabel}>Type</span>
          <select
            value={form.tag}
            onChange={(e) =>
              setForm((f) => ({ ...f, tag: e.target.value as AnnouncementTag }))
            }
            className={boxInput}
          >
            {TAG_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block">
          <span className={fieldLabel}>Short description</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className={boxInput}
          />
        </label>

        <IconField
          label="External link (optional)"
          icon={<LinkSimple size={16} className="text-gold" />}
          className="mt-5"
        >
          <input
            value={form.href}
            onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
            placeholder="Optional, for news without a video"
            aria-label="External link (optional)"
            className={bareInput}
          />
        </IconField>

        <button
          type="submit"
          disabled={busy || !form.title.trim()}
          className="mt-6 w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? 'Publishing...' : 'Publish'}
        </button>
      </form>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">
          Published ({items.length} / {MAX_ANNOUNCEMENTS})
        </h2>
        <p className="mt-2 max-w-[60ch] text-sm text-ash">
          Every field is editable here — click one, change it, click away and it
          saves. Re-order with the arrows or by dragging; the first entry is the
          featured card on the home page.
        </p>
        <ul className="mt-4 divide-y divide-line-strong rounded-2xl border border-line-strong bg-surface">
          {items.length === 0 && (
            <li className="px-5 py-4 text-sm text-ash">
              Nothing published yet. The site keeps its seed announcements for now.
            </li>
          )}
          {items.map((a, index) => (
            <AnnouncementRow
              key={a.id}
              item={a}
              index={index}
              count={items.length}
              dragging={dragId === a.id}
              saved={savedId === a.id}
              onDragStart={() => setDragId(a.id)}
              onDragEnd={() => setDragId(null)}
              onDrop={() => dropOn(a.id)}
              onMove={(dir) => move(a, dir)}
              onDelete={() => remove(a.id)}
              onSave={(patch, message) => save(a.id, patch, message)}
            />
          ))}
        </ul>
      </section>
    </div>
  )
}

/* Everything the console writes for one post, in the string form the inputs
   need. The video lives in Firestore as an ID; the field shows the watch URL
   so the admin can paste it straight back in. */
type AnnouncementDraft = {
  title: string
  date: string
  tag: AnnouncementTag
  description: string
  videoUrl: string
  href: string
}

const toDraft = (a: Announcement): AnnouncementDraft => ({
  title: a.title,
  date: a.date,
  tag: a.tag,
  description: a.description,
  videoUrl: a.videoId ? youtubeWatch(a.videoId) : '',
  href: a.href ?? '',
})

/* One published announcement, edited in place like a portfolio caption: each
   field saves on blur (or on change, for the type select) and only the changed
   fields are written, so an edit never clears the video or the link. */
function AnnouncementRow({
  item,
  index,
  count,
  dragging,
  saved,
  onDragStart,
  onDragEnd,
  onDrop,
  onMove,
  onDelete,
  onSave,
}: {
  item: Announcement
  index: number
  count: number
  dragging: boolean
  saved: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onDrop: () => void
  onMove: (dir: number) => void
  onDelete: () => void
  onSave: (patch: AnnouncementPatch, message: string) => void
}) {
  const [draft, setDraft] = useState<AnnouncementDraft>(() => toDraft(item))
  const [seed, setSeed] = useState<Announcement>(item)
  const [videoInvalid, setVideoInvalid] = useState(false)

  /* Re-seed the inputs when the row's stored copy changes: a save that landed,
     a reload, or a rejected write (which reloads, snapping the fields back to
     what Firestore actually holds). */
  if (item !== seed) {
    setSeed(item)
    setDraft(toDraft(item))
    setVideoInvalid(false)
  }

  const commit = (key: 'title' | 'date' | 'description' | 'href') => {
    const next = draft[key]
    if (next === (item[key] ?? '')) return
    const label =
      key === 'title'
        ? 'Title'
        : key === 'date'
          ? 'Date'
          : key === 'description'
            ? 'Description'
            : 'Link'
    onSave({ [key]: next }, `${label} saved.`)
  }

  const commitVideo = () => {
    const trimmed = draft.videoUrl.trim()
    const videoId = toVideoId(trimmed)
    if (trimmed && !videoId) {
      setVideoInvalid(true)
      return
    }
    setVideoInvalid(false)
    if ((videoId ?? '') === (item.videoId ?? '')) return
    onSave(
      { videoId: videoId ?? '' },
      videoId ? 'Video linked.' : 'Video removed.',
    )
  }

  const commitTag = (tag: AnnouncementTag) => {
    setDraft((d) => ({ ...d, tag }))
    if (tag === item.tag) return
    onSave({ tag }, `Type saved.`)
  }

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`px-4 py-4 transition-opacity ${
        dragging ? 'opacity-40' : ''
      } ${saved ? 'bg-gold-soft' : ''}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-1.5 shrink-0 cursor-grab text-faint active:cursor-grabbing"
          aria-hidden="true"
        >
          <DotsSixVertical size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <input
            value={draft.title}
            onChange={(e) =>
              setDraft((d) => ({ ...d, title: e.target.value }))
            }
            onBlur={() => commit('title')}
            onKeyDown={enterToBlur}
            aria-label="Title"
            placeholder="Title"
            className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 font-display text-base font-semibold text-ink outline-none hover:border-line-strong focus:border-gold/70 focus:bg-black"
          />

          <div className="mt-1 flex flex-wrap items-center gap-3 px-2">
            <select
              value={draft.tag}
              onChange={(e) => commitTag(e.target.value as AnnouncementTag)}
              aria-label="Type"
              className="rounded-full border border-line-strong bg-black px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold outline-none focus:border-gold/70"
            >
              {TAG_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              value={draft.date}
              onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
              onBlur={() => commit('date')}
              onKeyDown={enterToBlur}
              aria-label="Date shown on the card"
              placeholder="1 Sep 2026"
              className="w-32 rounded-lg border border-transparent bg-transparent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint outline-none hover:border-line-strong focus:border-gold/70 focus:bg-black focus:text-ink"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
              {item.videoId ? 'has video' : 'text only'}
            </span>
          </div>

          <textarea
            rows={2}
            value={draft.description}
            onChange={(e) =>
              setDraft((d) => ({ ...d, description: e.target.value }))
            }
            onBlur={() => commit('description')}
            aria-label="Short description"
            placeholder="Short description"
            className="mt-2 w-full resize-y rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm leading-relaxed text-ash outline-none hover:border-line-strong focus:border-gold/70 focus:bg-black focus:text-ink"
          />

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <VideoField
              value={draft.videoUrl}
              onChange={(videoUrl) => {
                setVideoInvalid(false)
                setDraft((d) => ({ ...d, videoUrl }))
              }}
              onCommit={commitVideo}
              invalid={videoInvalid}
              className=""
            />
            <IconField
              label="External link (optional)"
              icon={<LinkSimple size={16} className="text-gold" />}
              className=""
            >
              <input
                value={draft.href}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, href: e.target.value }))
                }
                onBlur={() => commit('href')}
                onKeyDown={enterToBlur}
                placeholder="Optional, for news without a video"
                aria-label="External link (optional)"
                className={bareInput}
              />
            </IconField>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
          {saved && (
            <span
              className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-gold"
              role="status"
            >
              <Check size={14} />
              Saved
            </span>
          )}
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => onMove(-1)}
              disabled={index === 0}
              aria-label="Move up"
              className="text-faint transition-colors hover:text-gold disabled:opacity-30"
            >
              <CaretUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => onMove(1)}
              disabled={index === count - 1}
              aria-label="Move down"
              className="text-faint transition-colors hover:text-gold disabled:opacity-30"
            >
              <CaretDown size={14} />
            </button>
          </div>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${item.title}`}
            className="rounded-full border border-line-strong p-2.5 text-ash transition-colors hover:border-gold/60 hover:text-gold"
          >
            <Trash size={15} />
          </button>
        </div>
      </div>
    </li>
  )
}

const TABS: { id: Tab; label: string; icon: Icon }[] = [
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'applications', label: 'Applications', icon: UsersThree },
  { id: 'portfolio', label: 'Portfolio', icon: Images },
  { id: 'awards', label: 'Awards', icon: Trophy },
]

function Manager() {
  const [tab, setTab] = useState<Tab>('announcements')

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Console
          </h1>
          <p className="mt-2 max-w-[60ch] text-sm text-ash">
            Publish announcements, review applications and curate the studio
            portfolio and the ADD Award strip.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void signOut()
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-err/50 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-err transition-colors hover:bg-err hover:text-white"
        >
          <SignOut size={14} />
          Sign out
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Console sections"
        className="mb-8 grid grid-cols-4 gap-1 rounded-2xl border border-line-strong bg-surface p-1.5"
      >
        {TABS.map((t) => {
          const Glyph = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                active
                  ? 'bg-gold text-black'
                  : 'text-ash hover:bg-surface-2 hover:text-ink'
              }`}
            >
              <Glyph size={15} weight={active ? 'fill' : 'regular'} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )
        })}
      </div>

      {tab === 'announcements' && <AnnouncementsPanel />}
      {tab === 'applications' && <LeadsPanel />}
      {tab === 'portfolio' && <PortfolioPanel />}
      {tab === 'awards' && <AwardsPanel />}
    </div>
  )
}

function LeadsPanel() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  const load = () => {
    fetchLeads()
      .then(setLeads)
      .catch(() => setNotice('Could not load applications'))
  }

  useEffect(() => {
    load()
  }, [])

  const remove = async (id: string) => {
    setBusyId(id)
    try {
      await deleteLead(id)
      setLeads((ls) => ls.filter((l) => l.id !== id))
      setNotice('Application deleted.')
    } catch {
      setNotice('Delete failed.')
    } finally {
      setBusyId(null)
    }
  }

  const formatDate = (iso: string) =>
    iso
      ? new Date(iso).toLocaleString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      : ''

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">
            Applications ({leads.length})
          </h2>
          <p className="mt-2 text-sm text-ash">
            Inquiries submitted through the contact form. Newest first — aim to
            call each one within two working days.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-gold/60 hover:text-gold"
        >
          <ArrowsClockwise size={14} />
          Refresh
        </button>
      </div>

      {notice && (
        <p className="mt-4 rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm text-gold">
          {notice}
        </p>
      )}

      <ul className="mt-4 divide-y divide-line-strong rounded-2xl border border-line-strong bg-surface">
        {leads.length === 0 && (
          <li className="px-5 py-4 text-sm text-ash">
            No applications yet. They will appear here as visitors submit the
            contact form.
          </li>
        )}
        {leads.map((l) => (
          <li key={l.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-ink">
                  {l.name || 'Unnamed'}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  {l.program} &middot; {formatDate(l.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(l.id)}
                disabled={busyId === l.id}
                aria-label={`Delete application from ${l.name}`}
                className="shrink-0 rounded-full border border-line-strong p-2.5 text-ash transition-colors hover:border-gold/60 hover:text-gold disabled:opacity-50"
              >
                <Trash size={15} />
              </button>
            </div>
            {l.phone && (
              <p className="mt-3 flex items-center gap-2 text-sm text-ink">
                <Phone size={14} className="text-gold" />
                <a
                  href={`tel:${l.phone}`}
                  className="text-gold underline-offset-4 hover:underline"
                >
                  {l.phone}
                </a>
              </p>
            )}
            {l.message && (
              <p className="mt-2 text-sm leading-relaxed text-ash">{l.message}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}