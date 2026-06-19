"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { authStore } from "@/store/auth.store"

const links = [
  { name: "Dashboard", href: "/dashboard", role: "any" },
  { name: "Terminal POS", href: "/pos", role: "any" },
  { name: "Inventario", href: "/inventory", role: "any" },
  { name: "Historial Ventas", href: "/sales", role: "any" },
  { name: "Usuarios", href: "/users", role: "admin" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [role, setRole] = useState<string>("cashier")

  useEffect(() => {
    setRole(authStore.getSnapshot().user?.role || "cashier")
    return authStore.subscribe(() => {
      setRole(authStore.getSnapshot().user?.role || "cashier")
    })
  }, [])

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between p-6 select-none">
      <div>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
            A
          </div>
          <span className="text-xl font-extrabold text-white tracking-wider bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            AxiomPOS
          </span>
        </div>

        <nav className="space-y-1.5">
          {links
            .filter(link => link.role === "any" || link.role === role)
            .map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    active
                      ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500"
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
        </nav>
      </div>

      <div className="text-zinc-600 text-xs px-2 border-t border-zinc-900 pt-4 text-center">
        AxiomPOS v1.0.0
      </div>
    </aside>
  )
}