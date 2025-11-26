"use client";

import { uploadProductImage } from "@/lib/supabase/storage";
import { validateImageFile } from "@/lib/utils";

/**
 * Client-side wrapper for uploading product images
 */
export async function uploadProductImageClient(file: File): Promise<string> {
  // Validate on client first
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid file");
  }

  // Call server action
  const imageUrl = await uploadProductImage(file);
  return imageUrl;
}
