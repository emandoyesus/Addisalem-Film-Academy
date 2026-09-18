import type {
  Auth as AuthType,
  User as AuthUser,
  UserCredential,
} from 'firebase/auth'
import type {
  Firestore,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import type { Announcement } from '../data/content'

export type { UserCredential }

/* Lazily-loaded Firebase layer. The firebase SDK is bundled separately and only
   fetched by the admin page, keeping it out of the public bundle that every
   visitor must download. */

async function loadFirebase(): Promise<{
  auth: AuthType
  db: Firestore
}> {
  const { initializeApp } = await import('firebase/app')
  const { getAuth } = await import('firebase/auth')
  const { getFirestore } = await import('firebase/firestore')
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
  const app = initializeApp(config)
  const auth = getAuth(app)
  const db = getFirestore(app)
  return { auth, db }
}

function assertConfig() {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    throw new Error(
      'Firebase not configured. Copy .env.example to .env and paste your web-app keys.',
    )
  }
}

export async function firebaseConfigured(): Promise<boolean> {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY)
}

export async function signIn(
  email: string,
  password: string,
): Promise<UserCredential> {
  assertConfig()
  const { auth } = await loadFirebase()
  const { signInWithEmailAndPassword } = await import('firebase/auth')
  return signInWithEmailAndPassword(auth, email, password)
}

export async function signOut(): Promise<void> {
  const { auth } = await loadFirebase()
  await (await import('firebase/auth')).signOut(auth)
}

export async function subscribeAuth(
  onUser: (user: AuthUser | null) => void,
): Promise<() => void> {
  const { auth } = await loadFirebase()
  const { onAuthStateChanged } = await import('firebase/auth')
  return onAuthStateChanged(auth, onUser)
}

/* Admin resolution — a signed-in user is an admin when either:
   - their Firestore document `users/{uid}` has `role: "admin"`, or
   - their auth email is in the VITE_ADMIN_EMAILS allowlist (comma-separated).
   The doc is read via rules restricted to the user's own uid, so another
   client can't read/write roles. */

const adminEmails: string =
  (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? ''

export async function subscribeAdminState(
  onChange: (isAdmin: boolean) => void,
): Promise<() => void> {
  const { auth, db } = await loadFirebase()
  const { onAuthStateChanged } = await import('firebase/auth')
  const { doc, onSnapshot } = await import('firebase/firestore')
  const allowlist = adminEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  let unsubRole: (() => void) | undefined
  const unsubAuth = onAuthStateChanged(auth, (user) => {
    unsubRole?.()
    unsubRole = undefined
    if (!user) {
      onChange(false)
      return
    }
    const emailOk = Boolean(
      user.email && allowlist.includes(user.email.toLowerCase()),
    )
    unsubRole = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      onChange(emailOk || snap.data()?.role === 'admin')
    })
  })
  return () => {
    unsubAuth()
    unsubRole?.()
  }
}

const announcementFromDoc = (
  doc: QueryDocumentSnapshot<Record<string, unknown>>,
): Announcement => {
  const d = doc.data()
  return {
    id: doc.id,
    title: String(d.title ?? 'Untitled'),
    date: String(d.date ?? ''),
    tag: (d.tag === 'Sitcom' || d.tag === 'Edit' || d.tag === 'News' ? d.tag : 'News'),
    description: String(d.description ?? ''),
    videoId: typeof d.videoId === 'string' && d.videoId ? d.videoId : undefined,
    href: typeof d.href === 'string' && d.href ? d.href : undefined,
  }
}

export async function fetchAnnouncements(): Promise<Announcement[]> {
  assertConfig()
  const { db } = await loadFirebase()
  const { collection, query, orderBy, getDocs } = await import('firebase/firestore')
  const snap = await getDocs(
    query(collection(db, 'announcements'), orderBy('createdAt', 'desc')),
  )
  return snap.docs.map(announcementFromDoc)
}

export async function createAnnouncement(
  input: Omit<Announcement, 'id'>,
): Promise<Announcement> {
  const { db } = await loadFirebase()
  const {
    addDoc,
    collection,
    serverTimestamp,
  } = await import('firebase/firestore')
  const ref = await addDoc(collection(db, 'announcements'), {
    title: input.title,
    date: input.date,
    tag: input.tag,
    description: input.description,
    videoId: input.videoId ?? '',
    href: input.href ?? '',
    createdAt: serverTimestamp(),
  })
  return { ...input, id: ref.id }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  assertConfig()
  const { db } = await loadFirebase()
  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, 'announcements', id))
}

export type LeadInput = {
  name: string
  phone: string
  program: string
  message: string
}

export async function createLead(input: LeadInput): Promise<void> {
  assertConfig()
  const { db } = await loadFirebase()
  const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
  await addDoc(collection(db, 'leads'), {
    name: input.name.trim(),
    phone: input.phone.trim(),
    program: input.program,
    message: input.message.trim(),
    createdAt: serverTimestamp(),
  })
}

export type Lead = {
  id: string
  name: string
  phone: string
  program: string
  message: string
  createdAt: string
}

const leadFromDoc = (
  doc: QueryDocumentSnapshot<Record<string, unknown>>,
): Lead => {
  const d = doc.data()
  const raw = d.createdAt as { toDate?: () => Date } | undefined
  return {
    id: doc.id,
    name: String(d.name ?? ''),
    phone: String(d.phone ?? ''),
    program: String(d.program ?? ''),
    message: String(d.message ?? ''),
    createdAt:
      raw && typeof raw.toDate === 'function' ? raw.toDate().toISOString() : '',
  }
}

export async function fetchLeads(): Promise<Lead[]> {
  assertConfig()
  const { db } = await loadFirebase()
  const { collection, query, orderBy, getDocs } = await import('firebase/firestore')
  const snap = await getDocs(
    query(collection(db, 'leads'), orderBy('createdAt', 'desc')),
  )
  return snap.docs.map(leadFromDoc)
}

export async function deleteLead(id: string): Promise<void> {
  assertConfig()
  const { db } = await loadFirebase()
  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, 'leads', id))
}

/* Portfolio — owner-uploaded artwork and photos (Photoshop / Illustrator
   exports, set photography). Image files are hosted on Cloudinary's free
   tier via an unsigned upload preset; the returned URL plus the caption and
   order live in the free Firestore `portfolio` collection. The order field is
   authoritative: the public site sorts by it. No Firebase billing needed. */

export type PortfolioItem = {
  id: string
  url: string
  publicId: string
  deleteToken?: string
  caption: string
  order: number
}

const cloudinaryConfig = () => ({
  cloud: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined,
  preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined,
})

export async function cloudinaryConfigured(): Promise<boolean> {
  const { cloud, preset } = cloudinaryConfig()
  return Boolean(cloud && preset)
}

/* Public read uses the Firestore REST endpoint instead of the SDK, so the
   landing page stays free of the ~500 KB Firebase bundle that the admin
   console loads on demand. The `portfolio` collection is world-readable per
   firestore.rules; writes below still go through the SDK as the signed-in
   admin. */
export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined
  if (!projectId || !apiKey) return []
  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${projectId}` +
    `/databases/(default)/documents/portfolio` +
    `?pageSize=100&orderBy=order&key=${apiKey}`
  const res = await fetch(endpoint)
  if (!res.ok) throw new Error(`Portfolio request failed (${res.status})`)
  const json = (await res.json()) as {
    documents?: {
      name: string
      fields?: Record<
        string,
        { stringValue?: string; integerValue?: string; doubleValue?: number }
      >
    }[]
  }
  return (json.documents ?? [])
    .map((doc) => {
      const f = doc.fields ?? {}
      return {
        id: doc.name.split('/').pop() ?? '',
        url: f.url?.stringValue ?? '',
        publicId: f.publicId?.stringValue ?? '',
        deleteToken: f.deleteToken?.stringValue || undefined,
        caption: f.caption?.stringValue ?? '',
        order: Number(f.order?.integerValue ?? f.order?.doubleValue ?? 0),
      }
    })
    .filter((item) => item.url)
}

type CloudinaryUpload = {
  secure_url: string
  public_id: string
  delete_token?: string
}

/* Uploads straight from the browser to Cloudinary with an unsigned preset.
   XHR (not fetch) is used so the progress bar can report bytes transferred. */
export async function uploadPortfolioImage(
  file: File,
  caption: string,
  order: number,
  onProgress?: (percent: number) => void,
): Promise<PortfolioItem> {
  assertConfig()
  const { cloud, preset } = cloudinaryConfig()
  if (!cloud || !preset) {
    throw new Error('Cloudinary is not configured (cloud name / upload preset).')
  }
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', preset)
  const result = await new Promise<CloudinaryUpload>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloud}/image/upload`)
    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as CloudinaryUpload)
        } catch {
          reject(new Error('Unexpected Cloudinary response.'))
        }
      } else {
        reject(new Error(`Cloudinary upload failed (${xhr.status}).`))
      }
    }
    xhr.onerror = () => reject(new Error('Cloudinary upload failed.'))
    xhr.send(form)
  })
  const clean = caption.trim()
  const { db } = await loadFirebase()
  const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
  const docRef = await addDoc(collection(db, 'portfolio'), {
    url: result.secure_url,
    publicId: result.public_id,
    deleteToken: result.delete_token ?? '',
    caption: clean,
    order,
    createdAt: serverTimestamp(),
  })
  return {
    id: docRef.id,
    url: result.secure_url,
    publicId: result.public_id,
    deleteToken: result.delete_token,
    caption: clean,
    order,
  }
}

export async function updatePortfolioCaption(
  id: string,
  caption: string,
): Promise<void> {
  assertConfig()
  const { db } = await loadFirebase()
  const { doc, updateDoc } = await import('firebase/firestore')
  await updateDoc(doc(db, 'portfolio', id), { caption: caption.trim() })
}

export async function savePortfolioOrder(
  items: Pick<PortfolioItem, 'id'>[],
): Promise<void> {
  assertConfig()
  const { db } = await loadFirebase()
  const { doc, writeBatch } = await import('firebase/firestore')
  const batch = writeBatch(db)
  items.forEach((item, index) => {
    batch.update(doc(db, 'portfolio', item.id), { order: index })
  })
  await batch.commit()
}

export async function deletePortfolioItem(item: PortfolioItem): Promise<void> {
  assertConfig()
  const { cloud } = cloudinaryConfig()
  /* Unsigned uploads return a one-time delete token; use it to remove the
     asset from Cloudinary. If it is missing, the asset is left in place and
     only the Firestore entry is removed. */
  if (cloud && item.deleteToken) {
    try {
      const form = new FormData()
      form.append('token', item.deleteToken)
      await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/delete_by_token`,
        { method: 'POST', body: form },
      )
    } catch {
      /* Ignore; the Firestore record below is what drives the site. */
    }
  }
  const { db } = await loadFirebase()
  const { doc, deleteDoc } = await import('firebase/firestore')
  await deleteDoc(doc(db, 'portfolio', item.id))
}