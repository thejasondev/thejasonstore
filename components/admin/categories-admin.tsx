"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Category } from "@/lib/types"
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories"
import { normalizeSlug } from "@/lib/utils/slug"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"

interface CategoriesAdminProps {
  categories: Category[]
}

export function CategoriesAdmin({ categories }: CategoriesAdminProps) {
  const router = useRouter()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [displayOrder, setDisplayOrder] = useState<number>(0)
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name)
      setSlug(editingCategory.slug)
      setDescription(editingCategory.description || "")
      setIcon(editingCategory.icon || "")
      setDisplayOrder(editingCategory.display_order ?? 0)
      setIsActive(editingCategory.is_active ?? true)
    } else {
      setName("")
      setSlug("")
      setDescription("")
      setIcon("")
      setDisplayOrder(0)
      setIsActive(true)
    }
  }, [editingCategory])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const normalizedSlug = normalizeSlug(slug || name)

      const payload = {
        name,
        slug: normalizedSlug,
        description: description || undefined,
        icon: icon || undefined,
        display_order: displayOrder,
        is_active: isActive,
      }

      if (editingCategory?.id) {
        await updateCategory(editingCategory.id, payload)
      } else {
        await createCategory(payload)
      }

      setEditingCategory(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la categoría")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClick = (category: Category) => {
    setEditingCategory(category)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar esta categoría?")) return

    setIsSubmitting(true)
    setError(null)

    try {
      await deleteCategory(id)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar la categoría")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEditing = Boolean(editingCategory)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar categoría" : "Nueva categoría"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Electrónica"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder="electronica"
                helper-text="Si lo dejas vacío, se generará automáticamente a partir del nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Productos de tecnología y gadgets"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icono (opcional)</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(event) => setIcon(event.target.value)}
                placeholder="Laptop, Shirt, Home, Dumbbell..."
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <Label htmlFor="display-order">Orden</Label>
                <Input
                  id="display-order"
                  type="number"
                  value={displayOrder}
                  onChange={(event) => setDisplayOrder(Number.parseInt(event.target.value || "0", 10))}
                  className="w-24"
                />
              </div>
              <div className="space-y-1 flex items-center gap-2">
                <Label htmlFor="is-active">Activa</Label>
                <Switch id="is-active" checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear categoría"}
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCategory(null)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categorías existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay categorías configuradas todavía.</p>
          ) : (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="hidden md:table-cell">Estado</TableHead>
                    <TableHead className="hidden md:table-cell">Orden</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="font-mono text-xs sm:text-sm">{category.slug}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={category.is_active ? "outline" : "secondary"}>
                          {category.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {category.display_order ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(category)}
                            disabled={isSubmitting}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(category.id)}
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
