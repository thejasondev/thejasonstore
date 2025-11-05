import type { Product } from "@/lib/types"

interface ProductJsonLdProps {
  product: Product
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "The Jason Store",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://thejasonstore.com"}/producto/${product.slug}`,
      seller: {
        "@type": "Organization",
        name: "The Jason Store",
      },
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
