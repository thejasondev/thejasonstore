import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { getBanners } from "@/lib/actions/banners";
import { BannersList } from "@/components/admin/banners-list";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Gestión de Banners | Admin",
  description: "Gestiona los banners y secciones de tu tienda",
};

export default async function SeccionesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  const banners = await getBanners();

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

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              Banners y Secciones
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mt-2">
              Gestiona el contenido visual de tu tienda, incluyendo banners
              principales, sliders y anuncios.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/secciones/nuevo">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Banner
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="glass-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Banners</p>
            <p className="text-2xl font-bold">{banners.length}</p>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Activos</p>
            <p className="text-2xl font-bold text-accent">
              {banners.filter((b) => b.is_active).length}
            </p>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Hero</p>
            <p className="text-2xl font-bold">
              {banners.filter((b) => b.position === "hero").length}
            </p>
          </div>
          <div className="glass-card p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Slider</p>
            <p className="text-2xl font-bold">
              {banners.filter((b) => b.position === "slider").length}
            </p>
          </div>
        </div>

        {/* Banners List */}
        <BannersList banners={banners} />
      </main>
    </div>
  );
}
