/**
 * Utility functions for discount/sale calculations
 */

/**
 * Calculate the discount percentage between original and sale price
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0 || salePrice <= 0) return 0;
  if (salePrice >= originalPrice) return 0;

  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Calculate the savings amount between original and sale price
 */
export function calculateSavings(
  originalPrice: number,
  salePrice: number
): number {
  if (originalPrice <= 0 || salePrice <= 0) return 0;
  if (salePrice >= originalPrice) return 0;

  return originalPrice - salePrice;
}

/**
 * Check if a sale is currently active based on dates
 */
export function isSaleActive(
  startDate?: string | null,
  endDate?: string | null
): boolean {
  if (!startDate || !endDate) return false;

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return now >= start && now <= end;
}

/**
 * Format discount percentage for display
 */
export function formatDiscountLabel(percentage: number): string {
  if (percentage <= 0) return "";
  return `-${percentage}%`;
}

/**
 * Get appropriate color class for discount badge based on percentage
 */
export function getDiscountBadgeColor(percentage: number): string {
  if (percentage >= 50) return "destructive"; // Very high discount
  if (percentage >= 30) return "default"; // High discount
  if (percentage >= 15) return "secondary"; // Medium discount
  return "outline"; // Low discount
}

/**
 * Check if a product has a valid sale configuration
 */
export function hasValidSale(product: {
  sale_price?: number | null;
  price: number;
  sale_start_date?: string | null;
  sale_end_date?: string | null;
}): boolean {
  if (!product.sale_price) return false;
  if (product.sale_price >= product.price) return false;
  if (!product.sale_start_date || !product.sale_end_date) return false;

  return isSaleActive(product.sale_start_date, product.sale_end_date);
}

/**
 * Get the effective price of a product (sale price if active, otherwise regular price)
 */
export function getEffectivePrice(product: {
  price: number;
  sale_price?: number | null;
  is_on_sale?: boolean;
}): number {
  return product.is_on_sale && product.sale_price
    ? product.sale_price
    : product.price;
}
