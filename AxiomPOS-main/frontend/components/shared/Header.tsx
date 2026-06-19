"use client"

import { useEffect, useState } from "react"
import { authStore } from "@/store/auth.store"

export default function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(authStore.getSnapshot().user)
    return authStore.subscribe(() => {
      setUser(authStore.getSnapshot().user)
    })
  }, [])

  const handleLogout = () => {
    authStore.logout()
  }

  return (
    <header className="h-20 border-b border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md flex items-center justify-between px-8">
      <h2 className="text-lg font-bold text-white tracking-wide">
        Terminal de Control
      </h2>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-zinc-100 font-semibold text-sm">{user?.username || "Usuario"}</div>
          <div className="text-indigo-400 text-xs uppercase tracking-wider font-bold">{user?.role || "cajero"}</div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-red-950/30 border border-zinc-800 hover:border-red-900/50 text-zinc-400 hover:text-red-400 text-xs font-bold rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
        >
          Salir
        </button>
      </div>
    </header>
  )
}