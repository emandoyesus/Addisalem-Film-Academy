import { useEffect } from 'react'
import { siteDescription, siteUrl } from '../data/content'

export type PageMeta = {
  title: string
  /** Falls back to the site-wide description from content.ts. */
  description?: string
  /** Path on the canonical origin, e.g. '/' or '/portfolio'. */
  path: string
}

/* Every route in this SPA is served the same index.html, so the home page's
   static canonical tag is what crawlers see on /portfolio too — and a
   "canonical -> home page" tag on a sub-route tells Google to drop that page
   as a duplicate. Overriding the tags per route after render is what keeps
   each page's own identity. The revert function restores (or removes) exactly
   what it touched, so navigating back to the home page is clean. */
export function applyPageMeta({ title, description, path }: PageMeta) {
  const url = `${siteUrl}${path}`
  const desc = description ?? siteDescription
  const added: Element[] = []
  const revert: (() => void)[] = []

  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    const existing = document.head.querySelector<HTMLMetaElement>(
      `meta[${attr}="${key}"]`,
    )
    const tag = existing ?? document.createElement('meta')
    if (!existing) {
      tag.setAttribute(attr, key)
      document.head.appendChild(tag)
      added.push(tag)
    } else {
      const before = tag.content
      revert.push(() => {
        tag.content = before
      })
    }
    tag.content = content
  }

  const previousTitle = document.title
  document.title = title

  setMeta('name', 'description', desc)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', desc)
  setMeta('property', 'og:url', url)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', desc)

  const existingCanonical =
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  const canonical = existingCanonical ?? document.createElement('link')
  if (!existingCanonical) {
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
    added.push(canonical)
  } else {
    const before = canonical.href
    revert.push(() => {
      canonical.href = before
    })
  }
  canonical.href = url

  return () => {
    document.title = previousTitle
    revert.forEach((undo) => undo())
    added.forEach((el) => el.remove())
  }
}

export function usePageMeta(meta: PageMeta) {
  const { title, description, path } = meta
  useEffect(() => applyPageMeta({ title, description, path }), [
    title,
    description,
    path,
  ])
}