/**
 * Formats a price with currency symbol
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  // Map currencies to their appropriate locales for number formatting
  const localeMap: Record<string, string> = {
    USD: "en-US",
    EUR: "es-ES",
    CUP: "es-CU",
    MXN: "es-MX",
  };

  const locale = localeMap[currency] || "en-US";

  // Format the number without currency symbol
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  // Add explicit currency code/symbol for clarity
  switch (currency) {
    case "EUR":
      return `${formattedNumber} €`;
    case "USD":
      return `${formattedNumber} USD`;
    case "CUP":
      return `${formattedNumber} CUP`;
    case "MXN":
      return `${formattedNumber} MXN`;
    default:
      return `${formattedNumber} ${currency}`;
  }
}

/**
 * Formats a date string
 */
export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
