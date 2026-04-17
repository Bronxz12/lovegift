import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const presente = await prisma.presente.findUnique({
      where: { slug },
      include: { fotos: { orderBy: { ordem: "asc" } } },
    });

    if (!presente) {
      return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
    }

    return NextResponse.json(presente);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
