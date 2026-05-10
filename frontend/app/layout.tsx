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
      <body className="bg-zinc-900 text-white">
        <div className="flex">
          <Sidebar />

          <div className="flex-1">
            <Header />

            <main className="p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}