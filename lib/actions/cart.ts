"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getEffectivePrice } from "@/lib/utils/discount-utils";

/**
 * Gets or creates a session ID for guest users
 */
async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session_id")?.value;

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;
    cookieStore.set("cart_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
}

/**
 * Fetches cart items for the current user or session
 */
export async function getCartItems(): Promise<CartItem[]> {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase.from("cart_items").select(`
      *,
      product:products(*)
    `);

    if (user) {
      query = query.eq("user_id", user.id);
    } else {
      const sessionId = await getSessionId();
      query = query.eq("session_id", sessionId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[v0] Error fetching cart items:", error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[v0] Error fetching cart items:", error);
    return [];
  }
}

/**
 * Adds an item to the cart
 */
export async function addToCart(
  productId: string,
  quantity = 1
): Promise<CartItem> {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cartData: any = {
    product_id: productId,
    quantity,
  };

  if (user) {
    cartData.user_id = user.id;
  } else {
    cartData.session_id = await getSessionId();
  }

  // Check if item already exists in cart
  let existingQuery = supabase
    .from("cart_items")
    .select("*")
    .eq("product_id", productId);

  if (user) {
    existingQuery = existingQuery.eq("user_id", user.id);
  } else {
    existingQuery = existingQuery.eq("session_id", cartData.session_id);
  }

  const { data: existing } = await existingQuery.single();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("[v0] Error updating cart item:", error);
      throw new Error("Failed to update cart item");
    }

    revalidatePath("/");
    return data;
  } else {
    // Insert new item
    const { data, error } = await supabase
      .from("cart_items")
      .insert(cartData)
      .select()
      .single();

    if (error) {
      console.error("[v0] Error adding to cart:", error);
      throw new Error("Failed to add to cart");
    }

    revalidatePath("/");
    return data;
  }
}

/**
 * Updates cart item quantity
 */
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<void> {
  const supabase = await createClient();

  if (quantity <= 0) {
    await removeFromCart(itemId);
    return;
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId);

  if (error) {
    console.error("[v0] Error updating cart item:", error);
    throw new Error("Failed to update cart item");
  }

  revalidatePath("/");
}

/**
 * Removes an item from the cart
 */
export async function removeFromCart(itemId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);

  if (error) {
    console.error("[v0] Error removing from cart:", error);
    throw new Error("Failed to remove from cart");
  }

  revalidatePath("/");
}

/**
 * Clears all items from the cart
 */
export async function clearCart(): Promise<void> {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("cart_items").delete();

  if (user) {
    query = query.eq("user_id", user.id);
  } else {
    const sessionId = await getSessionId();
    query = query.eq("session_id", sessionId);
  }

  const { error } = await query;

  if (error) {
    console.error("[v0] Error clearing cart:", error);
    throw new Error("Failed to clear cart");
  }

  revalidatePath("/");
}

/**
 * Gets cart total
 */
export async function getCartTotal(): Promise<{
  items: number;
  total: number;
}> {
  const items = await getCartItems();

  const total = items.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = getEffectivePrice(item.product);
    return sum + price * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items: itemCount, total };
}
