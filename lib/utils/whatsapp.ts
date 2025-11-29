import type { Product } from "@/lib/types";
import { WHATSAPP_PHONE } from "@/lib/constants";
import {
  getEffectivePrice,
  calculateSavings,
} from "@/lib/utils/discount-utils";

/**
 * Generates a pre-filled WhatsApp message for a product
 */
export function generateWhatsAppMessage(
  product: Product,
  productUrl: string
): string {
  const effectivePrice = getEffectivePrice(product);
  const isOnSale = product.is_on_sale && product.sale_price;
  const savings = isOnSale
    ? calculateSavings(product.price, product.sale_price!)
    : 0;

  let message = `Buenos días,\n\n`;
  message += `Me interesa adquirir el siguiente producto:\n\n`;

  // Product details
  message += `*PRODUCTO:* ${product.title}\n`;
  message += `*SKU:* ${product.sku}\n`;
  message += `*CATEGORÍA:* ${product.category}\n\n`;

  // Price information
  message += `*INFORMACIÓN DE PRECIO:*\n`;
  if (isOnSale && product.sale_price) {
    message += `Precio regular: ~${product.price.toFixed(2)} ${
      product.currency
    }~\n`;
    message += `*Precio de oferta: ${product.sale_price.toFixed(2)} ${
      product.currency
    }*\n`;
    message += `Ahorro: ${savings.toFixed(2)} ${product.currency}\n\n`;
  } else {
    message += `Precio: *${product.price.toFixed(2)} ${product.currency}*\n\n`;
  }

  // Stock availability
  message += `*DISPONIBILIDAD:*\n`;
  if (product.stock > 0) {
    message += `En stock (${product.stock} ${
      product.stock === 1 ? "unidad disponible" : "unidades disponibles"
    })\n\n`;
  } else {
    message += `Pendiente de confirmar disponibilidad\n\n`;
  }

  // Customer information
  message += `*MIS DATOS:*\n`;
  message += `Nombre completo: _______________\n`;
  message += `Teléfono: _______________\n\n`;

  // Product link - separated for better mobile experience
  message += `---\n`;
  message += `Ficha del producto:\n${productUrl}\n\n`;
  message += `Quedo atento a su respuesta.\n`;
  message += `Saludos cordiales.`;

  return message;
}

/**
 * Generates a WhatsApp URL with pre-filled message
 */
export function generateWhatsAppUrl(
  product: Product,
  productUrl: string
): string {
  const message = generateWhatsAppMessage(product, productUrl);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a WhatsApp URL with a custom message
 */
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp with pre-filled message
 */
export function openWhatsApp(product: Product, productUrl: string): void {
  const url = generateWhatsAppUrl(product, productUrl);
  window.open(url, "_blank");
}
