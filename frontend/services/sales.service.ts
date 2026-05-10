const API_URL = "http://127.0.0.1:8000/sales"

export async function createSale(items: {
  product_id: number
  quantity: number
}[]) {
  const res = await fetch(API_URL + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      items: items
    })
  })

  const text = await res.text()

  if (!res.ok) {
    throw new Error(text)
  }

  return JSON.parse(text)
}