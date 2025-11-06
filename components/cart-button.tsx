"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCart } from "@/lib/context/cart-context"

export function CartButton() {
  const { itemCount } = useCart()

  return (
    <Link href="/carrito">
      <Button variant="ghost" size="icon" className="relative group glass-effect">
        <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
        {itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-white animate-in zoom-in-50 duration-200">
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
        <span className="sr-only">Carrito ({itemCount})</span>
      </Button>
    </Link>
  )
}
