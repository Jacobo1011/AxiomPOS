const API_URL = "http://127.0.0.1:8000/products"

export async function getProducts() {
  const res = await fetch(API_URL)

  if (!res.ok) {
    throw new Error("Failed to fetch products")
  }

  return res.json()
}