export function formatMoney(value: number | string) {
  const num = typeof value === "string" ? Number(value) : value

  if (!isFinite(num)) return "0"

  return new Intl.NumberFormat("es-CO", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}