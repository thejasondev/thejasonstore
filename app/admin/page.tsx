import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProducts } from "@/lib/actions/products"
import { ProductsTable } from "@/components/admin/products-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const products = await getProducts()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-muted-foreground">Gestiona tus productos y contenido</p>
          </div>
          <Button asChild>
            <Link href="/admin/productos/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Productos</h2>
            <ProductsTable products={products} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
