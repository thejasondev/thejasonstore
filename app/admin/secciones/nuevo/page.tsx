import { BannerForm } from "@/components/admin/banner-form";
import Link from "next/link";
import { Header } from "@/components/header";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Nuevo Banner | Admin",
  description: "Crear un nuevo banner",
};

export default function NuevoBannerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
        <div className="mt-2 mb-4">
          <Link
            href="/admin/secciones"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a secciones
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Crear Nuevo Banner</h1>
          <p className="text-muted-foreground mt-2">
            Completa el formulario para crear un nuevo banner
          </p>
        </div>

        <BannerForm mode="create" />
      </main>
    </div>
  );
}
