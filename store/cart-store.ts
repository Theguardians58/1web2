'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
  variant?: {
    id: string
    name: string
    color?: string
    size: string
  }
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalPrice: () => number
  getItemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (itemData) => {
        const { items } = get()
        const existingItem = items.find(
          item => 
            item.productId === itemData.productId && 
            item.variant?.id === itemData.variant?.id
        )

        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + itemData.quantity }
                : item
            )
          })
        } else {
          set({
            items: [...items, { ...itemData, id: Math.random().toString(36).substr(2, 9) }]
          })
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map(item =>
              item.id === id ? { ...item, quantity } : item
            )
          })
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'cart-storage',
    }
  )
)
