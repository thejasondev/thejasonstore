"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { deleteProduct, toggleProductFeatured } from "@/lib/actions/products";
import { toast } from "sonner";
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

interface ProductsTableProps {
  products: Product[];
  categories?: Category[];
}

export function ProductsTable({ products, categories }: ProductsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null);

  const categoryLabelBySlug = useMemo(() => {
    if (!categories || categories.length === 0) {
      return new Map<string, string>();
    }

    return new Map(
      categories.map((category) => [category.slug, category.name])
    );
  }, [categories]);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteProduct(deleteId);
      setDeleteId(null);
      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      console.error("[v0] Error deleting product:", error);
      toast.error("Error al eliminar el producto");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async (
    productId: string,
    currentStatus: boolean
  ) => {
    setTogglingFeatured(productId);
    try {
      await toggleProductFeatured(productId, !currentStatus);
      toast.success(
        !currentStatus
          ? "Producto marcado como destacado"
          : "Producto removido de destacados"
      );
    } catch (error) {
      console.error("[v0] Error toggling featured:", error);
      toast.error("Error al actualizar producto destacado");
    } finally {
      setTogglingFeatured(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-center">Destacado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No hay productos registrados
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">
                    {product.sku}
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categoryLabelBySlug.get(product.category)?.trim() ||
                        product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatPrice(product.price, product.currency)}
                  </TableCell>
                  <TableCell>
                    {product.stock > 0 ? (
                      <Badge
                        variant="outline"
                        className="bg-accent/10 text-accent border-accent"
                      >
                        {product.stock}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Agotado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleToggleFeatured(
                          product.id,
                          product.is_featured || false
                        )
                      }
                      disabled={togglingFeatured === product.id}
                      className="h-8 w-8 p-0"
                      title={
                        product.is_featured
                          ? "Remover de destacados"
                          : "Marcar como destacado"
                      }
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          product.is_featured
                            ? "fill-accent text-accent"
                            : "text-muted-foreground hover:text-accent"
                        }`}
                      />
                      <span className="sr-only">
                        {product.is_featured ? "Destacado" : "No destacado"}
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/productos/${product.slug}`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
