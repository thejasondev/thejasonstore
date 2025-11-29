"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import type { Category, Product } from "@/lib/types";
import { normalizeSlug } from "@/lib/utils/slug";
import { ProductImagesUploader } from "@/components/admin/product-images-uploader";

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryValue, setCategoryValue] = useState<string>(
    product?.category ?? ""
  );
  const [images, setImages] = useState<string[]>(
    product?.images?.length ? product.images : []
  );
  const [currency, setCurrency] = useState<string>(product?.currency || "USD");
  const [salePrice, setSalePrice] = useState<string>(
    product?.sale_price?.toString() || ""
  );
  const [saleStartDate, setSaleStartDate] = useState<string>(
    product?.sale_start_date
      ? new Date(product.sale_start_date).toISOString().slice(0, 16)
      : ""
  );
  const [saleEndDate, setSaleEndDate] = useState<string>(
    product?.sale_end_date
      ? new Date(product.sale_end_date).toISOString().slice(0, 16)
      : ""
  );
  const hasNormalizedCategory = useRef(false);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(product);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError(null);

      try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) {
          throw error;
        }

        setCategories(data ?? []);
      } catch (err) {
        console.error("[v0] Error fetching categories:", err);
        setCategoryError(
          "No se pudieron cargar las categorías. Verifica tu conexión con Supabase."
        );
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (
      !product?.category ||
      categories.length === 0 ||
      hasNormalizedCategory.current
    ) {
      return;
    }

    const matchBySlug = categories.find(
      (category) => category.slug === product.category
    );
    const matchByName = categories.find(
      (category) =>
        category.name.toLowerCase() === product.category.toLowerCase()
    );

    const resolvedValue =
      matchBySlug?.slug ?? matchByName?.slug ?? product.category;
    setCategoryValue(resolvedValue);
    hasNormalizedCategory.current = true;
  }, [categories, product?.category]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const titleValue = (formData.get("title") as string) ?? "";
    const rawSlugValue = (formData.get("slug") as string) ?? titleValue;
    const normalizedSlug = normalizeSlug(rawSlugValue || titleValue);
    const categorySlug = (formData.get("category") as string) || categoryValue;

    if (!categorySlug) {
      setError("Selecciona una categoría válida");
      setIsLoading(false);
      return;
    }

    try {
      const selectedCategory = categories.find(
        (category) => category.slug === categorySlug
      );

      const baseProductData = {
        sku: formData.get("sku") as string,
        slug: normalizedSlug,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        currency: currency,
        stock: Number.parseInt(formData.get("stock") as string),
        images:
          images.length > 0
            ? images
            : ["/placeholder.svg?height=600&width=600"],
        category: selectedCategory?.slug ?? categorySlug,
        category_id: selectedCategory?.id ?? product?.category_id ?? null,
        is_featured: formData.get("is_featured") === "on",
        // Sale fields
        sale_price: salePrice ? Number.parseFloat(salePrice) : null,
        sale_start_date: saleStartDate || null,
        sale_end_date: saleEndDate || null,
      };

      if (isEditing && product?.id) {
        await updateProduct(product.id, baseProductData);
      } else {
        await createProduct(baseProductData);
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error("[v0] Error creating product:", err);
      setError(
        err instanceof Error ? err.message : "Error al crear el producto"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                placeholder="PROD-001"
                required
                defaultValue={product?.sku}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="producto-ejemplo"
                required
                defaultValue={product?.slug}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Nombre del producto"
                required
                defaultValue={product?.title}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descripción detallada del producto"
                required
                rows={4}
                defaultValue={product?.description}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  ref={priceInputRef}
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  defaultValue={product?.price}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="currency">Moneda</Label>
                <Select
                  name="currency"
                  value={currency}
                  onValueChange={setCurrency}
                  required
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Selecciona moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">
                      <span className="flex items-center gap-2">
                        💵 USD - Dólar
                      </span>
                    </SelectItem>
                    <SelectItem value="EUR">
                      <span className="flex items-center gap-2">
                        💶 EUR - Euro
                      </span>
                    </SelectItem>
                    <SelectItem value="CUP">
                      <span className="flex items-center gap-2">
                        🇨🇺 CUP - Peso Cubano
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  required
                  defaultValue={product?.stock}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                name="category"
                value={categoryValue || undefined}
                onValueChange={setCategoryValue}
                required
                disabled={isLoadingCategories || categories.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingCategories
                        ? "Cargando categorías..."
                        : "Selecciona una categoría"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Cargando categorías...
                    </SelectItem>
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-categories" disabled>
                      No hay categorías disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {categoryError && (
                <p className="text-sm text-destructive">{categoryError}</p>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Imágenes del Producto
              </label>
              <ProductImagesUploader
                value={images}
                onChange={setImages}
                maxImages={4}
              />
            </div>

            <div className="flex items-center space-x-2 rounded-lg border border-border p-4 bg-muted/30">
              <Checkbox
                id="is_featured"
                name="is_featured"
                defaultChecked={product?.is_featured || false}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="is_featured"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Producto Destacado
                </Label>
                <p className="text-sm text-muted-foreground">
                  Los productos destacados se muestran en la página principal
                </p>
              </div>
            </div>

            {/* Sale/Discount Section */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Descuento / Oferta</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configura un precio de oferta con fechasde inicio y fin. El
                sistema activará y desactivará automáticamente la oferta.
              </p>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sale_price">
                    Precio de Oferta (opcional)
                  </Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                  {salePrice && (
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        Precio original:{" "}
                        <span className="line-through">
                          $
                          {Number.parseFloat(
                            priceInputRef.current?.value ||
                              product?.price?.toString() ||
                              "0"
                          ).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-accent font-medium">
                        Ahorro: $
                        {(
                          Number.parseFloat(
                            priceInputRef.current?.value ||
                              product?.price?.toString() ||
                              "0"
                          ) - Number.parseFloat(salePrice)
                        ).toFixed(2)}{" "}
                        (
                        {(
                          ((Number.parseFloat(
                            priceInputRef.current?.value ||
                              product?.price?.toString() ||
                              "0"
                          ) -
                            Number.parseFloat(salePrice)) /
                            Number.parseFloat(
                              priceInputRef.current?.value ||
                                product?.price?.toString() ||
                                "1"
                            )) *
                          100
                        ).toFixed(0)}
                        % OFF)
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sale_start_date">
                      Fecha de Inicio{" "}
                      {salePrice && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="sale_start_date"
                      type="datetime-local"
                      value={saleStartDate}
                      onChange={(e) => setSaleStartDate(e.target.value)}
                      required={!!salePrice}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="sale_end_date">
                      Fecha de Fin{" "}
                      {salePrice && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="sale_end_date"
                      type="datetime-local"
                      value={saleEndDate}
                      onChange={(e) => setSaleEndDate(e.target.value)}
                      required={!!salePrice}
                      min={saleStartDate}
                    />
                  </div>
                </div>

                {salePrice && (!saleStartDate || !saleEndDate) && (
                  <p className="text-sm text-destructive">
                    ⚠️ Las fechas de inicio y fin son obligatorias cuando se
                    establece un precio de oferta
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Guardando..." : "Guardar Producto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
