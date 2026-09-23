import { useEffect, useState } from 'react'
import {
  firebaseConfigured,
  subscribeAdminState,
  subscribeAuth,
} from './firebase'

export type AuthStatus = {
  pending: boolean
  signedIn: boolean
  isAdmin: boolean
}

/* The /admin page sets this flag the moment it mounts, so the navbar "Admin
   Portal" button shows for any browser that has entered /admin (readAdminHint).
   Auth/role gating still happens inside the /admin page itself. */

const HINT_KEY = 'af_admin'

function readHint(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(HINT_KEY) === '1'
}

/* The navbar reads this flag directly — once a browser has entered /admin it
   keeps showing the "Admin Portal" button; nothing on the site clears it. */
export function readAdminHint(): boolean {
  return readHint()
}

function writeHint(isAdmin: boolean): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(HINT_KEY, isAdmin ? '1' : '0')
  } catch {
    /* storage unavailable — ignore */
  }
}

/* Called from the /admin page as soon as it mounts so the navbar "Admin
   Portal" button reliably shows for anyone who entered /admin in the URL. */
export function markAdminVisit(): void {
  writeHint(true)
}

const idle: AuthStatus = { pending: true, signedIn: false, isAdmin: false }

export function useAuthStatus(opts?: { lazy?: boolean }): AuthStatus {
  // lazy mode (navbar) only subscribes to Firebase when this browser was
  // previously an admin, so ordinary visitors never download the SDK.
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
    let unsubRole: (() => void) | undefined

    void (async () => {
      if (!(await firebaseConfigured())) {
        if (!cancelled) setStatus({ pending: false, signedIn: false, isAdmin: false })
        return
      }
      unsubAuth = await subscribeAuth((user) => {
        if (cancelled) return
        setStatus((s) => ({ ...s, signedIn: Boolean(user) }))
      })
      unsubRole = await subscribeAdminState((isAdmin) => {
        if (cancelled) return
        writeHint(isAdmin)
        setStatus((s) => ({ ...s, isAdmin, pending: false }))
      })
    })()

    return () => {
      cancelled = true
      unsubAuth?.()
      unsubRole?.()
    }
  }, [run])

  return status
}