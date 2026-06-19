"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/services/product.service"
import { getSales } from "@/services/sales.service"
import { formatMoney } from "@/utils/formatMoney"
import Link from "next/link"

type Product = {
  id: number
  barcode: string
  name: string
  price: number
  stock: number
}

type Sale = {
  id: number
  total: number
  created_at: string
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const p = await getProducts()
      const s = await getSales()
      setProducts(p)
      setSales(s)
    } catch (_) {
      // Silently handle errors or show static states
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [])

  const revenue = sales.reduce((sum, s) => sum + (s.total || 0), 0)
  
  const lowStockItems = products.filter(p => p.stock < 10)
  const lowStockCount = lowStockItems.length

  const recentSales = [...sales]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-500">
        <div className="w-10 h-10 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-semibold tracking-wider uppercase">Cargando Métricas...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Panel de Resumen</h1>
        <p className="text-zinc-400 text-sm">Visualización del rendimiento financiero y niveles del almacén en tiempo real</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/20 border border-zinc-800/80 p-6 rounded-2xl relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/25 transition-all duration-300"></div>
          <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Ingresos Totales</div>
          <div className="text-3xl font-black text-emerald-400 tracking-tight">{formatMoney(revenue)}</div>
          <p className="text-zinc-500 text-xs mt-2">Acumulado histórico facturado</p>
        </div>

        {/* Sales Card */}
        <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/20 border border-zinc-800/80 p-6 rounded-2xl relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/25 transition-all duration-300"></div>
          <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Ventas Realizadas</div>
          <div className="text-3xl font-black text-indigo-400 tracking-tight">{sales.length}</div>
          <p className="text-zinc-500 text-xs mt-2">Transacciones aprobadas en caja</p>
        </div>

        {/* Low Stock Card */}
        <Link 
          href="/inventory"
          className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/20 border border-zinc-800/80 p-6 rounded-2xl relative overflow-hidden shadow-lg group block hover:border-yellow-500/40 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/25 transition-all duration-300"></div>
          <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Productos en Alerta</div>
          <div className="text-3xl font-black text-yellow-500 tracking-tight">{lowStockCount}</div>
          <p className="text-zinc-500 text-xs mt-2 group-hover:text-yellow-400 transition-colors">Ver alertas de existencias →</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white mb-2">Ventas Recientes</h2>
          <div className="space-y-3">
            {recentSales.map((sale, i) => (
              <div 
                key={i} 
                className="flex justify-between items-center bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl"
              >
                <div>
                  <div className="text-sm font-bold text-white">Venta #{sale.id}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {sale.created_at ? new Date(sale.created_at).toLocaleString() : "Recién hecha"}
                  </div>
                </div>
                <div className="text-sm font-black text-emerald-400">
                  {formatMoney(sale.total)}
                </div>
              </div>
            ))}
            {recentSales.length === 0 && (
              <div className="text-center py-10 text-zinc-500 text-sm">
                Aún no se han registrado ventas.
              </div>
            )}
          </div>
        </div>

        {/* Low Stock List */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white mb-2">Alertas de Reabastecimiento</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {lowStockItems.slice(0, 5).map(item => (
              <div 
                key={item.id}
                className="flex justify-between items-center bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{item.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Cód. barras: {item.barcode}</div>
                </div>
                <div>
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                    item.stock === 0 
                      ? "bg-red-950/50 text-red-400 border border-red-900/50" 
                      : "bg-yellow-950/50 text-yellow-400 border border-yellow-900/50"
                  }`}>
                    Stock: {item.stock}
                  </span>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <div className="text-center py-10 text-zinc-500 text-sm">
                No hay alertas de stock en este momento. ¡Todo en orden!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}