import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import {
  getLowStockProducts,
  getOutOfStockProducts,
} from "@/lib/actions/inventory";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Package,
  ArrowLeft,
  TrendingDown,
  Edit,
  XCircle,
  TrendingUp,
  Boxes,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format";
import {
  calculateInventoryValueByCurrency,
  getSortedCurrencyEntries,
} from "@/lib/utils/currency-utils";

export const metadata = {
  title: "Gestión de Inventario | Admin",
  description: "Control completo de stock, alertas y métricas de inventario",
};

export default async function InventoryPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch all data
  const [allProducts, categories, lowStockProducts, outOfStockProducts] =
    await Promise.all([
      getProducts(),
      getCategories(),
      getLowStockProducts(),
      getOutOfStockProducts(),
    ]);

  // Calculate comprehensive stats
  const totalProducts = allProducts.length;
  const totalCategories = categories.length;
  const totalStock = allProducts.reduce((sum, p) => sum + p.stock, 0);
  const averageStock =
    totalProducts > 0 ? Math.round(totalStock / totalProducts) : 0;

  const inventoryByCurrency = calculateInventoryValueByCurrency(allProducts);
  const sortedInventory = getSortedCurrencyEntries(inventoryByCurrency);

  const lowStockCount = lowStockProducts.length;
  const outOfStockCount = outOfStockProducts.length;
  const healthyStockCount = allProducts.filter((p) => p.stock > 2).length;
  const stockHealthPercentage =
    totalProducts > 0
      ? Math.round((healthyStockCount / totalProducts) * 100)
      : 0;

  // Combine low stock and out of stock for the main table
  const criticalProducts = [
    ...outOfStockProducts.map((p) => ({ ...p, status: "out" as const })),
    ...lowStockProducts.map((p) => ({ ...p, status: "low" as const })),
  ].sort((a, b) => a.stock - b.stock);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <Button
              variant="ghost"
              asChild
              className="mb-2 pl-0 hover:bg-transparent hover:text-accent"
            >
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al Panel
              </Link>
            </Button>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Gestión de Inventario
            </h1>
            <p className="text-muted-foreground">
              Control completo de stock, alertas y métricas
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/productos">Editar Productos</Link>
          </Button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Productos</CardDescription>
                <Package className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                En {totalCategories} categorías
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Unidades Totales</CardDescription>
                <Boxes className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStock}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Promedio: {averageStock} por producto
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-amber-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  Stock Crítico
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">
                {lowStockCount + outOfStockCount}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {lowStockCount} bajo, {outOfStockCount} agotado
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-green-500/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  Salud del Stock
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {stockHealthPercentage}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {healthyStockCount} productos saludables
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Value by Currency */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-accent" />
                Valor del Inventario
              </CardTitle>
              <CardDescription>
                Valor total calculado por moneda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedInventory.map(([currency, value]) => (
                  <div
                    key={currency}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10"
                  >
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {currency}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-accent">
                      {formatPrice(value, currency)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Alertas</CardTitle>
              <CardDescription>Estados críticos de inventario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Sin Stock</p>
                      <p className="text-xs text-muted-foreground">
                        Productos agotados
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-red-500">
                    {outOfStockCount}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium">Stock Bajo</p>
                      <p className="text-xs text-muted-foreground">
                        1-2 unidades disponibles
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-amber-500">
                    {lowStockCount}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Stock Saludable</p>
                      <p className="text-xs text-muted-foreground">
                        &gt; 2 unidades
                      </p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-green-500">
                    {healthyStockCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Critical Stock Table */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-amber-500" />
                  Productos con Stock Crítico
                </CardTitle>
                <CardDescription>
                  {criticalProducts.length} productos que necesitan atención
                  urgente (0-2 unidades)
                </CardDescription>
              </div>
              {criticalProducts.length > 0 && (
                <Badge variant="destructive" className="h-6">
                  {criticalProducts.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {criticalProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">¡Todo en orden!</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  No hay productos con stock crítico en este momento. Todos tus
                  productos tienen niveles de inventario saludables.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[100px]">Estado</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead className="w-[120px]">SKU</TableHead>
                      <TableHead className="w-[140px]">Categoría</TableHead>
                      <TableHead className="w-[80px] text-right">
                        Stock
                      </TableHead>
                      <TableHead className="w-[120px] text-right">
                        Precio
                      </TableHead>
                      <TableHead className="w-[80px] text-right">
                        Acciones
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criticalProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell>
                          {product.status === "out" ? (
                            <Badge
                              variant="outline"
                              className="border-red-500/50 text-red-500 gap-1"
                            >
                              <XCircle className="h-3 w-3" />
                              Agotado
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-amber-500/50 text-amber-500 gap-1"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Bajo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{product.title}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">
                          {product.sku}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {product.category || "Sin categoría"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`font-bold text-lg ${
                              product.stock === 0
                                ? "text-red-500"
                                : "text-amber-500"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(product.price, product.currency)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8"
                          >
                            <Link href={`/admin/productos/${product.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="glass-card mt-8 bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              💡 Guía de Gestión de Inventario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <div>
                    <strong className="text-red-500">Sin Stock (0):</strong>
                    <p className="text-muted-foreground">
                      Productos agotados. Marca como inactivo o reabastece
                      urgentemente para no perder ventas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <div>
                    <strong className="text-amber-500">Stock Bajo (≤2):</strong>
                    <p className="text-muted-foreground">
                      Productos con 2 o menos unidades. Planifica
                      reabastecimiento pronto para evitar quedarte sin stock.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  <div>
                    <strong>Valor del Inventario:</strong>
                    <p className="text-muted-foreground">
                      Calculado por moneda (precio × stock). Útil para valorar
                      tu capital invertido.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-accent font-bold mt-0.5">•</span>
                  <div>
                    <strong>Edición Rápida:</strong>
                    <p className="text-muted-foreground">
                      Click en <Edit className="h-3 w-3 inline" /> para
                      actualizar stock, precio o desactivar productos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
