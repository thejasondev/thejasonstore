import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/actions/products"

// Forzar renderizado dinámico para soportar cookies de Supabase
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()

  const productUrls = products.map((product) => ({
    url: `https://tu-dominio.com/producto/${product.slug}`,
    lastModified: product.updated_at || product.created_at,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: "https://tu-dominio.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://tu-dominio.com/productos",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://tu-dominio.com/contacto",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...productUrls,
  ]
}
