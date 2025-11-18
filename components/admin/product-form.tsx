"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createProduct, updateProduct } from "@/lib/actions/products"
import { createClient as createSupabaseClient } from "@/lib/supabase/client"
import type { Category, Product } from "@/lib/types"
import { normalizeSlug } from "@/lib/utils/slug"

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categoryValue, setCategoryValue] = useState<string>(product?.category ?? "")
  const hasNormalizedCategory = useRef(false)
  const isEditing = Boolean(product)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true)
      setCategoryError(null)

      try {
        const supabase = createSupabaseClient()
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })

        if (error) {
          throw error
        }

        setCategories(data ?? [])
      } catch (err) {
        console.error("[v0] Error fetching categories:", err)
        setCategoryError("No se pudieron cargar las categorías. Verifica tu conexión con Supabase.")
      } finally {
        setIsLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (!product?.category || categories.length === 0 || hasNormalizedCategory.current) {
      return
    }

    const matchBySlug = categories.find((category) => category.slug === product.category)
    const matchByName = categories.find((category) => category.name.toLowerCase() === product.category.toLowerCase())

    const resolvedValue = matchBySlug?.slug ?? matchByName?.slug ?? product.category
    setCategoryValue(resolvedValue)
    hasNormalizedCategory.current = true
  }, [categories, product?.category])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const titleValue = (formData.get("title") as string) ?? ""
    const rawSlugValue = (formData.get("slug") as string) ?? titleValue
    const normalizedSlug = normalizeSlug(rawSlugValue || titleValue)
    const categorySlug = (formData.get("category") as string) || categoryValue

    if (!categorySlug) {
      setError("Selecciona una categoría válida")
      setIsLoading(false)
      return
    }

    try {
      const selectedCategory = categories.find((category) => category.slug === categorySlug)

      const baseProductData = {
        sku: formData.get("sku") as string,
        slug: normalizedSlug,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        currency: product?.currency ?? "USD",
        stock: Number.parseInt(formData.get("stock") as string),
        images: product?.images?.length ? product.images : ["/placeholder.svg?height=600&width=600"],
        category: selectedCategory?.slug ?? categorySlug,
        category_id: selectedCategory?.id ?? product?.category_id ?? null,
      }

      if (isEditing && product?.id) {
        await updateProduct(product.id, baseProductData)
      } else {
        await createProduct(baseProductData)
      }
      router.push("/admin")
      router.refresh()
    } catch (err) {
      console.error("[v0] Error creating product:", err)
      setError(err instanceof Error ? err.message : "Error al crear el producto")
    } finally {
      setIsLoading(false)
    }
  }

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
              <Input id="sku" name="sku" placeholder="PROD-001" required defaultValue={product?.sku} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" name="slug" placeholder="producto-ejemplo" required defaultValue={product?.slug} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" placeholder="Nombre del producto" required defaultValue={product?.title} />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
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
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" name="stock" type="number" placeholder="0" required defaultValue={product?.stock} />
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
                  <SelectValue placeholder={isLoadingCategories ? "Cargando categorías..." : "Selecciona una categoría"} />
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
              {categoryError && <p className="text-sm text-destructive">{categoryError}</p>}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Guardando..." : "Guardar Producto"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
