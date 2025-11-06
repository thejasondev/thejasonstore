"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { CartItem } from '@/lib/types'
import { getCartItems, addToCart as addToCartAction, updateCartItemQuantity, removeFromCart } from '@/lib/actions/cart'

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  isLoading: boolean
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshCart = useCallback(async () => {
    try {
      const cartItems = await getCartItems()
      setItems(cartItems)
    } catch (error) {
      console.error('Error refreshing cart:', error)
    }
  }, [])

  // Load cart on mount
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true)
      await refreshCart()
      setIsLoading(false)
    }
    loadCart()
  }, [refreshCart])

  // Optimistic update: add item
  const addItem = useCallback(async (productId: string, quantity = 1) => {
    try {
      // Optimistic update
      await addToCartAction(productId, quantity)
      
      // Refresh to get actual data
      await refreshCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }, [refreshCart])

  // Optimistic update: update quantity
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    // Optimistic update
    setItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0)
    )

    try {
      await updateCartItemQuantity(itemId, quantity)
      await refreshCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
      // Revert on error
      await refreshCart()
      throw error
    }
  }, [refreshCart])

  // Optimistic update: remove item
  const removeItem = useCallback(async (itemId: string) => {
    // Optimistic update
    setItems(prev => prev.filter(item => item.id !== itemId))

    try {
      await removeFromCart(itemId)
      await refreshCart()
    } catch (error) {
      console.error('Error removing item:', error)
      // Revert on error
      await refreshCart()
      throw error
    }
  }, [refreshCart])

  // Calculate totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0
    return sum + price * item.quantity
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        isLoading,
        addItem,
        updateQuantity,
        removeItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
