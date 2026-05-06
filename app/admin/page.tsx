import Link from "next/link";
import { prisma } from "@/lib/db";

function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("es-AR")}`;
}

export default async function AdminDashboard() {
  const today = getTodayString();

  const [todaySpecials, totalProducts, totalCategories] = await Promise.all([
    prisma.dailySpecial.findMany({
      where: { date: today },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count(),
    prisma.category.count(),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#1A5C2A" }}>
        Panel de administración
      </h1>
      <p className="text-gray-500 mb-8">Bienvenido al panel interno de La Especial.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard
          label="Viandas de hoy"
          value={String(todaySpecials.length)}
          icon="🍽️"
        />
        <StatCard label="Productos en menú" value={String(totalProducts)} icon="📋" />
        <StatCard label="Categorías" value={String(totalCategories)} icon="🗂️" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <ActionCard
          href="/admin/viandas"
          title="Gestionar Viandas del Día"
          description="Publicá, editá o eliminá las viandas especiales de hoy"
          icon="🍽️"
        />
        <ActionCard
          href="/admin/productos"
          title="Gestionar Productos"
          description="Actualizá precios y disponibilidad del menú"
          icon="📋"
        />
      </div>

      {/* Today's specials preview */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: "#1A5C2A" }}>
            Viandas publicadas hoy
          </h2>
          <Link
            href="/admin/viandas"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#1A5C2A" }}
          >
            Gestionar →
          </Link>
        </div>

        {todaySpecials.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No hay viandas publicadas para hoy.</p>
            <Link
              href="/admin/viandas"
              className="inline-block mt-3 px-5 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#1A5C2A" }}
            >
              Agregar viandas
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySpecials.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl border"
                style={{ borderColor: "#F5B800" }}
              >
                <div>
                  <p className="font-semibold text-gray-800">{s.name}</p>
                  {s.description && (
                    <p className="text-xs text-gray-500">{s.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.available
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {s.available ? "Disponible" : "No disponible"}
                  </span>
                  <span className="font-bold" style={{ color: "#1A5C2A" }}>
                    {formatPrice(s.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-2xl font-bold" style={{ color: "#1A5C2A" }}>
          {value}
        </p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-yellow-400"
    >
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </Link>
  );
}
