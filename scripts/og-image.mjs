/* Renders scripts/og-card.html to a 1200x630 PNG with headless Chromium.
   Facebook and LinkedIn both want at least 1200x630 for the large-image card;
   the old og:image was a 640x640 logo, which crops to a thumbnail.

   Chromium is already on the machine and screenshotting it avoids pulling in a
   native image library just to draw text. Run via `npm run og`; the output lands
   in public/og-image.png, which the build then copies into dist/.

   Fonts are inlined as file:// URLs rather than data URIs: a variable woff2 is
   ~30-60 KB and base64 would bloat the template past anything reasonable to
   keep in the repo. */
import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const CHROME = process.env.CHROME_PATH ?? 'chromium'
const WIDTH = 1200
const HEIGHT = 630
const OUT = join(root, 'public/og-image.png')

const fontDir = 'node_modules/@fontsource-variable'
/* Only the latin subset — the card sets no Amharic glyphs, and pulling in the
   cyrillic/greek/vietnamese cuts keeps the render fast. */
const fonts = {
  FONT_DISPLAY: `file://${join(root, fontDir, 'space-grotesk/files/space-grotesk-latin-wght-normal.woff2')}`,
  FONT_MONO: `file://${join(root, fontDir, 'jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}`,
}

const dataUri = (path, mime) => `data:${mime};base64,${readFileSync(path).toString('base64')}`

const parts = {
  HERO: dataUri(join(root, 'public/media/hero-2.jpg'), 'image/jpeg'),
  LOGO: dataUri(join(root, 'public/favicon.png'), 'image/png'),
  ...fonts,
}

for (const [name, path] of Object.entries(parts)) {
  if (name.startsWith('FONT_') && !existsSync(path.replace('file://', ''))) {
    throw new Error(`og: font not found at ${path}`)
  }
}

let html = readFileSync(join(root, 'scripts/og-card.html'), 'utf8')
for (const [token, value] of Object.entries(parts)) {
  html = html.replaceAll(token, value)
}
if (/HERO|LOGO|FONT_DISPLAY|FONT_MONO/.test(html)) {
  throw new Error('og: template still has an unreplaced placeholder')
}

/* Chromium's snap build cannot write into /tmp, so give it a profile it owns. */
const profile = mkdtempSync(join(process.env.HOME ?? tmpdir(), 'og-card-'))
const shot = join(profile, 'card.png')

writeFileSync(join(profile, 'card.html'), html)

try {
  execFileSync(
    CHROME,
    [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${WIDTH},${HEIGHT}`,
      `--user-data-dir=${profile}`,
      // Let the variable fonts finish loading before the frame is captured.
      '--virtual-time-budget=6000',
      `--screenshot=${shot}`,
      `file://${join(profile, 'card.html')}`,
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  )

  writeFileSync(OUT, readFileSync(shot))
  const { size } = statSync(OUT)
  if (size < 5000) throw new Error(`og: render looks empty (${size} bytes)`)
  console.log(`wrote public/og-image.png (${WIDTH}x${HEIGHT}, ${(size / 1024).toFixed(1)} kB)`)
} finally {
  rmSync(profile, { recursive: true, force: true })
}
