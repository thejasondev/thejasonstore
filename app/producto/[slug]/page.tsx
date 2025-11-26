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
import { ArrowLeft } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

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
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const inStock = product.stock > 0;

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
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
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
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
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
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-4">
                {product.category}
              </Badge>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-balance">
                {product.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-y border-border py-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-muted-foreground">
                  {product.currency}
                </span>
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

            <div className="space-y-4">
              <WhatsAppButton product={product} />

              <div className="text-sm text-muted-foreground space-y-2">
                <p>• SKU: {product.sku}</p>
                <p>• Compra segura por WhatsApp</p>
                <p>• Respuesta inmediata</p>
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
