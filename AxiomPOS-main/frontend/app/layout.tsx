"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import "./globals.css"
import Sidebar from "@/components/shared/Sidebar"
import Header from "@/components/shared/Header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  
  // Protect all pages except /login
  const auth = useAuth(!isLoginPage)

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wider uppercase">Cargando AxiomPOS...</p>
        </div>
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="p-8 flex-1 bg-zinc-900/30">
          {children}
        </main>
      </div>
    </div>
  )
}