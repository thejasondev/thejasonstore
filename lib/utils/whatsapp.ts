import type { Product } from "@/lib/types"
import { WHATSAPP_PHONE } from "@/lib/constants"

/**
 * Generates a pre-filled WhatsApp message for a product
 */
export function generateWhatsAppMessage(product: Product, productUrl: string): string {
  const message = `Hola, quiero comprar: ${product.title} (SKU: ${product.sku}). Precio: $${product.price.toFixed(2)} ${product.currency}. ¿Está disponible? 

Ver producto: ${productUrl}

Mi nombre: ___`

  return message
}

/**
 * Generates a WhatsApp URL with pre-filled message
 */
export function generateWhatsAppUrl(product: Product, productUrl: string): string {
  const message = generateWhatsAppMessage(product, productUrl)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
}

/**
 * Opens WhatsApp with pre-filled message
 */
export function openWhatsApp(product: Product, productUrl: string): void {
  const url = generateWhatsAppUrl(product, productUrl)
  window.open(url, "_blank")
}
