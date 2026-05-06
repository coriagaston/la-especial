"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/lib/cart";

const WA_NUMBER = "543625143630";

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total());
  const count = useCartStore((s) => s.count());
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const getWhatsAppMessage = useCartStore((s) => s.getWhatsAppMessage);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleWhatsApp = () => {
    const message = getWhatsAppMessage();
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#ffffff" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ backgroundColor: "#1A5C2A", color: "#F5B800" }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="font-bold text-lg">Tu Pedido</h2>
            {count > 0 && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}
              >
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-1">
                Explorá nuestro menú y agregá productos
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-5 py-2 rounded-full font-semibold text-sm text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#1A5C2A" }}
              >
                Ver Menú
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{formatPrice(item.price)} c/u</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "#1A5C2A" }}
                    >
                      −
                    </button>
                    <span className="w-5 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white transition-opacity hover:opacity-80"
                      style={{ backgroundColor: "#1A5C2A" }}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-sm" style={{ color: "#1A5C2A" }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      quitar
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-2"
              >
                Vaciar carrito
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-xl" style={{ color: "#1A5C2A" }}>
                {formatPrice(total)}
              </span>
            </div>
            <button
              onClick={handleWhatsApp}
              className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hacer pedido por WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
