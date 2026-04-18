import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enviarEmailPresente } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "slug obrigatório" }, { status: 400 });

    const presente = await prisma.presente.findUnique({ where: { slug } });
    if (!presente) return NextResponse.json({ error: "não encontrado" }, { status: 404 });

    if (presente.status === "ativo") {
      return NextResponse.json({ ok: true, jaAtivo: true });
    }

    await prisma.presente.update({
      where: { slug },
      data: { status: "ativo" },
    });

    if (presente.email && process.env.RESEND_API_KEY) {
      try {
        await enviarEmailPresente({
          email: presente.email,
          nomeRemetente: presente.nomeRemetente,
          nomeDestinatario: presente.nomeDestinatario,
          slug,
          baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
        });
      } catch {
        // email falhou mas presente foi ativado
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "erro interno" }, { status: 500 });
  }
}
