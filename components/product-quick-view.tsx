"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  ShoppingCart,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/format";
import {
  getEffectivePrice,
  calculateDiscountPercentage,
} from "@/lib/utils/discount-utils";
import { SaleBadge } from "@/components/sale-badge";

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({
  product,
  open,
  onOpenChange,
}: ProductQuickViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  if (!product) return null;

  const inStock = product.stock > 0;
  const validImages = product.images.filter(
    (img) => img && !img.includes("placeholder")
  );
  const images =
    validImages.length > 0 ? validImages : product.images.slice(0, 1);
  const hasMultipleImages = images.length > 1;

  // Sale price logic
  const isOnSale = product.is_on_sale && product.sale_price;
  const effectivePrice = getEffectivePrice(product);
  const discountPercentage = isOnSale
    ? calculateDiscountPercentage(product.price, product.sale_price!)
    : 0;

  const handleAddToCart = async () => {
    if (!inStock || isAdding) return;

    setIsAdding(true);
    try {
      await addItem(product.id, 1);

      toast.success("¡Producto agregado!", {
        description: `${product.title} se agregó a tu carrito`,
        action: {
          label: "Ver carrito",
          onClick: () => {
            onOpenChange(false);
            router.push("/carrito");
          },
        },
      });
    } catch (error) {
      console.error("[v0] Error adding to cart:", error);
      toast.error("Error al agregar", {
        description: "No se pudo agregar el producto. Intenta de nuevo.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCurrentImageIndex(0);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{product.title}</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery */}
          <div className="relative bg-muted p-6">
            <div className="sticky top-6 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-background">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=600&width=600"}
                      alt={`${product.title} - imagen ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}

                {/* Navigation arrows */}
                {hasMultipleImages && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {hasMultipleImages && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                        index === currentImageIndex
                          ? "border-accent"
                          : "border-border hover:border-accent/50"
                      )}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-6">
            <div>
              <Badge variant="outline" className="mb-3">
                {product.category}
              </Badge>
              <h2 className="text-2xl font-bold mb-3">{product.title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-y border-border py-4">
              {/* Price Display */}
              <div className="mb-3">
                {isOnSale ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-accent">
                        {formatPrice(effectivePrice, product.currency)}
                      </span>
                      <span className="text-xl font-medium text-muted-foreground line-through">
                        {formatPrice(product.price, product.currency)}
                      </span>
                    </div>
                    <SaleBadge
                      originalPrice={product.price}
                      salePrice={product.sale_price!}
                      variant="inline"
                      size="default"
                    />
                  </div>
                ) : (
                  <span className="text-3xl font-bold">
                    {formatPrice(product.price, product.currency)}
                  </span>
                )}
              </div>

              {/* Stock Badge */}
              {inStock ? (
                <Badge
                  variant="outline"
                  className="bg-accent/10 text-accent border-accent"
                >
                  En stock ({product.stock} disponibles)
                </Badge>
              ) : (
                <Badge variant="secondary">Agotado</Badge>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || isAdding}
                className="w-full h-12 text-base"
              >
                {isAdding ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Agregando...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al carrito
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full h-12 text-base"
                onClick={() => onOpenChange(false)}
              >
                <Link href={`/producto/${product.slug}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver detalles completos
                </Link>
              </Button>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="font-semibold mb-2">Detalles del producto</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">SKU:</dt>
                  <dd className="font-medium">{product.sku}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Categoría:</dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Disponibilidad:</dt>
                  <dd className="font-medium">
                    {inStock ? `${product.stock} unidades` : "Agotado"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
