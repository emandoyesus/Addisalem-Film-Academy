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
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
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