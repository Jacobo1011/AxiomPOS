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

  const fetchProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const sorted = [...products].sort((a, b) => {
    if (a.stock === 0 && b.stock > 0) return -1
    if (b.stock === 0 && a.stock > 0) return 1
    return a.stock - b.stock
  })

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">Inventory</h1>

      <ProductForm onProductAdded={fetchProducts} />

      <table className="w-full bg-zinc-800 rounded overflow-hidden">
        <thead className="bg-zinc-900">
          <tr>
            <th className="p-4 text-left">Barcode</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Stock</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map(p => (
            <tr
              key={p.id}
              className={`border-t border-zinc-700 ${
                p.stock === 0
                  ? "bg-red-900/40"
                  : p.stock < 10
                  ? "bg-yellow-500/20"
                  : ""
              }`}
            >
              <td className="p-4">{p.barcode}</td>
              <td className="p-4">{p.name}</td>
              <td className="p-4">{formatMoney(p.price)}</td>
              <td className="p-4">{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}