import type { CartItem, Product } from "@/lib/types";
import { getEffectivePrice } from "./discount-utils";

/**
 * Represents totals grouped by currency code
 */
export interface CurrencyTotals {
  [currencyCode: string]: number;
}

/**
 * Calculates cart totals grouped by currency
 * @param items - Cart items with products
 * @returns Object with currency codes as keys and totals as values
 */
export function calculateCartTotalsByCurrency(
  items: CartItem[]
): CurrencyTotals {
  return items.reduce((acc, item) => {
    if (!item.product) return acc;

    const currency = item.product.currency;
    const price = getEffectivePrice(item.product);
    const subtotal = price * item.quantity;

    acc[currency] = (acc[currency] || 0) + subtotal;
    return acc;
  }, {} as CurrencyTotals);
}

/**
 * Calculates inventory value grouped by currency
 * @param products - Array of products
 * @returns Object with currency codes as keys and inventory values as values
 */
export function calculateInventoryValueByCurrency(
  products: Product[]
): CurrencyTotals {
  return products.reduce((acc, product) => {
    const currency = product.currency;
    const inventoryValue = product.price * product.stock;

    acc[currency] = (acc[currency] || 0) + inventoryValue;
    return acc;
  }, {} as CurrencyTotals);
}

/**
 * Sorts currency totals to display USD first, then alphabetically
 * @param totals - Currency totals object
 * @returns Sorted array of [currency, amount] tuples
 */
export function getSortedCurrencyEntries(
  totals: CurrencyTotals
): [string, number][] {
  const entries = Object.entries(totals);

  return entries.sort(([currencyA], [currencyB]) => {
    // USD always first
    if (currencyA === "USD") return -1;
    if (currencyB === "USD") return 1;
    // Then alphabetically
    return currencyA.localeCompare(currencyB);
  });
}

/**
 * Checks if cart has multiple currencies
 * @param totals - Currency totals object
 * @returns True if more than one currency
 */
export function hasMultipleCurrencies(totals: CurrencyTotals): boolean {
  return Object.keys(totals).length > 1;
}
