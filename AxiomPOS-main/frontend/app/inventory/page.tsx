"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/services/product.service"
import ProductForm from "@/components/inventory/ProductForm"
import { formatMoney } from "@/utils/formatMoney"

type Product = {
  id: number
  barcode: string
  name: string
  price: number
  stock: number
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      setError("No se pudieron cargar los productos")
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      const res = await fetch(`http://127.0.0.1:8000/products/${id}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Error al eliminar")
      
      fetchProducts()
    } catch (_) {
      alert("No se pudo eliminar el producto")
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  // Sort products: out of stock and low stock first, then by name
  const sortedProducts = [...products].sort((a, b) => {
    if (a.stock === 0 && b.stock > 0) return -1
    if (b.stock === 0 && a.stock > 0) return 1
    if (a.stock < 10 && b.stock >= 10) return -1
    if (b.stock < 10 && a.stock >= 10) return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Inventario</h1>
          <p className="text-zinc-400 text-sm">Gestiona la base de datos de productos y sus niveles de existencia</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/10 active:scale-95 transition-all duration-150 cursor-pointer"
          >
           Agregar Producto
          </button>
        )}
      </div>

      {showForm && (
        <div className="animate-fade-in">
          <ProductForm
            onSuccess={handleFormSuccess}
            editProduct={editingProduct}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/40 text-red-300 text-sm rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/40 border-b border-zinc-800/80 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Código de Barras</th>
                <th className="p-4">Nombre del Producto</th>
                <th className="p-4">Precio (COP)</th>
                <th className="p-4">Nivel de Stock</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60">
              {sortedProducts.map(p => {
                const isOutOfStock = p.stock === 0
                const isLowStock = p.stock > 0 && p.stock < 10

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-zinc-800/20 transition duration-150 ${
                      isOutOfStock
                        ? "bg-red-950/10 text-zinc-300"
                        : isLowStock
                        ? "bg-yellow-950/10 text-zinc-300"
                        : "text-zinc-100"
                    }`}
                  >
                    <td className="p-4 font-mono text-xs">{p.barcode}</td>
                    <td className="p-4 font-semibold text-sm">{p.name}</td>
                    <td className="p-4 text-sm font-medium">{formatMoney(p.price)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        isOutOfStock
                          ? "bg-red-950/60 text-red-400 border-red-900/60"
                          : isLowStock
                          ? "bg-yellow-950/60 text-yellow-400 border-yellow-900/60"
                          : "bg-emerald-950/60 text-emerald-400 border-emerald-900/60"
                      }`}>
                        {isOutOfStock ? "Agotado" : isLowStock ? "Bajo Stock" : "Suficiente"} ({p.stock})
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="px-3 py-1 bg-zinc-850 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-3 py-1 bg-zinc-900 hover:bg-red-950/30 text-zinc-400 hover:text-red-400 border border-zinc-850 hover:border-red-900/50 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })}

              {sortedProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-500 text-sm">
                    No hay productos en el inventario. Registra uno arriba.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}