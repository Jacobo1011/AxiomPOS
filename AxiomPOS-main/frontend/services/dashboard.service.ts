const API_URL = "http://127.0.0.1:8000/dashboard"

export async function getDashboard() {
  const res = await fetch(API_URL)

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard")
  }

  return res.json()
}