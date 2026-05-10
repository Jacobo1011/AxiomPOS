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
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [scanning, setScanning] = useState(false)

  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<"ok" | "error" | "warn" | null>(null)

  const bufferRef = useRef("")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const playBeep = () => {
    const audio = new Audio("/beep.mp3")
    audio.volume = 0.4
    audio.play().catch(() => {})
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  const showMessage = (text: string, type: "ok" | "error" | "warn") => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 2000)
  }

  const processBarcode = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode)

    if (!product) {
      showMessage("Producto no existente", "warn")
      return
    }

    if (product.stock <= 0) {
      showMessage("Producto sin stock", "error")
      return
    }

    playBeep()

    setCart(prev => {
      const exists = prev.find(p => p.product_id === product.id)

      if (exists) {
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
        },
      ]
    })

    showMessage("Producto agregado", "ok")
  }

  useEffect(() => {
    if (!scanning) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        processBarcode(bufferRef.current.trim())
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

    await createSale(
      cart.map(i => ({
        product_id: i.product_id,
        quantity: i.quantity,
      }))
    )

    setCart([])
    await loadProducts()

    showMessage("Venta realizada", "ok")
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">POS Terminal</h1>

      <button
        onClick={() => setScanning(true)}
        className={`px-4 py-2 rounded mb-4 ${
          scanning ? "bg-green-600" : "bg-blue-600"
        }`}
      >
        {scanning ? "Esperando código..." : "Escanear"}
      </button>

      {message && (
        <div
          className={`p-3 mb-4 rounded font-bold ${
            messageType === "ok"
              ? "bg-green-600"
              : messageType === "warn"
              ? "bg-yellow-500 text-black"
              : "bg-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-zinc-800 p-4 rounded">
          <h2 className="text-xl mb-4">Carrito</h2>

          {cart.map(item => (
            <div
              key={item.product_id}
              className="flex justify-between bg-zinc-700 p-2 rounded mb-2"
            >
              <div>{item.name}</div>
              <div>
                {item.quantity} x {formatMoney(item.price)}
              </div>
            </div>
          ))}

          <div className="text-2xl font-bold mt-4">
            Total: {formatMoney(total)}
          </div>

          <button
            onClick={checkout}
            className="bg-green-600 w-full mt-4 py-2 rounded"
          >
            Cobrar
          </button>
        </div>
      </div>
    </div>
  )
}