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

type OcasiaoConfig = {
  gradients: string[];
  coverEmoji: string;
  coverSubtitulo: string;
  diasTitulo: string;
  diasSufixo: string;
  diasDescricao: (nome1: string, nome2: string) => string;
  fotoLegenda: string;
  mensagemEmoji: string;
  mensagemSubtitulo: string;
  musicaSubtitulo: string;
  finalEmoji: string;
  finalPre: string;
  finalVerbo: string;
  finalPos: (dias: number | null) => string;
};

const OCASIAO_CONFIG: Record<string, OcasiaoConfig> = {
  "Aniversário de namoro": {
    gradients: [
      "from-rose-900 via-pink-900 to-red-900",
      "from-red-900 via-rose-800 to-pink-900",
      "from-pink-900 via-red-900 to-rose-900",
      "from-rose-800 via-pink-800 to-red-900",
      "from-red-800 via-rose-900 to-pink-800",
    ],
    coverEmoji: "♥",
    coverSubtitulo: "Feliz aniversário de namoro",
    diasTitulo: "Juntos há",
    diasSufixo: "dias de amor",
    diasDescricao: (a, b) => `${a} e ${b} escrevem mais um capítulo`,
    fotoLegenda: "Memórias que ficam para sempre",
    mensagemEmoji: "💌",
    mensagemSubtitulo: "Uma declaração de amor",
    musicaSubtitulo: "A trilha sonora do nosso amor",
    finalEmoji: "♥",
    finalPre: "E assim",
    finalVerbo: "te ama",
    finalPos: (d) => d && d > 0 ? `Há ${d.toLocaleString("pt-BR")} dias e contando ♥` : "Hoje e sempre ♥",
  },
  "Dia dos Namorados": {
    gradients: [
      "from-red-900 via-rose-900 to-pink-900",
      "from-pink-900 via-red-900 to-rose-800",
      "from-rose-900 via-red-800 to-pink-900",
      "from-red-800 via-pink-900 to-rose-900",
      "from-pink-800 via-rose-900 to-red-900",
    ],
    coverEmoji: "💕",
    coverSubtitulo: "Feliz Dia dos Namorados",
    diasTitulo: "Vocês estão juntos há",
    diasSufixo: "dias apaixonados",
    diasDescricao: (a, b) => `${a} e ${b}, um casal lindo`,
    fotoLegenda: "Momentos que o coração guarda",
    mensagemEmoji: "💝",
    mensagemSubtitulo: "Do fundo do coração",
    musicaSubtitulo: "A música que representa vocês",
    finalEmoji: "💕",
    finalPre: "Feliz Dia dos Namorados,",
    finalVerbo: "te ama muito",
    finalPos: (d) => d && d > 0 ? `${d.toLocaleString("pt-BR")} dias juntos e apaixonados` : "Hoje é o dia de vocês ♥",
  },
  "Aniversário": {
    gradients: [
      "from-violet-900 via-purple-900 to-fuchsia-900",
      "from-fuchsia-900 via-violet-800 to-purple-900",
      "from-purple-900 via-fuchsia-900 to-violet-900",
      "from-violet-800 via-purple-800 to-fuchsia-900",
      "from-fuchsia-800 via-violet-900 to-purple-800",
    ],
    coverEmoji: "🎂",
    coverSubtitulo: "Feliz Aniversário",
    diasTitulo: "Você tem",
    diasSufixo: "dias de vida incrível",
    diasDescricao: (_, b) => `${b} merece todo o amor do mundo`,
    fotoLegenda: "Cada foto, uma lembrança especial",
    mensagemEmoji: "🎁",
    mensagemSubtitulo: "Uma mensagem de coração",
    musicaSubtitulo: "Uma música especial para você",
    finalEmoji: "🎂",
    finalPre: "Que este dia seja incrível,",
    finalVerbo: "te deseja tudo de bom",
    finalPos: () => "Parabéns pelo seu dia especial! ♥",
  },
  "Pedido de namoro": {
    gradients: [
      "from-pink-900 via-rose-900 to-fuchsia-900",
      "from-fuchsia-900 via-pink-800 to-rose-900",
      "from-rose-900 via-fuchsia-900 to-pink-900",
      "from-pink-800 via-rose-800 to-fuchsia-900",
      "from-fuchsia-800 via-pink-900 to-rose-800",
    ],
    coverEmoji: "💍",
    coverSubtitulo: "Uma pergunta especial",
    diasTitulo: "Há",
    diasSufixo: "dias querendo te pedir isso",
    diasDescricao: (a, b) => `${a} tem algo importante para dizer a ${b}`,
    fotoLegenda: "Nossa história até aqui",
    mensagemEmoji: "💍",
    mensagemSubtitulo: "Vem do fundo do coração",
    musicaSubtitulo: "Nossa música especial",
    finalEmoji: "💍",
    finalPre: "A pergunta é:",
    finalVerbo: "quer namorar comigo?",
    finalPos: () => "Você aceita? ♥",
  },
  "Só porque sim": {
    gradients: [
      "from-teal-900 via-cyan-900 to-blue-900",
      "from-blue-900 via-teal-800 to-cyan-900",
      "from-cyan-900 via-blue-900 to-teal-900",
      "from-teal-800 via-cyan-800 to-blue-900",
      "from-blue-800 via-teal-900 to-cyan-800",
    ],
    coverEmoji: "✨",
    coverSubtitulo: "Só porque você merece",
    diasTitulo: "Faz",
    diasSufixo: "dias que você ilumina minha vida",
    diasDescricao: (a, b) => `${a} pensou em ${b} hoje`,
    fotoLegenda: "Momentos que me fazem sorrir",
    mensagemEmoji: "✨",
    mensagemSubtitulo: "Direto do coração",
    musicaSubtitulo: "Uma música que me lembra de você",
    finalEmoji: "✨",
    finalPre: "Só queria que soubesse que",
    finalVerbo: "pensa em você",
    finalPos: () => "Porque você merece ♥",
  },
};

const DEFAULT_CONFIG: OcasiaoConfig = {
  gradients: [
    "from-pink-900 via-rose-900 to-purple-900",
    "from-purple-900 via-violet-900 to-indigo-900",
    "from-rose-900 via-pink-900 to-fuchsia-900",
    "from-indigo-900 via-purple-900 to-pink-900",
    "from-fuchsia-900 via-rose-900 to-pink-900",
  ],
  coverEmoji: "♥",
  coverSubtitulo: "Um presente especial",
  diasTitulo: "Vocês estão juntos há",
  diasSufixo: "dias",
  diasDescricao: (a, b) => `${a} e ${b}, uma história linda`,
  fotoLegenda: "Nossa história em fotos",
  mensagemEmoji: "💌",
  mensagemSubtitulo: "Uma mensagem especial",
  musicaSubtitulo: "A música de vocês",
  finalEmoji: "♥",
  finalPre: "E no final,",
  finalVerbo: "te ama",
  finalPos: (d) => d && d > 0 ? `Há ${d.toLocaleString("pt-BR")} dias e contando ♥` : "Hoje e sempre ♥",
};

function buildSlides(presente: Presente) {
  const diasJuntos = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;

  const slides: { type: string; [key: string]: unknown }[] = [];
  slides.push({ type: "cover" });

  if (presente.dataEspecial && diasJuntos !== null && diasJuntos > 0) {
    slides.push({ type: "dias", dias: diasJuntos, data: presente.dataEspecial });
  }

  presente.fotos.slice(0, 10).forEach((foto, i) => {
    slides.push({ type: "foto", foto, index: i, total: Math.min(presente.fotos.length, 10) });
  });

  slides.push({ type: "mensagem" });
  slides.push({ type: "musica" });
  slides.push({ type: "final" });

  return slides;
}

export default function Wrapped({ presente, onClose }: { presente: Presente; onClose: () => void }) {
  const config = OCASIAO_CONFIG[presente.ocasiao] ?? DEFAULT_CONFIG;
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
        if (p >= 100) { goTo(current + 1); return 0; }
        return p + 100 / (SLIDE_DURATION / 100);
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, paused, goTo]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.changedTouches[0].clientX : (e as React.MouseEvent).clientX;
    if (clientX < window.innerWidth * 0.35) goTo(current - 1);
    else goTo(current + 1);
  };

  const slide = slides[current];
  const gradient = config.gradients[current % config.gradients.length];

  return (
    <div
      className="fixed inset-0 z-50 select-none overflow-hidden"
      onClick={handleTap}
      onTouchEnd={handleTap}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-700`} />

      {/* Barra de progresso */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-3" style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}>
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: i < current ? "100%" : i === current ? `${progress}%` : "0%", transition: "none" }}
            />
          </div>
        ))}
      </div>

      {/* Fechar */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-8 right-4 z-20 text-white/70 hover:text-white text-xl w-8 h-8 flex items-center justify-center"
      >
        ✕
      </button>

      {/* Slide */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
          animDir === "in" ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {slide.type === "cover" && (
          <div className="text-center px-8">
            <div className="text-8xl mb-8 animate-bounce">{config.coverEmoji}</div>
            <p className="text-white/60 text-lg mb-3 uppercase tracking-widest">{config.coverSubtitulo}</p>
            <h1 className="text-5xl font-black text-white mb-4">
              Para<br />{presente.nomeDestinatario}
            </h1>
            <p className="text-white/50 text-xl">de {presente.nomeRemetente}</p>
            <p className="text-white/30 text-sm mt-8">Toque para continuar →</p>
          </div>
        )}

        {slide.type === "dias" && (
          <div className="text-center px-8">
            <p className="text-white/60 text-lg mb-6 uppercase tracking-widest">{config.diasTitulo}</p>
            <div className="text-9xl font-black text-white mb-2 leading-none">
              {(slide.dias as number).toLocaleString("pt-BR")}
            </div>
            <p className="text-3xl font-bold text-white/80 mb-8">{config.diasSufixo}</p>
            <p className="text-white/40 text-base italic">
              {config.diasDescricao(presente.nomeRemetente, presente.nomeDestinatario)}
            </p>
            <p className="text-white/30 text-sm mt-4">
              Desde {new Date(slide.data as string).toLocaleDateString("pt-BR", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
        )}

        {slide.type === "foto" && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(slide.foto as Foto).url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/40" />
            <div className="absolute bottom-16 left-0 right-0 text-center px-8">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
                {(slide.index as number) + 1} / {slide.total as number}
              </p>
              <p className="text-white font-bold text-lg">{config.fotoLegenda}</p>
            </div>
          </div>
        )}

        {slide.type === "mensagem" && (
          <div className="text-center px-8 max-w-sm mx-auto">
            <div className="text-5xl mb-6">{config.mensagemEmoji}</div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-6">{config.mensagemSubtitulo}</p>
            <p className="text-white text-xl leading-relaxed italic font-light">
              &ldquo;{presente.mensagem}&rdquo;
            </p>
            <p className="text-white/70 font-bold mt-6 text-lg">— {presente.nomeRemetente}</p>
          </div>
        )}

        {slide.type === "musica" && (
          <div className="text-center px-8">
            <div className="text-7xl mb-6">🎵</div>
            <p className="text-white/50 text-xs uppercase tracking-widest mb-4">{config.musicaSubtitulo}</p>
            <h2 className="text-3xl font-black text-white leading-tight">{presente.musica}</h2>
            <div className="flex justify-center items-end gap-1 mt-10 h-12">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-white/70 rounded-full animate-pulse"
                  style={{
                    height: `${20 + ((i * 7 + 13) % 28)}px`,
                    animationDelay: `${(i * 0.08) % 0.8}s`,
                    animationDuration: `${0.6 + (i % 3) * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {slide.type === "final" && (
          <div className="text-center px-8">
            <div className="text-8xl mb-6">{config.finalEmoji}</div>
            <p className="text-white/60 text-lg mb-3 uppercase tracking-widest">{config.finalPre}</p>
            <h2 className="text-4xl font-black text-white mb-2">{presente.nomeRemetente}</h2>
            <p className="text-3xl font-bold text-white/80 mb-6">{config.finalVerbo}</p>
            <p className="text-white/50 text-base">{config.finalPos(diasJuntos)}</p>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="mt-10 bg-white/20 backdrop-blur border border-white/30 text-white font-bold px-8 py-3 rounded-full text-base hover:bg-white/30 transition-all"
            >
              Ver presente completo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
