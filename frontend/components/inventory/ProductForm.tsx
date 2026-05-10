"use client"

import { useEffect, useRef, useState } from "react"

export default function ProductForm({
  onProductAdded
}: {
  onProductAdded: () => void
}) {
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  const barcodeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    barcodeRef.current?.focus()
  }, [])

  const playBeep = () => {
    const audio = new Audio("/beep.mp3")
    audio.play().catch(() => {})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!barcode || !name || !price || !stock) return

    await fetch("http://127.0.0.1:8000/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barcode,
        name,
        price: Number(price),
        stock: Number(stock)
      })
    })

    playBeep()

    setBarcode("")
    setName("")
    setPrice("")
    setStock("")

    onProductAdded()
    barcodeRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded mb-6">
      <input
        ref={barcodeRef}
        value={barcode}
        onChange={e => setBarcode(e.target.value)}
        placeholder="Barcode"
        className="w-full p-2 bg-zinc-700 mb-2"
      />

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        className="w-full p-2 bg-zinc-700 mb-2"
      />

      <input
        value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="Price"
        type="number"
        className="w-full p-2 bg-zinc-700 mb-2"
      />

      <input
        value={stock}
        onChange={e => setStock(e.target.value)}
        placeholder="Stock"
        type="number"
        className="w-full p-2 bg-zinc-700 mb-2"
      />

      <button className="bg-blue-600 px-4 py-2 rounded">
        Save
      </button>
    </form>
  )
}