import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const specials = await prisma.dailySpecial.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(specials);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener las viandas" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, price, date } = body;

    if (!name || !price || !date) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const special = await prisma.dailySpecial.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        date,
        available: true,
      },
    });

    return NextResponse.json(special, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear la vianda" },
      { status: 500 }
    );
  }
}
