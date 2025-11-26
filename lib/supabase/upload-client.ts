"use client";

import { uploadBannerImage } from "@/lib/supabase/storage";
import { validateImageFile } from "@/lib/utils";

/**
 * Client-side wrapper for uploading banner images
 * This is needed because we need to convert File to FormData for server actions
 */
export async function uploadBannerImageClient(file: File): Promise<string> {
  // Validate first
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Call server action
  const url = await uploadBannerImage(file);
  return url;
}
