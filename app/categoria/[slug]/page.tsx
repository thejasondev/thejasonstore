import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ProductCard } from "@/components/product-card";
import { getCategoryBySlug } from "@/lib/actions/categories";
import { searchProductsAdvanced } from "@/lib/actions/products";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { STORE_NAME } from "@/lib/constants";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all categories at build time
export async function generateStaticParams() {
  const { getAllCategories } = await import("@/lib/actions/categories");
  const categories = await getAllCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Force dynamic rendering - critical for production
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoría no encontrada",
    };
  }

  return {
    title: `${category.name} | ${STORE_NAME}`,
    description: category.description || `Productos de ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  console.log("[CategoryPage] Fetching category with slug:", slug);

  const category = await getCategoryBySlug(slug);
  console.log(
    "[CategoryPage] Category fetched:",
    category ? "Found" : "NULL",
    category?.name
  );

  if (!category) {
    console.error("[CategoryPage] Category not found, calling notFound()");
    notFound();
  }

  // Get products for this category
  const { products } = await searchProductsAdvanced({
    category: slug,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back navigation */}
        <div className="mt-2 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>

        {/* Category header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-muted-foreground text-lg">
              {category.description}
            </p>
          )}
        </div>

        {/* Products grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No hay productos disponibles en esta categoría
            </p>
            <Link href="/productos" className="text-accent hover:underline">
              Ver todos los productos
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
