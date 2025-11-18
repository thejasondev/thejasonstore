import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ProductCard } from "@/components/product-card"
import { CategoryIcon } from "@/components/category-icon"
import { getCategoryWithProducts } from "@/lib/actions/categories"
import { STORE_NAME } from "@/lib/constants"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const { category } = await getCategoryWithProducts(slug)

  if (!category) {
    return {
      title: "Categoría no encontrada",
    }
  }

  const title = `${category.name} | ${STORE_NAME}`
  const description =
    category.description || `Explora los mejores productos de la categoría ${category.name} en ${STORE_NAME}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: `/categoria/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const { category, products } = await getCategoryWithProducts(slug)

  if (!category) {
    notFound()
  }

  const hasProducts = products.length > 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
              <CategoryIcon iconName={category.slug} className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{category.name}</h1>
              {category.description && (
                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">{category.description}</p>
              )}
            </div>
          </div>

          <Link
            href="/productos"
            className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-2"
          >
            <span>Ver todas las categorías</span>
          </Link>
        </div>

        {!hasProducts ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <p className="text-muted-foreground">
              Aún no hay productos asociados a esta categoría. Crea nuevos productos desde el panel de administración.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
