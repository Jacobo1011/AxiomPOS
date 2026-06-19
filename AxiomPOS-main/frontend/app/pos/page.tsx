"use client"

import { useEffect, useRef, useState } from "react"
import { getProducts } from "@/services/product.service"
import { createSale } from "@/services/sales.service"
import { formatMoney } from "@/utils/formatMoney"

type Product = {
  id: number
  barcode: string
  name: string
  price: number
  stock: number
}

type CartItem = {
  product_id: number
  name: string
  price: number
  quantity: number
  stock: number
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [scanning, setScanning] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"ok" | "error" | "warn" | null>(null)

  const bufferRef = useRef("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (_) {
      showMessage("Error al cargar productos", "error")
    }
  }

  // Zero-dependency beep sound generator using Web Audio API
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.value = 880 // A5 pitch
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
      
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.12)
    } catch (_) {}
  }

  const showMessage = (text: string, type: "ok" | "error" | "warn") => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 2000)
  }

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showMessage("Producto sin stock", "error")
      return
    }

    playBeep()

    setCart(prev => {
      const exists = prev.find(p => p.product_id === product.id)
      
      if (exists) {
        if (exists.quantity >= product.stock) {
          showMessage("Límite de stock alcanzado", "warn")
          return prev
        }
        return prev.map(p =>
          p.product_id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      }

      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock
        },
      ]
    })

    showMessage("Producto agregado", "ok")
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product_id === productId) {
          const newQty = item.quantity + delta
          if (newQty <= 0) return null
          if (newQty > item.stock) {
            showMessage("Stock máximo alcanzado", "warn")
            return item
          }
          return { ...item, quantity: newQty }
        }
        return item
      }).filter((item): item is CartItem => item !== null)
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product_id !== productId))
    showMessage("Producto eliminado", "warn")
  }

  // Handle hardware barcode scanning buffer
  const processBarcode = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode)
    if (!product) {
      showMessage(`Código ${barcode} no registrado`, "warn")
      return
    }
    addToCart(product)
  }

  useEffect(() => {
    if (!scanning) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (bufferRef.current.trim()) {
          processBarcode(bufferRef.current.trim())
        }
        bufferRef.current = ""
        return
      }

      if (e.key.length === 1) {
        bufferRef.current += e.key
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        bufferRef.current = ""
      }, 250)
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [scanning, products])

  const checkout = async () => {
    if (cart.length === 0) return

    try {
      await createSale(
        cart.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
        }))
      )

      setCart([])
      await loadProducts()
      showMessage("Venta cobrada con éxito", "ok")
    } catch (err: any) {
      showMessage(err.message || "Error al procesar venta", "error")
    }
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)
  
  // Filter products for catalog search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.barcode.includes(searchQuery)
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Terminal POS</h1>
          <p className="text-zinc-400 text-sm">Escanea códigos de barras o agrega productos manualmente</p>
        </div>

        <button
          onClick={() => setScanning(!scanning)}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
            scanning 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-500" 
              : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
          }`}
        >
          {scanning ? "Escáner Activo" : "Activar Escáner"}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 animate-slide-in ${
            messageType === "ok"
              ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
              : messageType === "warn"
              ? "bg-yellow-950/60 border border-yellow-500/40 text-yellow-300"
              : "bg-red-950/60 border border-red-500/40 text-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column: Product Catalog */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-zinc-950/30 border border-zinc-800/80 p-4 rounded-2xl flex items-center gap-3">
            <span className="text-zinc-500 text-lg"></span>
            <input
              type="text"
              placeholder="Buscar producto por nombre o código de barras..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-zinc-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredProducts.map(p => (
              <div
                key={p.id}
                onClick={() => addToCart(p)}
                className={`bg-zinc-900/40 border border-zinc-800/80 hover:border-indigo-500/50 p-4 rounded-xl cursor-pointer hover:bg-zinc-800/30 transition-all duration-200 group flex justify-between items-center ${
                  p.stock === 0 ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-zinc-500 mb-1">{p.barcode}</div>
                  <div className="text-white font-bold group-hover:text-indigo-400 transition-colors text-sm">{p.name}</div>
                  <div className="text-emerald-400 font-extrabold text-sm mt-1">{formatMoney(p.price)}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                    p.stock === 0 
                      ? "bg-red-950/50 text-red-400 border border-red-900/50" 
                      : p.stock < 10 
                      ? "bg-yellow-950/50 text-yellow-400 border border-yellow-900/50" 
                      : "bg-zinc-800 text-zinc-400"
                  }`}>
                    Stock: {p.stock}
                  </span>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-2 text-center py-10 text-zinc-500 text-sm">
                No se encontraron productos registrados
              </div>
            )}
          </div>
        </div>

        {/* Right column: Cart & Checkout */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between min-h-[500px]">
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800/80 pb-3 flex justify-between items-center">
              <span>Detalle de Compra</span>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md">{cart.length} ítems</span>
            </h2>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {cart.map(item => (
                <div
                  key={item.product_id}
                  className="bg-zinc-950/40 border border-zinc-800/40 p-3 rounded-xl flex justify-between items-center gap-3 animate-fade-in"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">{item.name}</div>
                    <div className="text-zinc-500 text-xs mt-0.5">{formatMoney(item.price)} c/u</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, -1)}
                      className="w-7 h-7 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold rounded-lg border border-zinc-800 text-xs flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold text-white w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, 1)}
                      className="w-7 h-7 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold rounded-lg border border-zinc-800 text-xs flex items-center justify-center cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-bold text-sm">{formatMoney(item.price * item.quantity)}</div>
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-red-500 hover:text-red-400 text-xs mt-0.5 transition-colors cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="text-center py-20 text-zinc-500 text-sm">
                  El carrito está vacío
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-4 mt-6">
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-zinc-400 font-medium">Total a Pagar:</span>
              <span className="text-3xl font-black text-emerald-400">{formatMoney(total)}</span>
            </div>

            <button
              onClick={checkout}
              disabled={cart.length === 0}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl text-lg shadow-lg shadow-emerald-500/10 active:scale-[0.99] transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
             Finalizar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}