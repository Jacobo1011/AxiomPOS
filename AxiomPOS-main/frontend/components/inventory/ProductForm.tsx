"use client"

import { useEffect, useRef, useState } from "react"

type Product = {
  id: number
  barcode: string
  name: string
  price: number
  stock: number
}

interface ProductFormProps {
  onSuccess: () => void
  editProduct?: Product | null
  onCancel?: () => void
}

export default function ProductForm({
  onSuccess,
  editProduct = null,
  onCancel
}: ProductFormProps) {
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const barcodeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editProduct) {
      setBarcode(editProduct.barcode)
      setName(editProduct.name)
      setPrice(editProduct.price.toString())
      setStock(editProduct.stock.toString())
    } else {
      setBarcode("")
      setName("")
      setPrice("")
      setStock("")
    }
    setError(null)
    barcodeRef.current?.focus()
  }, [editProduct])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!barcode || !name || !price || !stock) {
      setError("Por favor completa todos los campos")
      return
    }

    setLoading(true)

    const url = editProduct 
      ? `http://127.0.0.1:8000/products/${editProduct.id}`
      : "http://127.0.0.1:8000/products/"
    
    const method = editProduct ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barcode,
          name,
          price: Number(price),
          stock: Number(stock)
        })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || "Error al guardar el producto")
      }

      setBarcode("")
      setName("")
      setPrice("")
      setStock("")
      
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/50 border border-zinc-800/80 p-6 rounded-2xl space-y-4 max-w-xl">
      <h3 className="text-lg font-bold text-white mb-2">
        {editProduct ? "✏️ Editar Producto" : "📦 Registrar Nuevo Producto"}
      </h3>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs rounded-xl font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Código de Barras</label>
          <input
            ref={barcodeRef}
            value={barcode}
            onChange={e => setBarcode(e.target.value)}
            placeholder="Ej. 7702001001"
            className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Nombre</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Ej. Leche Colanta 1L"
            className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Precio (COP)</label>
          <input
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Ej. 3500"
            type="number"
            min="0"
            className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-zinc-400 text-xs font-bold mb-1.5 uppercase tracking-wider">Stock Inicial</label>
          <input
            value={stock}
            onChange={e => setStock(e.target.value)}
            placeholder="Ej. 50"
            type="number"
            min="0"
            className="w-full px-4 py-2.5 bg-zinc-800/60 border border-zinc-700 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold rounded-xl transition cursor-pointer"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/10 transition cursor-pointer"
        >
          {loading ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  )
}