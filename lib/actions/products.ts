"use server"

import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"
import { revalidatePath } from "next/cache"

/**
 * Fetches all products from the database
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }

  return data || []
}

/**
 * Fetches a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single()

  if (error) {
    console.error("[v0] Error fetching product:", error)
    return null
  }

  return data
}

/**
 * Fetches products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching products by category:", error)
    throw new Error("Failed to fetch products")
  }

  return data || []
}

/**
 * Searches products by title or description
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error searching products:", error)
    throw new Error("Failed to search products")
  }

  return data || []
}

/**
 * Creates a new product (admin only)
 */
export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase.from("products").insert(product).select().single()

  if (error) {
    console.error("[v0] Error creating product:", error)
    throw new Error("Failed to create product")
  }

  revalidatePath("/productos")
  revalidatePath("/admin")

  return data
}

/**
 * Updates a product (admin only)
 */
export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating product:", error)
    throw new Error("Failed to update product")
  }

  revalidatePath("/productos")
  revalidatePath(`/producto/${data.slug}`)
  revalidatePath("/admin")

  return data
}

/**
 * Deletes a product (admin only)
 */
export async function deleteProduct(id: string) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting product:", error)
    throw new Error("Failed to delete product")
  }

  revalidatePath("/productos")
  revalidatePath("/admin")
}
