"use client"

import { useEffect, useState } from "react"
import { getSales } from "@/services/sales.service"
import { formatMoney } from "@/utils/formatMoney"

type SaleItem = {
  product_id: number
  quantity: number
  price: number
  product_name?: string // Optional display field
}

type Sale = {
  id: number
  total: number
  created_at: string
  items: SaleItem[]
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const data = await getSales()
      setSales(data)
    } catch (_) {
      // Silently handle list loading error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Historial de Ventas</h1>
        <p className="text-zinc-400 text-sm">Registro de todas las facturas procesadas en la terminal</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-zinc-500">
          <div className="w-10 h-10 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
          <p className="text-sm font-semibold tracking-wider">Cargando transacciones...</p>
        </div>
      ) : (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/40 border-b border-zinc-800/80 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">ID Factura</th>
                <th className="p-4">Fecha y Hora</th>
                <th className="p-4">Ítems Vendidos</th>
                <th className="p-4">Total Recaudado</th>
                <th className="p-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
              {[...sales].sort((a, b) => b.id - a.id).map(sale => {
                const totalItems = sale.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

                return (
                  <tr key={sale.id} className="hover:bg-zinc-800/20 transition">
                    <td className="p-4 font-bold text-sm"># {sale.id}</td>
                    <td className="p-4 text-sm text-zinc-400">
                      {sale.created_at ? new Date(sale.created_at).toLocaleString() : "Sin fecha"}
                    </td>
                    <td className="p-4 text-sm">{totalItems} unidades</td>
                    <td className="p-4 text-sm font-black text-emerald-400">{formatMoney(sale.total)}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="px-3.5 py-1.5 bg-zinc-850 hover:bg-zinc-850 text-indigo-400 hover:text-indigo-300 border border-zinc-800 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                )
              })}

              {sales.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-zinc-500 text-sm">
                    No se han registrado facturas en el sistema POS.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 relative">
            <h2 className="text-xl font-bold text-white mb-1">Factura #{selectedSale.id}</h2>
            <p className="text-zinc-500 text-xs mb-4">
              {selectedSale.created_at ? new Date(selectedSale.created_at).toLocaleString() : ""}
            </p>

            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/60 pb-1.5 grid grid-cols-5 gap-2">
                <span className="col-span-2">Producto</span>
                <span className="text-center">Cant.</span>
                <span className="text-right">Unitario</span>
                <span className="text-right">Subtotal</span>
              </div>

              {selectedSale.items?.map((item, idx) => (
                <div key={idx} className="text-sm grid grid-cols-5 gap-2 items-center text-zinc-300 py-1">
                  <span className="col-span-2 font-medium truncate">Producto #{item.product_id}</span>
                  <span className="text-center font-bold text-zinc-500">{item.quantity}</span>
                  <span className="text-right text-zinc-500">{formatMoney(item.price)}</span>
                  <span className="text-right font-semibold text-white">{formatMoney(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-850 pt-4 flex justify-between items-baseline mb-6">
              <span className="text-zinc-400 font-bold text-sm">Total Factura:</span>
              <span className="text-2xl font-black text-emerald-400">{formatMoney(selectedSale.total)}</span>
            </div>

            <button
              onClick={() => setSelectedSale(null)}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm rounded-xl border border-zinc-700 cursor-pointer active:scale-95 transition"
            >
              Cerrar Detalle
            </button>
          </div>
        </div>
      )}
    </div>
  )
}