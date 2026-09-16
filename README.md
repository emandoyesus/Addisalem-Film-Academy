# Addisalem Film Training Center — website

Public landing page + a private admin console for the Addisalem Film Training Center (Dessie, Ethiopia). Visitors can read programs and announcements and apply to enroll; applications are saved to Firestore and trigger an email notification to the owner.

## Stack

- React 19 + Vite + TypeScript + Tailwind CSS 4
- Firebase (Firestore) — applications, announcements, admin auth
- EmailJS — enrollment notification emails
- Deployed on Vercel

## For the site owner

### Where applications go

Every time someone submits the contact form:

1. The application is saved to the Firestore **`leads`** collection (name, phone, program, message, timestamp).
2. An email is sent to the address configured in the **EmailJS template** (usually the owner's inbox).

### Admin console

Open **`/admin`** (e.g. `https://<site>/admin`) and sign in with the email/password user created in **Firebase Console → Authentication → Users**.

From the console you can:

- **Applications** — see every enrollment (newest first), tap a phone number to call it, and delete handled ones. Refreshed from Firestore.
- **Announcements** — publish a YouTube link or external link-driven news post shown on the homepage; manage and delete published items.

### Changing site text, phones, hours

All copy lives in one file: **`src/data/content.ts`**. That includes the phone numbers, address, opening hours, email, programs, and announcements, e.g. `site.phone`, `site.email`, `programs`, `announcements`.

## Developer setup

```bash
npm install
npm run dev        # local dev server
npm run build      # production build (outputs dist/)
npm run typecheck
npm run lint
```

### Environment variables

Copy `.env.example` to `.env` and fill in:

- **Firebase** keys (Firebase Console → Project Settings → General → Your apps → web app).
- **EmailJS** values (EmailJS dashboard): the Service ID, Template ID (its "To email" must be the notification recipient), and the Public Key.

The build also needs these three EmailJS variables on the hosting platform (Vercel: *Settings → Environment Variables*) — they are **not** committed to the repo.

### Firebase setup

- **Firestore rules**: deploy the contents of `firestore.rules` (Firebase Console → Firestore Database → Rules). Public visitors may only create leads and read announcements; admins read/delete leads and write announcements.
- **Authentication**: enable Email/Password and create one admin user.
- **Firestore collections**: created on first use (`leads`, `announcements`). No Firestore billing beyond the project plan is required; email sending uses EmailJS, not Firebase (Firebase Extensions such as Trigger Email are not used).

### Notification emails

Emails are sent client-side via EmailJS (`src/lib/notify.ts`). Configuration steps live in `src/lib/notify.ts` and `.env.example`. For production, enable **Access Management → Lock domains** in EmailJS and add the production URL so nobody can reuse the public keys from another site.

### Deployment

Vercel builds from the repo automatically. Make sure the **VITE_FIREBASE_*** and **VITE_EMAILJS_*** variables exist in the Vercel project settings and redeploy after changing them.

## File map

| Path | Purpose |
| --- | --- |
| `src/data/content.ts` | All site copy: contacts, hours, programs, announcements, nav |
| `src/pages/Admin.tsx` | `/admin` login, applications, announcement manager |
| `src/lib/firebase.ts` | Firebase layer: leads, announcements, auth |
| `src/lib/notify.ts` | EmailJS enrollment notification |
| `firestore.rules` | Firestore security rules (mirror in the console) |