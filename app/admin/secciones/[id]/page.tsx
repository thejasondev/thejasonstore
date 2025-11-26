import { getBannerById } from "@/lib/actions/banners";
import { BannerForm } from "@/components/admin/banner-form";
import Link from "next/link";
import { Header } from "@/components/header";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Editar Banner | Admin",
  description: "Editar banner existente",
};

interface EditBannerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  const banner = await getBannerById(id);

  if (!banner) {
    notFound();
  }

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
          <h1 className="text-3xl font-bold">Editar Banner</h1>
          <p className="text-muted-foreground mt-2">{banner.title}</p>
        </div>

        <BannerForm mode="edit" banner={banner} />
      </main>
    </div>
  );
}
