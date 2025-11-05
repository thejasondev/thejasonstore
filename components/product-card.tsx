import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0

  return (
    <Link href={`/producto/${product.slug}`}>
      <Card className="group overflow-hidden glass-card glass-hover border-border/50">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0] || "/placeholder.svg?height=400&width=400"}
            alt={product.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {!inStock && (
            <div className="absolute inset-0 glass flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Agotado
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-balance group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            <span className="text-xs text-muted-foreground">{product.currency}</span>
          </div>
          {inStock && (
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/50">
              En stock
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
