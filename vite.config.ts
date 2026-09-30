import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { portfolioMeta, siteUrl } from './src/data/content.ts'

const ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/portfolio', changefreq: 'weekly', priority: '0.7' },
]

function sitemap(): Plugin {
  return {
    name: 'afa-sitemap',
    apply: 'build',
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = ROUTES.map(
        (route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
      ).join('\n')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
      })
    },
  }
}

/* Serves /portfolio with its own meta tags already in the HTML. Every route in
   this SPA gets the same index.html, so without this a crawler fetching
   /portfolio reads the home page's canonical and treats the route as a
   duplicate. The runtime equivalent is usePageMeta in src/lib/usePageMeta.ts;
   both read portfolioMeta so the two can't disagree. */
function prerenderPortfolio(): Plugin {
  return {
    name: 'afa-prerender-portfolio',
    apply: 'build',
    closeBundle() {
      const outDir = resolve('dist')
      const url = `${siteUrl}/portfolio`
      const { title, description } = portfolioMeta
      let html = readFileSync(resolve(outDir, 'index.html'), 'utf8')

      const swaps: [RegExp, string][] = [
        [/<title>[^<]+<\/title>/, `<title>${title}</title>`],
        [
          /<meta name="description"[^>]*>/,
          `<meta name="description" content="${description}" />`,
        ],
        [
          /<link rel="canonical"[^>]*>/,
          `<link rel="canonical" href="${url}" />`,
        ],
        [
          /<meta property="og:url"[^>]*>/,
          `<meta property="og:url" content="${url}" />`,
        ],
        [
          /<meta property="og:title"[^>]*>/,
          `<meta property="og:title" content="${title}" />`,
        ],
        [
          /<meta property="og:description"[^>]*>/,
          `<meta property="og:description" content="${description}" />`,
        ],
        [
          /<meta name="twitter:title"[^>]*>/,
          `<meta name="twitter:title" content="${title}" />`,
        ],
        [
          /<meta name="twitter:description"[^>]*>/,
          `<meta name="twitter:description" content="${description}" />`,
        ],
      ]

      for (const [pattern, replacement] of swaps) {
        if (!pattern.test(html)) {
          this.warn(`portfolio prerender: no tag matched ${pattern}`)
        }
        html = html.replace(pattern, replacement)
      }

      writeFileSync(resolve(outDir, 'portfolio.html'), html)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap(), prerenderPortfolio()],
})