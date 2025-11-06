"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, X, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchProducts } from "@/lib/actions/products"
import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils/format"
import { CategoryIcon } from "@/components/category-icon"
import { SearchResultsSkeleton } from "@/components/skeletons"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const POPULAR_SEARCHES = ["Electrónica", "Moda", "Hogar", "Deportes", "Ofertas", "Nuevos productos"]

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem("recentSearches")
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(true)
      }
      // ESC to close
      if (e.key === "Escape" && open) {
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const products = await searchProducts(query)
        setResults(products.slice(0, 6)) // Limit to 6 results
      } catch (error) {
        console.error("[v0] Search error:", error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return

      // Save to recent searches
      const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      // Navigate to products page with search
      window.location.href = `/productos?q=${encodeURIComponent(searchQuery)}`
    },
    [recentSearches],
  )

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 bg-background/95 backdrop-blur-xl border-border/50">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-6 border-b border-border/50">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSearch(query)
              }
            }}
            className="border-0 focus-visible:ring-0 text-lg h-auto p-0 bg-transparent"
          />
          {query && (
            <Button variant="ghost" size="icon" onClick={() => setQuery("")} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="py-4">
              <SearchResultsSkeleton count={4} />
            </div>
          )}

          {!loading && query && results.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-semibold">Resultados</h3>
                <Link
                  href={`/productos?q=${encodeURIComponent(query)}`}
                  className="text-sm text-accent hover:underline flex items-center gap-1"
                  onClick={() => onOpenChange(false)}
                >
                  Ver todos
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid gap-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/producto/${product.slug}`}
                    onClick={() => {
                      handleSearch(query)
                      onOpenChange(false)
                    }}
                    className="flex items-center gap-4 p-3 rounded-lg glass-card glass-hover group"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate group-hover:text-accent transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <CategoryIcon category={product.category} className="h-3 w-3" />
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-accent">{formatPrice(product.price)}</p>
                      {product.stock > 0 ? (
                        <p className="text-xs text-green-500">En stock</p>
                      ) : (
                        <p className="text-xs text-red-500">Agotado</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No encontramos resultados</h3>
              <p className="text-sm text-muted-foreground">Intenta con otros términos de búsqueda</p>
            </div>
          )}

          {!query && (
            <div className="p-6 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Búsquedas recientes
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs h-auto p-1 text-muted-foreground hover:text-foreground"
                    >
                      Limpiar
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search)
                          handleSearch(search)
                        }}
                        className="px-4 py-2 rounded-full glass-card glass-hover text-sm transition-all hover:scale-105"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Búsquedas populares
                </h3>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search)
                        handleSearch(search)
                      }}
                      className="px-4 py-2 rounded-full glass-card glass-hover text-sm transition-all hover:scale-105 hover:border-accent"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
