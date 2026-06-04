import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Presente-demo (não usa banco) — usado no botão "Ver exemplo pronto"
    if (slug === "exemplo") {
      return NextResponse.json({
        id: "exemplo",
        slug: "exemplo",
        nomeRemetente: "Lucas",
        nomeDestinatario: "Maria",
        ocasiao: "Dia dos Namorados",
        dataEspecial: "2022-06-12T00:00:00.000Z",
        mensagem:
          "Meu amor, cada dia ao seu lado é o meu presente favorito. Obrigado por cada sorriso, cada abraço e cada plano nosso. Eu te amo mais do que consigo expressar. 💕",
        musica: "Perfect — Ed Sheeran",
        musicaUrl: null,
        tema: "romantico",
        moldura: "nenhuma",
        premium: false,
        email: null,
        paymentId: "demo",
        notificadoEm: null,
        criadoEm: new Date().toISOString(),
        fotos: [1, 2, 3, 4].map((n) => ({
          id: String(n),
          url: `/images/exemplo/${n}.jpg`,
          ordem: n - 1,
          presenteId: "exemplo",
        })),
      });
    }

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
