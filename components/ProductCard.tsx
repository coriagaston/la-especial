"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cart";

interface ProductCardProps {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  available?: boolean;
  imageUrl?: string | null;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  category,
  available = true,
  imageUrl,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const [added, setAdded] = useState(false);

  const cartItem = items.find((i) => i.id === id);
  const qty = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({ id, name, price, category });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  if (!available) {
    return (
      <div className="relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-gray-50 opacity-60 overflow-hidden">
        {imageUrl && (
          <div className="relative w-full h-32">
            <Image src={imageUrl} alt={name} fill className="object-cover" />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-gray-500">{name}</h3>
          {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
          <div className="flex items-center justify-between mt-3">
            <span className="font-bold text-gray-400">{formatPrice(price)}</span>
            <span className="text-xs text-gray-400 italic">No disponible</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {imageUrl && (
        <div className="relative w-full h-36">
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 text-sm leading-snug">{name}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 gap-2">
          <span className="font-bold text-lg" style={{ color: "#1A5C2A" }}>
            {formatPrice(price)}
          </span>

          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: added ? "#22c55e" : "#1A5C2A" }}
            >
              {added ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Agregado
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(id, qty - 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-sm transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#1A5C2A" }}
              >
                −
              </button>
              <span className="w-5 text-center font-bold text-sm">{qty}</span>
              <button
                onClick={() => updateQty(id, qty + 1)}
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-sm transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#1A5C2A" }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
