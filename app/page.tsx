import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Store,
  ShoppingBag,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ProductsCarousel } from "@/components/products-carousel";
import { CategoryIcon } from "@/components/category-icon";
import { getFeaturedProducts, getSaleProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { getActiveBanners } from "@/lib/actions/banners";
import { BannerRenderer } from "@/components/banners/banner-renderer";
import type { Category, Banner } from "@/lib/types";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";

// Forzar renderizado dinámico para soportar autenticación
export const dynamic = "force-dynamic";

export const metadata = {
  title: `${STORE_NAME} | ${STORE_TAGLINE} - Miles de Productos en un Solo Lugar`,
  description:
    "Descubre miles de productos de vendedores verificados en nuestro marketplace. Electrónica, moda, hogar, deportes y más. Compra seguro por WhatsApp con las mejores ofertas y precios.",
  openGraph: {
    title: `${STORE_NAME} | Marketplace Online con Miles de Productos`,
    description:
      "Conectamos compradores con vendedores de confianza. Gran variedad de productos, mejores precios y compra fácil por WhatsApp.",
  },
};

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let saleProducts: any[] = [];
  let categories: Category[] = [];
  let banners: Banner[] = [];
  let hasError = false;

  try {
    const [productsData, saleProductsData, categoriesData, bannersData] =
      await Promise.all([
        getFeaturedProducts(6), // Only featured products
        getSaleProducts(6), // Only sale products
        getCategories(),
        getActiveBanners(),
      ]);
    featuredProducts = productsData;
    saleProducts = saleProductsData;
    categories = categoriesData;
    banners = bannersData;
  } catch (error) {
    console.error("[v0] Error loading home data:", error);
    hasError = true;
  }

  // Filter banners by position
  const heroBanners = banners.filter((b) => b.position === "hero");
  const sliderBanners = banners.filter((b) => b.position === "slider");
  const infoBanners = banners.filter((b) => b.position === "info");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: STORE_NAME,
    description:
      "Marketplace online con miles de productos de calidad. Conectamos vendedores con compradores para ofrecerte las mejores ofertas.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://thejasonstore.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://thejasonstore.com"
        }/productos?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const hasHeroBanners = banners.some(
    (b) => b.position === "hero" || b.position === "slider"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section - Dynamic or Static */}
          {hasHeroBanners ? (
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <BannerRenderer banners={banners} position="hero" />
              <div className="mt-4">
                <BannerRenderer banners={banners} position="slider" />
              </div>
            </section>
          ) : (
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32 relative">
              <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
              <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
                style={{ animationDelay: "3s" }}
              />

              <div className="max-w-4xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6">
                  <Store className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">
                    Marketplace de Confianza
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 sm:mb-6 text-balance">
                  Miles de Productos, Un Solo Lugar
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-pretty max-w-2xl mx-auto px-4">
                  Conectamos vendedores verificados con compradores como tú.
                  Descubre ofertas increíbles en electrónica, moda, hogar,
                  deportes y mucho más. Compra fácil y seguro por WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="text-base bg-primary hover:bg-primary/90 relative overflow-hidden group"
                  >
                    <Link href="/productos">
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative z-10">Explorar Productos</span>
                      <ArrowRight className="ml-2 h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-base glass-card glass-hover bg-transparent"
                  >
                    <Link href="/contacto">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Contactar Ahora
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          )}
          {/* Trust Indicators - Desktop Only */}
          <section className="hidden md:block border-y border-border/50 glass py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold">Miles de Productos</h3>
                  <p className="text-sm text-muted-foreground">
                    Gran variedad de categorías y marcas
                  </p>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold">Vendedores Verificados</h3>
                  <p className="text-sm text-muted-foreground">
                    Todos nuestros vendedores son confiables
                  </p>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold">Mejores Ofertas</h3>
                  <p className="text-sm text-muted-foreground">
                    Precios competitivos y promociones
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Info Banners */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BannerRenderer banners={banners} position="info" />
          </section>

          {/* Categories Section - Horizontal Scroll Mobile-First */}
          <section className="py-8 sm:py-12 lg:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold">Categorías</h2>
                <Link
                  href="/productos"
                  className="text-sm text-accent hover:underline"
                >
                  Ver todo
                </Link>
              </div>

              {categories.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <p className="text-muted-foreground">
                    Aún no hay categorías configuradas. Crea nuevas categorías
                    en Supabase para comenzar a mostrarlas aquí.
                  </p>
                </div>
              ) : (
                /* Horizontal Scroll on Mobile, Grid on Desktop */
                <div className="scroll-container gap-3 pb-2 md:grid md:grid-cols-4 lg:grid-cols-6 md:gap-4 md:overflow-visible">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categoria/${category.slug}`}
                      className="scroll-item flex flex-col items-center justify-center w-20 sm:w-24 md:w-auto p-3 sm:p-4 md:p-6 rounded-2xl glass-card glass-hover group"
                      aria-label={`Ver productos de ${category.name}`}
                    >
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-accent/10 flex items-center justify-center mb-2 group-hover:bg-accent/20 transition-colors">
                        <CategoryIcon
                          iconName={category.icon || category.slug}
                          className="h-6 w-6 sm:h-7 sm:w-7 text-accent group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-center line-clamp-1">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Featured Products */}
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-muted/30">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  Productos Destacados
                </h2>
                <p className="text-muted-foreground">
                  Las mejores ofertas seleccionadas para ti
                </p>
              </div>
              <Button asChild variant="ghost" className="group hidden md:flex">
                <Link href="/productos">
                  Ver todos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            {featuredProducts.length > 0 ? (
              <ProductsCarousel
                products={featuredProducts}
                autoPlayInterval={5000}
              />
            ) : (
              <div className="text-center py-12 glass-card rounded-lg">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">Próximamente</h3>
                <p className="text-muted-foreground mb-4">
                  Estamos preparando productos increíbles para ti. Vuelve
                  pronto.
                </p>
                {hasError && (
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    Nota: Asegúrate de ejecutar los scripts SQL en la carpeta
                    /scripts para configurar la base de datos.
                  </p>
                )}
              </div>
            )}
            <div className="text-center mt-8 md:hidden">
              <Button
                asChild
                variant="outline"
                className="group bg-transparent"
              >
                <Link href="/productos">
                  Ver todos los productos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Sale Products Section */}
          {saleProducts.length > 0 && (
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-accent/5">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                    Ofertas Especiales
                  </h2>
                  <p className="text-muted-foreground">
                    Descuentos increíbles por tiempo limitado
                  </p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="group hidden md:flex"
                >
                  <Link href="/ofertas">
                    Ver todas
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <ProductsCarousel
                products={saleProducts}
                autoPlayInterval={5000}
              />
              <div className="text-center mt-8 md:hidden">
                <Button
                  asChild
                  variant="outline"
                  className="group bg-transparent"
                >
                  <Link href="/ofertas">
                    Ver todas las ofertas
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center glass-card p-12 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-accent/10 to-transparent" />
              <MessageCircle className="h-12 w-12 mx-auto mb-6 text-accent relative z-10 animate-float" />
              <h2 className="text-3xl font-bold mb-4 relative z-10">
                ¿Listo para Comprar?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed relative z-10">
                Contáctanos por WhatsApp y te ayudaremos a encontrar el producto
                perfecto. Respuesta inmediata garantizada.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground relative z-10 animate-glow"
              >
                <a
                  href={`https://wa.me/5353118193?text=${encodeURIComponent(
                    "Hola, quiero información sobre los productos de The Jason Store"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contactar por WhatsApp
                </a>
              </Button>
            </div>
          </section>
        </main>

        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
}
