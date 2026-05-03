import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LoveGift — Presente Digital para o Dia das Mães";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d0008 0%, #1a0015 50%, #0d0008 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow de fundo */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(232,67,147,0.35) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #e84393, #c0306f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            🌸
          </div>
          <span style={{ fontSize: "36px", fontWeight: 900, color: "white" }}>
            <span style={{ color: "#e84393" }}>Love</span>Gift
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 900,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          O presente que vai fazer{" "}
          <span style={{ color: "#e84393" }}>sua mãe chorar.</span>
        </div>

        {/* Subtítulo */}
        <div
          style={{
            fontSize: "26px",
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            marginBottom: "40px",
            maxWidth: "700px",
          }}
        >
          Fotos, música e retrospectiva animada. Pronto em 5 min.
        </div>

        {/* Pill CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "linear-gradient(135deg, #e84393, #c0306f)",
            borderRadius: "50px",
            padding: "16px 40px",
          }}
        >
          <span style={{ fontSize: "24px", color: "white", fontWeight: 700 }}>
            🌸 Criar agora por R$ 9,90
          </span>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            color: "rgba(255,255,255,0.25)",
            fontSize: "20px",
          }}
        >
          lovegift.art.br
        </div>
      </div>
    ),
    { ...size }
  );
}
