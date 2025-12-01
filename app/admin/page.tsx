import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { getProducts } from "@/lib/actions/products";
import { getCategories } from "@/lib/actions/categories";
import { getBanners } from "@/lib/actions/banners";
import { InventoryDashboard } from "@/components/admin/inventory-dashboard";
import { Button } from "@/components/ui/button";
import {
  Package,
  Tags,
  LayoutTemplate,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Percent,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Panel de Administración | The Jason Store",
  description: "Panel de control general",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Fetch data for stats
  const [products, categories, banners] = await Promise.all([
    getProducts(),
    getCategories(),
    getBanners(),
  ]);

  const lowStockCount = products.filter((p) => p.stock <= 2).length;
  const activeBannersCount = banners.filter((b) => b.is_active).length;
  const activeSalesCount = products.filter((p) => p.is_on_sale).length;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 truncate">
              Panel de Administración
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona tus productos y categorías
            </p>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <div className="glass-card p-6 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Productos
              </p>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{products.length}</div>
          </div>

          <div className="glass-card p-6 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Categorías
              </p>
              <Tags className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{categories.length}</div>
          </div>

          <div className="glass-card p-6 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Banners Activos
              </p>
              <LayoutTemplate className="h-4 w-4 text-accent" />
            </div>
            <div className="text-2xl font-bold">{activeBannersCount}</div>
          </div>

          <div className="glass-card p-6 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Ofertas Activas
              </p>
              <Percent className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{activeSalesCount}</div>
          </div>

          <div className="glass-card p-6 rounded-xl space-y-2 border-l-4 border-l-destructive">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Alertas Stock
              </p>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div className="text-2xl font-bold">{lowStockCount}</div>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {/* Products Card */}
          <Link href="/admin/productos" className="group">
            <div className="h-full glass-card p-6 rounded-xl transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:-translate-y-1">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                Productos
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-muted-foreground text-sm">
                Gestiona tu inventario, precios y stock. Agrega nuevos productos
                o edita los existentes.
              </p>
            </div>
          </Link>

          {/* Categories Card */}
          <Link href="/admin/categorias" className="group">
            <div className="h-full glass-card p-6 rounded-xl transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:-translate-y-1">
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Tags className="h-6 w-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                Categorías
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-muted-foreground text-sm">
                Organiza tus productos en categorías para facilitar la
                navegación de tus clientes.
              </p>
            </div>
          </Link>

          {/* Banners Card */}
          <Link href="/admin/secciones" className="group">
            <div className="h-full glass-card p-6 rounded-xl transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:-translate-y-1">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <LayoutTemplate className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                Banners y Secciones
                <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="text-muted-foreground text-sm">
                Personaliza la apariencia de tu tienda. Gestiona banners,
                sliders y anuncios destacados.
              </p>
            </div>
          </Link>
        </div>

        {/* Inventory Alerts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Estado del Inventario
            </h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/inventario">Ver todo el inventario</Link>
            </Button>
          </div>
          <InventoryDashboard />
        </div>

        {/* Quick Links Footer */}
        <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            Ver Tienda
          </Link>
          <span>•</span>
          <Link
            href="/admin/productos/nuevo"
            className="hover:text-foreground transition-colors"
          >
            Nuevo Producto
          </Link>
          <span>•</span>
          <Link
            href="/admin/secciones/nuevo"
            className="hover:text-foreground transition-colors"
          >
            Nuevo Banner
          </Link>
        </div>
      </main>
    </div>
  );
}
