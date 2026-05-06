"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
  getWhatsAppMessage: () => string;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: qty } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      total: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      count: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getWhatsAppMessage: () => {
        const items = get().items;
        if (items.length === 0) return "";

        const lines = items
          .map(
            (item) =>
              `📦 *${item.name}* x${item.quantity} — ${formatPrice(
                item.price * item.quantity
              )}`
          )
          .join("\n");

        const total = get().total();

        return `Hola! 👋 Quiero hacer el siguiente pedido:\n\n${lines}\n\n💰 *Total: ${formatPrice(
          total
        )}*\n\nMi nombre es:`;
      },
    }),
    {
      name: "la-especial-cart",
    }
  )
);
