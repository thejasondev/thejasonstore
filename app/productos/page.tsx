"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, type FilterState } from "@/components/product-filters";
import { searchProductsAdvanced, getPriceRange } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import type { Product, Category } from "@/lib/types";
import { ProductCardSkeleton } from "@/components/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { AlertCircle, Search } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductQuickView } from "@/components/product-quick-view";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [searchQuery]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData, priceData] = await Promise.all([
        searchProductsAdvanced(searchQuery ? { query: searchQuery } : {}),
        getCategories(),
        getPriceRange(),
      ]);
      setProducts(productsData.products);
      setTotal(productsData.total);
      setCategories(categoriesData);
      setPriceRange(priceData);
    } catch (error) {
      console.error("[v0] Error loading data:", error);
      setError(
        "Hubo un problema al cargar los productos. Por favor intenta recargar la página."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = async (filters: FilterState) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await searchProductsAdvanced({
        ...filters,
        query: searchQuery || filters.query,
      });
      setProducts(result.products);
      setTotal(result.total);
    } catch (error) {
      console.error("[v0] Error filtering products:", error);
      setError("Error al filtrar productos.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto mb-4 px-4 sm:px-6 lg:px-8">
        <div className="mt-6 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Página principal
          </Link>
        </div>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            {searchQuery
              ? `Resultados para "${searchQuery}"`
              : "Todos los Productos"}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
            Descubre miles de productos de calidad de vendedores confiables.
            Mejores precios y ofertas exclusivas.
          </p>
        </div>

        {error && (
          <div className="mb-6 glass-card rounded-2xl p-6 border-l-4 border-destructive/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Lo sentimos</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside>
            <ProductFilters
              categories={categories}
              onFilterChange={handleFilterChange}
              priceRange={priceRange}
            />
          </aside>

          {/* Products Grid */}
          <div>
            <div className="mb-4 text-sm text-muted-foreground">
              {isLoading ? "Cargando..." : `${total} productos encontrados`}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={<Search className="h-6 w-6 text-accent" />}
                title="No se encontraron productos"
                description="No hay productos que coincidan con la búsqueda y los filtros seleccionados. Prueba ajustar los filtros o ver todo el catálogo disponible."
              >
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/productos">Limpiar filtros</Link>
                </Button>
              </EmptyState>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      />
    </div>
  );
}
