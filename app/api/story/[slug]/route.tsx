import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const origin = new URL(req.url).origin;

  let nome = "Você";
  let remetente = "";
  let mensagem = "Tenho um presente especial para você ♥";
  let fotoUrl: string | null = null;

  try {
    const res = await fetch(`${origin}/api/presentes/${slug}`);
    if (res.ok) {
      const data = await res.json();
      nome = data.nomeDestinatario ?? nome;
      remetente = data.nomeRemetente ?? "";
      mensagem = data.mensagem ?? mensagem;
      fotoUrl = data.fotos?.[0]?.url ?? null;
    }
  } catch {
    // usa valores padrão
  }

  const mensagemCurta =
    mensagem.length > 100 ? mensagem.slice(0, 97) + "…" : mensagem;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1920px",
          background: "#0d0010",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo topo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "80px",
          }}
        >
          <span style={{ fontSize: "52px", color: "#e84393", marginRight: "16px" }}>♥</span>
          <span style={{ fontSize: "48px", color: "white", fontWeight: "bold" }}>LoveGift</span>
        </div>

        {/* Foto ou coração */}
        <div
          style={{
            width: "520px",
            height: "520px",
            borderRadius: "32px",
            overflow: "hidden",
            borderWidth: "4px",
            borderStyle: "solid",
            borderColor: "rgba(232,67,147,0.5)",
            marginBottom: "64px",
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
            <span style={{ fontSize: "180px", color: "#e84393" }}>♥</span>
          )}
        </div>

        {/* Para */}
        <div
          style={{
            fontSize: "36px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "16px",
            letterSpacing: "6px",
          }}
        >
          PARA
        </div>

        {/* Nome destinatário */}
        <div
          style={{
            fontSize: "88px",
            fontWeight: "bold",
            color: "white",
            marginBottom: "48px",
            textAlign: "center",
            paddingLeft: "60px",
            paddingRight: "60px",
            lineHeight: "1.1",
          }}
        >
          {nome}
        </div>

        {/* Mensagem */}
        <div
          style={{
            fontSize: "36px",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            paddingLeft: "80px",
            paddingRight: "80px",
            marginBottom: "32px",
            fontStyle: "italic",
            lineHeight: "1.6",
          }}
        >
          "{mensagemCurta}"
        </div>

        {/* Remetente */}
        {remetente ? (
          <div
            style={{
              fontSize: "34px",
              color: "#e84393",
              marginBottom: "80px",
            }}
          >
            — {remetente} ♥
          </div>
        ) : (
          <div style={{ marginBottom: "80px" }} />
        )}

        {/* Botão CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              background: "#e84393",
              borderRadius: "60px",
              paddingTop: "28px",
              paddingBottom: "28px",
              paddingLeft: "80px",
              paddingRight: "80px",
              fontSize: "40px",
              color: "white",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Abra seu presente ♥
          </div>
          <div style={{ fontSize: "28px", color: "rgba(255,255,255,0.35)" }}>
            lovegift.com.br
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1920 }
  );
}
