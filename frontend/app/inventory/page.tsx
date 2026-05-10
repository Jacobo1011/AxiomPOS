"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/services/product.service"
import ProductForm from "@/components/inventory/ProductForm"

type Product = {
  id: number
  barcode: string
  name: string
  price: number
  stock: number
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])

  async function fetchProducts() {
    const data = await getProducts()
    setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Inventory
      </h1>

      <ProductForm onProductAdded={fetchProducts} />

      <div className="bg-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-900">
            <tr>
              <th className="p-4 text-left">Barcode</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-zinc-700"
              >
                <td className="p-4">{product.barcode}</td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}