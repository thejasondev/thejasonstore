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

    console.log("[BANNERS] === Fetching Active Banners ===");
    console.log("[BANNERS] Current server time (ISO):", now);
    console.log(
      "[BANNERS] Current local time:",
      new Date().toLocaleString("es-ES", { timeZone: "America/Havana" })
    );

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

    console.log(
      "[BANNERS] Total banners from DB (is_active=true):",
      data.length
    );

    // Filter by date programación
    const activeBanners = data.filter((banner) => {
      console.log(
        `[BANNERS] --- Checking: "${banner.title}" (ID: ${banner.id}) ---`
      );
      console.log(`[BANNERS]   Position: ${banner.position}`);
      console.log(`[BANNERS]   is_active: ${banner.is_active}`);
      console.log(`[BANNERS]   start_date: ${banner.start_date || "null"}`);
      console.log(`[BANNERS]   end_date: ${banner.end_date || "null"}`);

      // Si tiene start_date y no es vacío, debe haber comenzado
      if (banner.start_date && banner.start_date.trim() !== "") {
        const startDate = new Date(banner.start_date);
        const nowDate = new Date(now);
        const hasNotStarted = startDate > nowDate;

        console.log(
          `[BANNERS]   Start check: ${startDate.toISOString()} > ${nowDate.toISOString()} = ${hasNotStarted}`
        );

        if (hasNotStarted) {
          console.log(`[BANNERS]   ❌ HIDDEN - Banner hasn't started yet`);
          return false;
        }
      }

      // Si tiene end_date y no es vacío, no debe haber terminado
      if (banner.end_date && banner.end_date.trim() !== "") {
        const endDate = new Date(banner.end_date);
        const nowDate = new Date(now);
        const hasEnded = endDate < nowDate;

        console.log(
          `[BANNERS]   End check: ${endDate.toISOString()} < ${nowDate.toISOString()} = ${hasEnded}`
        );

        if (hasEnded) {
          console.log(`[BANNERS]   ❌ HIDDEN - Banner has ended`);
          return false;
        }
      }

      console.log(`[BANNERS]   ✅ ACTIVE - Banner will be displayed`);
      return true;
    });

    console.log(
      "[BANNERS] === Result: " +
        activeBanners.length +
        " active banners will be shown ==="
    );
    console.log(
      "[BANNERS] Active banner titles:",
      activeBanners.map((b) => b.title).join(", ")
    );

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
