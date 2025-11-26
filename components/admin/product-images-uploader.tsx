"use client";

import { useState, useCallback } from "react";
import { Upload, X, GripVertical, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { cn, validateImageFile } from "@/lib/utils";
import { uploadProductImageClient } from "@/lib/supabase/upload-product-client";
import { deleteProductImage } from "@/lib/supabase/storage";

interface ProductImagesUploaderProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export function ProductImagesUploader({
  value = [],
  onChange,
  maxImages = 4,
  className,
}: ProductImagesUploaderProps) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileUpload = useCallback(
    async (file: File, index: number) => {
      setError(null);

      // Validate
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setUploading(index);

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        // Upload to Supabase
        const imageUrl = await uploadProductImageClient(file);

        clearInterval(progressInterval);
        setProgress(100);

        // Update images array
        const newImages = [...value];
        if (index < newImages.length) {
          // Replace existing image
          const oldImage = newImages[index];
          if (
            oldImage &&
            oldImage !== "/placeholder.svg?height=600&width=600"
          ) {
            // Delete old image from storage
            try {
              await deleteProductImage(oldImage);
            } catch (err) {
              console.error("Failed to delete old image:", err);
            }
          }
          newImages[index] = imageUrl;
        } else {
          // Add new image
          newImages.push(imageUrl);
        }

        onChange(newImages);
      } catch (err) {
        console.error("Upload error:", err);
        setError(
          err instanceof Error ? err.message : "Error al subir la imagen"
        );
      } finally {
        setUploading(null);
        setTimeout(() => setProgress(0), 500);
      }
    },
    [value, onChange]
  );

  const handleRemoveImage = useCallback(
    async (index: number) => {
      const imageToRemove = value[index];
      const newImages = value.filter((_, i) => i !== index);
      onChange(newImages);

      // Delete from storage
      if (
        imageToRemove &&
        imageToRemove !== "/placeholder.svg?height=600&width=600"
      ) {
        try {
          await deleteProductImage(imageToRemove);
        } catch (err) {
          console.error("Failed to delete image:", err);
        }
      }
    },
    [value, onChange]
  );

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();

      if (draggedIndex === null || draggedIndex === targetIndex) {
        setDraggedIndex(null);
        return;
      }

      const newImages = [...value];
      const [draggedImage] = newImages.splice(draggedIndex, 1);
      newImages.splice(targetIndex, 0, draggedImage);

      onChange(newImages);
      setDraggedIndex(null);
    },
    [draggedIndex, value, onChange]
  );

  const handleFileDrop = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();

      const files = e.dataTransfer.files;
      if (files?.length > 0) {
        handleFileUpload(files[0], index);
      }
    },
    [handleFileUpload]
  );

  const renderImageSlot = (index: number) => {
    const hasImage = index < value.length && value[index];
    const isUploading = uploading === index;

    return (
      <div
        key={index}
        draggable={hasImage}
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDrop={(e) => {
          // Check if it's a file drop or image reorder
          if (e.dataTransfer.files?.length > 0) {
            handleFileDrop(e, index);
          } else {
            handleDrop(e, index);
          }
        }}
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-all",
          hasImage
            ? "border-border bg-muted/20"
            : "border-border bg-muted/10 hover:border-accent/50",
          draggedIndex === index && "opacity-50",
          className
        )}
      >
        <div className="aspect-square relative">
          {hasImage ? (
            <>
              <Image
                src={value[index]}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                <div className="flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                  <GripVertical className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium">
                    {index === 0 ? "Principal" : `#${index + 1}`}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleRemoveImage(index)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <label
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center cursor-pointer",
                isUploading && "cursor-not-allowed"
              )}
            >
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, index);
                }}
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-3 w-full px-4">
                  <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  <Progress value={progress} className="w-full" />
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center px-4">
                    {index === 0 ? "Imagen Principal" : `Imagen ${index + 1}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Clic o arrastra
                  </p>
                </>
              )}
            </label>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: maxImages }).map((_, index) =>
          renderImageSlot(index)
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="rounded-lg bg-muted/30 border border-border p-3">
        <div className="flex items-start gap-2">
          <ImageIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• La primera imagen es la principal del producto</p>
            <p>• Arrastra las imágenes para reordenarlas</p>
            <p>• Formatos: JPG, PNG, WebP (máx. 5MB)</p>
            <p>• Recomendado: Imágenes cuadradas de al menos 800x800px</p>
          </div>
        </div>
      </div>
    </div>
  );
}
