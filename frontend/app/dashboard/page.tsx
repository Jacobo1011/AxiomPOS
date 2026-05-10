"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/services/product.service"
import { getSales } from "@/services/sales.service"
import { formatMoney } from "@/utils/formatMoney"

export default function DashboardPage() {
  const [products, setProducts] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])

  const load = async () => {
    const p = await getProducts()
    const s = await getSales()

    setProducts(p)
    setSales(s)
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  const revenue = sales.reduce((sum, s) => sum + (s.total || 0), 0)
  const lowStock = products.filter(p => p.stock < 10).length

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-zinc-800 p-6 rounded-xl">
          Revenue: {formatMoney(revenue)}
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl">
          Sales: {sales.length}
        </div>

        <div className="bg-zinc-800 p-6 rounded-xl text-yellow-400">
          Low Stock: {lowStock}
        </div>
      </div>
    </div>
  )
}