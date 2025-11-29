```typescript
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
  // Use anonymous client for build-time (no cookies available)
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: categories } = await supabase.from("categories").select("slug");

  return (
    categories?.map((category) => ({
      slug: category.slug,
    })) || []
  );
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
  console.log('[CategoryPage] Fetching category with slug:', slug);
  
  try {
    const category = await getCategoryBySlug(slug);
    console.log('[CategoryPage] Result:', category ? 'Found' : 'NULL');

    if (!category) {
      // DEBUG: Mostrar en pantalla por qué falló en lugar de 404
      return (
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold text-red-500">Categoría no encontrada</h1>
          <p className="mt-4">Slug buscado: {slug}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Posible causa: La categoría no existe en la base de datos o las políticas RLS de Supabase bloquean el acceso público.
          </p>
          <div className="mt-8">
            <Link href="/" className="btn btn-primary">Volver al inicio</Link>
          </div>
        </div>
      );
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
  } catch (error) {
    console.error('[CategoryPage] Error:', error);
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error del Servidor</h1>
        <p className="mt-4">Ocurrió un error al cargar la categoría.</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-left inline-block max-w-lg overflow-auto text-xs">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }
}
```
