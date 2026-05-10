"use client"

import { useEffect, useState } from "react"
import { getProducts } from "@/services/product.service"
import { createSale } from "@/services/sales.service"

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
  const [search, setSearch] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    const data = await getProducts()
    setProducts(data)
  }

  const addToCart = (product: Product) => {
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
          quantity: 1
        }
      ]
    })
  }

  const updateQty = (product_id: number, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter(p => p.product_id !== product_id))
      return
    }

    setCart(
      cart.map(p =>
        p.product_id === product_id
          ? { ...p, quantity: qty }
          : p
      )
    )
  }

  const clearCart = () => setCart([])

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const checkout = async () => {
    if (cart.length === 0) return

    const payload = cart.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    }))

    await createSale(payload)

    alert("Venta realizada")

    clearCart()
    loadProducts()
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search)
  )

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        POS Terminal
      </h1>

      {/* SEARCH BAR (clave en POS real) */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Escanear o buscar producto..."
        className="w-full p-3 mb-6 bg-zinc-800 rounded"
      />

      <div className="grid grid-cols-2 gap-6">

        {/* PRODUCTS */}
        <div className="bg-zinc-800 p-4 rounded">
          <h2 className="text-xl mb-4">Productos</h2>

          <div className="space-y-2">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className="w-full text-left p-3 bg-zinc-700 rounded hover:bg-zinc-600"
              >
                <div className="font-semibold">
                  {product.name}
                </div>
                <div className="text-sm text-zinc-300">
                  ${product.price} | stock: {product.stock}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CART */}
        <div className="bg-zinc-800 p-4 rounded">
          <h2 className="text-xl mb-4">Carrito</h2>

          <div className="space-y-2 mb-4">
            {cart.map(item => (
              <div
                key={item.product_id}
                className="flex justify-between bg-zinc-700 p-2 rounded"
              >
                <div>
                  {item.name}
                  <div className="text-sm text-zinc-400">
                    ${item.price}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQty(item.product_id, item.quantity - 1)
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQty(item.product_id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-2xl font-bold mb-4">
            Total: ${total}
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearCart}
              className="bg-red-600 px-3 py-2 rounded"
            >
              Limpiar
            </button>

            <button
              onClick={checkout}
              className="bg-green-600 px-3 py-2 rounded flex-1"
            >
              Cobrar
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}