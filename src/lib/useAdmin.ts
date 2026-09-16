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

const idle: AuthStatus = { pending: true, signedIn: false, isAdmin: false }

export function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>(idle)

  useEffect(() => {
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
        setStatus((s) => ({ ...s, isAdmin, pending: false }))
      })
    })()

    return () => {
      cancelled = true
      unsubAuth?.()
      unsubRole?.()
    }
  }, [])

  return status
}