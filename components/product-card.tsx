"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCart } from "@/lib/context/cart-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const { addItem } = useCart()
  const inStock = product.stock > 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!inStock || isAdding) return

    setIsAdding(true)
    try {
      await addItem(product.id, 1)
      
      toast.success('¡Producto agregado!', {
        description: `${product.title} se agregó a tu carrito`,
        action: {
          label: 'Ver carrito',
          onClick: () => router.push('/carrito')
        },
      })
    } catch (error) {
      console.error("[v0] Error adding to cart:", error)
      toast.error('Error al agregar', {
        description: 'No se pudo agregar el producto. Intenta de nuevo.',
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Link href={`/producto/${product.slug}`}>
      <Card className="group overflow-hidden glass-card glass-hover border-border/50 h-full flex flex-col">
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

          {inStock && (
            <>
              {/* Botón visible en móvil, hover en desktop */}
              <div className="absolute bottom-4 right-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                  size="icon" 
                  className="glass-effect shadow-lg hover:scale-110 transition-transform" 
                  onClick={handleAddToCart} 
                  disabled={isAdding}
                  aria-label="Agregar al carrito"
                >
                  {isAdding ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
        <CardContent className="p-4 flex-1">
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
              {product.stock} disponibles
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
