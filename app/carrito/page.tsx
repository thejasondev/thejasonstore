"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCart } from "@/lib/context/cart-context";
import { formatPrice } from "@/lib/utils/format";
import { WHATSAPP_PHONE } from "@/lib/constants";
import { toast } from "sonner";
import {
  getEffectivePrice,
  calculateSavings,
  calculateDiscountPercentage,
} from "@/lib/utils/discount-utils";
import { SaleBadge } from "@/components/sale-badge";

export default function CarritoPage() {
  const { items, itemCount, total, updateQuantity, removeItem, isLoading } =
    useCart();
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast.error("Error al actualizar cantidad");
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await removeItem(itemToDelete.id);
      await removeItem(itemToDelete.id);
      toast.error("Producto eliminado", {
        description: `${itemToDelete.name} se eliminó del carrito`,
        icon: <Trash2 className="h-5 w-5 text-destructive" />,
      });
    } catch (error) {
      toast.error("Error al eliminar producto");
    } finally {
      setItemToDelete(null);
    }
  };

  const generateWhatsAppMessage = () => {
    let message = `¡Hola! Me interesa comprar los siguientes productos:\n\n`;

    items.forEach((item, index) => {
      const product = item.product;
      if (product) {
        message += `${index + 1}. ${product.title}\n`;
        message += `   Cantidad: ${item.quantity}\n`;
        message += `   Precio: ${formatPrice(product.price)}\n\n`;
      }
    });

    message += `Total: ${formatPrice(total)}\n\n`;
    message += `¿Podrías confirmar la disponibilidad?`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppCheckout = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent mb-4" />
              <p className="text-muted-foreground">Cargando carrito...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            Tu Carrito
          </h1>
          <p className="text-muted-foreground">
            {itemCount === 0
              ? "No hay productos"
              : `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <Card className="glass-card p-12 sm:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mb-6">
                Agrega productos para comenzar tu compra
              </p>
              <Link href="/productos">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Explorar Productos
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;

                const isUpdating = updatingItems.has(item.id);
                const effectivePrice = getEffectivePrice(product);
                const subtotal = effectivePrice * item.quantity;
                const isOnSale = product.is_on_sale && product.sale_price;
                const savings = isOnSale
                  ? calculateSavings(product.price, product.sale_price!) *
                    item.quantity
                  : 0;

                return (
                  <Card key={item.id} className="glass-card p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image & Mobile Header */}
                      <div className="flex gap-4 sm:block">
                        <Link
                          href={`/producto/${product.slug}`}
                          className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted shrink-0 group"
                        >
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </Link>

                        {/* Mobile Title & Delete - Visible only on mobile */}
                        <div className="flex-1 sm:hidden flex flex-col justify-between">
                          <div>
                            <Link
                              href={`/producto/${product.slug}`}
                              className="font-semibold text-base line-clamp-2 leading-tight mb-1"
                            >
                              {product.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {product.category}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex flex-col">
                              {isOnSale ? (
                                <>
                                  <span className="font-bold text-accent">
                                    {formatPrice(
                                      effectivePrice,
                                      product.currency
                                    )}
                                  </span>
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatPrice(
                                      product.price,
                                      product.currency
                                    )}
                                  </span>
                                </>
                              ) : (
                                <span className="font-bold text-accent">
                                  {formatPrice(product.price, product.currency)}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setItemToDelete({
                                  id: item.id,
                                  name: product.title,
                                })
                              }
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Product Info */}
                      <div className="hidden sm:flex flex-1 min-w-0 flex-col">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <Link
                              href={`/producto/${product.slug}`}
                              className="font-semibold text-lg hover:text-accent transition-colors line-clamp-2"
                            >
                              {product.title}
                            </Link>
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.category}
                            </p>
                            {isOnSale && product.sale_price && (
                              <div className="mt-2">
                                <SaleBadge
                                  originalPrice={product.price}
                                  salePrice={product.sale_price}
                                  variant="inline"
                                  size="sm"
                                />
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setItemToDelete({
                                id: item.id,
                                name: product.title,
                              })
                            }
                            className="shrink-0 hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between gap-4 mt-auto">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={isUpdating || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div className="w-12 text-center font-medium">
                              {isUpdating ? (
                                <div className="h-4 w-4 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
                              ) : (
                                item.quantity
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleUpdateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={
                                isUpdating || item.quantity >= product.stock
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            {product.stock <= 5 && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Solo {product.stock}
                              </Badge>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Subtotal
                            </p>
                            <p className="text-xl font-bold text-accent">
                              {formatPrice(subtotal, product.currency)}
                            </p>
                            {isOnSale && (
                              <p className="text-xs text-green-600 font-medium">
                                Ahorras {formatPrice(savings, product.currency)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mobile Quantity Controls - Below image/info on mobile */}
                      <div className="flex sm:hidden items-center justify-between pt-3 border-t border-border/50 mt-2">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={isUpdating || item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={
                              isUpdating || item.quantity >= product.stock
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Subtotal
                          </p>
                          <p className="font-bold text-accent">
                            {formatPrice(subtotal, product.currency)}
                          </p>
                          {isOnSale && (
                            <p className="text-xs text-green-600 font-medium">
                              -{formatPrice(savings, product.currency)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="glass-card p-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({itemCount}{" "}
                      {itemCount === 1 ? "producto" : "productos"})
                    </span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>

                  {items.some(
                    (item) =>
                      item.product?.is_on_sale && item.product.sale_price
                  ) && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Ahorro Total</span>
                      <span>
                        -
                        {formatPrice(
                          items.reduce((acc, item) => {
                            if (
                              item.product?.is_on_sale &&
                              item.product.sale_price
                            ) {
                              return (
                                acc +
                                calculateSavings(
                                  item.product.price,
                                  item.product.sale_price
                                ) *
                                  item.quantity
                              );
                            }
                            return acc;
                          }, 0)
                        )}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-accent">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full gap-2 mb-4"
                  onClick={handleWhatsAppCheckout}
                >
                  <MessageCircle className="h-5 w-5" />
                  Comprar por WhatsApp
                </Button>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>Pago seguro al recibir</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>Atención personalizada</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={() => setItemToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas eliminar "{itemToDelete?.name}" de tu
              carrito?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
