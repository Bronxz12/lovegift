import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "600px",
          height: "400px",
          background: "linear-gradient(135deg, #e84393, #c0306f)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "48px",
          fontWeight: "bold",
        }}
      >
        ♥ LoveGift
      </div>
    ),
    { width: 600, height: 400 }
  );
}
