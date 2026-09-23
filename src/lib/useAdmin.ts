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

/* localStorage hint: a returning admin gets the navbar "Admin Portal" button
   immediately while the real auth/role check re-runs in the background, instead
   of waiting for the lazy Firebase SDK + auth roundtrip. Non-admins clear it. */

const HINT_KEY = 'af_admin'

function readHint(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(HINT_KEY) === '1'
}

function writeHint(isAdmin: boolean): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(HINT_KEY, isAdmin ? '1' : '0')
  } catch {
    /* storage unavailable — ignore */
  }
}

/* Called from the /admin page as soon as it mounts (before any auth/role
   roundtrip) so the navbar "Admin Portal" button reliably shows for anyone
   who has entered /admin in the URL. The real role check later keeps it for
   admins and clears it for everyone else. */
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