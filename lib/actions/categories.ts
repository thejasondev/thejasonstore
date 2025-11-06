"use server"

import { createClient } from "@/lib/supabase/server"
import type { Category } from "@/lib/types"
import { revalidatePath } from "next/cache"

/**
 * Fetches all active categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching categories:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }
}

/**
 * Fetches a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).eq("is_active", true).single()

  if (error) {
    console.error("[v0] Error fetching category:", error)
    return null
  }

  return data
}

/**
 * Creates a new category (admin only)
 */
export async function createCategory(category: Omit<Category, "id" | "created_at" | "updated_at">) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase.from("categories").insert(category).select().single()

  if (error) {
    console.error("[v0] Error creating category:", error)
    throw new Error("Failed to create category")
  }

  revalidatePath("/productos")
  revalidatePath("/admin")

  return data
}

/**
 * Updates a category (admin only)
 */
export async function updateCategory(id: string, updates: Partial<Category>) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating category:", error)
    throw new Error("Failed to update category")
  }

  revalidatePath("/productos")
  revalidatePath("/admin")

  return data
}

/**
 * Deletes a category (admin only)
 */
export async function deleteCategory(id: string) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting category:", error)
    throw new Error("Failed to delete category")
  }

  revalidatePath("/productos")
  revalidatePath("/admin")
}
