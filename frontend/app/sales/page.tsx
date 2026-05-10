"use client"

import { useEffect, useState } from "react"
import { getSales } from "@/services/sales.service"
import { formatMoney } from "@/utils/formatMoney"

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([])

  const load = async () => {
    const data = await getSales()
    setSales(data)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">Sales History</h1>

      <div className="bg-zinc-800 rounded-xl p-6 space-y-3">
        {sales.length === 0 && (
          <div className="text-zinc-400">No sales yet</div>
        )}

        {sales.map((sale, i) => (
          <div key={i} className="p-3 bg-zinc-700 rounded">
            <div>Sale ID: {sale.id}</div>
            <div>Total: {formatMoney(sale.total)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}