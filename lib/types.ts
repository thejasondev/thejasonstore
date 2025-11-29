export interface Product {
  id: string;
  sku: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
  category: string;
  category_id?: string | null;
  is_featured?: boolean;
  is_active?: boolean;
  // Sale/Discount fields
  sale_price?: number | null;
  sale_start_date?: string | null;
  sale_end_date?: string | null;
  is_on_sale?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  product_id: string;
  product?: Product;
  quantity: number;
  created_at: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  image_alt?: string;

  cta_text?: string;
  cta_link?: string;
  cta_style?: "primary" | "secondary" | "outline";

  position: "hero" | "slider" | "info";
  display_order: number;
  is_active: boolean;

  start_date?: string;
  end_date?: string;

  background_color?: string;
  text_color?: string;
  overlay_opacity?: number;

  created_at: string;
  updated_at?: string;
}

export interface BannerFormData {
  title: string;
  description?: string;
  image: File | null;
  image_url?: string;
  image_alt?: string;
  cta_text?: string;
  cta_link?: string;
  cta_style?: "primary" | "secondary" | "outline";
  position: "hero" | "slider" | "info" | "sidebar";
  is_active: boolean;
  start_date?: Date | null;
  end_date?: Date | null;
  background_color?: string;
  text_color?: string;
  overlay_opacity?: number;
}
