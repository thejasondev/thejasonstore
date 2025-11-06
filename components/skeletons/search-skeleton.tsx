import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton para resultados de búsqueda
 */
export function SearchResultSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg">
      {/* Imagen */}
      <Skeleton className="h-12 w-12 rounded flex-shrink-0" />
      
      {/* Contenido */}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

/**
 * Lista de skeletons para búsqueda
 */
export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <SearchResultSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Skeleton para modal de búsqueda completo
 */
export function SearchModalSkeleton() {
  return (
    <div className="space-y-4">
      {/* Input skeleton */}
      <div className="flex items-center gap-2 border-b pb-4">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      
      {/* Resultados skeleton */}
      <div className="space-y-2 max-h-96">
        <SearchResultsSkeleton count={4} />
      </div>
    </div>
  )
}
