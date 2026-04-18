"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { differenceInDays } from "date-fns";

type Foto = { id: string; url: string; ordem: number };
type Presente = {
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

function buildSlides(presente: Presente) {
  const diasJuntos = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;

  const slides: { type: string; [key: string]: unknown }[] = [];

  // Slide 1 — Abertura
  slides.push({ type: "cover" });

  // Slide 2 — Data especial / dias juntos
  if (presente.dataEspecial && diasJuntos !== null && diasJuntos > 0) {
    slides.push({ type: "dias", dias: diasJuntos, data: presente.dataEspecial });
  }

  // Slides de fotos (uma por slide)
  presente.fotos.slice(0, 10).forEach((foto, i) => {
    slides.push({ type: "foto", foto, index: i, total: Math.min(presente.fotos.length, 10) });
  });

  // Slide — Mensagem
  slides.push({ type: "mensagem" });

  // Slide — Música
  slides.push({ type: "musica" });

  // Slide — Final
  slides.push({ type: "final" });

  return slides;
}

const GRADIENTS = [
  "from-pink-900 via-rose-900 to-purple-900",
  "from-purple-900 via-violet-900 to-indigo-900",
  "from-rose-900 via-pink-900 to-fuchsia-900",
  "from-indigo-900 via-purple-900 to-pink-900",
  "from-fuchsia-900 via-rose-900 to-pink-900",
];

export default function Wrapped({
  presente,
  onClose,
}: {
  presente: Presente;
  onClose: () => void;
}) {
  const slides = buildSlides(presente);
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const SLIDE_DURATION = 5000;

  const diasJuntos = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;

  const goTo = useCallback(
    (index: number) => {
      if (index < 0) { onClose(); return; }
      if (index >= slides.length) { onClose(); return; }
      setAnimDir("out");
      setTimeout(() => {
        setCurrent(index);
        setProgress(0);
        setAnimDir("in");
      }, 200);
    },
    [slides.length, onClose]
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          goTo(current + 1);
          return 0;
        }
        return p + 100 / (SLIDE_DURATION / 100);
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, paused, goTo]);

  const handleTap = (e: React.MouseEvent) => {
    const x = e.clientX;
    const w = window.innerWidth;
    if (x < w * 0.35) goTo(current - 1);
    else goTo(current + 1);
  };

  const slide = slides[current];
  const gradient = GRADIENTS[current % GRADIENTS.length];

  return (
    <div
      className="fixed inset-0 z-50 select-none"
      onClick={handleTap}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Fundo com gradiente */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-500`} />

      {/* Barra de progresso */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-3 pt-safe">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* Botão fechar */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-8 right-4 z-20 text-white/70 hover:text-white text-2xl w-8 h-8 flex items-center justify-center"
      >
        ✕
      </button>

      {/* Conteúdo do slide */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          animDir === "in" ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {slide.type === "cover" && (
          <div className="text-center px-8">
            <div className="text-8xl mb-8 animate-bounce">♥</div>
            <p className="text-white/60 text-lg mb-3 uppercase tracking-widest">Um presente especial</p>
            <h1 className="text-5xl font-black text-white mb-4">
              Para<br />{presente.nomeDestinatario}
            </h1>
            <p className="text-white/50 text-xl">de {presente.nomeRemetente}</p>
            <p className="text-white/30 text-sm mt-8">Toque para continuar →</p>
          </div>
        )}

        {slide.type === "dias" && (
          <div className="text-center px-8">
            <p className="text-white/60 text-lg mb-6 uppercase tracking-widest">Vocês estão juntos há</p>
            <div className="text-9xl font-black text-white mb-4 leading-none">
              {(slide.dias as number).toLocaleString("pt-BR")}
            </div>
            <p className="text-4xl font-bold text-pink-300 mb-8">dias</p>
            <p className="text-white/40 text-base">
              Desde {new Date(slide.data as string).toLocaleDateString("pt-BR", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </p>
          </div>
        )}

        {slide.type === "foto" && (
          <div className="w-full h-full flex flex-col">
            <div className="flex-1 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={(slide.foto as Foto).url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-12 left-0 right-0 text-center px-8">
              <p className="text-white/60 text-sm uppercase tracking-widest mb-2">
                Foto {(slide.index as number) + 1} de {slide.total as number}
              </p>
              <p className="text-white font-bold text-xl">Nossa história ♥</p>
            </div>
          </div>
        )}

        {slide.type === "mensagem" && (
          <div className="text-center px-8 max-w-sm mx-auto">
            <div className="text-5xl mb-8">💌</div>
            <p className="text-white/50 text-sm uppercase tracking-widest mb-6">Uma mensagem especial</p>
            <p className="text-white text-xl leading-relaxed italic font-light">
              &ldquo;{presente.mensagem}&rdquo;
            </p>
            <p className="text-pink-300 font-bold mt-6 text-lg">— {presente.nomeRemetente}</p>
          </div>
        )}

        {slide.type === "musica" && (
          <div className="text-center px-8">
            <div className="text-7xl mb-8">🎵</div>
            <p className="text-white/50 text-sm uppercase tracking-widest mb-4">A música de vocês</p>
            <h2 className="text-3xl font-black text-white mb-4 leading-tight">{presente.musica}</h2>
            <div className="flex justify-center gap-1 mt-8">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-pink-400 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 10}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {slide.type === "final" && (
          <div className="text-center px-8">
            <div className="text-8xl mb-8">🎉</div>
            <p className="text-white/60 text-xl mb-4 uppercase tracking-widest">E no final</p>
            <h2 className="text-5xl font-black text-white mb-6">
              {presente.nomeRemetente}<br />
              <span className="text-pink-300">te ama</span>
            </h2>
            {diasJuntos !== null && diasJuntos > 0 && (
              <p className="text-white/50 text-lg">
                Há {diasJuntos.toLocaleString("pt-BR")} dias e contando ♥
              </p>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="mt-10 bg-white text-pink-900 font-bold px-8 py-3 rounded-full text-lg hover:scale-105 transition-transform"
            >
              Ver presente completo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
