import Link from "next/link";
import { ArrowLeft, Tag as TagIcon, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ProductCard } from "@/components/product-card";
import { getSaleProducts } from "@/lib/actions/products";
import { STORE_NAME } from "@/lib/constants";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export const metadata = {
  title: `Ofertas y Descuentos | ${STORE_NAME}`,
  description:
    "Aprovecha las mejores ofertas y descuentos del marketplace. Productos en oferta con precios especiales por tiempo limitado. ¡No te pierdas estas increíbles promociones!",
  openGraph: {
    title: `Ofertas Especiales | ${STORE_NAME}`,
    description:
      "Descuentos increíbles en productos seleccionados. Aprovecha nuestras ofertas por tiempo limitado.",
  },
};

export default async function OfertasPage() {
  const saleProducts = await getSaleProducts(50); // Get up to 50 sale products

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Ofertas y Descuentos",
    description:
      "Productos en oferta con descuentos especiales por tiempo limitado",
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://thejasonstore.com"
    }/ofertas`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col gap-6">
              <Button
                variant="ghost"
                asChild
                className="w-fit pl-0 hover:bg-transparent hover:text-accent"
              >
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </Link>
              </Button>

              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[280px]">
                  <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
                    <TrendingDown className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium">
                      Precios Especiales
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
                    Ofertas Especiales
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Aprovecha descuentos increíbles en productos seleccionados.
                    Ofertas por tiempo limitado. ¡No dejes pasar estas
                    oportunidades!
                  </p>
                </div>

                {saleProducts.length > 0 && (
                  <div className="glass-card p-6 rounded-xl text-center min-w-[200px]">
                    <TagIcon className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <p className="text-3xl font-bold text-accent">
                      {saleProducts.length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ofertas Activas
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {saleProducts.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center max-w-2xl mx-auto">
                <TagIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h2 className="text-2xl font-semibold mb-2">
                  No hay ofertas activas
                </h2>
                <p className="text-muted-foreground mb-6">
                  Por el momento no tenemos productos en oferta. Vuelve pronto
                  para descubrir nuevas promociones.
                </p>
                <Button asChild size="lg">
                  <Link href="/productos">Ver Todos los Productos</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <p className="text-muted-foreground">
                    Mostrando {saleProducts.length}{" "}
                    {saleProducts.length === 1 ? "producto" : "productos"} en
                    oferta
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {saleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* CTA Section */}
          {saleProducts.length > 0 && (
            <section className="container mx-auto px-4 py-16">
              <div className="glass-card p-8 sm:p-12 rounded-2xl text-center max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  ¿Encontraste lo que buscabas?
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Aprovecha estas ofertas especiales antes de que terminen.
                  Contáctanos por WhatsApp si tienes alguna pregunta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="outline">
                    <Link href="/productos">Ver Más Productos</Link>
                  </Button>
                  <Button asChild size="lg">
                    <Link href="/contacto">Contactar por WhatsApp</Link>
                  </Button>
                </div>
              </div>
            </section>
          )}
        </main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
}
