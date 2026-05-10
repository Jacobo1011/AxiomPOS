"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "POS", href: "/pos" },
  { name: "Inventory", href: "/inventory" },
  { name: "Sales", href: "/sales" },
  { name: "Users", href: "/users" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 h-screen p-6">
      <h1 className="text-2xl font-bold text-white mb-10">
        AxiomPOS
      </h1>

      <nav className="space-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 rounded-lg transition ${
              pathname === link.href
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}