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
    const categories = await prisma.category.findMany({
      include: {
        products: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener los productos" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { updates } = body as {
      updates: Array<{ id: number; price?: number; available?: boolean }>;
    };

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Formato inválido" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      updates.map((update) =>
        prisma.product.update({
          where: { id: update.id },
          data: {
            ...(update.price !== undefined && { price: update.price }),
            ...(update.available !== undefined && { available: update.available }),
          },
        })
      )
    );

    return NextResponse.json({ updated: results.length });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar productos" },
      { status: 500 }
    );
  }
}
