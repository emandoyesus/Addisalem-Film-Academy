import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  ArrowsClockwise,
  CaretDown,
  CaretUp,
  Check,
  DotsSixVertical,
  Plus,
  Trash,
  UploadSimple,
  X,
} from '@phosphor-icons/react'
import {
  cloudinaryConfigured,
  deleteGalleryItem,
  fetchGallery,
  saveGalleryOrder,
  seedAwardGallery,
  updateGalleryCaption,
  uploadGalleryImage,
  type GalleryItem,
} from '../lib/firebase'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

/* Admin panel for the ADD Award photos in the home Gallery strip. The owner
   can import the current seven bundled photos in one click, upload new ones,
   rename, re-order (arrows or drag) and delete — all live, no deploy. */
export function AwardsPanel() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [batch, setBatch] = useState({ done: 0, total: 0 })
  const [notice, setNotice] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)
  const [cloudReady, setCloudReady] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previewRef = useRef<string[]>([])

  useEffect(() => {
    void cloudinaryConfigured().then(setCloudReady)
  }, [])

  useEffect(() => {
    previewRef.current = previews
  }, [previews])

  useEffect(
    () => () => {
      previewRef.current.forEach((url) => URL.revokeObjectURL(url))
    },
    [],
  )

  const load = () => {
    void fetchGallery()
      .then(setItems)
      .catch(() => setNotice('Could not load the award photos'))
  }

  useEffect(() => {
    load()
  }, [])

  const pick = (list: FileList | null) => {
    setNotice('')
    if (!list || list.length === 0) return
    const incoming = Array.from(list)
    const good = incoming.filter((f) => ALLOWED.includes(f.type))
    const skipped = incoming.length - good.length
    if (good.length === 0) {
      setNotice('Use a JPG, PNG or WebP image.')
      return
    }
    setFiles((prev) => [...prev, ...good])
    setPreviews((prev) => [...prev, ...good.map((f) => URL.createObjectURL(f))])
    if (inputRef.current) inputRef.current.value = ''
    if (skipped > 0) setNotice(`${skipped} file skipped — use JPG, PNG or WebP.`)
  }

  const clearFiles = () => {
    previews.forEach((url) => URL.revokeObjectURL(url))
    setFiles([])
    setPreviews([])
  }

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (cloudReady === false) {
      setNotice('Cloudinary is not configured. Add the cloud name and upload preset first.')
      return
    }
    if (files.length === 0) {
      setNotice('Choose at least one image first.')
      return
    }
    setBusy(true)
    setProgress(0)
    setBatch({ done: 0, total: files.length })
    try {
      const startOrder = items.length
        ? Math.max(...items.map((i) => i.order)) + 1
        : 0
      const created: GalleryItem[] = []
      for (let i = 0; i < files.length; i++) {
        setBatch({ done: i, total: files.length })
        const item = await uploadGalleryImage(files[i], caption, startOrder + i, (p) => {
          setProgress(Math.round(((i + p / 100) / files.length) * 100))
        })
        created.push(item)
      }
      setItems((prev) => [...prev, ...created])
      clearFiles()
      setCaption('')
      setNotice(
        created.length === 1
          ? 'Uploaded. It is live in the ADD Award strip.'
          : `${created.length} photos uploaded. They are live in the ADD Award strip.`,
      )
    } catch {
      setNotice('Upload failed. Check the Cloudinary preset and the console error.')
    } finally {
      setBusy(false)
      setProgress(0)
      setBatch({ done: 0, total: 0 })
    }
  }

  const persist = (next: GalleryItem[]) => {
    void saveGalleryOrder(next).catch(() => setNotice('Could not save the new order.'))
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

  const remove = async (item: GalleryItem) => {
    if (!window.confirm(`Delete "${item.caption || 'this photo'}"? This cannot be undone.`))
      return
    try {
      await deleteGalleryItem(item)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      setNotice('Deleted.')
    } catch {
      setNotice('Delete failed.')
    }
  }

  const seed = async () => {
    if (items.length > 0) return
    if (
      !window.confirm(
        'Import the seven current ADD Award photos so you can edit them here?',
      )
    )
      return
    setBusy(true)
    setNotice('')
    try {
      const count = await seedAwardGallery()
      setNotice(`${count} award photos imported. You can now edit them any time.`)
    } catch {
      setNotice('Import failed. Check the console error.')
    } finally {
      setBusy(false)
      load()
    }
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">
            ADD Award photos ({items.length})
          </h2>
          <p className="mt-2 text-sm text-ash">
            The yearly award strip on the home page. Edit the captions, drag to
            re-order, delete or add photos. JPG, PNG or WebP.
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

      {items.length === 0 && (
        <div className="mt-4 rounded-2xl border border-gold/40 bg-surface px-5 py-4">
          <p className="text-sm text-ash">
            There are no award photos saved in Firestore yet. The home page is
            still showing the bundled photos.
          </p>
          <button
            type="button"
            onClick={seed}
            disabled={busy}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <UploadSimple size={14} />
            {busy ? 'Importing...' : 'Import the seven current photos'}
          </button>
        </div>
      )}

      {notice && (
        <p className="mt-4 rounded-xl border border-line-strong bg-surface px-4 py-3 text-sm text-gold">
          {notice}
        </p>
      )}

      {cloudReady === false && (
        <p className="mt-4 rounded-xl border border-gold/40 bg-surface px-4 py-3 text-sm text-ash">
          Image hosting is not set up yet. Add{' '}
          <code className="text-gold">VITE_CLOUDINARY_CLOUD_NAME</code> and{' '}
          <code className="text-gold">VITE_CLOUDINARY_UPLOAD_PRESET</code> to
          <code>/.env</code> (and Vercel) to enable uploads — see the README.
        </p>
      )}

      <form
        onSubmit={submit}
        className="mt-4 rounded-2xl border border-line-strong bg-surface p-6"
      >
        <div className="grid gap-5 sm:grid-cols-[220px_1fr]">
          <div>
            {previews.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {previews.map((url, i) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-line"
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label="Remove image"
                      className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-ash transition-colors hover:text-gold"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-line-strong text-ash transition-colors hover:border-gold/60 hover:text-gold">
                  <Plus size={18} />
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ALLOWED.join(',')}
                    multiple
                    className="hidden"
                    onChange={(e) => pick(e.target.files)}
                  />
                </label>
              </div>
            ) : (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-line-strong bg-black text-center transition-colors hover:border-gold/60">
                <span className="flex flex-col items-center gap-2 px-4 text-ash">
                  <UploadSimple size={22} className="text-gold" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                    Choose photos
                  </span>
                </span>
                <input
                  ref={inputRef}
                  type="file"
                  accept={ALLOWED.join(',')}
                  multiple
                  className="hidden"
                  onChange={(e) => pick(e.target.files)}
                />
              </label>
            )}
          </div>

          <div>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Caption (applies to every file)
              </span>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Best actor of the year"
                className="mt-2 w-full rounded-xl border border-line-strong bg-black px-4 py-3 text-sm text-ink outline-none placeholder:text-faint focus:border-gold/70"
              />
            </label>
            {previews.length > 0 && (
              <p className="mt-3 font-mono text-[11px] text-gold">
                {previews.length} photo{previews.length > 1 ? 's' : ''} ready
              </p>
            )}
            <button
              type="submit"
              disabled={busy || files.length === 0 || cloudReady === false}
              className="mt-4 w-full rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {busy
                ? batch.total > 1
                  ? `Uploading ${batch.done + 1}/${batch.total} · ${progress}%`
                  : `Uploading ${progress}%`
                : files.length > 1
                  ? `Upload ${files.length} photos`
                  : 'Upload photo'}
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
            Nothing here yet. Import the current photos or upload your own — the
            home Gallery strip follows this list.
          </li>
        )}
        {items.map((item, index) => (
          <AwardRow
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

function AwardRow({
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
  item: GalleryItem
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
  const [seeded, setSeeded] = useState(item.caption)
  const [saved, setSaved] = useState(false)

  if (item.caption !== seeded) {
    setSeeded(item.caption)
    setDraft(item.caption)
  }

  const commit = () => {
    const clean = draft.trim()
    if (clean === item.caption) return
    void updateGalleryCaption(item.id, clean).then(() => {
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
      <span className="cursor-grab text-faint active:cursor-grabbing" aria-hidden="true">
        <DotsSixVertical size={18} />
      </span>
      <img
        src={cloudinaryThumb(item.url)}
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
        aria-label="Award caption"
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
        aria-label="Delete photo"
        className="shrink-0 rounded-full border border-line-strong p-2.5 text-ash transition-colors hover:border-gold/60 hover:text-gold"
      >
        <Trash size={15} />
      </button>
    </li>
  )
}

/* Tiny visual check in the admin list — a 200px-wide Cloudinary render. */
function cloudinaryThumb(url: string): string {
  return url.replace(
    /\/image\/upload\//,
    '/image/upload/f_auto,q_auto,w_200,c_limit/',
  )
}