import { NextRequest, NextResponse } from "next/server";
import MercadoPago, { Preference } from "mercadopago";
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

    const preference = new Preference(client);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    const result = await preference.create({
      body: {
        items: [
          {
            id: slug,
            title: titulo,
            quantity: 1,
            unit_price: preco,
            currency_id: "BRL",
          },
        ],
        payer: presente.email ? { email: presente.email } : undefined,
        back_urls: {
          success: `${baseUrl}/presente/${slug}?pago=1`,
          failure: `${baseUrl}/criar?erro=pagamento`,
          pending: `${baseUrl}/presente/${slug}?pago=pendente`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/pagamento/webhook`,
        metadata: { slug },
        statement_descriptor: "LOVEGIFT",
      },
    });

    return NextResponse.json({
      url: result.init_point,
      sandbox_url: result.sandbox_init_point,
    });
  } catch (err) {
    console.error("Erro ao criar preferência MP:", err);
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }
}
