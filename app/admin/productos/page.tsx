import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { ProductsTable } from "@/components/admin/products-table";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  calculateInventoryValueByCurrency,
  getSortedCurrencyEntries,
} from "@/lib/utils/currency-utils";
import { formatPrice } from "@/lib/utils/format";

export const metadata = {
  title: "Gestión de Productos | Admin",
  description: "Gestiona el inventario de tu tienda",
};

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  // Calculate inventory value by currency
  const inventoryByCurrency = calculateInventoryValueByCurrency(products);
  const sortedInventory = getSortedCurrencyEntries(inventoryByCurrency);

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Productos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tu catálogo e inventario
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-2 mb-8">
        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Total Productos</p>
          <p className="text-2xl font-bold">{products.length}</p>
        </div>
        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Valor del Inventario
          </p>
          {sortedInventory.length > 0 ? (
            <div className="space-y-1">
              {sortedInventory.map(([currency, value]) => (
                <div key={currency} className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {currency}:
                  </span>
                  <span className="text-lg font-bold text-accent">
                    {formatPrice(value, currency)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-2xl font-bold text-accent">$0</p>
          )}
        </div>
        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">Bajo Stock</p>
          <p className="text-2xl font-bold text-destructive">
            {products.filter((p) => p.stock < 5).length}
          </p>
        </div>
        <div className="glass-card p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">En Oferta</p>
          <p className="text-2xl font-bold text-green-500">
            {products.filter((p) => p.is_on_sale).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <ProductsTable products={products} categories={categories} />
    </main>
  );
}
