import { useEffect, useState } from 'react'
import { firebaseConfigured, subscribeAuth } from './firebase'

export type AuthStatus = {
  pending: boolean
  signedIn: boolean
  isAdmin: boolean
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