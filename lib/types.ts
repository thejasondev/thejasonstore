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
}
