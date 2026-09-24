import { useEffect, useState } from 'react'
import { fetchGallery, firebaseConfigured } from './firebase'
import { cloudinaryUrl } from './responsive'
import { gallery as staticGallery, img } from '../data/content'

/* A rendered Gallery slide — full-size lightbox source, the strip tile, the
   featured captions and whether portraits should be letterboxed instead of
   cropped. */
export type GallerySlide = {
  key: string
  full: string
  tile: string
  caption: string
  contain: boolean
}

/* The bundled award photos act as the strip until the owner manages the ADD
   Award from the console (edits, uploads or reorders are stored in Firestore
   and take over from the first save). */
const staticSlides: GallerySlide[] = staticGallery.map((g) => ({
  key: g.id,
  full: g.id.startsWith('/') ? g.id : img(g.id, 2400, 80),
  tile: g.src ?? img(g.id, 900, 75),
  caption: g.caption,
  contain: Boolean(g.contain),
}))

export function useGallery(): GallerySlide[] {
  const [slides, setSlides] = useState<GallerySlide[]>(staticSlides)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        if (!(await firebaseConfigured())) return
        const remote = await fetchGallery()
        if (cancelled || remote.length === 0) return
        setSlides(
          remote.map((item) => ({
            key: item.id,
            full: item.url,
            tile: cloudinaryUrl(item.url, 900),
            caption: item.caption || 'ADD Award',
            contain: item.contain !== false,
          })),
        )
      } catch {
        /* Keep the bundled strip when Firestore is unreachable. */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return slides
}