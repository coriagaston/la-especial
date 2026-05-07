import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Login page: no nav, solo renderiza children
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9f6f0" }}>
      {/* Admin nav */}
      <nav className="shadow-sm" style={{ backgroundColor: "#1A5C2A" }}>
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/admin" className="font-bold text-base whitespace-nowrap" style={{ color: "#F5B800" }}>
              Admin
            </Link>
            <div className="flex gap-2 sm:gap-3">
              <Link href="/admin/viandas" className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap">
                Viandas
              </Link>
              <Link href="/admin/productos" className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap">
                Productos
              </Link>
              <Link href="/admin/suscriptores" className="text-xs sm:text-sm font-medium text-white/80 hover:text-white transition-colors whitespace-nowrap">
                Suscriptores
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/" className="text-xs text-white/60 hover:text-white transition-colors whitespace-nowrap hidden sm:block">
              ← Ver sitio
            </Link>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80 whitespace-nowrap"
                style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
