import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let nomeDestinatario = "Você";
  let nomeRemetente = "Alguém especial";
  let mensagem = "Uma mensagem especial para você ♥";
  let dias: number | null = null;
  let fotoUrl: string | null = null;
  let ocasiao = "Aniversário de namoro";

  try {
    const origin = new URL(req.url).origin;
    const res = await fetch(`${origin}/api/presentes/${slug}`, {
      headers: { "User-Agent": "LoveGift-Story-Generator/1.0" },
    });
    if (res.ok) {
      const data = await res.json();
      nomeDestinatario = data.nomeDestinatario ?? nomeDestinatario;
      nomeRemetente = data.nomeRemetente ?? nomeRemetente;
      mensagem = data.mensagem ?? mensagem;
      ocasiao = data.ocasiao ?? ocasiao;
      fotoUrl = data.fotos?.[0]?.url ?? null;
      if (data.dataEspecial) {
        dias = Math.floor(
          (Date.now() - new Date(data.dataEspecial).getTime()) / 86400000
        );
      }
    }
  } catch {
    // usa valores padrão
  }

  const mensagemPreview =
    mensagem.length > 100 ? mensagem.slice(0, 100) + "..." : mensagem;

  const GRADIENTS: Record<string, [string, string]> = {
    "Aniversário de namoro": ["#3d0018", "#8b1a42"],
    "Dia dos Namorados": ["#3d0010", "#a0255a"],
    "Aniversário": ["#150030", "#5b1a8a"],
    "Pedido de namoro": ["#250035", "#7a28c4"],
    "Só porque sim": ["#002535", "#0770a0"],
  };

  const [c1, c2] = GRADIENTS[ocasiao] ?? ["#1a0030", "#6d1060"];

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
          position: "relative",
        }}
      >
        {/* Foto de fundo */}
        {fotoUrl && (
          <img
            src={fotoUrl}
            alt=""
            width={1080}
            height={1920}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              objectFit: "cover",
              opacity: 0.15,
            }}
          />
        )}

        {/* Logo */}
        <div
          style={{
            position: "absolute",
            top: "70px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <span style={{ color: "#e84393", fontSize: "36px" }}>♥</span>
          <span
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "28px",
              letterSpacing: "8px",
            }}
          >
            LOVEGIFT
          </span>
        </div>

        {/* Foto circular */}
        {fotoUrl && (
          <div
            style={{
              width: "460px",
              height: "460px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "5px solid rgba(232,67,147,0.6)",
              marginBottom: "48px",
              display: "flex",
            }}
          >
            <img
              src={fotoUrl}
              alt=""
              width={460}
              height={460}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {!fotoUrl && (
          <div style={{ fontSize: "120px", marginBottom: "48px" }}>♥</div>
        )}

        {/* Para */}
        <div
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "30px",
            letterSpacing: "6px",
            marginBottom: "8px",
          }}
        >
          PARA
        </div>
        <div
          style={{
            color: "#ffffff",
            fontSize: "100px",
            fontWeight: 900,
            lineHeight: "1",
            marginBottom: "12px",
          }}
        >
          {nomeDestinatario}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "32px",
            marginBottom: "40px",
          }}
        >
          de {nomeRemetente}
        </div>

        {/* Divisor */}
        <div
          style={{
            width: "80px",
            height: "2px",
            background: "#e84393",
            marginBottom: "40px",
            opacity: 0.6,
          }}
        />

        {/* Dias */}
        {dias !== null && dias > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              marginBottom: "40px",
            }}
          >
            <span
              style={{
                color: "#e84393",
                fontSize: "80px",
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              {dias}
            </span>
            <span
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "30px" }}
            >
              dias juntos
            </span>
          </div>
        )}

        {/* Mensagem */}
        <div
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "24px",
            padding: "36px 52px",
            maxWidth: "880px",
            margin: "0 80px",
          }}
        >
          <div
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "30px",
              fontStyle: "italic",
              lineHeight: "1.6",
            }}
          >
            &ldquo;{mensagemPreview}&rdquo;
          </div>
        </div>

        {/* Rodapé */}
        <div
          style={{
            position: "absolute",
            bottom: "70px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "22px" }}>
            Abra em
          </div>
          <div
            style={{
              background: "rgba(232,67,147,0.15)",
              border: "1px solid rgba(232,67,147,0.3)",
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
    { width: 1080, height: 1920 }
  );
}
