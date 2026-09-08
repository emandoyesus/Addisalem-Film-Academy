import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, LinkSimple, Trash, YoutubeLogo } from '@phosphor-icons/react'
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  firebaseConfigured,
  signIn,
  signOut,
  subscribeAuth,
} from '../lib/firebase'
import {
  toVideoId,
  youtubeThumb,
  type Announcement,
  type AnnouncementTag,
} from '../data/content'

const TAG_OPTIONS: AnnouncementTag[] = ['Sitcom', 'Edit', 'News']

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
  tag: 'Sitcom',
  description: '',
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black text-ink">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-gold-soft font-mono text-xs font-semibold text-gold">
              AF
            </span>
            <div>
              <p className="font-display text-sm font-semibold leading-none text-ink">
                Addisalem
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Announcement console
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-gold/60 hover:text-gold"
          >
            <ArrowLeft size={14} />
            Back to site
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-10">
        <LoginGate>
          <Manager />
        </LoginGate>
      </main>
    </div>
  )
}

function LoginGate({ children }: { children: ReactNode }) {
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let unsub: (() => void) | undefined
    let cancelled = false
    void (async () => {
      const ok = await firebaseConfigured()
      if (cancelled) return
      setConfigured(ok)
      if (ok) {
        unsub = await subscribeAuth((user) => {
          if (!cancelled) setAuthed(Boolean(user))
        })
      }
    })()
    return () => {
      cancelled = true
      unsub?.()
    }
  }, [])

  if (configured === null) {
    return <p className="text-sm text-ash">Checking configuration...</p>
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

  if (authed) return <>{children}</>

  return (
    <form
      className="rounded-2xl border border-line-strong bg-surface p-6"
      onSubmit={(e) => {
        e.preventDefault()
        setBusy(true)
        setError('')
        signIn(email, password)
          .then(() => setAuthed(true))
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

function Manager() {
  const [items, setItems] = useState<Announcement[]>([])
  const [form, setForm] = useState<FormState>(emptyForm)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  const load = () => {
    void fetchAnnouncements()
      .then(setItems)
      .catch(() => setNotice('Could not load announcements'))
  }

  useEffect(() => {
    load()
  }, [])

  const videoId = toVideoId(form.videoUrl)
  const previewSrc = videoId ? youtubeThumb(videoId) : ''

  const submit = (e: FormEvent) => {
    e.preventDefault()
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

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Manage announcements
          </h1>
          <p className="mt-2 text-sm text-ash">
            Paste a YouTube link to publish it. Newest becomes the featured card.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            void signOut()
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-gold/60 hover:text-gold"
        >
          Sign out
        </button>
      </div>

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

        <label className="mt-5 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            YouTube link
          </span>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-line-strong bg-black px-4 py-3 focus-within:border-gold/70">
            <YoutubeLogo size={16} className="text-gold" />
            <input
              value={form.videoUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, videoUrl: e.target.value }))
              }
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
            />
          </div>
        </label>
        {previewSrc && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={previewSrc}
              alt=""
              className="h-16 w-28 rounded-lg border border-line object-cover"
            />
            <p className="font-mono text-[11px] text-gold">Video ID: {videoId}</p>
          </div>
        )}

        <label className="mt-5 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            Title
          </span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-line-strong bg-black px-4 py-3 text-sm text-ink outline-none focus:border-gold/70"
          />
        </label>

        <label className="mt-5 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            Type
          </span>
          <select
            value={form.tag}
            onChange={(e) =>
              setForm((f) => ({ ...f, tag: e.target.value as AnnouncementTag }))
            }
            className="mt-2 w-full rounded-xl border border-line-strong bg-black px-4 py-3 text-sm text-ink outline-none focus:border-gold/70"
          >
            {TAG_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            Short description
          </span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="mt-2 w-full rounded-xl border border-line-strong bg-black px-4 py-3 text-sm text-ink outline-none focus:border-gold/70"
          />
        </label>

        <label className="mt-5 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            External link (optional)
          </span>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-line-strong bg-black px-4 py-3 focus-within:border-gold/70">
            <LinkSimple size={16} className="text-gold" />
            <input
              value={form.href}
              onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
              placeholder="Optional, for news without a video"
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-faint"
            />
          </div>
        </label>

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
          Published ({items.length})
        </h2>
        <ul className="mt-4 divide-y divide-line-strong rounded-2xl border border-line-strong bg-surface">
          {items.length === 0 && (
            <li className="px-5 py-4 text-sm text-ash">
              Nothing published yet. The site keeps its seed announcements for now.
            </li>
          )}
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-ink">
                  {a.title}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                  {a.tag} &middot; {a.date}
                  {a.videoId ? ' &middot; has video' : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(a.id)}
                aria-label={`Delete ${a.title}`}
                className="shrink-0 rounded-full border border-line-strong p-2.5 text-ash transition-colors hover:border-gold/60 hover:text-gold"
              >
                <Trash size={15} />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}