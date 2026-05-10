const API_URL = "http://127.0.0.1:8000/sales"

export async function createSale(items: {
  product_id: number
  quantity: number
}[]) {
  const res = await fetch(API_URL + "/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  })

  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getSales() {
  const res = await fetch(API_URL)

  if (!res.ok) throw new Error("Failed to fetch sales")

  return res.json()
}