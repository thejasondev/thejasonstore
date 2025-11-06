export interface Product {
  id: string
  sku: string
  slug: string
  title: string
  description: string
  price: number
  currency: string
  stock: number
  images: string[]
  category: string
  created_at: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  display_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  id: string
  user_id?: string
  session_id?: string
  product_id: string
  product?: Product
  quantity: number
  created_at: string
  updated_at?: string
}
