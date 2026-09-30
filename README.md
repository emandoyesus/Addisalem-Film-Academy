# Addisalem Film Academy — website

Public site for the Addisalem Film Academy (Dessie, Ethiopia): a landing page, a standalone studio portfolio page, and a private admin console. Visitors can read programs and announcements and apply to enroll; applications are saved to Firestore and trigger an email notification to the owner.

| Route | What it serves |
| --- | --- |
| `/` | Landing page — hero, programs, facilities, awards strip, announcements, portfolio preview, contact form |
| `/portfolio` | The full studio collection, in the order the studio arranged it |
| `/admin` | Private console — announcements, applications, portfolio, awards (sign-in required) |

Live at **https://www.addisalemfilms.com** (`www` is the canonical host; the apex domain redirects there).

## Stack

- React 19 + Vite 8 + TypeScript + Tailwind CSS 4
- React Router 7 — three routes, all prerendered at build time
- Firebase (Firestore + Auth) — applications, announcements, awards gallery, portfolio metadata, admin sign-in
- Cloudinary (free tier) — portfolio and awards image hosting (no Firebase Storage billing)
- EmailJS — enrollment notification emails
- Motion — entrance animations, all gated on `prefers-reduced-motion`
- oxlint + `tsc` for lint and typecheck
- Deployed on Vercel (`vercel.json`)

## For the site owner

### Where applications go

Every time someone submits the contact form:

1. The application is saved to the Firestore **`leads`** collection (name, phone, program, message, server timestamp).
2. An email is sent to the address configured in the **EmailJS template** (usually the owner's inbox).

Leads are never shown to the public and are only readable from `/admin`.

### Admin console

Open **`/admin`** and sign in with an email/password user from **Firebase Console → Authentication → Users**.

Anyone who can sign in is an administrator — the same rule the Firestore rules enforce, so the console and the database agree. Don't create Firebase users for other people; every account you create can read and delete applications and edit the site content. Signed-out visitors simply get the sign-in form (they are never redirected).

The navbar's "Admin Portal" link appears for any browser that has visited `/admin` since the last sign-out.

Four tabs:

- **Announcements** — publish up to 4 posts (delete one to add another). Each has a title, an auto-stamped date, a category tag (Showcase & Portfolio, Education & Tips, Social Proof & Stories, Behind-the-Scenes, Academy Updates & Ads), a description, an optional YouTube link that renders as an embedded thumbnail/player, and an optional external link. Drag or use the arrows to re-order; delete to remove. Posts show in the homepage feed in the order set here.
- **Applications** — every enrollment, newest first, with the chosen program and message. Tap a phone number to call it, delete handled ones.
- **Awards** — the ADD Award photo strip on the homepage. One click imports the seven bundled photos, then you can upload new ones, re-caption, re-order (drag or arrows) and delete. Until the first save, the homepage shows the photos shipped in the repo.
- **Studio portfolio** — upload poster art, illustration and photos (JPG, PNG or WebP — export Adobe files first), give each a caption, re-order by dragging (or the arrows), re-caption in place, and delete. Images are hosted free on **Cloudinary**; only URLs, captions and order are saved in Firestore. They appear in the homepage preview (the first three, with a "See more work" link) and in full on `/portfolio`, in the order shown here.

Awards and portfolio uploads both need the Cloudinary variables below; the panels say so inline if they're missing.

### Changing site text, phones, hours

All copy lives in one file: **`src/data/content.ts`** — phone numbers, address, hours, email, programs, facilities, stories, awards photos, announcements, nav links and socials (`site`, `programs`, `announcements`, `gallery`, `navLinks`, …).

Search metadata lives there too: `siteUrl` (the canonical origin), `siteDescription` and `portfolioMeta` (title + description for `/portfolio`). Keep `siteDescription` in sync with the static copy in `index.html`, which cannot import from TypeScript.

Structured data (address, phone, opening hours, geo) is generated from the same file in `src/components/StructuredData.tsx`, so a change there updates the JSON-LD too.

## Developer setup

```bash
npm install
npm run dev        # local dev server
npm run build      # client build + SSR build + prerender (see below)
npm run preview    # serve the built dist/
npm run typecheck
npm run lint
npm run og         # regenerate public/og-image.png (needs Chromium)
```

### How the build produces the served HTML

The site is an SPA, but crawlers should not depend on Google running the bundle, so `npm run build` runs three steps:

1. `vite build` — the client bundle into `dist/`, using `index.html` as the template.
2. `vite build --ssr src/entry-server.tsx --outDir dist-ssr` — a server bundle for build-time rendering.
3. `node scripts/prerender.mjs` — renders `/`, `/portfolio` and `/admin` with `react-dom/server`, writes them over `dist/index.html`, `dist/portfolio.html` and `dist/admin.html` (each with its own title, description, canonical and OG tags), then writes `dist/sitemap.xml` and a `noindex` `dist/404.html`.

To add a route: register it in `prerenderRoutes` (`src/entry-server.tsx`), and if it needs a cache-busting entry, add a rewrite in `vercel.json`. Note that `Admin.tsx` is the only code-split route; anything prerendered must stay in the main bundle, or the prerender will emit its Suspense fallback instead of the page.

### Environment variables

Copy `.env.example` to `.env` and fill in:

- **Firebase** — `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` (Firebase Console → Project Settings → General → Your apps → web app).
- **Cloudinary** (free tier) — `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`. Needed by the portfolio and awards uploads.
- **EmailJS** — `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID` (its "To email" must be the notification recipient), `VITE_EMAILJS_PUBLIC_KEY`.

All of these are **baked into the client bundle** at build time, so they must also exist in the Vercel project settings (*Settings → Environment Variables*) and the site must be redeployed after changing them. Nothing secret belongs here: the Firebase web config, the Cloudinary upload preset and the EmailJS public key are all designed to be public.

`VITE_ADMIN_EMAILS` is still listed in `.env.example` and `src/vite-env.d.ts` but is no longer read by the app — access is decided by Firebase Auth alone. Safe to delete.

### Firebase setup

- **Firestore rules**: deploy the contents of `firestore.rules` (Firebase Console → Firestore Database → Rules). Visitors may only create leads and read announcements, the portfolio and the awards gallery; any signed-in user may read/delete leads and write the three content collections; users may read only their own `users/{uid}` document, and nobody may write roles from the client.
- **Authentication**: enable the Email/Password provider and create one user per person who needs the console. Do not enable any other sign-in method — those accounts are not covered by the rules or the console's expectations.
- **Firestore collections**: created on first use (`leads`, `announcements`, `portfolio`, `gallery`). No Firebase billing is required: email goes through EmailJS and images through Cloudinary, not Firebase Storage.
- **Seeds**: with no Firestore data the site still ships the announcements and award photos from `content.ts`, so a fresh clone renders a complete page.

### Cloudinary setup (free image hosting)

Firebase Cloud Storage needs the paid Blaze plan, so uploaded images are hosted on Cloudinary's free tier instead. Image bytes never touch Firebase; only the URL, caption and order are stored in Firestore.

1. Create a free account at <https://cloudinary.com>.
2. Copy the **Cloud name** from the dashboard → `VITE_CLOUDINARY_CLOUD_NAME`.
3. **Settings → Upload → Add upload preset**; set **Signing mode: Unsigned**, restrict **Format** to `jpg,png,webp` (and optionally a max file size / incoming transformation), then copy the preset name → `VITE_CLOUDINARY_UPLOAD_PRESET`.
4. Add both variables to `.env` locally and to the Vercel project settings, then redeploy.

The preset is public by design (that is what makes browser uploads possible), so keep it locked down with the format/size restrictions above. Deletion uses the one-time `delete_token` Cloudinary returns for unsigned uploads, so no API secret is shipped in the site.

### Notification emails

Emails are sent client-side via EmailJS (`src/lib/notify.ts`); variable names are documented in `.env.example`. If the variables are missing, applications are still saved to Firestore — only the email is skipped. For production, enable **Access Management → Lock domains** in EmailJS and add the production URL so nobody can reuse the public keys from another site.

### SEO and how the site is served

- Each route is prerendered with its own title, description, canonical, OG and Twitter tags. The same values are re-applied on client navigation by `src/lib/usePageMeta.ts`, so the served HTML and the live tabs cannot drift.
- `robots.txt` disallows `/admin` and points at the build-time `sitemap.xml`; `/admin` and the 404 page are also served `noindex`.
- `LocalBusiness` JSON-LD (address, E.164 phone, opening hours, geo, socials) is built from `content.ts`.
- `public/og-image.png` is a 1200x630 card rendered from `scripts/og-card.html` by `npm run og` using headless Chromium (`CHROME_PATH` overrides the binary). It is committed, so re-run that script only when the card design changes.

### Deployment

Vercel builds from the repo automatically with `npm run build` and serves `dist/`. `vercel.json` rewrites `/portfolio` and `/admin` to their prerendered `.html` files and sets cache headers (hashed assets immutable for a year, images revalidated daily, HTML not cached). Make sure the Vercel project has the VITE_ variables from `.env.example` and redeploy after changing them.

## File map

| Path | Purpose |
| --- | --- |
| `index.html` | Document template and the default meta/OG/canonical tags |
| `src/data/content.ts` | All site copy plus `siteUrl`, `siteDescription`, `portfolioMeta` |
| `src/App.tsx` | Route table and landing page section order |
| `src/entry-server.tsx` | Prerender routes, per-route meta swaps, sitemap generation |
| `src/pages/PortfolioPage.tsx` | `/portfolio` |
| `src/pages/Admin.tsx` | `/admin` sign-in, tabs, announcements manager, applications list |
| `src/components/AwardsPanel.tsx` | Admin upload / caption / order / delete for the awards strip |
| `src/components/PortfolioPanel.tsx` | Admin upload / caption / order / delete for the portfolio |
| `src/components/Portfolio.tsx` | Public portfolio preview on the home page + the shared grid |
| `src/components/Gallery.tsx` | Public awards strip with lightbox |
| `src/components/StructuredData.tsx` | LocalBusiness JSON-LD |
| `src/lib/firebase.ts` | Firestore + Auth + Cloudinary layer (leads, announcements, portfolio, gallery) |
| `src/lib/useAdmin.ts` | Auth status hook behind the console and the navbar link |
| `src/lib/usePageMeta.ts` | Client-side per-route title/description/canonical |
| `src/lib/useGallery.ts` / `usePortfolio.ts` | Firestore data with bundled fallbacks |
| `src/lib/notify.ts` | EmailJS enrollment notification |
| `src/lib/motion.ts`, `useMediaQuery.ts` | Shared variants and the reduced-motion gate |
| `scripts/prerender.mjs` | Renders every route into `dist/`, writes `sitemap.xml` and `404.html` |
| `scripts/og-image.mjs`, `og-card.html` | Social preview card generator |
| `vercel.json` | Rewrites and cache headers |
| `firestore.rules` | Firestore security rules (mirror in the console) |
