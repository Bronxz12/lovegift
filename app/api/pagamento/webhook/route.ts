import { NextRequest, NextResponse } from "next/server";
import MercadoPago, { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { enviarEmailPresente } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP envia notificações de vários tipos — só queremos "payment"
    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) return NextResponse.json({ ok: true });

    const client = new MercadoPago({ accessToken: process.env.MP_ACCESS_TOKEN! });
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: paymentId });

    if (payment.status !== "approved") {
      return NextResponse.json({ ok: true });
    }

    const slug = payment.metadata?.slug;
    if (!slug) return NextResponse.json({ ok: true });

    const presente = await prisma.presente.update({
      where: { slug },
      data: { status: "ativo", paymentId: String(paymentId) },
    });

    // Envia e-mail com o link se tiver e-mail cadastrado
    if (presente.email && process.env.RESEND_API_KEY) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
      await enviarEmailPresente({
        email: presente.email,
        nomeRemetente: presente.nomeRemetente,
        nomeDestinatario: presente.nomeDestinatario,
        slug: presente.slug,
        baseUrl,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro no webhook MP:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
