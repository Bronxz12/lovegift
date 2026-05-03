import { NextRequest, NextResponse } from "next/server";
import MercadoPago, { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { slug, premium } = await req.json();

    const presente = await prisma.presente.findUnique({ where: { slug } });
    if (!presente) {
      return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
    }

    const isPremium = premium || presente.premium || false;
    const preco = isPremium ? 19.9 : 9.9;
    const titulo = isPremium
      ? `LoveGift Premium — Presente para ${presente.nomeDestinatario}`
      : `LoveGift — Presente para ${presente.nomeDestinatario}`;

    const client = new MercadoPago({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const payment = new Payment(client);

    // Expira em 30 minutos
    const expiracao = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const result = await payment.create({
      body: {
        transaction_amount: preco,
        description: titulo,
        payment_method_id: "pix",
        date_of_expiration: expiracao,
        payer: {
          email: presente.email || "comprador@lovegift.art.br",
        },
        metadata: { slug },
        notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/pagamento/webhook`,
      },
    });

    const qrCode = result.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = result.point_of_interaction?.transaction_data?.qr_code_base64;
    const paymentId = result.id;

    return NextResponse.json({
      paymentId,
      qrCode,
      qrCodeBase64,
      valor: preco,
    });
  } catch (err) {
    console.error("Erro ao criar pagamento Pix MP:", err);
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }
}
