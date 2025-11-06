"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ProductCard } from "@/components/product-card"
import { ProductFilters, type FilterState } from "@/components/product-filters"
import { searchProductsAdvanced, getPriceRange } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import type { Product, Category } from "@/lib/types"
import { ProductCardSkeleton } from "@/components/skeletons"
import { AlertCircle } from "lucide-react"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q")

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [searchQuery])

  const loadInitialData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [productsData, categoriesData, priceData] = await Promise.all([
        searchProductsAdvanced(searchQuery ? { query: searchQuery } : {}),
        getCategories(),
        getPriceRange(),
      ])
      setProducts(productsData.products)
      setTotal(productsData.total)
      setCategories(categoriesData)
      setPriceRange(priceData)

      if (productsData.total === 0) {
        setError("No hay productos disponibles. Por favor, ejecuta el script SQL de configuración.")
      }
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      setError("Error al cargar los productos. Por favor, verifica la configuración de la base de datos.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = async (filters: FilterState) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await searchProductsAdvanced({
        ...filters,
        query: searchQuery || filters.query,
      })
      setProducts(result.products)
      setTotal(result.total)
    } catch (error) {
      console.error("[v0] Error filtering products:", error)
      setError("Error al filtrar productos.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Todos los Productos"}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Descubre miles de productos de calidad de vendedores confiables. Mejores precios y ofertas exclusivas.
          </p>
        </div>

        {error && (
          <div className="mb-6 glass-card rounded-2xl p-6 border-l-4 border-accent">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Configuración Requerida</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ejecuta el script <code className="bg-muted px-2 py-1 rounded">scripts/SETUP_FINAL.sql</code> en tu
                  Supabase SQL Editor.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside>
            <ProductFilters categories={categories} onFilterChange={handleFilterChange} priceRange={priceRange} />
          </aside>

          {/* Products Grid */}
          <div>
            <div className="mb-4 text-sm text-muted-foreground">
              {isLoading ? "Cargando..." : `${total} productos encontrados`}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 glass-card rounded-2xl">
                <p className="text-lg text-muted-foreground">
                  No se encontraron productos con los filtros seleccionados.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
