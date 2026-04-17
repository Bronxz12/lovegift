import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveGift — Presentes Digitais Personalizados",
  description: "Crie um presente digital único com fotos, música e retrospectiva animada. Pronto em 5 minutos.",
  openGraph: {
    title: "LoveGift — Presentes Digitais Personalizados",
    description: "Declare seu amor de forma única. Crie um presente digital com fotos, música e retrospectiva animada.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable}`}>
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
