import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authStore } from "@/store/auth.store"

export function useAuth(requireAuth = true) {
  const router = useRouter()
  const [auth, setAuth] = useState({
    token: null as string | null,
    user: null as any,
    isAuthenticated: false,
    loading: true
  })

  useEffect(() => {
    // Initial load from client
    const snapshot = authStore.getSnapshot()
    setAuth({
      token: snapshot.token,
      user: snapshot.user,
      isAuthenticated: snapshot.isAuthenticated,
      loading: false
    })

    const unsubscribe = authStore.subscribe(() => {
      const snap = authStore.getSnapshot()
      setAuth({
        token: snap.token,
        user: snap.user,
        isAuthenticated: snap.isAuthenticated,
        loading: false
      })
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!auth.loading) {
      if (requireAuth && !auth.isAuthenticated) {
        router.push("/login")
      } else if (!requireAuth && auth.isAuthenticated) {
        router.push("/dashboard")
      }
    }
  }, [auth.isAuthenticated, auth.loading, requireAuth, router])

  return auth
}
