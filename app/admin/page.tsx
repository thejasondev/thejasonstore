import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProducts } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import { ProductsTable } from "@/components/admin/products-table"
import { InventoryDashboard } from "@/components/admin/inventory-dashboard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
              <div className="mt-6 mb-4 ml-2">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Página principal
          </Link>
        </div>
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 truncate">Panel de Administración</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Gestiona tus productos y categorías</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:justify-end">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/admin/categorias" className="inline-flex items-center justify-center">
                <span className="whitespace-nowrap">Categorías</span>
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/productos/nuevo" className="inline-flex items-center justify-center">
                <Plus className="mr-2 h-4 w-4" />
                <span className="whitespace-nowrap">Nuevo Producto</span>
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Alertas de Inventario</h2>
            <InventoryDashboard />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Productos</h2>
            <ProductsTable products={products} categories={categories} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
