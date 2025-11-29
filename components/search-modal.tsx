"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  X,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { searchProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import type { Product, Category } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";
import { CategoryIcon } from "@/components/category-icon";
import { SearchResultsSkeleton } from "@/components/skeletons";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchSuggestion {
  type: "product" | "category" | "recent";
  data: Product | Category | string;
  score?: number;
}

const POPULAR_SEARCHES = [
  "Electrónica",
  "Moda",
  "Hogar",
  "Deportes",
  "Ofertas",
  "Nuevos productos",
];

const MAX_RECENT_SEARCHES = 5;
const MAX_RESULTS = 8;
const DEBOUNCE_MS = 250;

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load recent searches and categories
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing recent searches:", e);
        }
      }

      // Load categories for suggestions
      getCategories().then((cats) => setCategories(cats));

      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Reset state when closing
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [open]);

  // Global keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  // Debounced search with advanced suggestions
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const products = await searchProducts(query);
        setResults(products.slice(0, MAX_RESULTS));

        // Generate smart suggestions
        const newSuggestions: SearchSuggestion[] = [];

        // Add matching categories
        const matchingCategories = categories.filter((cat) =>
          cat.name.toLowerCase().includes(query.toLowerCase())
        );
        matchingCategories.forEach((cat) => {
          newSuggestions.push({ type: "category", data: cat });
        });

        // Add product results
        products.slice(0, 6).forEach((product) => {
          newSuggestions.push({ type: "product", data: product });
        });

        setSuggestions(newSuggestions);
      } catch (error) {
        console.error("[v0] Search error:", error);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query, categories]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!query) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else if (query.trim()) {
            handleSearch(query);
          }
          break;
        case "Escape":
          e.preventDefault();
          if (query) {
            setQuery("");
            setSelectedIndex(-1);
          } else {
            onOpenChange(false);
          }
          break;
      }
    },
    [query, selectedIndex, suggestions, onOpenChange]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      selectedElement?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      // Save to recent searches
      const updated = [
        searchQuery,
        ...recentSearches.filter(
          (s) => s.toLowerCase() !== searchQuery.toLowerCase()
        ),
      ].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));

      // Navigate to products page with search
      window.location.href = `/productos?q=${encodeURIComponent(searchQuery)}`;
    },
    [recentSearches]
  );

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "product") {
      const product = suggestion.data as Product;
      handleSearch(query);
      window.location.href = `/producto/${product.slug}`;
    } else if (suggestion.type === "category") {
      const category = suggestion.data as Category;
      handleSearch(category.name);
      window.location.href = `/categoria/${category.slug}`;
    } else {
      const searchTerm = suggestion.data as string;
      handleSearch(searchTerm);
    }
    onOpenChange(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-accent/20 text-accent font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Calculate result metrics
  const resultsByCategory = results.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-3xl p-0 gap-0 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl sm:rounded-xl overflow-hidden"
      >
        {/* Accessible Title (Hidden) */}
        <DialogTitle className="sr-only">Búsqueda de productos</DialogTitle>

        {/* Search Header */}
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 pr-9 h-11 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-accent/50 focus-visible:ring-0 transition-all rounded-xl text-base"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedIndex(-1);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 p-0.5 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 text-muted-foreground transition-colors"
                title="Borrar texto"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Borrar texto</span>
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="shrink-0 text-base font-medium text-accent hover:text-accent/80 hover:bg-transparent px-2"
          >
            Cancelar
          </Button>
        </div>

        {/* Search Results */}
        <div className="max-h-[70vh] overflow-y-auto" ref={resultsRef}>
          {loading && (
            <div className="py-4">
              <SearchResultsSkeleton count={4} />
            </div>
          )}

          {/* Results with metrics */}
          {!loading && query && suggestions.length > 0 && (
            <div className="p-4">
              {/* Metrics Banner */}
              {results.length > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">
                        {results.length} resultado
                        {results.length !== 1 ? "s" : ""} encontrado
                        {results.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {Object.keys(resultsByCategory).length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {Object.entries(resultsByCategory)
                          .slice(0, 3)
                          .map(([cat, count]) => (
                            <Badge
                              key={cat}
                              variant="outline"
                              className="text-xs"
                            >
                              <CategoryIcon
                                iconName={cat}
                                className="h-3 w-3 mr-1"
                              />
                              {cat}: {count}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-semibold">Resultados</h3>
                {results.length > MAX_RESULTS && (
                  <Link
                    href={`/productos?q=${encodeURIComponent(query)}`}
                    className="text-sm text-accent hover:underline flex items-center gap-1"
                    onClick={() => {
                      handleSearch(query);
                      onOpenChange(false);
                    }}
                  >
                    Ver todos ({results.length})
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>

              <div className="grid gap-1">
                {suggestions.map((suggestion, index) => {
                  const isSelected = selectedIndex === index;

                  if (suggestion.type === "category") {
                    const category = suggestion.data as Category;
                    return (
                      <button
                        key={`cat-${category.id}`}
                        data-index={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                          isSelected
                            ? "bg-accent/10 border border-accent"
                            : "glass-card glass-hover border border-transparent"
                        )}
                      >
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <CategoryIcon
                            iconName={category.icon || category.slug}
                            className="h-5 w-5 text-accent"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {highlightMatch(category.name, query)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Ver productos en esta categoría
                          </p>
                        </div>
                        <ArrowRight
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform",
                            isSelected && "translate-x-1 text-accent"
                          )}
                        />
                      </button>
                    );
                  }

                  if (suggestion.type === "product") {
                    const product = suggestion.data as Product;
                    return (
                      <button
                        key={`prod-${product.id}`}
                        data-index={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "flex items-center gap-4 p-3 rounded-lg text-left transition-all",
                          isSelected
                            ? "bg-accent/10 border border-accent"
                            : "glass-card glass-hover border border-transparent"
                        )}
                      >
                        <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className={cn(
                              "object-cover transition-transform",
                              isSelected && "scale-110"
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={cn(
                              "font-medium truncate transition-colors",
                              isSelected && "text-accent"
                            )}
                          >
                            {highlightMatch(product.title, query)}
                          </h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <CategoryIcon
                              iconName={product.category}
                              className="h-3 w-3"
                            />
                            {product.category}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-accent">
                            {formatPrice(product.price, product.currency)}
                          </p>
                          {product.stock > 0 ? (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              En stock
                            </p>
                          ) : (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              Agotado
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && query && suggestions.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">No encontramos resultados</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Intenta con otros términos de búsqueda
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="text-xs text-muted-foreground">
                  Sugerencias:
                </span>
                {POPULAR_SEARCHES.slice(0, 3).map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="text-xs px-3 py-1 rounded-full glass-card glass-hover"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state - Recent & Popular searches */}
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
                          setQuery(search);
                        }}
                        className="px-4 py-2 rounded-full glass-card glass-hover text-sm transition-all hover:scale-105 hover:border-accent"
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
                        setQuery(search);
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
  );
}
