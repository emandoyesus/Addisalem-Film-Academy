import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { portfolioMeta, siteDescription, siteUrl } from './data/content'

/* Build-time rendering. Every route in this app is served the same document,
   which left crawlers with an empty <div id="root"> and every word of the site
   dependent on Google executing the bundle. Rendering the real React tree into
   the HTML at build time puts the copy, headings, addresses and program names
   in the markup itself.
   Two things make this work cleanly:
     - Entrance animations are gated on useMediaQuery, which reports false
       without a window, so the prerender comes out at rest and visible rather
       than stuck at opacity:0.
     - Portfolio images and announcements come from Firestore at runtime, so the
       prerender carries the headings and fallback copy and the live data fills
       in on the client. */

type RouteMeta = { title: string; description: string }

export type PrerenderRoute = {
  /** Path as the browser sees it. */
  url: string
  /** File written inside dist/. */
  file: string
  meta: RouteMeta
  changefreq: string
  priority: string
  /** False for private routes: served with noindex and left out of the sitemap. */
  indexable?: boolean
}

export const prerenderRoutes: PrerenderRoute[] = [
  {
    url: '/',
    file: 'index.html',
    meta: { title: 'Addisalem Film Academy · Dessie', description: siteDescription },
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    url: '/portfolio',
    file: 'portfolio.html',
    meta: portfolioMeta,
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    /* Prerendered precisely so it stops falling back to the home document, which
       would hand /admin the home page's canonical. Admin itself is lazy-loaded,
       so this serves its loader shell marked noindex, and robots.txt already
       disallows the path. */
    url: '/admin',
    file: 'admin.html',
    meta: { title: 'Admin · Addisalem Film Academy', description: 'Private.' },
    changefreq: 'never',
    priority: '0.0',
    indexable: false,
  },
]

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/* Vite's HTML minifier keeps long tags wrapped across lines, so every pattern
   here has to tolerate whitespace between attributes. */
const metaByName = (value: string) =>
  new RegExp(`<meta\\s+name="${value}"[^>]*>`, 'i')
const metaByProperty = (value: string) =>
  new RegExp(`<meta\\s+property="${value}"[^>]*>`, 'i')

/* The same tags src/lib/usePageMeta swaps on the client, applied to the served
   HTML so a crawler sees them without running any JavaScript. Both read the
   same values from content.ts, so they cannot drift. */
export function applyMeta(html: string, route: PrerenderRoute): string {
  const url = `${siteUrl}${route.url}`
  const { title, description } = route.meta

  const swaps: [RegExp, string][] = [
    [/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`],
    [metaByName('description'), `<meta name="description" content="${escapeAttr(description)}" />`],
    [
      /<link\s+rel="canonical"[^>]*>/i,
      route.indexable === false
        ? '<meta name="robots" content="noindex, nofollow" />'
        : `<link rel="canonical" href="${escapeAttr(url)}" />`,
    ],
    [
      metaByProperty('og:url'),
      `<meta property="og:url" content="${escapeAttr(url)}" />`,
    ],
    [metaByProperty('og:title'), `<meta property="og:title" content="${escapeAttr(title)}" />`],
    [
      metaByProperty('og:description'),
      `<meta property="og:description" content="${escapeAttr(description)}" />`,
    ],
    [metaByName('twitter:title'), `<meta name="twitter:title" content="${escapeAttr(title)}" />`],
    [
      metaByName('twitter:description'),
      `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    ],
  ]

  for (const [pattern, replacement] of swaps) {
    if (!pattern.test(html)) {
      throw new Error(`prerender: index.html has no tag matching ${pattern}`)
    }
    html = html.replace(pattern, replacement)
  }

  return html
}

const ROOT = '<div id="root"></div>'

export function renderDocument(route: PrerenderRoute, template: string): string {
  if (!template.includes(ROOT)) {
    throw new Error(`prerender: template is missing ${ROOT}`)
  }

  const body = renderToString(
    <StaticRouter location={route.url}>
      <App />
    </StaticRouter>,
  )

  return applyMeta(template, route).replace(ROOT, `<div id="root">${body}</div>`)
}

/* Google ignores <priority> and <changefreq>; <lastmod> is the only freshness
   signal it uses, so it is stamped at build time. */
export function renderSitemap(routes: PrerenderRoute[] = prerenderRoutes): string {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = routes
    .filter((route) => route.indexable !== false)
    .map(
      (route) => `  <url>
    <loc>${siteUrl}${route.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}