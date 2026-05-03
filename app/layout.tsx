import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveGift — Presente Digital para o Dia das Mães",
  description: "Surpreenda sua mãe com fotos, música e uma retrospectiva animada. Pronto em 5 minutos por apenas R$ 9,90.",
  openGraph: {
    title: "LoveGift 🌸 — O presente que vai fazer sua mãe chorar",
    description: "Fotos, música favorita dela e uma retrospectiva emocionante. Crie agora em 5 minutos por R$ 9,90.",
    type: "website",
    url: "https://lovegift.art.br",
    siteName: "LoveGift",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoveGift 🌸 — O presente que vai fazer sua mãe chorar",
    description: "Fotos, música favorita dela e uma retrospectiva emocionante. R$ 9,90.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable}`}>
      <head>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1478921067070541');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1478921067070541&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
