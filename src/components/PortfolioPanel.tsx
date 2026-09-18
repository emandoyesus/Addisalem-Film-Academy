import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowsClockwise,
  CaretDown,
  CaretUp,
  Check,
  DotsSixVertical,
  Trash,
  UploadSimple,
} from '@phosphor-icons/react'
import {
  cloudinaryConfigured,
  deletePortfolioItem,
  fetchPortfolio,
  savePortfolioOrder,
  updatePortfolioCaption,
  uploadPortfolioImage,
  type PortfolioItem,
} from '../lib/firebase'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

/* Admin panel for the public "Studio portfolio" section. The owner picks an
   image (a Photoshop/Illustrator export or a photo), gives it a caption, and
   publishes it. Existing items can be re-ordered by dragging or with the
   arrows, re-captioned in place, and deleted. */
export function PortfolioPanel() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [notice, setNotice] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)
  const [cloudReady, setCloudReady] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef('')

  useEffect(() => {
    void cloudinaryConfigured().then(setCloudReady)
  }, [])

  const load = () => {
    void fetchPortfolio()
      .then(setItems)
      .catch(() => setNotice('Could not load portfolio images'))
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    },
    [],
  )

  const pick = (next: File | null) => {
    setNotice('')
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = ''
    if (next && !ALLOWED.includes(next.type)) {
      setNotice('Use a JPG, PNG or WebP image.')
      setFile(null)
      setPreview('')
      return
    }
    setFile(next)
    if (next) {
      const url = URL.createObjectURL(next)
      previewRef.current = url
      setPreview(url)
    } else {
      setPreview('')
    }
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (cloudReady === false) {
      setNotice('Cloudinary is not configured. Add the cloud name and upload preset first.')
      return
    }
    if (!file) {
      setNotice('Choose an image first.')
      return
    }
    setBusy(true)
    setProgress(0)
    try {
      const order = items.length
        ? Math.max(...items.map((i) => i.order)) + 1
        : 0
      const created = await uploadPortfolioImage(file, caption, order, setProgress)
      setItems((prev) => [...prev, created])
      pick(null)
      setCaption('')
      if (inputRef.current) inputRef.current.value = ''
      setNotice('Uploaded. It is live in the Studio portfolio section.')
    } catch {
      setNotice('Upload failed. Check the Cloudinary preset and the console error.')
    } finally {
      setBusy(false)
      setProgress(0)
    }
  }

  const persist = (next: PortfolioItem[]) => {
    void savePortfolioOrder(next).catch(() =>
      setNotice('Could not save the new order.'),
    )
  }

  const move = (index: number, dir: number) => {
    setItems((prev) => {
      const next = [...prev]
      const to = index + dir
      if (to < 0 || to >= next.length) return prev
      ;[next[index], next[to]] = [next[to], next[index]]
      persist(next)
      return next
    })
  }

  const drop = (targetId: string) => {
    const sourceId = dragId
    setDragId(null)
    if (!sourceId || sourceId === targetId) return
    setItems((prev) => {
      const from = prev.findIndex((i) => i.id === sourceId)
      const to = prev.findIndex((i) => i.id === targetId)
      if (from === -1 || to === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      persist(next)
      return next
    })
  }

  const remove = async (item: PortfolioItem) => {
    if (!window.confirm(`Delete "${item.caption || 'this image'}"? This cannot be undone.`))
      return
    try {
      await deletePortfolioItem(item)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      setNotice('Deleted.')
    } catch {
      setNotice('Delete failed.')
    }
  }

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">
            Studio portfolio ({items.length})
          </h2>
          <p className="mt-2 text-sm text-ash">
            Upload the poster art, illustration and photos shown in the public
            portfolio section. JPG, PNG or WebP.
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

      {cloudReady === false && (
        <p className="mt-4 rounded-xl border border-gold/40 bg-surface px-4 py-3 text-sm text-ash">
          Image hosting is not set up yet. Add{' '}
          <code className="text-gold">VITE_CLOUDINARY_CLOUD_NAME</code> and{' '}
          <code className="text-gold">VITE_CLOUDINARY_UPLOAD_PRESET</code> to{' '}
          <code>/.env</code> (and Vercel) to enable uploads — see the README.
        </p>
      )}

      <form
        onSubmit={submit}
        className="mt-4 rounded-2xl border border-line-strong bg-surface p-6"
      >
        <div className="grid gap-5 sm:grid-cols-[160px_1fr]">
          <label className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-line-strong bg-black text-center transition-colors hover:border-gold/60">
            {preview ? (
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-2 px-4 text-ash">
                <UploadSimple size={22} className="text-gold" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                  Choose image
                </span>
              </span>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED.join(',')}
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0] ?? null)}
            />
          </label>

          <div>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Caption
              </span>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Poster design, 2026 intake"
                className="mt-2 w-full rounded-xl border border-line-strong bg-black px-4 py-3 text-sm text-ink outline-none placeholder:text-faint focus:border-gold/70"
              />
            </label>
            <button
              type="submit"
              disabled={busy || !file || cloudReady === false}
              className="mt-4 w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy ? `Uploading ${progress}%` : 'Upload to portfolio'}
            </button>
            {busy && (
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black">
                <div
                  className="h-full rounded-full bg-gold transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </form>

      <ul className="mt-4 divide-y divide-line-strong rounded-2xl border border-line-strong bg-surface">
        {items.length === 0 && (
          <li className="px-5 py-4 text-sm text-ash">
            Nothing uploaded yet. The public portfolio section stays hidden until
            the first image is added.
          </li>
        )}
        {items.map((item, index) => (
          <PortfolioRow
            key={item.id}
            item={item}
            index={index}
            count={items.length}
            dragging={dragId === item.id}
            onDragStart={() => setDragId(item.id)}
            onDragEnd={() => setDragId(null)}
            onDrop={() => drop(item.id)}
            onMove={move}
            onDelete={() => remove(item)}
          />
        ))}
      </ul>
    </section>
  )
}

function PortfolioRow({
  item,
  index,
  count,
  dragging,
  onDragStart,
  onDragEnd,
  onDrop,
  onMove,
  onDelete,
}: {
  item: PortfolioItem
  index: number
  count: number
  dragging: boolean
  onDragStart: () => void
  onDragEnd: () => void
  onDrop: () => void
  onMove: (index: number, dir: number) => void
  onDelete: () => void
}) {
  const [draft, setDraft] = useState(item.caption)
  const [saved, setSaved] = useState(false)

  const commit = () => {
    const clean = draft.trim()
    if (clean === item.caption) return
    void updatePortfolioCaption(item.id, clean).then(() => {
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    })
  }

  return (
    <li
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={`flex items-center gap-3 px-4 py-3 transition-opacity ${
        dragging ? 'opacity-40' : ''
      }`}
    >
      <span
        className="cursor-grab text-faint active:cursor-grabbing"
        aria-hidden="true"
      >
        <DotsSixVertical size={18} />
      </span>
      <img
        src={item.url}
        alt=""
        className="h-12 w-12 shrink-0 rounded-lg border border-line object-cover"
      />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
        }}
        aria-label="Image caption"
        placeholder="Caption"
        className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-sm text-ink outline-none hover:border-line-strong focus:border-gold/70 focus:bg-black"
      />
      {saved && <Check size={14} className="shrink-0 text-gold" />}
      <div className="flex shrink-0 flex-col">
        <button
          type="button"
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          aria-label="Move up"
          className="text-faint transition-colors hover:text-gold disabled:opacity-30"
        >
          <CaretUp size={14} />
        </button>
        <button
          type="button"
          onClick={() => onMove(index, 1)}
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
        aria-label="Delete image"
        className="shrink-0 rounded-full border border-line-strong p-2.5 text-ash transition-colors hover:border-gold/60 hover:text-gold"
      >
        <Trash size={15} />
      </button>
    </li>
  )
}
