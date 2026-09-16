import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowsClockwise,
  LinkSimple,
  Phone,
  Trash,
  YoutubeLogo,
} from '@phosphor-icons/react'
import {
  createAnnouncement,
  deleteAnnouncement,
  deleteLead,
  fetchAnnouncements,
  fetchLeads,
  firebaseConfigured,
  signIn,
  signOut,
  type Lead,
} from '../lib/firebase'
import { useAuthStatus } from '../lib/useAdmin'
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
  const { pending, signedIn, isAdmin } = useAuthStatus()
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

  if (signedIn && !isAdmin) {
    return (
      <div className="rounded-2xl border border-line-strong bg-surface p-6">
        <h2 className="font-display text-xl font-semibold text-ink">No admin access</h2>
        <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-ash">
          This account is signed in but does not have admin privileges, so the
          console stays locked. If you should have access, add{' '}
          <code>users/&#123;uid&#125;</code> with <code>role: 'admin'</code> in
          Firestore or add the email to <code>VITE_ADMIN_EMAILS</code>.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/"
            className="rounded-full border border-line-strong px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-gold/60 hover:text-gold"
          >
            Back to site
          </Link>
          <button
            type="button"
            onClick={() => {
              void signOut()
              setEmail('')
              setPassword('')
            }}
            className="rounded-full border border-line-strong px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors hover:border-gold/60 hover:text-gold"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  if (signedIn && isAdmin) return <>{children}</>

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

      <LeadsPanel />

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
    <section className="mt-10">
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