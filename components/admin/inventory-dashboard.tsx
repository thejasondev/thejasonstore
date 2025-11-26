"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { AlertTriangle, Package } from "lucide-react"
import { getLowStockProducts, getOutOfStockProducts } from "@/lib/actions/inventory"
import type { LowStockProduct } from "@/lib/actions/inventory"
import Link from "next/link"

export function InventoryDashboard() {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [outOfStockProducts, setOutOfStockProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    setIsLoading(true)
    try {
      const [lowStock, outOfStock] = await Promise.all([getLowStockProducts(), getOutOfStockProducts()])
      setLowStockProducts(lowStock)
      setOutOfStockProducts(outOfStock)
    } catch (error) {
      console.error("[v0] Error loading inventory data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Low Stock Alert */}
      <Card className="glass-card border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Stock Bajo
          </CardTitle>
          <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length === 0 ? (
            <EmptyState
              title="Sin alertas de stock bajo"
              description="Por ahora todos los productos tienen niveles de stock saludables. Revisa este panel con frecuencia para anticiparte a futuras reposiciones."
              className="px-4 py-6 sm:px-6 sm:py-8"
            />
          ) : (
            <div className="space-y-2">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 rounded-lg glass-card">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <Badge variant="outline" className="ml-2 border-amber-500/50 text-amber-500">
                    {product.stock} unidades
                  </Badge>
                </div>
              ))}
              {lowStockProducts.length > 5 && (
                <Button variant="link" className="w-full text-accent" asChild>
                  <Link href="/admin/inventario">Ver todos ({lowStockProducts.length})</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Out of Stock Alert */}
      <Card className="glass-card border-red-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-red-500" />
            Sin Stock
          </CardTitle>
          <CardDescription>Productos agotados</CardDescription>
        </CardHeader>
        <CardContent>
          {outOfStockProducts.length === 0 ? (
            <EmptyState
              title="Sin productos agotados"
              description="Actualmente no hay artículos con stock en cero. Usa este panel para reaccionar rápido cuando algún producto se agote."
              className="px-4 py-6 sm:px-6 sm:py-8"
            />
          ) : (
            <div className="space-y-2">
              {outOfStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-2 rounded-lg glass-card">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <Badge variant="outline" className="ml-2 border-red-500/50 text-red-500">
                    Agotado
                  </Badge>
                </div>
              ))}
              {outOfStockProducts.length > 5 && (
                <Button variant="link" className="w-full text-accent" asChild>
                  <Link href="/admin/inventario">Ver todos ({outOfStockProducts.length})</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
