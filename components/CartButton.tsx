"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cart";
import CartSidebar from "./CartSidebar";

export default function CartButton() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = useCartStore((s) => s.count());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Floating button (mobile only, fixed bottom-right) */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: "#1A5C2A", color: "#F5B800" }}
          aria-label="Abrir carrito"
        >
          <CartIcon />
          {mounted && count > 0 && (
            <span
              className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
              style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}
            >
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
      </div>

      {/* Navbar cart button (desktop) */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="relative hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
        style={{ backgroundColor: "#1A5C2A", color: "#F5B800" }}
        aria-label="Abrir carrito"
      >
        <CartIcon />
        <span>Carrito</span>
        {mounted && count > 0 && (
          <span
            className="flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full"
            style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <CartSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

function CartIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
