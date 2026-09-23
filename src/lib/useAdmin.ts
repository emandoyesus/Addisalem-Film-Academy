import { useEffect, useState } from 'react'
import { firebaseConfigured, subscribeAuth } from './firebase'

export type AuthStatus = {
  pending: boolean
  signedIn: boolean
  isAdmin: boolean
}

/* /admin sets this flag when it mounts, seeding the navbar "Admin Portal"
   button instantly for this browser while the real auth check re-runs in the
   background. Ordinary visitors (no hint) never load the Firebase SDK. */
const HINT_KEY = 'af_admin'

function readHint(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(HINT_KEY) === '1'
}

function writeHint(value: boolean): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(HINT_KEY, value ? '1' : '0')
  } catch {
    /* storage unavailable — ignore */
  }
}

export function markAdminVisit(): void {
  writeHint(true)
}

const idle: AuthStatus = { pending: true, signedIn: false, isAdmin: false }

/* The console treats any signed-in email/password user as an administrator
   (matching the Firestore rules, which gate admin actions on `auth != null`),
   so `isAdmin` simply mirrors `signedIn` here. In lazy mode (the navbar) the
   hook only subscribes when this browser has entered /admin before. */
export function useAuthStatus(opts?: { lazy?: boolean }): AuthStatus {
  const [run] = useState(() => !(opts?.lazy ?? false) || readHint())
  const [seeded] = useState(() => (opts?.lazy ?? false) && readHint())
  const [status, setStatus] = useState<AuthStatus>(() => {
    if (!run) return { pending: false, signedIn: false, isAdmin: false }
    if (seeded) return { pending: false, signedIn: false, isAdmin: true }
    return idle
  })

  useEffect(() => {
    if (!run) return
    let cancelled = false
    let unsubAuth: (() => void) | undefined

    void (async () => {
      if (!(await firebaseConfigured())) {
        if (!cancelled)
          setStatus({ pending: false, signedIn: false, isAdmin: false })
        return
      }
      unsubAuth = await subscribeAuth((user) => {
        if (cancelled) return
        const signedIn = Boolean(user)
        setStatus({ pending: false, signedIn, isAdmin: signedIn })
      })
    })()

    return () => {
      cancelled = true
      unsubAuth?.()
    }
  }, [run])

  return status
}