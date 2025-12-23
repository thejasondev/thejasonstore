"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Check,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/lib/context/cart-context";
import { useFavorites } from "@/lib/context/favorites-context";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/format";
import { SaleBadge } from "@/components/sale-badge";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const inStock = product.stock > 0;
  const isProductFavorite = isFavorite(product.id);

  // Filter out placeholder images
  const validImages = product.images.filter(
    (img) => img && !img.includes("placeholder")
  );
  const images =
    validImages.length > 0 ? validImages : product.images.slice(0, 1);
  const hasMultipleImages = images.length > 1;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock || isAdding) return;

    setIsAdding(true);
    try {
      await addItem(product.id, 1);

      toast.success("¡Producto agregado!", {
        description: `${product.title} se agregó a tu carrito`,
        action: {
          label: "Ver carrito",
          onClick: () => router.push("/carrito"),
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 400);

    if (!isProductFavorite) {
      toast.success("¡Agregado a favoritos!", {
        description: product.title,
        icon: "❤️",
      });
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const startX = touch.clientX;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const currentX = moveEvent.touches[0].clientX;
        const diff = startX - currentX;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
          } else {
            setCurrentImageIndex(
              (prev) => (prev - 1 + images.length) % images.length
            );
          }
          document.removeEventListener("touchmove", handleTouchMove);
        }
      };

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener(
        "touchend",
        () => {
          document.removeEventListener("touchmove", handleTouchMove);
        },
        { once: true }
      );
    },
    [images.length]
  );

  return (
    <Link href={`/producto/${product.slug}`}>
      <Card
        className="group overflow-hidden glass-card glass-hover border-border/50 h-full flex flex-col"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Main Image with smooth transitions */}
          {images.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === currentImageIndex
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0"
              )}
            >
              <Image
                src={image || "/placeholder.svg?height=400&width=400"}
                alt={`${product.title} - imagen ${index + 1}`}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

          {/* Favorite Button - Mobile First (always visible) */}
          <button
            onClick={handleFavoriteToggle}
            className={cn(
              "favorite-btn absolute top-3 right-3 z-40 h-9 w-9 rounded-full flex items-center justify-center transition-all",
              "bg-white/90 dark:bg-black/70 backdrop-blur-sm shadow-lg",
              "hover:scale-110 active:scale-95",
              heartAnimating && isProductFavorite && "is-favorite"
            )}
            aria-label={
              isProductFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
            }
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isProductFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 dark:text-gray-300"
              )}
            />
          </button>

          {/* Sale Badge */}
          {product.is_on_sale && product.sale_price && (
            <SaleBadge
              originalPrice={product.price}
              salePrice={product.sale_price}
              variant="corner"
              size="md"
              className="top-3 left-3"
            />
          )}

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 glass flex items-center justify-center z-30">
              <Badge variant="secondary" className="text-sm">
                Agotado
              </Badge>
            </div>
          )}

          {/* Image navigation arrows (desktop only, on hover) */}
          {hasMultipleImages && isHovering && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-background/80 hover:bg-background/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === currentImageIndex
                      ? "w-6 bg-accent"
                      : "w-1.5 bg-white/50 hover:bg-white/80"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Action buttons */}
          {inStock && (
            <div className="absolute bottom-4 right-4 flex gap-2 z-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              {onQuickView && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="glass-effect shadow-lg hover:scale-110 transition-transform"
                  onClick={handleQuickView}
                  aria-label="Vista rápida"
                >
                  <Eye className="h-5 w-5" />
                </Button>
              )}
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
          )}

          {/* Touch area for mobile swipe */}
          {hasMultipleImages && (
            <div
              className="absolute inset-0 z-20 md:hidden"
              onTouchStart={handleTouchStart}
              aria-label="Desliza para ver más imágenes"
            />
          )}
        </div>

        <CardContent className="p-4 flex-1">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-balance group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {product.is_on_sale && product.sale_price ? (
              <>
                <span className="text-2xl font-bold text-accent">
                  {formatPrice(product.sale_price, product.currency)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price, product.currency)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                {formatPrice(product.price, product.currency)}
              </span>
            )}
          </div>
          {inStock && (
            <Badge
              variant="outline"
              className="bg-accent/10 text-accent border-accent/50"
            >
              {product.stock} disponibles
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
