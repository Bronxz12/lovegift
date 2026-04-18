import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const origin = new URL(req.url).origin;

  let presente: {
    nomeRemetente: string;
    nomeDestinatario: string;
    mensagem: string;
    fotos: { url: string }[];
  } | null = null;

  try {
    const res = await fetch(`${origin}/api/presentes/${slug}`);
    if (res.ok) presente = await res.json();
  } catch {
    // fallback to generic card
  }

  const nome = presente?.nomeDestinatario ?? "Você";
  const remetente = presente?.nomeRemetente ?? "";
  const mensagem = presente?.mensagem ?? "Tenho um presente especial para você ♥";
  const fotoUrl = presente?.fotos?.[0]?.url ?? null;
  const mensagemCurta =
    mensagem.length > 120 ? mensagem.slice(0, 117) + "…" : mensagem;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          background: "linear-gradient(160deg, #1a0010 0%, #0a0a0a 40%, #1a0010 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "180px",
            left: "190px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,67,147,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span style={{ fontSize: "52px", color: "#e84393" }}>♥</span>
          <span style={{ fontSize: "44px", color: "white", fontWeight: "bold" }}>
            LoveGift
          </span>
        </div>

        {/* Foto ou coração */}
        <div
          style={{
            width: "520px",
            height: "520px",
            borderRadius: "32px",
            overflow: "hidden",
            border: "4px solid rgba(232,67,147,0.5)",
            marginBottom: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(232,67,147,0.1)",
          }}
        >
          {fotoUrl ? (
            <img
              src={fotoUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: "200px" }}>♥</span>
          )}
        </div>

        {/* Para */}
        <div style={{ fontSize: "38px", color: "rgba(255,255,255,0.6)", marginBottom: "16px", letterSpacing: "4px" }}>
          PARA
        </div>

        {/* Nome */}
        <div
          style={{
            fontSize: "96px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "48px",
            textAlign: "center",
            lineHeight: "1.1",
            paddingLeft: "60px",
            paddingRight: "60px",
          }}
        >
          {nome}
        </div>

        {/* Mensagem */}
        <div
          style={{
            fontSize: "38px",
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            lineHeight: "1.6",
            paddingLeft: "80px",
            paddingRight: "80px",
            marginBottom: "40px",
            fontStyle: "italic",
          }}
        >
          "{mensagemCurta}"
        </div>

        {remetente ? (
          <div style={{ fontSize: "36px", color: "#e84393", marginBottom: "80px" }}>
            — {remetente} ♥
          </div>
        ) : null}

        {/* CTA */}
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #e84393, #c0306f)",
              borderRadius: "60px",
              padding: "28px 80px",
              fontSize: "42px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Abra seu presente ♥
          </div>
          <div style={{ fontSize: "30px", color: "rgba(255,255,255,0.4)" }}>
            lovegift.com.br
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
