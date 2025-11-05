import { Suspense } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ProductCard } from "@/components/product-card"
import { CategoryIcon } from "@/components/category-icon"
import { getProducts, getProductsByCategory } from "@/lib/actions/products"
import { CATEGORIES, STORE_NAME } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductsPageProps {
  searchParams: Promise<{ categoria?: string }>
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams
  const category = CATEGORIES.find((cat) => cat.slug === params.categoria)

  if (category) {
    return {
      title: `${category.name} - Productos de Calidad | ${STORE_NAME}`,
      description: `Descubre nuestra selección de productos en ${category.name}. Vendedores verificados, mejores precios y compra segura por WhatsApp. Envío rápido y garantía de calidad.`,
      openGraph: {
        title: `${category.name} | ${STORE_NAME}`,
        description: `Explora productos de ${category.name} de vendedores confiables. Mejores ofertas y precios competitivos.`,
      },
    }
  }

  return {
    title: `Todos los Productos | ${STORE_NAME} - Marketplace Online`,
    description:
      "Explora miles de productos de vendedores verificados. Electrónica, moda, hogar, deportes, libros, juguetes y más. Compra seguro por WhatsApp con las mejores ofertas.",
    openGraph: {
      title: `Catálogo Completo | ${STORE_NAME}`,
      description: "Miles de productos de calidad en un solo lugar. Vendedores verificados y mejores precios.",
    },
  }
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-8 w-1/2" />
    </div>
  )
}

async function ProductsList({ categoria }: { categoria?: string }) {
  const products = categoria ? await getProductsByCategory(categoria) : await getProducts()

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">
          No se encontraron productos en esta categoría. Explora otras categorías o contáctanos por WhatsApp.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const selectedCategory = params.categoria
  const categoryName = CATEGORIES.find((cat) => cat.slug === selectedCategory)?.name

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {categoryName ? `Productos de ${categoryName}` : "Todos los Productos"}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {categoryName
              ? `Explora nuestra selección curada de productos en ${categoryName} de vendedores verificados`
              : "Descubre miles de productos de calidad de vendedores confiables. Mejores precios y ofertas exclusivas."}
          </p>
        </div>

        {/* Category Filters */}
        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Filtros de categoría">
          <Button variant={!selectedCategory ? "default" : "outline"} asChild className="gap-2">
            <a href="/productos">Todos</a>
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              asChild
              className="gap-2"
            >
              <a href={`/productos?categoria=${category.slug}`} aria-label={`Filtrar por ${category.name}`}>
                <CategoryIcon iconName={category.icon || "Laptop"} className="h-4 w-4" />
                {category.name}
              </a>
            </Button>
          ))}
        </nav>

        {/* Products Grid */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ProductsList categoria={selectedCategory} />
        </Suspense>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
