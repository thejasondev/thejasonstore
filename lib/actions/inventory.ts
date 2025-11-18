"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface InventoryHistory {
  id: string
  product_id: string
  previous_stock: number
  new_stock: number
  change_amount: number
  change_type: "sale" | "restock" | "adjustment" | "return"
  notes?: string
  created_by?: string
  created_at: string
}

export interface LowStockProduct {
  id: string
  title: string
  sku: string
  stock: number
  low_stock_threshold?: number | null
}

/**
 * Updates product stock and logs the change
 */
export async function updateStock(
  productId: string,
  newStock: number,
  changeType: "sale" | "restock" | "adjustment" | "return",
  notes?: string,
): Promise<void> {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  // Update product stock
  const { error } = await supabase.from("products").update({ stock: newStock }).eq("id", productId)

  if (error) {
    console.error("[v0] Error updating stock:", error)
    throw new Error("Failed to update stock")
  }

  revalidatePath("/productos")
  revalidatePath("/admin")
}

/**
 * Gets inventory history for a product
 */
export async function getInventoryHistory(productId: string): Promise<InventoryHistory[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("inventory_history")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("[v0] Error fetching inventory history:", error)
    throw new Error("Failed to fetch inventory history")
  }

  return data || []
}

/**
 * Gets products with low stock
 */
export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  const supabase = await createClient()

  const LOW_STOCK_DEFAULT_THRESHOLD = 5

  const { data, error } = await supabase
    .from("products")
    .select("id, title, sku, stock, low_stock_threshold")

  if (error) {
    const missingThresholdColumn =
      error.code === "42703" ||
      error.message?.toLowerCase().includes("low_stock_threshold") ||
      error.details?.toLowerCase().includes("low_stock_threshold")

    if (missingThresholdColumn) {
      console.warn("[v0] low_stock_threshold column missing, falling back to default threshold")
      const fallback = await supabase.from("products").select("id, title, sku, stock")

      if (fallback.error) {
        console.error("[v0] Error fetching low stock products (fallback):", fallback.error)
        throw new Error("Failed to fetch low stock products")
      }

      return (fallback.data ?? []).filter((product) => {
        const stock = product.stock ?? 0
        return stock <= LOW_STOCK_DEFAULT_THRESHOLD
      })
    }

    console.error("[v0] Error fetching low stock products:", error)
    throw new Error("Failed to fetch low stock products")
  }

  return (data ?? []).filter((product) => {
    const threshold = product.low_stock_threshold ?? LOW_STOCK_DEFAULT_THRESHOLD
    const stock = product.stock ?? 0
    return stock <= threshold
  })
}

/**
 * Gets out of stock products
 */
export async function getOutOfStockProducts(): Promise<any[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select("id, title, sku, stock, updated_at")
    .lte("stock", 0)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching out of stock products:", error)
    throw new Error("Failed to fetch out of stock products")
  }

  return data || []
}

/**
 * Adjusts stock for multiple products (bulk operation)
 */
export async function bulkAdjustStock(
  adjustments: Array<{ productId: string; newStock: number; notes?: string }>,
): Promise<void> {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  // Update each product
  for (const adjustment of adjustments) {
    await updateStock(adjustment.productId, adjustment.newStock, "adjustment", adjustment.notes)
  }

  revalidatePath("/productos")
  revalidatePath("/admin")
}

/**
 * Sets low stock threshold for a product
 */
export async function setLowStockThreshold(productId: string, threshold: number): Promise<void> {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("products").update({ low_stock_threshold: threshold }).eq("id", productId)

  if (error) {
    console.error("[v0] Error setting low stock threshold:", error)
    throw new Error("Failed to set low stock threshold")
  }

  revalidatePath("/admin")
}
