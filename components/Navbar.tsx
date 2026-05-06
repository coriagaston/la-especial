"use client";

import Link from "next/link";
import { useState } from "react";
import CartButton from "./CartButton";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full shadow-md" style={{ backgroundColor: "#F5B800" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="text-xl font-bold tracking-tight leading-none"
              style={{ color: "#1A5C2A" }}
            >
              La Especial.
            </span>
            <span
              className="hidden sm:block text-xs font-medium italic opacity-80"
              style={{ color: "#1A5C2A" }}
            >
              Fábrica de Pastas
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink href="/menu">Menú</NavLink>
            <NavLink href="/#viandas">Viandas del Día</NavLink>
            <NavLink href="/#contacto">Contacto</NavLink>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <CartButton />
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: "#1A5C2A" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Abrir menú"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-yellow-600 bg-yellow-400" style={{ backgroundColor: "#F5B800" }}>
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink href="/menu" onClick={() => setMobileOpen(false)}>Menú</MobileNavLink>
            <MobileNavLink href="/#viandas" onClick={() => setMobileOpen(false)}>Viandas del Día</MobileNavLink>
            <MobileNavLink href="/#contacto" onClick={() => setMobileOpen(false)}>Contacto</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-semibold text-sm transition-opacity hover:opacity-70"
      style={{ color: "#1A5C2A" }}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-2 px-3 rounded-lg font-semibold text-sm"
      style={{ color: "#1A5C2A" }}
    >
      {children}
    </Link>
  );
}
