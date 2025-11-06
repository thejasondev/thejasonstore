"use client"

import { ShoppingCart, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import type { CartItem } from "@/lib/types"
import Image from "next/image"
import { Minus, Plus, Trash2, X } from "lucide-react"
import { formatPrice } from "@/lib/utils/format"
import { getWhatsAppUrl } from "@/lib/utils/whatsapp"
import Link from "next/link"
import { useCart } from "@/lib/context/cart-context"
import { toast } from "sonner"

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { items: cartItems, itemCount, total, updateQuantity, removeItem } = useCart()

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setIsUpdating(true)
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      toast.error('Error al actualizar cantidad')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async (itemId: string, productName: string) => {
    try {
      await removeItem(itemId)
      toast.success('Producto eliminado', {
        description: `${productName} se eliminó del carrito`
      })
    } catch (error) {
      toast.error('Error al eliminar producto')
    }
  }

  const handleCheckout = () => {
    // Generate WhatsApp message with all cart items
    const products = cartItems
      .map((item) => {
        const product = item.product
        if (!product) return ""
        return `• ${product.title} (x${item.quantity}) - ${formatPrice(product.price * item.quantity, product.currency)}`
      })
      .join("\n")

    const total = cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0
      return sum + price * item.quantity
    }, 0)

    const message = `Hola, quiero realizar una compra:\n\n${products}\n\nTotal: ${formatPrice(total, "MXN")}\n\nMi nombre: ___`

    const url = getWhatsAppUrl(message)
    window.open(url, "_blank")
  }


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group glass-effect">
          <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-white animate-in zoom-in-50 duration-200">
              {itemCount > 99 ? '99+' : itemCount}
            </Badge>
          )}
          <span className="sr-only">Carrito ({itemCount})</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg glass-effect border-white/10 flex flex-col">
        <SheetHeader className="space-y-3 pb-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">Carrito</SheetTitle>
            {cartItems.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShoppingCart className="h-4 w-4" />
                <span>{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}</span>
              </div>
            )}
          </div>
          {cartItems.length > 0 && (
            <Link href="/carrito" className="w-full" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm" className="w-full gap-2">
                Ver carrito completo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </SheetHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Explora nuestro catálogo y agrega productos que te interesen
              </p>
              <Button asChild onClick={() => setIsOpen(false)} size="lg" className="gap-2">
                <Link href="/productos">
                  <ShoppingCart className="h-4 w-4" />
                  Explorar Productos
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Lista de productos con scroll */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent">
                {cartItems.map((item) => {
                  const product = item.product
                  if (!product) return null
                  const subtotal = product.price * item.quantity

                  return (
                    <div key={item.id} className="glass-card p-3 rounded-xl hover:shadow-lg transition-shadow">
                      <div className="flex gap-3">
                        {/* Imagen del producto */}
                        <Link 
                          href={`/producto/${product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 group"
                        >
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-110"
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </Link>

                        {/* Info del producto */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <Link 
                            href={`/producto/${product.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="font-medium text-sm line-clamp-2 hover:text-accent transition-colors mb-1"
                          >
                            {product.title}
                          </Link>
                          
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-accent font-bold">
                              {formatPrice(product.price, product.currency)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-xs text-muted-foreground">
                                x{item.quantity} = {formatPrice(subtotal, product.currency)}
                              </span>
                            )}
                          </div>

                          {/* Controles de cantidad */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={isUpdating}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={isUpdating || item.quantity >= product.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRemove(item.id, product.title)}
                              disabled={isUpdating}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer con total y CTA */}
              <div className="border-t border-border/50 pt-4 space-y-3 bg-background/95 backdrop-blur-sm">
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-bold text-accent">{formatPrice(total, "MXN")}</span>
                </div>

                <Separator />

                <Button 
                  onClick={handleCheckout} 
                  className="w-full gap-2" 
                  size="lg" 
                  disabled={isUpdating}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Comprar por WhatsApp
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Pago seguro al recibir
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
