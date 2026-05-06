import Link from "next/link";
import { prisma } from "@/lib/db";

function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
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

export default async function Home() {
  const today = getTodayString();

  const [dailySpecials, categories] = await Promise.all([
    prisma.dailySpecial.findMany({
      where: { date: today, available: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <>
      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#F5B800" }}
      >
        {/* Decorative pasta shapes */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none select-none">
          <div className="absolute -top-10 -left-10 text-[200px]">🍝</div>
          <div className="absolute -bottom-10 -right-10 text-[200px]">🍜</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[300px]">🫓</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-32 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80"
            style={{ color: "#1A5C2A" }}
          >
            Resistencia, Chaco
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold leading-none mb-4"
            style={{ color: "#1A5C2A" }}
          >
            La Especial.
          </h1>
          <p
            className="text-2xl md:text-3xl font-medium italic mb-2"
            style={{ color: "#1A5C2A" }}
          >
            Fábrica de Pastas
          </p>
          <p
            className="text-lg md:text-xl opacity-70 mb-10"
            style={{ color: "#1A5C2A" }}
          >
            &ldquo;hecho como en casa&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              className="px-8 py-4 rounded-full font-bold text-lg text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
              style={{ backgroundColor: "#1A5C2A" }}
            >
              Ver Menú Completo
            </Link>
            <a
              href="https://wa.me/543625143630"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full font-bold text-lg border-2 transition-all hover:opacity-80 hover:-translate-y-0.5 active:scale-95"
              style={{ borderColor: "#1A5C2A", color: "#1A5C2A" }}
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* VIANDAS DEL DÍA */}
      <section id="viandas" className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span
              className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-3"
              style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}
            >
              Hoy especialmente
            </span>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#1A5C2A" }}>
              Viandas del Día
            </h2>
            <p className="text-gray-500 mt-2">
              Propuestas especiales para llevar hoy a tu mesa
            </p>
          </div>

          {dailySpecials.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🍽️</div>
              <p className="text-gray-500 text-lg">
                No hay viandas del día publicadas hoy.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Consultanos por WhatsApp para conocer las opciones del día.
              </p>
              <a
                href="https://wa.me/543625143630"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 px-6 py-3 rounded-full font-semibold text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#25D366" }}
              >
                Consultar por WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailySpecials.map((special) => (
                <div
                  key={special.id}
                  className="relative overflow-hidden rounded-2xl border-2 shadow-sm hover:shadow-lg transition-shadow"
                  style={{ borderColor: "#F5B800" }}
                >
                  <div
                    className="h-2"
                    style={{ backgroundColor: "#F5B800" }}
                  />
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800">{special.name}</h3>
                    {special.description && (
                      <p className="text-sm text-gray-500 mt-1">{special.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold" style={{ color: "#1A5C2A" }}>
                        {formatPrice(special.price)}
                      </span>
                      <a
                        href={`https://wa.me/543625143630?text=${encodeURIComponent(
                          `Hola! 👋 Quiero consultar sobre la vianda del día: *${special.name}* (${formatPrice(special.price)})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-80"
                        style={{ backgroundColor: "#25D366" }}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Pedir
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        className="py-16 px-4 sm:px-6"
        style={{ backgroundColor: "#f9f6f0" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#1A5C2A" }}>
              Nuestras Pastas
            </h2>
            <p className="text-gray-500 mt-2">
              Elaboradas a diario con ingredientes de primera calidad
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu#${cat.slug}`}
                className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-transparent bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-yellow-400"
              >
                <span className="text-4xl">{categoryEmojis[cat.slug] ?? cat.emoji}</span>
                <span
                  className="font-semibold text-sm text-center"
                  style={{ color: "#1A5C2A" }}
                >
                  {cat.name}
                </span>
                {cat.unit && (
                  <span className="text-xs text-gray-400 text-center">{cat.unit}</span>
                )}
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/menu"
              className="inline-block px-8 py-4 rounded-full font-bold text-lg text-white shadow-md transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: "#1A5C2A" }}
            >
              Ver Menú Completo →
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contacto"
        className="py-16 px-4 sm:px-6"
        style={{ backgroundColor: "#1A5C2A" }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: "#F5B800" }}>
            ¿Dónde encontrarnos?
          </h2>
          <p className="opacity-80 mb-10">
            Hacé tu pedido por WhatsApp o visitanos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* WhatsApp */}
            <a
              href="https://wa.me/543625143630"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#25D366" }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="font-semibold">WhatsApp</span>
              <span className="text-sm opacity-70">+54 362 514-3630</span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/somoslaespecial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#E1306C" }}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="font-semibold">Instagram</span>
              <span className="text-sm opacity-70">@somoslaespecial</span>
            </a>

            {/* Address */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/10">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "#F5B800" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold">Dirección</span>
              <span className="text-sm opacity-70 text-center">San Juan 38, Resistencia, Chaco</span>
            </div>
          </div>

          <a
            href={`https://wa.me/543625143630?text=${encodeURIComponent("Hola! 👋 Quiero hacer un pedido en La Especial.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-xl transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
            style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Hacer mi pedido ahora
          </a>
        </div>
      </section>
    </>
  );
}
