"use server";

import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { revalidatePath } from "next/cache";

/**
 * Fetches all products from the database
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.log(
          "[v0] Products table doesn't exist yet. Please run the SQL scripts in the /scripts folder."
        );
        return [];
      }
      console.error("[v0] Error fetching products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[v0] Unexpected error fetching products:", error);
    return [];
  }
}

/**
 * Fetches featured products for homepage display
 */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.log(
          "[v0] Products table doesn't exist yet. Please run the SQL scripts in the /scripts folder."
        );
        return [];
      }
      console.error("[v0] Error fetching featured products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[v0] Unexpected error fetching featured products:", error);
    return [];
  }
}

/**
 * Fetches a single product by id
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.log(
          "[v0] Products table doesn't exist yet. Please run the SQL scripts."
        );
        return null;
      }
      console.error("[v0] Error fetching product by id:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("[v0] Unexpected error fetching product by id:", error);
    return null;
  }
}

/**
 * Fetches a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.log(
          "[v0] Products table doesn't exist yet. Please run the SQL scripts."
        );
        return null;
      }
      console.error("[v0] Error fetching product:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("[v0] Unexpected error fetching product:", error);
    return null;
  }
}

/**
 * Fetches products by category
 */
export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        return [];
      }
      console.error("[v0] Error fetching products by category:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[v0] Unexpected error:", error);
    return [];
  }
}

/**
 * Searches products by title or description
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        return [];
      }
      console.error("[v0] Error searching products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[v0] Unexpected error:", error);
    return [];
  }
}

/**
 * Advanced product search with filters
 */
export async function searchProductsAdvanced(params: {
  query?: string;
  category?: string;
  currency?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  sortBy?:
    | "price_asc"
    | "price_desc"
    | "newest"
    | "oldest"
    | "name_asc"
    | "name_desc";
  limit?: number;
  offset?: number;
}): Promise<{ products: Product[]; total: number }> {
  try {
    const supabase = await createClient();

    let query = supabase.from("products").select("*", { count: "exact" });

    // Text search
    if (params.query) {
      query = query.or(
        `title.ilike.%${params.query}%,description.ilike.%${params.query}%,sku.ilike.%${params.query}%`
      );
    }

    // Category filter
    if (params.category) {
      query = query.eq("category", params.category);
    }

    // Currency filter
    if (params.currency) {
      query = query.eq("currency", params.currency);
    }

    // Price range filter
    if (params.minPrice !== undefined) {
      query = query.gte("price", params.minPrice);
    }
    if (params.maxPrice !== undefined) {
      query = query.lte("price", params.maxPrice);
    }

    // Stock filter
    if (params.inStock) {
      query = query.gt("stock", 0);
    }

    // Sale filter
    if (params.onSale) {
      query = query.eq("is_on_sale", true);
    }

    // Sorting
    switch (params.sortBy) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "name_asc":
        query = query.order("title", { ascending: true });
        break;
      case "name_desc":
        query = query.order("title", { ascending: false });
        break;
      default:
        query = query.order("created_at", { ascending: false });
    }

    // Pagination
    if (params.limit) {
      query = query.limit(params.limit);
    }
    if (params.offset) {
      query = query.range(
        params.offset,
        params.offset + (params.limit || 10) - 1
      );
    }

    const { data, error, count } = await query;

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        return { products: [], total: 0 };
      }
      console.error("[v0] Error searching products:", error);
      return { products: [], total: 0 };
    }

    return {
      products: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("[v0] Unexpected error:", error);
    return { products: [], total: 0 };
  }
}

/**
 * Get price range for products
 */
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("price")
      .order("price", { ascending: true });

    if (error || !data || data.length === 0) {
      return { min: 0, max: 10000 };
    }

    return {
      min: data[0].price,
      max: data[data.length - 1].price,
    };
  } catch (error) {
    return { min: 0, max: 10000 };
  }
}

/**
 * Creates a new product (admin only)
 */
export async function createProduct(
  product: Omit<Product, "id" | "created_at" | "updated_at">
) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("[v0] Error creating product:", error);
    throw new Error("Failed to create product");
  }

  revalidatePath("/productos");
  revalidatePath("/admin");

  return data;
}

/**
 * Updates a product (admin only)
 */
export async function updateProduct(id: string, updates: Partial<Product>) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[v0] Error updating product:", error);
    throw new Error("Failed to update product");
  }

  revalidatePath("/productos");
  revalidatePath(`/producto/${data.slug}`);
  revalidatePath("/admin");

  return data;
}

/**
 * Deletes a product (admin only)
 */
export async function deleteProduct(id: string) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("[v0] Error deleting product:", error);
    throw new Error("Failed to delete product");
  }

  revalidatePath("/productos");
  revalidatePath("/admin");
}

/**
 * Toggles the featured status of a product (admin only)
 */
export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("products")
    .update({ is_featured: isFeatured })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[v0] Error toggling featured status:", error);
    throw new Error("Failed to update featured status");
  }

  revalidatePath("/productos");
  revalidatePath("/");
  revalidatePath("/admin");

  return data;
}

/**
 * Get products currently on sale
 */
export async function getSaleProducts(limit = 12): Promise<Product[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_on_sale", true)
      .eq("is_active", true)
      .order("sale_start_date", { ascending: false })
      .limit(limit);

    if (error) {
      if (error.code === "42P01" || error.message.includes("does not exist")) {
        console.log(
          "[v0] Products table doesn't have sale columns yet. Run the add-discounts-support.sql script."
        );
        return [];
      }
      console.error("[v0] Error fetching sale products:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[v0] Unexpected error fetching sale products:", error);
    return [];
  }
}

/**
 * Get best deals (products with highest savings)
 */
export async function getBestDeals(limit = 6): Promise<Product[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_on_sale", true)
      .eq("is_active", true)
      .not("sale_price", "is", null)
      .order("price", { ascending: false }) // Higher original price = potentially better deal
      .limit(limit * 2); // Get more to calculate savings

    if (error) {
      console.error("[v0] Error fetching best deals:", error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Sort by actual savings amount
    const sorted = data
      .map((product) => ({
        ...product,
        savings: product.price - (product.sale_price || 0),
      }))
      .sort((a, b) => b.savings - a.savings)
      .slice(0, limit);

    return sorted;
  } catch (error) {
    console.error("[v0] Unexpected error fetching best deals:", error);
    return [];
  }
}

/**
 * Update product sale information (admin only)
 */
export async function updateProductSale(
  id: string,
  saleData: {
    sale_price: number | null;
    sale_start_date: string | null;
    sale_end_date: string | null;
  }
) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // Validate sale data
  if (saleData.sale_price !== null) {
    if (!saleData.sale_start_date || !saleData.sale_end_date) {
      throw new Error(
        "Sale start and end dates are required when setting a sale price"
      );
    }

    const startDate = new Date(saleData.sale_start_date);
    const endDate = new Date(saleData.sale_end_date);

    if (endDate <= startDate) {
      throw new Error("Sale end date must be after start date");
    }
  }

  const { data, error } = await supabase
    .from("products")
    .update(saleData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[v0] Error updating product sale:", error);
    throw new Error("Failed to update product sale");
  }

  revalidatePath("/productos");
  revalidatePath("/ofertas");
  revalidatePath(`/producto/${data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/");

  return data;
}

/**
 * Remove sale from a product (admin only)
 */
export async function removeProductSale(id: string) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      sale_price: null,
      sale_start_date: null,
      sale_end_date: null,
      is_on_sale: false,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[v0] Error removing product sale:", error);
    throw new Error("Failed to remove product sale");
  }

  revalidatePath("/productos");
  revalidatePath("/ofertas");
  revalidatePath(`/producto/${data.slug}`);
  revalidatePath("/admin");
  revalidatePath("/");

  return data;
}
