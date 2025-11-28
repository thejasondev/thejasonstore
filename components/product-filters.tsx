"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";
import { CategoryIcon } from "@/components/category-icon";
import type { Category } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface ProductFiltersProps {
  categories: Category[];
  onFilterChange: (filters: FilterState) => void;
  priceRange: { min: number; max: number };
}

export interface FilterState {
  query?: string;
  category?: string;
  currency?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?:
    | "price_asc"
    | "price_desc"
    | "newest"
    | "oldest"
    | "name_asc"
    | "name_desc";
}

export function ProductFilters({
  categories,
  onFilterChange,
  priceRange,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [priceValues, setPriceValues] = useState<number[]>([
    priceRange.min,
    priceRange.max,
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    setPriceValues([priceRange.min, priceRange.max]);
  }, [priceRange]);

  // Trigger filter change when debounced search changes
  useEffect(() => {
    if (debouncedSearchQuery !== filters.query) {
      const newFilters = {
        ...filters,
        query: debouncedSearchQuery || undefined,
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    }
  }, [debouncedSearchQuery]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceValues(values);
    const newFilters = { ...filters, minPrice: values[0], maxPrice: values[1] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {};
    setFilters(clearedFilters);
    setSearchQuery(""); // Clear search input
    setPriceValues([priceRange.min, priceRange.max]);
    onFilterChange(clearedFilters);
  };

  const activeFiltersCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof FilterState];
    return value !== undefined && value !== "" && value !== false;
  }).length;

  return (
    <div className="space-y-4">
      {/* Desktop Filters */}
      <div className="hidden lg:block glass-card p-6 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label>Buscar</Label>
          <Input
            placeholder="Nombre, descripción, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-card"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "category",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger className="glass-card">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  <div className="flex items-center gap-2">
                    <CategoryIcon
                      iconName={category.slug}
                      className="h-4 w-4"
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Currency Filter */}
        <div className="space-y-2">
          <Label>Moneda</Label>
          <Select
            value={filters.currency || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "currency",
                value === "all" ? undefined : value
              )
            }
          >
            <SelectTrigger className="glass-card">
              <SelectValue placeholder="Todas las monedas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las monedas</SelectItem>
              <SelectItem value="USD">
                <span className="flex items-center gap-2">💵 USD - Dólar</span>
              </SelectItem>
              <SelectItem value="EUR">
                <span className="flex items-center gap-2">💶 EUR - Euro</span>
              </SelectItem>
              <SelectItem value="CUP">
                <span className="flex items-center gap-2">
                  🇨🇺 CUP - Peso Cubano
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label>
            Rango de Precio
            {filters.currency && (
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                ({filters.currency})
              </span>
            )}
          </Label>
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={10}
            value={priceValues}
            onValueChange={handlePriceChange}
            className="py-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {filters.currency === "EUR"
                ? `${priceValues[0].toLocaleString()} €`
                : `${priceValues[0].toLocaleString()} ${
                    filters.currency || ""
                  }`}
            </span>
            <span>
              {filters.currency === "EUR"
                ? `${priceValues[1].toLocaleString()} €`
                : `${priceValues[1].toLocaleString()} ${
                    filters.currency || ""
                  }`}
            </span>
          </div>
        </div>

        {/* In Stock */}
        <div className="flex items-center justify-between">
          <Label htmlFor="in-stock">Solo en stock</Label>
          <Switch
            id="in-stock"
            checked={filters.inStock || false}
            onCheckedChange={(checked) =>
              handleFilterChange("inStock", checked)
            }
          />
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Ordenar por</Label>
          <Select
            value={filters.sortBy || "newest"}
            onValueChange={(value) => handleFilterChange("sortBy", value)}
          >
            <SelectTrigger className="glass-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguos</SelectItem>
              <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="name_asc">Nombre: A-Z</SelectItem>
              <SelectItem value="name_desc">Nombre: Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-14 glass-card bg-gradient-to-r from-accent/10 to-accent/5 border-2 border-accent/20 hover:border-accent/40 hover:bg-accent/10 transition-all duration-300 shadow-sm"
            >
              <div className="flex items-center justify-center gap-3 w-full">
                <div className="h-9 w-9 rounded-full bg-accent/20 flex items-center justify-center">
                  <Filter className="h-5 w-5 text-accent" />
                </div>
                <span className="text-base font-semibold">
                  Filtros de Búsqueda
                </span>
                {activeFiltersCount > 0 && (
                  <span className="ml-auto px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-bold shadow-sm">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[85vh] rounded-t-3xl border-t-2 border-border/50 p-0"
          >
            <div className="flex flex-col h-full">
              {/* Header fijo con diseño moderno */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border/50 px-6 py-4 z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Filter className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Filtros</h2>
                      {activeFiltersCount > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {activeFiltersCount}{" "}
                          {activeFiltersCount === 1
                            ? "filtro activo"
                            : "filtros activos"}
                        </p>
                      )}
                    </div>
                  </div>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-accent hover:text-accent/80 hover:bg-accent/10"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpiar
                    </Button>
                  )}
                </div>
                {/* Indicador visual de scroll */}
                <div className="w-12 h-1 bg-muted rounded-full mx-auto mt-2" />
              </div>

              {/* Contenido scrolleable con mejor espaciado */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Búsqueda con diseño destacado */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    {" "}
                    Buscar Producto
                  </Label>
                  <Input
                    placeholder="Nombre, descripción, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 text-base glass-card border-2 focus:border-accent transition-colors"
                  />
                </div>

                {/* Categoría con card */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    {" "}
                    Categoría
                  </Label>
                  <Select
                    value={filters.category || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "category",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger className="h-12 text-base glass-card border-2 hover:border-accent transition-colors">
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          <div className="flex items-center gap-2">
                            <CategoryIcon
                              iconName={category.slug}
                              className="h-4 w-4"
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Moneda con card */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Moneda
                  </Label>
                  <Select
                    value={filters.currency || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "currency",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger className="h-12 text-base glass-card border-2 hover:border-accent transition-colors">
                      <SelectValue placeholder="Todas las monedas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las monedas</SelectItem>
                      <SelectItem value="USD">
                        <span className="flex items-center gap-2">
                          💵 USD - Dólar
                        </span>
                      </SelectItem>
                      <SelectItem value="EUR">
                        <span className="flex items-center gap-2">
                          💶 EUR - Euro
                        </span>
                      </SelectItem>
                      <SelectItem value="CUP">
                        <span className="flex items-center gap-2">
                          🇨🇺 CUP - Peso Cubano
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Precio con card visual */}
                <div className="space-y-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <Label className="text-sm font-semibold text-foreground">
                    Rango de Precio
                    {filters.currency && (
                      <span className="ml-2 text-xs text-muted-foreground font-normal">
                        ({filters.currency})
                      </span>
                    )}
                  </Label>
                  <Slider
                    min={priceRange.min}
                    max={priceRange.max}
                    step={10}
                    value={priceValues}
                    onValueChange={handlePriceChange}
                    className="py-4"
                  />
                  <div className="flex items-center justify-between">
                    <div className="px-3 py-2 rounded-lg bg-background border border-border">
                      <span className="text-sm font-semibold">
                        {filters.currency === "EUR"
                          ? `${priceValues[0].toLocaleString()} €`
                          : `${priceValues[0].toLocaleString()} ${
                              filters.currency || ""
                            }`}
                      </span>
                    </div>
                    <div className="h-px flex-1 bg-border mx-2" />
                    <div className="px-3 py-2 rounded-lg bg-background border border-border">
                      <span className="text-sm font-semibold">
                        {filters.currency === "EUR"
                          ? `${priceValues[1].toLocaleString()} €`
                          : `${priceValues[1].toLocaleString()} ${
                              filters.currency || ""
                            }`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock con card interactivo */}
                <div className="p-4 rounded-xl bg-muted/50 border border-border hover:border-accent transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="in-stock-mobile"
                        className="text-sm font-semibold cursor-pointer"
                      >
                        Solo en stock
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Productos disponibles
                      </p>
                    </div>
                    <Switch
                      id="in-stock-mobile"
                      checked={filters.inStock || false}
                      onCheckedChange={(checked) =>
                        handleFilterChange("inStock", checked)
                      }
                    />
                  </div>
                </div>

                {/* Ordenar con diseño destacado */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    {" "}
                    Ordenar por
                  </Label>
                  <Select
                    value={filters.sortBy || "newest"}
                    onValueChange={(value) =>
                      handleFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger className="h-12 text-base glass-card border-2 hover:border-accent transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Más recientes</SelectItem>
                      <SelectItem value="oldest">Más antiguos</SelectItem>
                      <SelectItem value="price_asc">
                        Precio: menor a mayor
                      </SelectItem>
                      <SelectItem value="price_desc">
                        Precio: mayor a menor
                      </SelectItem>
                      <SelectItem value="name_asc">Nombre: A-Z</SelectItem>
                      <SelectItem value="name_desc">Nombre: Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Footer fijo con botón de aplicar */}
              <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t border-border/50 p-6">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
                >
                  Aplicar Filtros
                  {activeFiltersCount > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-accent-foreground/20 rounded-full text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
