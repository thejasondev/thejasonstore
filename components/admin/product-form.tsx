"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createProduct } from "@/lib/actions/products"
import { CATEGORIES } from "@/lib/constants"
import type { Product } from "@/lib/types"

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const productData = {
        sku: formData.get("sku") as string,
        slug: formData.get("slug") as string,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: Number.parseFloat(formData.get("price") as string),
        currency: "MXN",
        stock: Number.parseInt(formData.get("stock") as string),
        images: ["/placeholder.svg?height=600&width=600"],
        category: formData.get("category") as string,
      }

      await createProduct(productData)
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
              <Select name="category" defaultValue={product?.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
