"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  available: boolean;
  sortOrder: number;
  imageUrl: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  emoji: string;
  unit: string;
  products: Product[];
}

const categoryEmojis: Record<string, string> = {
  sorrentinos: "🫓",
  ravioles: "🍝",
  fideos: "🍜",
  noquis: "⚪",
  canelones: "🌯",
  lasagnas: "🫕",
  pizzas: "🍕",
  "productos-congelados": "❄️",
  salsas: "🥫",
};

function ImageUploadCell({
  product,
  onUploaded,
}: {
  product: Product;
  onUploaded: (productId: number, url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(product.imageUrl);

  const handleFile = async (file: File) => {
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url);
        onUploaded(product.id, data.url);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {preview ? (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
          <Image src={preview} alt={product.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs px-2 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {uploading ? "..." : preview ? "Cambiar" : "Subir"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}

export default function AdminProductos() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState<
    Record<number, { price?: number; available?: boolean; imageUrl?: string | null }>
  >({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/productos")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePriceChange = (productId: number, price: string) => {
    setChanges((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], price: parseFloat(price) || 0 },
    }));
  };

  const handleAvailableChange = (productId: number, available: boolean) => {
    setChanges((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], available },
    }));
  };

  const handleImageUploaded = (productId: number, url: string) => {
    setChanges((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], imageUrl: url },
    }));
  };

  const getProductValue = (product: Product, field: "price" | "available") => {
    if (changes[product.id]?.[field] !== undefined) {
      return changes[product.id][field];
    }
    return product[field];
  };

  const getProductWithChanges = (product: Product): Product => {
    const change = changes[product.id];
    if (!change) return product;
    return {
      ...product,
      price: change.price ?? product.price,
      available: change.available ?? product.available,
      imageUrl: change.imageUrl !== undefined ? change.imageUrl : product.imageUrl,
    };
  };

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) {
      setSaveMessage("No hay cambios para guardar.");
      setTimeout(() => setSaveMessage(""), 2000);
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const updates = Object.entries(changes).map(([id, data]) => ({
        id: parseInt(id),
        ...data,
      }));

      const res = await fetch("/api/admin/productos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          products: cat.products.map((p) => getProductWithChanges(p)),
        }))
      );

      setChanges({});
      setSaveMessage(`✓ ${updates.length} producto(s) actualizado(s)`);
    } catch {
      setSaveMessage("Error al guardar los cambios.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const pendingCount = Object.keys(changes).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold" style={{ color: "#1A5C2A" }}>
          Productos
        </h1>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span
              className={`text-sm font-medium ${
                saveMessage.startsWith("✓") ? "text-green-600" : "text-red-600"
              }`}
            >
              {saveMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || pendingCount === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#1A5C2A" }}
          >
            {saving ? "Guardando..." : `Guardar${pendingCount > 0 ? ` (${pendingCount})` : ""}`}
          </button>
        </div>
      </div>
      <p className="text-gray-500 mb-8">
        Actualizá precios, disponibilidad y fotos. Los cambios se guardan al presionar Guardar.
      </p>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando productos...</div>
      ) : (
        <div className="space-y-10">
          {categories.map((category) => (
            <section key={category.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">
                  {categoryEmojis[category.slug] ?? category.emoji}
                </span>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "#1A5C2A" }}>
                    {category.name}
                  </h2>
                  {category.unit && (
                    <p className="text-xs text-gray-500">{category.unit}</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: "#f9f6f0" }}>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">
                        Producto
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 w-36">
                        Foto
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700 w-32">
                        Precio ($)
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700 w-28">
                        Disponible
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.products.map((product, idx) => {
                      const currentPrice = getProductValue(product, "price") as number;
                      const currentAvailable = getProductValue(product, "available") as boolean;
                      const hasChange = !!changes[product.id];
                      const productWithChanges = getProductWithChanges(product);

                      return (
                        <tr
                          key={product.id}
                          className={`border-b last:border-0 transition-colors ${
                            hasChange ? "bg-yellow-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800">{product.name}</p>
                            {product.description && (
                              <p className="text-xs text-gray-400">{product.description}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <ImageUploadCell
                              product={productWithChanges}
                              onUploaded={handleImageUploaded}
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end">
                              <input
                                type="number"
                                value={currentPrice}
                                onChange={(e) =>
                                  handlePriceChange(product.id, e.target.value)
                                }
                                min="0"
                                step="50"
                                className="w-28 text-right px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 font-mono"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={currentAvailable}
                                onChange={(e) =>
                                  handleAvailableChange(
                                    product.id,
                                    e.target.checked
                                  )
                                }
                                className="sr-only peer"
                              />
                              <div
                                className="w-10 h-6 rounded-full peer
                                  peer-checked:after:translate-x-full peer-checked:after:border-white
                                  after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                  after:bg-white after:border-gray-300 after:border after:rounded-full
                                  after:h-5 after:w-5 after:transition-all
                                  peer-checked:bg-green-600 bg-gray-200"
                              />
                            </label>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Sticky save bar */}
      {pendingCount > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 border-t shadow-xl"
          style={{ backgroundColor: "#1A5C2A" }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <span className="text-white font-medium text-sm">
              {pendingCount} cambio(s) sin guardar
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setChanges({})}
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Descartar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 rounded-full font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
