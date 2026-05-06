import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const specialId = parseInt(id);

    if (isNaN(specialId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.dailySpecial.delete({
      where: { id: specialId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar la vianda" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const specialId = parseInt(id);
    const body = await req.json();

    const special = await prisma.dailySpecial.update({
      where: { id: specialId },
      data: {
        ...(body.available !== undefined && { available: body.available }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    return NextResponse.json(special);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar la vianda" },
      { status: 500 }
    );
  }
}
