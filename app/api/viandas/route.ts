import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const today = new Date().toISOString().split("T")[0];
    const specials = await prisma.dailySpecial.findMany({
      where: { date: today, available: true },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(specials);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener las viandas" },
      { status: 500 }
    );
  }
}
