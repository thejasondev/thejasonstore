import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CategoriesAdmin } from "@/components/admin/categories-admin"
import { getAllCategories } from "@/lib/actions/categories"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const categories = await getAllCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mt-2 mb-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al panel
          </Link>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Gestión de categorías</h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Crea y administra las categorías que organizan tus productos. Estas categorías se usan en el inicio, filtros
            y páginas de detalle.
          </p>
        </div>

        <CategoriesAdmin categories={categories} />
      </main>

      <Footer />
    </div>
  )
}
