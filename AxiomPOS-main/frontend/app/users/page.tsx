"use client"

import { useEffect, useState } from "react"
import { authStore } from "@/store/auth.store"
import { useAuth } from "@/hooks/useAuth"

type User = {
  id: number
  username: string
  email: string
  role: string
}

export default function UsersPage() {
  // Enforce authentication
  const auth = useAuth()
  
  const [users, setUsers] = useState<User[]>([])
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)

  const fetchUsers = async () => {
    const token = authStore.getSnapshot().token
    if (!token) return

    try {
      const res = await fetch("http://127.0.0.1:8000/users/", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("No tienes permisos de Administrador para ver esta sección")
        }
        throw new Error("Error al obtener la lista de usuarios")
      }

      const data = await res.json()
      setUsers(data)
    } catch (err: any) {
      setListError(err.message)
    }
  }

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role === "admin") {
      fetchUsers()
    }
  }, [auth.isAuthenticated, auth.user])

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setFormSuccess(null)

    if (!username || !email || !password) {
      setFormError("Por favor completa todos los campos")
      return
    }

    const token = authStore.getSnapshot().token
    if (!token) return

    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ username, email, password })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || "Error al crear usuario")
      }

      setFormSuccess("Usuario registrado exitosamente")
      setUsername("")
      setEmail("")
      setPassword("")
      fetchUsers()
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return

    const token = authStore.getSnapshot().token
    if (!token) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || "Error al eliminar usuario")
      }

      fetchUsers()
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (auth.user?.role !== "admin") {
    return (
      <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-2xl max-w-2xl text-center">
        <h2 className="text-xl font-bold text-red-400 mb-2">Acceso Denegado</h2>
        <p className="text-zinc-400">Esta sección solo está disponible para usuarios con rol de Administrador.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List of Users (2 Cols) */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Usuarios</h1>
          <p className="text-zinc-400 text-sm">Lista de cajeros y administradores con acceso a la plataforma</p>
        </div>

        {listError && (
          <div className="p-4 bg-red-950/40 border border-red-500/40 text-red-300 rounded-xl text-sm">
            {listError}
          </div>
        )}

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/40 border-b border-zinc-800/80 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Usuario</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rol</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-zinc-800/20 transition">
                  <td className="p-4 font-semibold text-sm">{u.username}</td>
                  <td className="p-4 text-sm text-zinc-400">{u.email}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      u.role === "admin" 
                        ? "bg-indigo-950/60 text-indigo-400 border border-indigo-900/60" 
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700/60"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={u.id === 1}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-red-950/30 text-zinc-500 hover:text-red-400 border border-zinc-850 hover:border-red-900/50 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Form (1 Col) */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 h-fit space-y-4">
        <h2 className="text-xl font-bold text-white mb-2">Registrar Cajero</h2>
        <p className="text-zinc-400 text-xs">Agrega un nuevo operador de caja al sistema POS</p>

        {formError && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs rounded-xl font-medium">
            {formError}
          </div>
        )}

        {formSuccess && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl font-medium">
            {formSuccess}
          </div>
        )}

        <form onSubmit={handleRegisterUser} className="space-y-4">
          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-1 uppercase tracking-wider">Nombre de Usuario</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ej. juan_cajero"
              className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-1 uppercase tracking-wider">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="juan@axiompos.com"
              className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold mb-1 uppercase tracking-wider">Contraseña Temporal</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/10 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            {loading ? "Creando..." : "Registrar Cajero"}
          </button>
        </form>
      </div>
    </div>
  )
}