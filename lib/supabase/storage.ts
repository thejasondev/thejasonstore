"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * Uploads an image to Supabase Storage
 * @param file - The file to upload
 * @param folder - Optional folder path within the bucket
 * @returns The public URL of the uploaded image
 */
export async function uploadProductImage(file: File, folder = "products"): Promise<string> {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  // Generate unique filename
  const fileExt = file.name.split(".").pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  // Upload file
  const { data, error } = await supabase.storage.from("product-images").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.error("[v0] Error uploading image:", error)
    throw new Error("Failed to upload image")
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(data.path)

  return publicUrl
}

/**
 * Deletes an image from Supabase Storage
 * @param url - The public URL of the image to delete
 */
export async function deleteProductImage(url: string): Promise<void> {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  // Extract path from URL
  const path = url.split("/product-images/").pop()
  if (!path) {
    throw new Error("Invalid image URL")
  }

  const { error } = await supabase.storage.from("product-images").remove([path])

  if (error) {
    console.error("[v0] Error deleting image:", error)
    throw new Error("Failed to delete image")
  }
}

/**
 * Lists all images in a folder
 * @param folder - The folder path to list
 */
export async function listProductImages(folder = "products"): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.storage.from("product-images").list(folder)

  if (error) {
    console.error("[v0] Error listing images:", error)
    throw new Error("Failed to list images")
  }

  return (
    data?.map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(`${folder}/${file.name}`)
      return publicUrl
    }) || []
  )
}
