/* Runs after `vite build`: renders each route with react-dom/server and writes
   the result over dist/, so the deployed HTML already contains the page copy.
   Kept out of vite.config.ts on purpose — the client build and this step are
   separate builds, and a plugin would fire in both.

   The media-query stub has to be installed *before* the SSR bundle is imported.
   Motion reads `typeof window` once at module-evaluation time to decide whether
   it is in a browser, and `prefers-reduced-motion` once per hook call. Left
   alone it would render the animated branch and stamp `style="opacity:0"` onto
   the hero, leaving the most important heading on the page invisible in the
   served HTML. Reporting reduced motion here makes the prerender emit resting,
   visible markup instead.

   Only matchMedia and the listener methods resolve on the stub; every other
   property is undefined, so nothing can mistake it for a real measurement (and
   react-dom/server's canUseDOM check still sees no document). The browser never
   runs any of this — the client bundle mounts with createRoot and animates
   normally. */
const matchMedia = (query) => ({
  media: query,
  /* Motion asks for the bare "(prefers-reduced-motion)" form rather than
     ": reduce", so match the feature however it is spelled. */
  matches: /prefers-reduced-motion/.test(query),
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
})

const noop = () => {}

/* The SSR bundle is a production build; say so, or react/motion take their
   development branches (including a reduced-motion console warning). */
process.env.NODE_ENV ??= 'production'

globalThis.matchMedia = matchMedia
globalThis.window = new Proxy(
  {
    matchMedia,
    addEventListener: noop,
    removeEventListener: noop,
    addListener: noop,
    removeListener: noop,
    dispatchEvent: () => false,
  },
  { get: (target, prop) => target[prop] },
)

const { prerenderRoutes, renderDocument, renderSitemap } = await import(
  '../dist-ssr/entry-server.js'
)
const { readFileSync, writeFileSync } = await import('node:fs')

const template = readFileSync('dist/index.html', 'utf8')

for (const route of prerenderRoutes) {
  const html = renderDocument(route, template)
  writeFileSync(`dist/${route.file}`, html)
  console.log(
    `prerendered ${route.url} -> dist/${route.file} (${(html.length / 1024).toFixed(1)} kB)`,
  )
}

writeFileSync('dist/sitemap.xml', renderSitemap())
console.log(`wrote dist/sitemap.xml (${prerenderRoutes.length} urls)`)