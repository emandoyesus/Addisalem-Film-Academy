import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/* Keep in sync with SITE_URL in src/data/content.ts. The apex domain
   308-redirects to www, so www is the canonical host. */
const SITE_URL = 'https://www.addisalemfilms.com'

/* Crawlable, indexable routes only. /admin is private (see robots.txt). */
const ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/portfolio', changefreq: 'weekly', priority: '0.7' },
]

/* Google ignores <priority> and <changefreq>; <lastmod> is the only freshness
   signal it uses, so stamping it at build time keeps it honest without anyone
   remembering to edit a file by hand. */
function sitemap(): Plugin {
  return {
    name: 'afa-sitemap',
    apply: 'build',
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = ROUTES.map(
        (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
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

export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap()],
})