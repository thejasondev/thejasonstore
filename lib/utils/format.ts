/**
 * Formats a price with currency symbol
 */
export function formatPrice(price: number, currency = "MXN"): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency,
  }).format(price)
}

/**
 * Formats a date string
 */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}
