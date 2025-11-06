"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import { CategoryIcon } from "@/components/category-icon"
import type { Category } from "@/lib/types"

interface ProductFiltersProps {
  categories: Category[]
  onFilterChange: (filters: FilterState) => void
  priceRange: { min: number; max: number }
}

export interface FilterState {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  sortBy?: "price_asc" | "price_desc" | "newest" | "oldest" | "name_asc" | "name_desc"
}

export function ProductFilters({ categories, onFilterChange, priceRange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({})
  const [priceValues, setPriceValues] = useState<number[]>([priceRange.min, priceRange.max])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setPriceValues([priceRange.min, priceRange.max])
  }, [priceRange])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (values: number[]) => {
    setPriceValues(values)
    const newFilters = { ...filters, minPrice: values[0], maxPrice: values[1] }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {}
    setFilters(clearedFilters)
    setPriceValues([priceRange.min, priceRange.max])
    onFilterChange(clearedFilters)
  }

  const activeFiltersCount = Object.keys(filters).filter((key) => {
    const value = filters[key as keyof FilterState]
    return value !== undefined && value !== "" && value !== false
  }).length

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
            value={filters.query || ""}
            onChange={(e) => handleFilterChange("query", e.target.value)}
            className="glass-card"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}
          >
            <SelectTrigger className="glass-card">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  <div className="flex items-center gap-2">
                    <CategoryIcon iconName={category.slug} className="h-4 w-4" />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label>Rango de Precio</Label>
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={10}
            value={priceValues}
            onValueChange={handlePriceChange}
            className="py-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceValues[0]}</span>
            <span>${priceValues[1]}</span>
          </div>
        </div>

        {/* In Stock */}
        <div className="flex items-center justify-between">
          <Label htmlFor="in-stock">Solo en stock</Label>
          <Switch
            id="in-stock"
            checked={filters.inStock || false}
            onCheckedChange={(checked) => handleFilterChange("inStock", checked)}
          />
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Ordenar por</Label>
          <Select value={filters.sortBy || "newest"} onValueChange={(value) => handleFilterChange("sortBy", value)}>
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
            <Button variant="outline" className="w-full glass-card bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-accent text-accent-foreground rounded-full text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="glass-effect w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Same filters as desktop */}
              <div className="space-y-2">
                <Label>Buscar</Label>
                <Input
                  placeholder="Nombre, descripción, SKU..."
                  value={filters.query || ""}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                  className="glass-card"
                />
              </div>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}
                >
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        <div className="flex items-center gap-2">
                          <CategoryIcon iconName={category.slug} className="h-4 w-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Rango de Precio</Label>
                <Slider
                  min={priceRange.min}
                  max={priceRange.max}
                  step={10}
                  value={priceValues}
                  onValueChange={handlePriceChange}
                  className="py-4"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>${priceValues[0]}</span>
                  <span>${priceValues[1]}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="in-stock-mobile">Solo en stock</Label>
                <Switch
                  id="in-stock-mobile"
                  checked={filters.inStock || false}
                  onCheckedChange={(checked) => handleFilterChange("inStock", checked)}
                />
              </div>

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

              <Button onClick={() => setIsOpen(false)} className="w-full">
                Aplicar Filtros
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
