"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUploader } from "@/components/admin/image-uploader";
import { createBanner, updateBanner } from "@/lib/actions/banners";
import type { Banner } from "@/lib/types";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface BannerFormProps {
  banner?: Banner;
  mode: "create" | "edit";
}

export function BannerForm({ banner, mode }: BannerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(banner?.title || "");
  const [description, setDescription] = useState(banner?.description || "");
  const [imageUrl, setImageUrl] = useState(banner?.image_url || "");
  const [imageAlt, setImageAlt] = useState(banner?.image_alt || "");
  const [ctaText, setCtaText] = useState(banner?.cta_text || "");
  const [ctaLink, setCtaLink] = useState(banner?.cta_link || "");
  const [ctaStyle, setCtaStyle] = useState<"primary" | "secondary" | "outline">(
    banner?.cta_style || "primary"
  );
  const [position, setPosition] = useState<
    "hero" | "slider" | "info" | "sidebar"
  >(banner?.position || "hero");
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);
  const [startDate, setStartDate] = useState(banner?.start_date || "");
  const [endDate, setEndDate] = useState(banner?.end_date || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validations
      if (!title.trim()) {
        throw new Error("El título es requerido");
      }
      if (!imageUrl) {
        throw new Error("La imagen es requerida");
      }

      const bannerData = {
        title: title.trim(),
        description: description.trim() || undefined,
        image_url: imageUrl,
        image_alt: imageAlt.trim() || undefined,
        cta_text: ctaText.trim() || undefined,
        cta_link: ctaLink.trim() || undefined,
        cta_style: ctaStyle,
        position,
        is_active: isActive,
        display_order: banner?.display_order || 0,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      };

      if (mode === "edit" && banner?.id) {
        await updateBanner(banner.id, bannerData);
        toast.success("Banner actualizado exitosamente");
      } else {
        await createBanner(bannerData);
        toast.success("Banner creado exitosamente");
      }

      router.push("/admin/secciones");
      router.refresh();
    } catch (err) {
      console.error("Error saving banner:", err);
      setError(
        err instanceof Error ? err.message : "Error al guardar el banner"
      );
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del banner"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción del banner (opcional)"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image-alt">Texto alternativo (SEO)</Label>
            <Input
              id="image-alt"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Descripción de la imagen para SEO"
            />
          </div>
        </CardContent>
      </Card>

      {/* Imagen */}
      <Card>
        <CardHeader>
          <CardTitle>
            Imagen <span className="text-destructive">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            aspectRatio={
              position === "hero"
                ? "hero"
                : position === "info"
                ? "wide"
                : "wide"
            }
          />
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card>
        <CardHeader>
          <CardTitle>Call to Action (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="cta-text">Texto del Botón</Label>
            <Input
              id="cta-text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Ej: Ver Productos"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cta-link">Enlace</Label>
            <Input
              id="cta-link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="/productos"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cta-style">Estilo del Botón</Label>
            <Select value={ctaStyle} onValueChange={(v: any) => setCtaStyle(v)}>
              <SelectTrigger id="cta-style">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary (Dorado)</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="position">
              Posición <span className="text-destructive">*</span>
            </Label>
            <Select value={position} onValueChange={(v: any) => setPosition(v)}>
              <SelectTrigger id="position">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">Hero (Banner Principal)</SelectItem>
                <SelectItem value="slider">Slider (Carrusel)</SelectItem>
                <SelectItem value="info">Info (Banner Informativo)</SelectItem>
                <SelectItem value="sidebar">Sidebar (Barra Lateral)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is-active" className="text-base cursor-pointer">
                Banner Activo
              </Label>
              <p className="text-sm text-muted-foreground">
                El banner se mostrará en la tienda
              </p>
            </div>
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </CardContent>
      </Card>

      {/* Programación */}
      <Card>
        <CardHeader>
          <CardTitle>Programación Automática (Opcional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="start-date">Fecha de Inicio</Label>
            <Input
              id="start-date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              El banner se activará automáticamente en esta fecha
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="end-date">Fecha de Fin</Label>
            <Input
              id="end-date"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              El banner se desactivará automáticamente en esta fecha
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {mode === "edit" ? "Actualizar Banner" : "Crear Banner"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/secciones")}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
