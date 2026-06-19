export interface User {
  id: number
  username: string
  email: string
  role: string
}

type Listener = () => void

let listeners: Listener[] = []
let currentToken: string | null = null
let currentUser: User | null = null

// Server-safe initializer
if (typeof window !== "undefined") {
  currentToken = localStorage.getItem("axiom_token")
  const savedUser = localStorage.getItem("axiom_user")
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser)
    } catch (_) {}
  }
}

function notify() {
  listeners.forEach(l => l())
}

export const authStore = {
  subscribe(listener: Listener) {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  },

  getSnapshot() {
    return {
      token: currentToken,
      user: currentUser,
      isAuthenticated: !!currentToken
    }
  },

  login(token: string, user: User) {
    currentToken = token
    currentUser = user
    if (typeof window !== "undefined") {
      localStorage.setItem("axiom_token", token)
      localStorage.setItem("axiom_user", JSON.stringify(user))
    }
    notify()
  },

  logout() {
    currentToken = null
    currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("axiom_token")
      localStorage.removeItem("axiom_user")
    }
    notify()
  }
}
