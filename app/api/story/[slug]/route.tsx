import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { differenceInDays } from "date-fns";

export const runtime = "nodejs";

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

  const GRADIENTS: Record<string, string[]> = {
    "Aniversário de namoro": ["#4a0020", "#9b1a4b"],
    "Dia dos Namorados": ["#4a0010", "#c0306f"],
    "Aniversário": ["#1a0040", "#6b21a8"],
    "Pedido de namoro": ["#2d0040", "#9333ea"],
    "Só porque sim": ["#003040", "#0891b2"],
  };

  const EMOJIS: Record<string, string> = {
    "Aniversário de namoro": "♥",
    "Dia dos Namorados": "💕",
    "Aniversário": "🎂",
    "Pedido de namoro": "💍",
    "Só porque sim": "✨",
  };

  const colors = GRADIENTS[presente.ocasiao] ?? ["#1a0030", "#e84393"];
  const emoji = EMOJIS[presente.ocasiao] ?? "♥";

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
          background: `linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Foto de fundo desfocada */}
        {fotoUrl && (
          <img
            src={fotoUrl}
            width={1080}
            height={1920}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "cover",
              opacity: 0.15,
              filter: "blur(40px)",
            }}
          />
        )}

        {/* Brilho central */}
        <div
          style={{
            position: "absolute",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,67,147,0.25) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Logo topo */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span style={{ color: "#e84393", fontSize: "28px" }}>♥</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "24px", letterSpacing: "4px", textTransform: "uppercase" }}>LoveGift</span>
        </div>

        {/* Conteúdo central */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 80px",
            gap: "0px",
          }}
        >
          {/* Badge ocasião */}
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "100px",
              padding: "10px 28px",
              color: "rgba(255,255,255,0.6)",
              fontSize: "22px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "48px",
            }}
          >
            {presente.ocasiao}
          </div>

          {/* Emoji */}
          <div style={{ fontSize: "120px", marginBottom: "40px" }}>{emoji}</div>

          {/* Foto principal */}
          {fotoUrl && (
            <div
              style={{
                width: "520px",
                height: "520px",
                borderRadius: "32px",
                overflow: "hidden",
                marginBottom: "56px",
                border: "3px solid rgba(232,67,147,0.4)",
                boxShadow: "0 0 80px rgba(232,67,147,0.3)",
                display: "flex",
              }}
            >
              <img
                src={fotoUrl}
                width={520}
                height={520}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>
          )}

          {/* Para */}
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "28px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px" }}>
            Para
          </div>
          <div style={{ color: "#ffffff", fontSize: "96px", fontWeight: 900, lineHeight: 1, marginBottom: "16px" }}>
            {presente.nomeDestinatario}
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "30px", marginBottom: "48px" }}>
            de {presente.nomeRemetente}
          </div>

          {/* Linha separadora */}
          <div style={{ width: "60px", height: "2px", background: "rgba(232,67,147,0.5)", marginBottom: "48px" }} />

          {/* Dias juntos */}
          {dias !== null && dias > 0 && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "48px" }}>
              <div style={{ color: "#e84393", fontSize: "80px", fontWeight: 900, lineHeight: 1 }}>
                {dias.toLocaleString("pt-BR")}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "26px", letterSpacing: "3px", textTransform: "uppercase" }}>
                dias juntos
              </div>
            </div>
          )}

          {/* Mensagem preview */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "24px",
              padding: "32px 40px",
              maxWidth: "800px",
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "30px", fontStyle: "italic", lineHeight: 1.5 }}>
              &ldquo;{presente.mensagem.length > 120 ? presente.mensagem.slice(0, 120) + "..." : presente.mensagem}&rdquo;
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "22px" }}>
            Abra o presente em
          </div>
          <div
            style={{
              background: "rgba(232,67,147,0.2)",
              border: "1px solid rgba(232,67,147,0.3)",
              borderRadius: "100px",
              padding: "12px 32px",
              color: "#e84393",
              fontSize: "24px",
              fontWeight: 700,
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
