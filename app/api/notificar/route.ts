import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ ok: false }, { status: 400 });

    const presente = await prisma.presente.findUnique({ where: { slug } });
    if (!presente || !presente.email) return NextResponse.json({ ok: false });

    // Evita enviar mais de uma vez
    if ((presente as { notificadoEm?: Date | null }).notificadoEm) {
      return NextResponse.json({ ok: true, jaEnviado: true });
    }

    await resend.emails.send({
      from: "LoveGift <noreply@lovegift.com.br>",
      to: presente.email,
      subject: `♥ ${presente.nomeDestinatario} abriu seu presente!`,
      html: `
        <div style="font-family:sans-serif;background:#0a0a0a;color:#fff;padding:40px;max-width:520px;margin:0 auto;border-radius:16px;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:48px;">♥</span>
            <h1 style="color:#e84393;font-size:28px;margin:12px 0 4px;">LoveGift</h1>
          </div>
          <h2 style="font-size:22px;margin-bottom:8px;">
            ${presente.nomeDestinatario} abriu seu presente! 🎉
          </h2>
          <p style="color:rgba(255,255,255,0.6);line-height:1.6;margin-bottom:24px;">
            Seu presente digital para <strong style="color:#fff">${presente.nomeDestinatario}</strong>
            foi aberto agora mesmo. Esperamos que tenha emocionado muito! ♥
          </p>
          <a href="https://lovegift.com.br/presente/${slug}"
             style="display:inline-block;background:linear-gradient(135deg,#e84393,#c0306f);color:#fff;font-weight:bold;padding:14px 32px;border-radius:12px;text-decoration:none;font-size:16px;">
            Ver o presente
          </a>
          <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:32px;text-align:center;">
            LoveGift — Presentes digitais que emocionam
          </p>
        </div>
      `,
    });

    // Marca como notificado (campo opcional, ignora erro se não existir)
    try {
      await prisma.$executeRaw`UPDATE "Presente" SET "notificadoEm" = NOW() WHERE slug = ${slug}`;
    } catch {
      // campo ainda não existe no banco, ok por enquanto
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
