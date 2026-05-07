import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { categoryId, name, description, price } = await req.json();
  if (!categoryId || !name?.trim() || price === undefined) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const maxOrder = await prisma.product.aggregate({
    where: { categoryId },
    _max: { sortOrder: true },
  });

  const product = await prisma.product.create({
    data: {
      categoryId,
      name: name.trim(),
      description: description?.trim() || null,
      price: parseFloat(price),
      available: true,
      sortOrder: (maxOrder._max.sortOrder ?? 0) + 1,
    },
  });

  return NextResponse.json(product, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
