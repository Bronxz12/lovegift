import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function gerarSlug(remetente: string, destinatario: string): string {
  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").slice(0, 15);
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${normalize(remetente)}-${normalize(destinatario)}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nomeRemetente, nomeDestinatario, ocasiao, dataEspecial, mensagem, musica, musicaUrl, spotifyUrl, tema, fotos, email } = body;
    const isPremium = tema === "premium";

    const slug = gerarSlug(nomeRemetente, nomeDestinatario);

    const presente = await prisma.presente.create({
      data: {
        slug,
        nomeRemetente,
        nomeDestinatario,
        ocasiao,
        dataEspecial: dataEspecial ? new Date(dataEspecial) : null,
        mensagem,
        musica,
        musicaUrl: musicaUrl || null,
        spotifyUrl: spotifyUrl || null,
        tema: isPremium ? "romantico" : (tema || "romantico"),
        premium: isPremium,
        status: "pendente",
        email: email || null,
        fotos: {
          create: (fotos as string[]).map((url: string, ordem: number) => ({ url, ordem })),
        },
      },
    });

    return NextResponse.json({ slug: presente.slug, id: presente.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao criar presente" }, { status: 500 });
  }
}
