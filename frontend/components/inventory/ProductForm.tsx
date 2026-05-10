"use client"

import { useState } from "react"

export default function ProductForm({
  onProductAdded,
}: {
  onProductAdded: () => void
}) {
  const [barcode, setBarcode] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await fetch("http://127.0.0.1:8000/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        barcode,
        name,
        price: Number(price),
        stock: Number(stock),
      }),
    })

    setBarcode("")
    setName("")
    setPrice("")
    setStock("")

    onProductAdded()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-800 p-6 rounded-xl mb-6 space-y-4"
    >
      <h2 className="text-xl font-bold">Add Product</h2>

      <input
        className="w-full p-2 rounded bg-zinc-700"
        placeholder="Barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
      />

      <input
        className="w-full p-2 rounded bg-zinc-700"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full p-2 rounded bg-zinc-700"
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        className="w-full p-2 rounded bg-zinc-700"
        placeholder="Stock"
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <button className="bg-blue-600 px-4 py-2 rounded">
        Save Product
      </button>
    </form>
  )
}