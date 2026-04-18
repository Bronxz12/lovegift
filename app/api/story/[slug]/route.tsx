import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { differenceInDays } from "date-fns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const presente = await prisma.presente.findUnique({
    where: { slug },
    include: { fotos: { orderBy: { ordem: "asc" }, take: 1 } },
  });

  if (!presente) {
    return new Response("Não encontrado", { status: 404 });
  }

  const dias = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;

  const fotoUrl = presente.fotos[0]?.url ?? null;

  const GRADIENTS: Record<string, [string, string]> = {
    "Aniversário de namoro": ["#3d0018", "#8b1a42"],
    "Dia dos Namorados": ["#3d0010", "#a0255a"],
    "Aniversário": ["#150030", "#5b1a8a"],
    "Pedido de namoro": ["#250035", "#7a28c4"],
    "Só porque sim": ["#002535", "#0770a0"],
  };

  const EMOJIS: Record<string, string> = {
    "Aniversário de namoro": "♥",
    "Dia dos Namorados": "💕",
    "Aniversário": "🎂",
    "Pedido de namoro": "💍",
    "Só porque sim": "✨",
  };

  const [c1, c2] = GRADIENTS[presente.ocasiao] ?? ["#1a0030", "#6d1060"];
  const emoji = EMOJIS[presente.ocasiao] ?? "♥";
  const mensagemPreview = presente.mensagem.length > 100
    ? presente.mensagem.slice(0, 100) + "..."
    : presente.mensagem;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(160deg, ${c1} 0%, ${c2} 100%)`,
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Foto de fundo desfocada */}
        {fotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fotoUrl}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "1080px",
              height: "1920px",
              objectFit: "cover",
              opacity: 0.12,
            }}
          />
        )}

        {/* Overlay escuro */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Logo topo */}
        <div
          style={{
            position: "absolute",
            top: "64px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ color: "#e84393", fontSize: "30px" }}>♥</span>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "26px", letterSpacing: "6px" }}>LOVEGIFT</span>
        </div>

        {/* Conteúdo central */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 80px",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Foto principal */}
          {fotoUrl ? (
            <div
              style={{
                width: "480px",
                height: "480px",
                borderRadius: "240px",
                overflow: "hidden",
                marginBottom: "48px",
                border: "4px solid rgba(232,67,147,0.5)",
                display: "flex",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotoUrl}
                alt=""
                style={{ width: "480px", height: "480px", objectFit: "cover" }}
              />
            </div>
          ) : (
            <div style={{ fontSize: "140px", marginBottom: "48px" }}>{emoji}</div>
          )}

          {/* Badge ocasião */}
          <div
            style={{
              background: "rgba(232,67,147,0.15)",
              border: "1px solid rgba(232,67,147,0.3)",
              borderRadius: "100px",
              padding: "12px 32px",
              color: "#e84393",
              fontSize: "24px",
              letterSpacing: "3px",
              marginBottom: "32px",
            }}
          >
            {presente.ocasiao.toUpperCase()}
          </div>

          {/* Para */}
          <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "30px", letterSpacing: "4px", marginBottom: "8px" }}>
            PARA
          </div>
          <div style={{ color: "#ffffff", fontSize: "100px", fontWeight: 900, lineHeight: "1", marginBottom: "12px" }}>
            {presente.nomeDestinatario}
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "32px", marginBottom: "40px" }}>
            de {presente.nomeRemetente}
          </div>

          {/* Divisor */}
          <div style={{ width: "80px", height: "2px", background: "rgba(232,67,147,0.5)", marginBottom: "40px" }} />

          {/* Dias juntos */}
          {dias !== null && dias > 0 && (
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "40px" }}>
              <span style={{ color: "#e84393", fontSize: "88px", fontWeight: 900, lineHeight: 1 }}>
                {dias.toLocaleString("pt-BR")}
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "30px", letterSpacing: "2px" }}>
                dias juntos
              </span>
            </div>
          )}

          {/* Mensagem */}
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "36px 48px",
              maxWidth: "880px",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "32px", fontStyle: "italic", lineHeight: "1.5" }}>
              &ldquo;{mensagemPreview}&rdquo;
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div
          style={{
            position: "absolute",
            bottom: "64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "22px" }}>
            Abra o presente em
          </div>
          <div
            style={{
              background: "rgba(232,67,147,0.15)",
              border: "1px solid rgba(232,67,147,0.25)",
              borderRadius: "100px",
              padding: "14px 40px",
              color: "#e84393",
              fontSize: "26px",
              fontWeight: 600,
            }}
          >
            lovegift-six.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1920,
    }
  );
}
