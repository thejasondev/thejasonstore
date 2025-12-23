"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ProductCard } from "@/components/product-card";
import { ProductQuickView } from "@/components/product-quick-view";
import { useFavorites } from "@/lib/context/favorites-context";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { getProductsByIds } from "@/lib/actions/products";

export default function FavoritosPage() {
  const { favorites, clearFavorites, favoritesCount } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedProducts = await getProductsByIds(favorites);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error loading favorite products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <Heart className="h-7 w-7 text-red-500 fill-red-500" />
              Mis Favoritos
            </h1>
            <p className="text-muted-foreground mt-1">
              {favoritesCount === 0
                ? "Aún no tienes productos guardados"
                : `${favoritesCount} producto${
                    favoritesCount !== 1 ? "s" : ""
                  } guardado${favoritesCount !== 1 ? "s" : ""}`}
            </p>
          </div>

          {favoritesCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFavorites}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar todo
            </Button>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              No tienes favoritos aún
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Explora nuestros productos y guarda tus favoritos tocando el
              corazón. Así podrás encontrarlos fácilmente después.
            </p>
            <Button asChild className="group">
              <Link href="/productos">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explorar productos
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppFloat />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          open={!!quickViewProduct}
          onOpenChange={(open) => !open && setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
