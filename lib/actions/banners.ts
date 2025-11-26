"use server";

import { createClient } from "@/lib/supabase/server";
import type { Banner, BannerFormData } from "@/lib/types";
import { revalidatePath } from "next/cache";

/**
 * Get all banners (admin)
 */
export async function getBanners(): Promise<Banner[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[v0] Error fetching banners:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[v0] Error in getBanners:", error);
    return [];
  }
}

/**
 * Get active banners with automatic scheduling
 */
export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[v0] Error fetching active banners:", error);
      return [];
    }

    if (!data) return [];

    // Filter by date programación
    const activeBanners = data.filter((banner) => {
      // Si tiene start_date, debe haber comenzado
      if (banner.start_date && new Date(banner.start_date) > new Date(now)) {
        return false;
      }

      // Si tiene end_date, no debe haber terminado
      if (banner.end_date && new Date(banner.end_date) < new Date(now)) {
        return false;
      }

      return true;
    });

    return activeBanners;
  } catch (error) {
    console.error("[v0] Error in getActiveBanners:", error);
    return [];
  }
}

/**
 * Get banners by position
 */
export async function getBannersByPosition(
  position: Banner["position"]
): Promise<Banner[]> {
  try {
    const allBanners = await getActiveBanners();
    return allBanners.filter((banner) => banner.position === position);
  } catch (error) {
    console.error("[v0] Error in getBannersByPosition:", error);
    return [];
  }
}

/**
 * Get single banner by ID
 */
export async function getBannerById(id: string): Promise<Banner | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("[v0] Error fetching banner:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("[v0] Error in getBannerById:", error);
    return null;
  }
}

/**
 * Create new banner
 */
export async function createBanner(
  banner: Omit<Banner, "id" | "created_at" | "updated_at">
): Promise<Banner | null> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const { data, error } = await supabase
      .from("banners")
      .insert(banner)
      .select()
      .single();

    if (error) {
      console.error("[v0] Error creating banner:", error);
      throw new Error("Failed to create banner");
    }

    revalidatePath("/");
    revalidatePath("/admin/secciones");

    return data;
  } catch (error) {
    console.error("[v0] Error in createBanner:", error);
    throw error;
  }
}

/**
 * Update banner
 */
export async function updateBanner(
  id: string,
  updates: Partial<Banner>
): Promise<Banner | null> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const { data, error } = await supabase
      .from("banners")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[v0] Error updating banner:", error);
      throw new Error("Failed to update banner");
    }

    revalidatePath("/");
    revalidatePath("/admin/secciones");

    return data;
  } catch (error) {
    console.error("[v0] Error in updateBanner:", error);
    throw error;
  }
}

/**
 * Delete banner
 */
export async function deleteBanner(id: string): Promise<void> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const { error } = await supabase.from("banners").delete().eq("id", id);

    if (error) {
      console.error("[v0] Error deleting banner:", error);
      throw new Error("Failed to delete banner");
    }

    revalidatePath("/");
    revalidatePath("/admin/secciones");
  } catch (error) {
    console.error("[v0] Error in deleteBanner:", error);
    throw error;
  }
}

/**
 * Toggle banner active status
 */
export async function toggleBannerStatus(
  id: string,
  isActive: boolean
): Promise<Banner | null> {
  return updateBanner(id, { is_active: isActive });
}

/**
 * Reorder banners
 */
export async function reorderBanners(
  banners: Array<{ id: string; display_order: number }>
): Promise<void> {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    // Update each banner's display_order
    const promises = banners.map((banner) =>
      supabase
        .from("banners")
        .update({ display_order: banner.display_order })
        .eq("id", banner.id)
    );

    await Promise.all(promises);

    revalidatePath("/");
    revalidatePath("/admin/secciones");
  } catch (error) {
    console.error("[v0] Error in reorderBanners:", error);
    throw error;
  }
}
