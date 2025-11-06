import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loader para ProductCard
 * Muestra un placeholder mientras se cargan los productos
 */
export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden glass-card border-border/50 h-full flex flex-col">
      {/* Imagen skeleton */}
      <Skeleton className="aspect-square w-full" />
      
      {/* Contenido skeleton */}
      <CardContent className="p-4 flex-1 space-y-2">
        {/* Título */}
        <Skeleton className="h-6 w-3/4" />
        {/* Descripción línea 1 */}
        <Skeleton className="h-4 w-full" />
        {/* Descripción línea 2 */}
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      
      {/* Footer skeleton */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="space-y-1">
          {/* Precio */}
          <Skeleton className="h-8 w-20" />
          {/* Moneda */}
          <Skeleton className="h-3 w-12" />
        </div>
        {/* Badge stock */}
        <Skeleton className="h-6 w-24 rounded-full" />
      </CardFooter>
    </Card>
  )
}

/**
 * Grid de skeletons para múltiples productos
 */
export function ProductsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
