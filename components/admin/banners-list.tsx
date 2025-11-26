"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Banner } from "@/lib/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Calendar, GripVertical } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  deleteBanner,
  toggleBannerStatus,
  reorderBanners,
} from "@/lib/actions/banners";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BannersListProps {
  banners: Banner[];
}

function SortableBannerRow({
  banner,
  onToggle,
  onDelete,
  togglingId,
}: {
  banner: Banner;
  onToggle: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
  togglingId: string | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPositionLabel = (position: string) => {
    const labels = {
      hero: "Hero",
      slider: "Slider",
      info: "Info",
      sidebar: "Sidebar",
    };
    return labels[position as keyof typeof labels] || position;
  };

  const isScheduled = (banner: Banner) => {
    return banner.start_date || banner.end_date;
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      {/* Drag Handle */}
      <TableCell className="w-10">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent/10 rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>

      {/* Preview */}
      <TableCell>
        <div className="relative w-20 h-12 rounded overflow-hidden bg-muted">
          <Image
            src={banner.image_url}
            alt={banner.image_alt || banner.title}
            fill
            className="object-cover"
          />
        </div>
      </TableCell>

      {/* Título */}
      <TableCell>
        <div className="space-y-1">
          <p className="font-medium">{banner.title}</p>
          {banner.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {banner.description}
            </p>
          )}
        </div>
      </TableCell>

      {/* Posición */}
      <TableCell>
        <Badge variant="outline">{getPositionLabel(banner.position)}</Badge>
      </TableCell>

      {/* Estado */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={banner.is_active}
            onCheckedChange={() => onToggle(banner.id, banner.is_active)}
            disabled={togglingId === banner.id}
          />
          <span className="text-sm">
            {banner.is_active ? "Activo" : "Inactivo"}
          </span>
        </div>
      </TableCell>

      {/* Programación */}
      <TableCell>
        {isScheduled(banner) ? (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Programado</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </TableCell>

      {/* Acciones */}
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/secciones/${banner.id}`}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(banner.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function BannersList({ banners: initialBanners }: BannersListProps) {
  const router = useRouter();
  const [banners, setBanners] = useState(initialBanners);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = banners.findIndex((b) => b.id === active.id);
    const newIndex = banners.findIndex((b) => b.id === over.id);

    const newBanners = arrayMove(banners, oldIndex, newIndex);
    setBanners(newBanners);

    // Update display_order and save to database
    setIsSaving(true);
    try {
      const updates = newBanners.map((banner, index) => ({
        id: banner.id,
        display_order: index,
      }));
      await reorderBanners(updates);
      toast.success("Orden actualizado");
      router.refresh();
    } catch (error) {
      console.error("Error reordering banners:", error);
      toast.error("Error al actualizar el orden");
      // Revert on error
      setBanners(initialBanners);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteBanner(deleteId);
      setBanners(banners.filter((b) => b.id !== deleteId));
      setDeleteId(null);
      toast.success("Banner eliminado exitosamente");
      router.refresh();
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Error al eliminar el banner");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await toggleBannerStatus(id, !currentStatus);
      // Update local state
      setBanners(
        banners.map((b) =>
          b.id === id ? { ...b, is_active: !currentStatus } : b
        )
      );
      toast.success(!currentStatus ? "Banner activado" : "Banner desactivado");
      router.refresh();
    } catch (error) {
      console.error("Error toggling banner:", error);
      toast.error("Error al cambiar estado");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {isSaving && (
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-sm">
            Guardando nuevo orden...
          </div>
        )}

        <div className="rounded-lg border border-border">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="w-24">Preview</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Programación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-8"
                    >
                      No hay banners creados
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext
                    items={banners.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {banners.map((banner) => (
                      <SortableBannerRow
                        key={banner.id}
                        banner={banner}
                        onToggle={handleToggle}
                        onDelete={setDeleteId}
                        togglingId={togglingId}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El banner será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
