import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton para el carrusel de productos
 */
export function CarouselSkeleton() {
  return (
    <div className="relative">
      {/* Slide principal */}
      <div className="overflow-hidden rounded-xl">
        <Skeleton className="aspect-[16/9] md:aspect-[21/9] w-full" />
      </div>
      
      {/* Controles */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-2 w-8 rounded-full" />
        ))}
      </div>
      
      {/* Botones de navegación */}
      <Skeleton className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full" />
      <Skeleton className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full" />
    </div>
  )
}
