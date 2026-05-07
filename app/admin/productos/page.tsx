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

function ImageUploadCell({ product, onUploaded }: { product: Product; onUploaded: (id: number, url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(product.imageUrl);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    // Validación de tamaño: máx 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("El archivo es muy grande. Máximo 5MB.");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      setError("Formato no permitido. Usá JPG, PNG o WEBP.");
      return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      let data: Record<string, string> = {};
      try { data = await res.json(); } catch { /* respuesta no-JSON */ }
      if (!res.ok) {
        setError(data.error || `Error ${res.status} — revisá las credenciales de Cloudinary`);
        return;
      }
      setPreview(data.url);
      onUploaded(product.id, data.url);
    } catch (e) {
      setError("Error de red. Verificá tu conexión a internet.");
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
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
          {uploading ? "Subiendo..." : preview ? "Cambiar" : "Subir foto"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
      {error && <p className="text-xs text-red-500 max-w-[160px]">{error}</p>}
    </div>
  );
}

function AddProductForm({ categoryId, onAdded, onCancel }: {
  categoryId: number;
  onAdded: (p: Product) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) { setError("Nombre y precio son obligatorios"); return; }
    setSaving(true);
    const res = await fetch("/api/admin/productos/crear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name, description, price: parseFloat(price) }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error"); setSaving(false); return; }
    onAdded(data);
  };

  return (
    <tr className="bg-blue-50">
      <td colSpan={4} className="px-4 py-3">
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del producto *"
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 w-48" />
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción (opcional)"
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 w-48" />
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio *" type="number" min="0" step="50"
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 w-28" />
          <button type="submit" disabled={saving}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "#1A5C2A" }}>
            {saving ? "..." : "Agregar"}
          </button>
          <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700">
            Cancelar
          </button>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </form>
      </td>
    </tr>
  );
}

function AddCategoryForm({ onAdded, onCancel }: {
  onAdded: (c: Category) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [emoji, setEmoji] = useState("🍝");
  const [unit, setUnit] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("El nombre es obligatorio"); return; }
    const autoSlug = slug.trim() || name.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");
    setSaving(true);
    const res = await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: autoSlug, emoji, unit }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error"); setSaving(false); return; }
    onAdded({ ...data, products: [] });
  };

  return (
    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
      <h3 className="font-semibold text-gray-700 mb-3">Nueva categoría</h3>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre *"
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 w-40" />
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (auto si vacío)"
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 w-40" />
        <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="Emoji"
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm w-16 text-center" />
        <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Unidad (ej: x500gr · 2 porciones)"
          className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 w-64" />
        <button type="submit" disabled={saving}
          className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: "#1A5C2A" }}>
          {saving ? "..." : "Crear categoría"}
        </button>
        <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-700">
          Cancelar
        </button>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </form>
    </div>
  );
}

export default function AdminProductos() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [changes, setChanges] = useState<Record<number, { price?: number; available?: boolean; imageUrl?: string | null }>>({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [addingProductTo, setAddingProductTo] = useState<number | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<number | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/productos")
      .then((r) => r.json())
      .then((data) => { setCategories(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handlePriceChange = (id: number, price: string) =>
    setChanges((p) => ({ ...p, [id]: { ...p[id], price: parseFloat(price) || 0 } }));

  const handleAvailableChange = (id: number, available: boolean) =>
    setChanges((p) => ({ ...p, [id]: { ...p[id], available } }));

  const handleImageUploaded = (id: number, url: string) =>
    setChanges((p) => ({ ...p, [id]: { ...p[id], imageUrl: url } }));

  const getValue = (product: Product, field: "price" | "available") =>
    changes[product.id]?.[field] !== undefined ? changes[product.id][field] : product[field];

  const getMerged = (product: Product): Product => {
    const c = changes[product.id];
    if (!c) return product;
    return { ...product, price: c.price ?? product.price, available: c.available ?? product.available, imageUrl: c.imageUrl !== undefined ? c.imageUrl : product.imageUrl };
  };

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) return;
    setSaving(true);
    try {
      const updates = Object.entries(changes).map(([id, data]) => ({ id: parseInt(id), ...data }));
      const res = await fetch("/api/admin/productos", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) throw new Error();
      setCategories((prev) => prev.map((cat) => ({ ...cat, products: cat.products.map(getMerged) })));
      setChanges({});
      setSaveMessage(`✓ ${updates.length} producto(s) actualizado(s)`);
    } catch { setSaveMessage("Error al guardar."); }
    finally { setSaving(false); setTimeout(() => setSaveMessage(""), 3000); }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setDeletingProduct(productId);
    const res = await fetch("/api/admin/productos/crear", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId }),
    });
    if (res.ok) {
      setCategories((prev) => prev.map((cat) => ({ ...cat, products: cat.products.filter((p) => p.id !== productId) })));
    }
    setDeletingProduct(null);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm("¿Eliminar esta categoría? Solo se puede si no tiene productos.")) return;
    setDeletingCategory(categoryId);
    const res = await fetch("/api/admin/categorias", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: categoryId }),
    });
    const data = await res.json();
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    } else {
      alert(data.error);
    }
    setDeletingCategory(null);
  };

  const pendingCount = Object.keys(changes).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold" style={{ color: "#1A5C2A" }}>Productos</h1>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className={`text-sm font-medium ${saveMessage.startsWith("✓") ? "text-green-600" : "text-red-600"}`}>
              {saveMessage}
            </span>
          )}
          <button onClick={() => setShowAddCategory(true)}
            className="px-4 py-2 rounded-full text-sm font-bold border-2 transition-all hover:opacity-80"
            style={{ borderColor: "#1A5C2A", color: "#1A5C2A" }}>
            + Categoría
          </button>
          <button onClick={handleSave} disabled={saving || pendingCount === 0}
            className="px-5 py-2.5 rounded-full font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#1A5C2A" }}>
            {saving ? "Guardando..." : `Guardar${pendingCount > 0 ? ` (${pendingCount})` : ""}`}
          </button>
        </div>
      </div>
      <p className="text-gray-500 mb-6">Precios, disponibilidad, fotos. Podés agregar o eliminar categorías y productos.</p>

      {showAddCategory && (
        <div className="mb-8">
          <AddCategoryForm
            onAdded={(c) => { setCategories((prev) => [...prev, c]); setShowAddCategory(false); }}
            onCancel={() => setShowAddCategory(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando productos...</div>
      ) : (
        <div className="space-y-10">
          {categories.map((category) => (
            <section key={category.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{category.emoji}</span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold" style={{ color: "#1A5C2A" }}>{category.name}</h2>
                  {category.unit && <p className="text-xs text-gray-500">{category.unit}</p>}
                </div>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={deletingCategory === category.id}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50 px-2 py-1 rounded border border-red-200 hover:border-red-400"
                  title="Eliminar categoría"
                >
                  Eliminar categoría
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: "#f9f6f0" }}>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Producto</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700 w-44">Foto</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700 w-32">Precio ($)</th>
                      <th className="text-center px-4 py-3 font-semibold text-gray-700 w-24">Activo</th>
                      <th className="px-4 py-3 w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {category.products.map((product, idx) => {
                      const hasChange = !!changes[product.id];
                      const merged = getMerged(product);
                      return (
                        <tr key={product.id}
                          className={`border-b last:border-0 transition-colors ${hasChange ? "bg-yellow-50" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800">{product.name}</p>
                            {product.description && <p className="text-xs text-gray-400">{product.description}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <ImageUploadCell product={merged} onUploaded={handleImageUploaded} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end">
                              <input type="number" value={getValue(product, "price") as number}
                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                min="0" step="50"
                                className="w-28 text-right px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 font-mono" />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" checked={getValue(product, "available") as boolean}
                                onChange={(e) => handleAvailableChange(product.id, e.target.checked)}
                                className="sr-only peer" />
                              <div className="w-10 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 bg-gray-200" />
                            </label>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => handleDeleteProduct(product.id)} disabled={deletingProduct === product.id}
                              className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-50" title="Eliminar">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {addingProductTo === category.id ? (
                      <AddProductForm
                        categoryId={category.id}
                        onAdded={(p) => { setCategories((prev) => prev.map((c) => c.id === category.id ? { ...c, products: [...c.products, p] } : c)); setAddingProductTo(null); }}
                        onCancel={() => setAddingProductTo(null)}
                      />
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-2">
                          <button onClick={() => setAddingProductTo(category.id)}
                            className="text-sm text-green-700 hover:text-green-900 font-medium transition-colors">
                            + Agregar producto
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      {pendingCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t shadow-xl" style={{ backgroundColor: "#1A5C2A" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <span className="text-white font-medium text-sm">{pendingCount} cambio(s) sin guardar</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setChanges({})} className="text-white/70 hover:text-white text-sm">Descartar</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2 rounded-full font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
