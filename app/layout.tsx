import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Especial. Fábrica de Pastas",
  description: "Pastas frescas artesanales. hecho como en casa. Resistencia, Chaco.",
  keywords: ["pastas", "fábrica de pastas", "Resistencia", "Chaco", "artesanal", "ravioles", "sorrentinos"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProviderWrapper>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
