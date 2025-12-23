import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getProductBySlug } from "@/lib/actions/products";
import { Badge } from "@/components/ui/badge";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ProductJsonLd } from "@/components/json-ld";
import { STORE_NAME } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Store } from "lucide-react";
import {
  getEffectivePrice,
  calculateDiscountPercentage,
  calculateSavings,
} from "@/lib/utils/discount-utils";
import { SaleBadge } from "@/components/sale-badge";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all products at build time
export async function generateStaticParams() {
  // Use anonymous client for build-time (no cookies available)
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: products } = await supabase.from("products").select("slug");

  return (
    products?.map((product) => ({
      slug: product.slug,
    })) || []
  );
}

// Force dynamic rendering - critical for production
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: `${product.title} - ${product.category} | ${STORE_NAME}`,
    description: `${product.description} Compra ${product.title} por WhatsApp. Precio: $${product.price} ${product.currency}. Vendedor verificado, envío rápido y compra segura.`,
    keywords: [
      product.title,
      product.category,
      "comprar por whatsapp",
      "producto de calidad",
      "vendedor verificado",
      product.sku,
      STORE_NAME,
    ],
    openGraph: {
      title: `${product.title} | ${STORE_NAME}`,
      description: `${product.description} - $${product.price} ${product.currency}`,
      images: product.images.map((img) => ({
        url: img,
        width: 800,
        height: 800,
        alt: product.title,
      })),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | ${STORE_NAME}`,
      description: `${product.description} - $${product.price} ${product.currency}`,
      images: product.images,
    },
    alternates: {
      canonical: `/producto/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  console.log("[ProductPage] Fetching product with slug:", slug);

  const product = await getProductBySlug(slug);
  console.log(
    "[ProductPage] Product fetched:",
    product ? "Found" : "NULL",
    product?.title
  );

  if (!product) {
    console.error("[ProductPage] Product not found, calling notFound()");
    notFound();
  }

  const inStock = product.stock > 0;
  const effectivePrice = getEffectivePrice(product);
  const isOnSale = product.is_on_sale && product.sale_price;
  const savings = isOnSale
    ? calculateSavings(product.price, product.sale_price!)
    : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <ProductJsonLd product={product} />

      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mt-2 mb-4">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Image Gallery - Mobile First with Curved Background */}
          <div className="space-y-4">
            {/* Main Image with Curved Background */}
            <div className="relative">
              {/* Curved Background - Only visible on Mobile */}
              <div className="absolute inset-0 bg-muted rounded-b-[40%] md:rounded-b-[30%] -z-10 transform scale-105 h-[90%]" />

              <div className="relative aspect-square overflow-hidden rounded-2xl md:rounded-3xl border border-border/50 bg-muted/50">
                <Image
                  src={
                    product.images[0] || "/placeholder.svg?height=600&width=600"
                  }
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Sale Badge on Image */}
                {isOnSale && product.sale_price && (
                  <SaleBadge
                    originalPrice={product.price}
                    salePrice={product.sale_price}
                    variant="corner"
                    size="lg"
                    className="top-4 left-4"
                  />
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {product.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted cursor-pointer hover:ring-2 hover:ring-accent transition-all"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} - imagen ${index + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12.5vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance leading-tight">
              {product.title}
            </h1>

            {/* Verified Store Badge - Mobile First Design */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm">{STORE_NAME}</span>
                    <BadgeCheck className="h-4 w-4 text-accent fill-accent/20" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Tienda oficial
                  </span>
                </div>
              </div>
              <Badge
                variant="outline"
                className="pill-shape bg-primary text-primary-foreground border-0 text-xs px-3"
              >
                Verificado
              </Badge>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="border-y border-border py-6">
              <div className="space-y-3">
                {isOnSale && product.sale_price ? (
                  <>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-green-600">
                        ${product.sale_price.toFixed(2)}
                      </span>
                      <span className="text-lg text-muted-foreground">
                        {product.currency}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-muted-foreground line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <Badge
                        variant="secondary"
                        className="h-6 px-2 text-xs bg-green-100 text-green-700 hover:bg-green-100"
                      >
                        Ahorras ${savings.toFixed(2)} (
                        {calculateDiscountPercentage(
                          product.price,
                          product.sale_price
                        )}
                        % OFF)
                      </Badge>
                    </div>
                  </>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-lg text-muted-foreground">
                      {product.currency}
                    </span>
                  </div>
                )}
              </div>
              {inStock ? (
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-accent"
                >
                  En stock ({product.stock} disponibles)
                </Badge>
              ) : (
                <Badge variant="secondary">Agotado</Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <WhatsAppButton product={product} />

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-accent" />
                  Compra segura
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-accent" />
                  Respuesta rápida
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-2">Detalles del producto</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Categoría:</dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">SKU:</dt>
                  <dd className="font-medium">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Disponibilidad:</dt>
                  <dd className="font-medium">
                    {inStock ? `${product.stock} unidades` : "Agotado"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
