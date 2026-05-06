"use client";

import { useState, useEffect, FormEvent } from "react";

interface DailySpecial {
  id: number;
  date: string;
  name: string;
  description: string | null;
  price: number;
  available: boolean;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AdminViandas() {
  const today = getTodayString();
  const [specials, setSpecials] = useState<DailySpecial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    date: today,
  });

  const fetchSpecials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/viandas");
      if (!res.ok) throw new Error("Error al cargar");
      const data = await res.json();
      setSpecials(data);
    } catch {
      setError("Error al cargar las viandas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecials();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.date) {
      setError("Completá todos los campos requeridos.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/viandas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          price: parseFloat(form.price),
          date: form.date,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      setForm({ name: "", description: "", price: "", date: today });
      setSuccess("Vianda agregada exitosamente!");
      await fetchSpecials();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Error al guardar la vianda.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta vianda?")) return;

    try {
      const res = await fetch(`/api/admin/viandas/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      await fetchSpecials();
    } catch {
      setError("Error al eliminar la vianda.");
    }
  };

  const todaySpecials = specials.filter((s) => s.date === today);
  const otherSpecials = specials.filter((s) => s.date !== today);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#1A5C2A" }}>
        Viandas del Día
      </h1>
      <p className="text-gray-500 mb-8">
        Publicá las propuestas especiales del día
      </p>

      {/* Add form */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-4" style={{ color: "#1A5C2A" }}>
          Agregar nueva vianda
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Ravioles de ricota c/salsa bolognesa"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="3500"
                min="0"
                step="50"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ej: Incluye plato de pasta + salsa, apto para 2 personas"
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
            />
          </div>

          <div className="sm:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "#1A5C2A" }}
          >
            {saving ? "Guardando..." : "Agregar Vianda"}
          </button>
        </form>
      </div>

      {/* Today's list */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4" style={{ color: "#1A5C2A" }}>
          Hoy ({today})
        </h2>

        {loading ? (
          <div className="text-center py-8 text-gray-400">Cargando...</div>
        ) : todaySpecials.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-400">No hay viandas publicadas para hoy.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySpecials.map((s) => (
              <SpecialRow key={s.id} special={s} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Other dates */}
      {otherSpecials.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: "#1A5C2A" }}>
            Otros días
          </h2>
          <div className="space-y-3">
            {otherSpecials.map((s) => (
              <SpecialRow key={s.id} special={s} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SpecialRow({
  special,
  onDelete,
}: {
  special: DailySpecial;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border-l-4"
      style={{ borderLeftColor: "#F5B800" }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-gray-800">{special.name}</p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              special.available
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {special.available ? "Visible" : "Oculta"}
          </span>
        </div>
        {special.description && (
          <p className="text-xs text-gray-500 mt-0.5">{special.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">📅 {special.date}</p>
      </div>
      <div className="flex items-center gap-4 ml-4">
        <span className="font-bold text-lg" style={{ color: "#1A5C2A" }}>
          {formatPrice(special.price)}
        </span>
        <button
          onClick={() => onDelete(special.id)}
          className="text-red-400 hover:text-red-600 transition-colors p-1"
          title="Eliminar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
