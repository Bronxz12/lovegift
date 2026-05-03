import { NextRequest, NextResponse } from "next/server";
import MercadoPago, { Payment } from "mercadopago";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentId = searchParams.get("id");

  if (!paymentId) {
    return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
  }

  try {
    const client = new MercadoPago({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });

    const payment = new Payment(client);
    const result = await payment.get({ id: Number(paymentId) });

    return NextResponse.json({
      status: result.status, // "approved" | "pending" | "rejected"
      statusDetail: result.status_detail,
      metadata: result.metadata,
    });
  } catch (err) {
    console.error("Erro ao checar status MP:", err);
    return NextResponse.json({ error: "Erro ao checar status" }, { status: 500 });
  }
}
