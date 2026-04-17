import { Resend } from "resend";

export async function enviarEmailPresente(params: {
  email: string;
  nomeRemetente: string;
  nomeDestinatario: string;
  slug: string;
  baseUrl: string;
}) {
  const { email, nomeRemetente, nomeDestinatario, slug, baseUrl } = params;
  const link = `${baseUrl}/presente/${slug}`;
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "LoveGift <noreply@lovegift.com.br>",
    to: email,
    subject: `💝 Seu presente para ${nomeDestinatario} está pronto!`,
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
        <div style="max-width:520px;margin:0 auto;padding:40px 20px;">
          <div style="text-align:center;margin-bottom:32px;">
            <span style="font-size:48px;">♥</span>
            <h1 style="color:#ffffff;font-size:28px;margin:16px 0 8px;">Presente criado com sucesso!</h1>
            <p style="color:#888;font-size:16px;margin:0;">Olá, ${nomeRemetente}!</p>
          </div>

          <div style="background:#1a1a1a;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #333;">
            <p style="color:#ccc;font-size:15px;line-height:1.6;margin:0 0 20px;">
              Seu presente digital para <strong style="color:#fff;">${nomeDestinatario}</strong> está pronto!
              Clique no botão abaixo para visualizar e compartilhar.
            </p>
            <div style="text-align:center;">
              <a href="${link}" style="display:inline-block;background:#e84393;color:#fff;font-weight:bold;font-size:16px;text-decoration:none;padding:14px 32px;border-radius:50px;">
                Ver meu presente →
              </a>
            </div>
          </div>

          <div style="background:#111;border-radius:12px;padding:16px;margin-bottom:24px;">
            <p style="color:#666;font-size:12px;margin:0 0 8px;">Link do presente:</p>
            <p style="color:#e84393;font-size:13px;word-break:break-all;margin:0;">${link}</p>
          </div>

          <p style="color:#555;font-size:12px;text-align:center;margin:0;">
            Compartilhe esse link com ${nomeDestinatario} e prepare-se para a reação! ♥<br/>
            © 2025 LoveGift · Presentes digitais personalizados
          </p>
        </div>
      </body>
      </html>
    `,
  });
}
