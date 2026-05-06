import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9f6f0" }}>
      {/* Admin nav */}
      <nav
        className="px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm"
        style={{ backgroundColor: "#1A5C2A" }}
      >
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-bold text-lg" style={{ color: "#F5B800" }}>
            La Especial. Admin
          </Link>
          <div className="flex gap-3">
            <Link
              href="/admin/viandas"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Viandas
            </Link>
            <Link
              href="/admin/productos"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              Productos
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/60 hidden sm:block">
            {session.user?.name}
          </span>
          <Link
            href="/"
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            ← Ver sitio
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#F5B800", color: "#1A5C2A" }}
            >
              Salir
            </button>
          </form>
        </div>
      </nav>

      {children}
    </div>
  );
}
