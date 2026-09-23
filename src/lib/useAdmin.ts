import { useEffect, useState } from 'react'
import { firebaseConfigured, subscribeAuth } from './firebase'

export type AuthStatus = {
  pending: boolean
  signedIn: boolean
  isAdmin: boolean
}

/* /admin writes this flag the moment it mounts so the navbar keeps showing the
   "Admin Portal" button for this browser afterwards (see readAdminHint). */
const HINT_KEY = 'af_admin'

function readHint(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(HINT_KEY) === '1'
}

export function readAdminHint(): boolean {
  return readHint()
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

/* The console treats any signed-in email/password user as an administrator.
   This mirrors the Firestore rules, which already gate every admin action on
   `request.auth != null`, so there is no separate role check on the client. */
export function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>(idle)

  useEffect(() => {
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
  }, [])

  return status
}