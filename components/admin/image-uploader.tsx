"use client";

import { useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { cn, validateImageFile } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  className?: string;
  aspectRatio?: "hero" | "square" | "wide";
}

export function ImageUploader({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  className,
  aspectRatio = "wide",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);

  const aspectClasses = {
    hero: "aspect-[21/9]",
    square: "aspect-square",
    wide: "aspect-[16/9]",
  };

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      setUploading(true);
      onUploadStart?.();

      try {
        // Simulate progress during upload
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        // Call uploadBannerImage
        const { uploadBannerImage } = await import("@/lib/supabase/storage");
        const imageUrl = await uploadBannerImage(file);

        clearInterval(progressInterval);
        setProgress(100);

        // Update with actual URL
        onChange(imageUrl);
        setPreview(imageUrl);
      } catch (err) {
        console.error("Upload error:", err);
        setError(
          err instanceof Error ? err.message : "Error al subir la imagen"
        );
        setPreview(null);
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 500);
        onUploadEnd?.();
      }
    },
    [onChange, onUploadStart, onUploadEnd]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setPreview(null);
    onChange("");
  }, [onChange]);

  return (
    <div className={cn("space-y-4", className)}>
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative rounded-lg border-2 border-dashed transition-colors",
            aspectClasses[aspectRatio],
            isDragging
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/50",
            uploading && "pointer-events-none opacity-50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            {uploading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-accent" />
                <p className="text-sm text-muted-foreground">
                  Subiendo imagen...
                </p>
                <Progress value={progress} className="w-full max-w-xs" />
              </>
            ) : (
              <>
                <div className="rounded-full bg-accent/10 p-4">
                  <Upload className="h-8 w-8 text-accent" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Arrastra una imagen aquí o click para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG o WebP (máx. 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative group rounded-lg overflow-hidden",
            aspectClasses[aspectRatio]
          )}
        >
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemove}
              className="glass-card"
            >
              <X className="h-4 w-4 mr-2" />
              Remover
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
