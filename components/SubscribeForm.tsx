"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/suscribirse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("¡Te registraste con éxito! Vas a recibir las viandas del día.");
        setForm({ name: "", phone: "", email: "" });
      } else {
        setStatus("error");
        setMessage(data.error || "Ocurrió un error. Intentá de nuevo.");
      }
    } catch {
      setStatus("error");
      setMessage("No se pudo conectar. Intentá más tarde.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">✅</div>
        <p className="text-white font-semibold text-lg">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Nombre completo *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="w-full px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <input
        type="tel"
        placeholder="Celular (ej: 3624 123456) *"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
        className="w-full px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      <input
        type="email"
        placeholder="Correo electrónico *"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        className="w-full px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
      {status === "error" && (
        <p className="text-yellow-300 text-sm text-center">{message}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 rounded-xl font-bold text-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
        style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}
      >
        {status === "loading" ? "Registrando..." : "Quiero recibir las viandas del día"}
      </button>
    </form>
  );
}
