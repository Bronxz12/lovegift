"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import QRCodeLib from "qrcode";
import { differenceInDays } from "date-fns";
import Wrapped from "./Wrapped";

type Foto = { id: string; url: string; ordem: number };
type Presente = {
  id: string;
  slug: string;
  nomeRemetente: string;
  nomeDestinatario: string;
  ocasiao: string;
  dataEspecial: string | null;
  mensagem: string;
  musica: string;
  musicaUrl: string | null;
  tema: string;
  fotos: Foto[];
};

const TEMAS: Record<string, { bg: string; accent: string; card: string; text: string; border: string }> = {
  romantico: {
    bg: "bg-[#0a0a0a]",
    accent: "text-[#e84393]",
    card: "bg-white/5",
    text: "text-white",
    border: "border-[#e84393]/20",
  },
  minimalista: {
    bg: "bg-gray-50",
    accent: "text-gray-800",
    card: "bg-white",
    text: "text-gray-800",
    border: "border-gray-200",
  },
  vintage: {
    bg: "bg-amber-50",
    accent: "text-amber-800",
    card: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-300",
  },
};

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default function PresentePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [presente, setPresente] = useState<Presente | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [qrCode, setQrCode] = useState("");
  const [aberto, setAberto] = useState(false);
  const [wrappedAberto, setWrappedAberto] = useState(false);
  const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pago = searchParams.get("pago");
    if (pago === "1") {
      fetch("/api/pagamento/ativar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      }).catch(() => {});
    }
  }, [slug, searchParams]);

  useEffect(() => {
    fetch(`/api/presentes/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPresente(data);
        setCarregando(false);
        if (typeof window !== "undefined") {
          QRCodeLib.toDataURL(window.location.href, {
            width: 200,
            margin: 2,
            color: { dark: "#000000", light: "#ffffff" },
          }).then(setQrCode);
        }
      })
      .catch(() => setCarregando(false));
  }, [slug]);

  useEffect(() => {
    if (!presente || presente.fotos.length <= 1) return;
    slideInterval.current = setInterval(() => {
      setFotoAtual((prev) => (prev + 1) % presente.fotos.length);
    }, 4000);
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [presente]);

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse-heart">♥</div>
          <p className="text-white/50">Abrindo seu presente...</p>
        </div>
      </div>
    );
  }

  if (!presente) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white text-center px-4">
        <div>
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold mb-2">Presente não encontrado</h1>
          <p className="text-white/50">O link pode estar incorreto ou expirado.</p>
        </div>
      </div>
    );
  }

  const tema = TEMAS[presente.tema] || TEMAS.romantico;
  const diasJuntos = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;

  const youtubeId = presente.musicaUrl ? getYoutubeId(presente.musicaUrl) : null;

  if (!aberto) {
    return (
      <div className={`min-h-screen ${tema.bg} flex items-center justify-center text-center px-4`}>
        <div className="max-w-md">
          <div className={`text-8xl mb-8 animate-pulse-heart ${tema.accent}`}>♥</div>
          <p className={`text-lg ${tema.text} opacity-60 mb-2`}>Um presente especial</p>
          <h1 className={`text-4xl md:text-5xl font-bold ${tema.text} mb-2`}>
            Para {presente.nomeDestinatario}
          </h1>
          <p className={`${tema.text} opacity-50 mb-10`}>
            Com todo o amor de {presente.nomeRemetente}
          </p>
          <button
            onClick={() => setAberto(true)}
            className={`bg-[#e84393] hover:bg-[#c0306f] text-white font-bold px-10 py-4 rounded-full transition-all hover:scale-105 text-lg`}
            style={{ boxShadow: "0 10px 40px rgba(232,67,147,0.4)" }}
          >
            Abrir presente ♥
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${tema.bg} ${tema.text} pb-20`}>
      {wrappedAberto && (
        <Wrapped presente={presente} onClose={() => setWrappedAberto(false)} />
      )}

      {/* Botão Ver História */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setWrappedAberto(true)}
          className="flex items-center gap-2 bg-[#e84393] hover:bg-[#c0306f] text-white font-bold px-6 py-3 rounded-full shadow-2xl transition-all hover:scale-105"
          style={{ boxShadow: "0 8px 32px rgba(232,67,147,0.5)" }}
        >
          <span className="text-lg">▶</span> Ver nossa história
        </button>
      </div>

      {/* BLOCO 1 — Cabeçalho */}
      <section className="text-center py-20 px-4">
        <div className={`text-6xl mb-6 animate-pulse-heart ${tema.accent}`}>♥</div>
        <p className="text-sm opacity-50 mb-2 uppercase tracking-widest">{presente.ocasiao}</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          Para {presente.nomeDestinatario}
        </h1>
        <p className="opacity-50 text-lg">Com todo o amor de {presente.nomeRemetente}</p>
      </section>

      {/* BLOCO 2 — Mensagem */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <div className={`${tema.card} border ${tema.border} rounded-3xl p-8`}>
          <div className="flex items-center gap-3 mb-6 opacity-60">
            <span className="text-2xl">💌</span>
            <span className="text-sm uppercase tracking-widest">Uma mensagem especial</span>
          </div>
          <p className="text-xl leading-relaxed italic opacity-90">&ldquo;{presente.mensagem}&rdquo;</p>
          <p className={`mt-6 font-bold ${tema.accent}`}>— {presente.nomeRemetente}</p>
        </div>
      </section>

      {/* BLOCO 3 — Slideshow de Fotos */}
      {presente.fotos.length > 0 && (
        <section className="mb-16">
          <h2 className="text-center text-2xl font-bold mb-8 px-4">Nossa história em fotos 📸</h2>
          <div className="relative max-w-lg mx-auto px-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden relative">
              {presente.fotos.map((foto, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={foto.id}
                  src={foto.url}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    i === fotoAtual ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                />
              ))}

              {/* Controles */}
              {presente.fotos.length > 1 && (
                <>
                  <button
                    onClick={() => setFotoAtual((prev) => (prev - 1 + presente.fotos.length) % presente.fotos.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setFotoAtual((prev) => (prev + 1) % presente.fotos.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Dots */}
            {presente.fotos.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {presente.fotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoAtual(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === fotoAtual ? "bg-[#e84393] w-6" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* BLOCO 4 — Música */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <h2 className="text-center text-2xl font-bold mb-8">Nossa música 🎵</h2>
        <div className="bg-[#111] rounded-3xl overflow-hidden border border-white/10">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#e84393]/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                🎵
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Nossa música</p>
                <p className="font-bold text-lg text-white">{presente.musica}</p>
              </div>
            </div>
          </div>
          {youtubeId && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}`}
                title="Nossa música"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* BLOCO 5 — Linha do Tempo */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <h2 className="text-center text-2xl font-bold mb-10">Nossa jornada 🗓️</h2>
        <div className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#e84393]/20" />
          {[
            {
              data: presente.dataEspecial
                ? new Date(presente.dataEspecial).toLocaleDateString("pt-BR")
                : "Um dia especial",
              icon: "💕",
              titulo: "O começo de tudo",
              desc: `${presente.nomeRemetente} e ${presente.nomeDestinatario} começaram sua história`,
            },
            { data: "Hoje", icon: "⭐", titulo: "Mais um capítulo lindo", desc: "Cada dia ao seu lado é um presente" },
          ].map((item, i) => (
            <div key={i} className="relative mb-10 last:mb-0">
              <div className="absolute -left-5 w-8 h-8 bg-[#e84393] rounded-full flex items-center justify-center text-base">
                {item.icon}
              </div>
              <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 ml-4`}>
                <p className={`text-xs ${tema.accent} font-bold uppercase tracking-widest mb-1`}>{item.data}</p>
                <h3 className="font-bold mb-1">{item.titulo}</h3>
                <p className="text-sm opacity-60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOCO 6 — Encerramento */}
      <section className="text-center px-4 mb-16">
        <div className={`text-6xl ${tema.accent} animate-pulse-heart mb-6`}>♥</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {presente.nomeRemetente} te ama ♥
        </h2>
        {diasJuntos !== null && diasJuntos > 0 && (
          <p className="text-lg opacity-60 mb-10">
            Já são <strong className={tema.accent}>{diasJuntos} dias</strong> juntos
          </p>
        )}

        {/* QR Code */}
        {qrCode && (
          <div className="inline-block">
            <div className={`${tema.card} border ${tema.border} rounded-3xl p-6 inline-block`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="QR Code do presente" className="w-40 h-40 mx-auto rounded-xl" />
              <p className="text-sm opacity-50 mt-3">Escaneie para abrir este presente de qualquer lugar</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
