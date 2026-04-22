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

/* ─── Partículas flutuantes ─── */
function Particles({ color = "#e84393", count = 12 }: { color?: string; count?: number }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 4}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: `${4 + Math.random() * 8}px`,
    }))
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.current.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: color,
            opacity: 0,
            animation: `particle-float ${p.duration} ${p.delay} ease-out infinite`,
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Contador animado ─── */
function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return <span>{val.toLocaleString("pt-BR")}</span>;
}

/* ─── Texto revelado palavra por palavra ─── */
function RevealText({ text, className = "", baseDelay = 0 }: { text: string; className?: string; baseDelay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline", perspective: "400px" }}>
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: 0,
            marginRight: "0.25em",
            animation: `reveal-word 0.5s cubic-bezier(0.22,1,0.36,1) forwards`,
            animationDelay: `${baseDelay + i * 0.08}s`,
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}

/* ─── Configurações por ocasião ─── */
type OcasiaoConfig = {
  colors: [string, string, string];   // gradiente 3 cores
  glowColor: string;
  emoji: string;
  badge: string;
  coverFrase: string;
  diasTitulo: string;
  diasSufixo: string;
  diasFrase: (a: string, b: string) => string;
  fotoCaptions: string[];
  mensagemFrase: string;
  musicaFrase: string;
  finalVerbo: string;
  finalFrase: (d: number | null) => string;
};

const CONFIGS: Record<string, OcasiaoConfig> = {
  "Aniversário de namoro": {
    colors: ["#1a0020", "#3d0035", "#1a0020"],
    glowColor: "#e84393",
    emoji: "💑", badge: "Aniversário de Namoro",
    coverFrase: "Hoje celebramos mais um capítulo da história mais bonita que já vivemos juntos.",
    diasTitulo: "Juntos há", diasSufixo: "dias de amor",
    diasFrase: (a, b) => `${a} e ${b} escolheram um ao outro todos os dias.`,
    fotoCaptions: ["Esse momento ficou gravado no coração", "Uma memória que aquece a alma", "Um pedacinho da nossa história de amor", "Cada foto guarda um sorriso sem preço", "Dentre tantos momentos, esse é inesquecível", "Porque algumas memórias precisam durar para sempre", "A vida ao seu lado tem um sabor diferente", "O amor que transborda em cada cena", "Momentos simples que significam tudo", "Esse registro vale mais que qualquer palavra"],
    mensagemFrase: "Alguns sentimentos são grandes demais para caber no peito.",
    musicaFrase: "Toda vez que essa música toca, é impossível não pensar em você.",
    finalVerbo: "te ama com tudo que tem",
    finalFrase: (d) => d && d > 0 ? `${d.toLocaleString("pt-BR")} dias juntos, e cada um deles valeu a pena. ♥` : "Feliz aniversário de namoro. Que venham muitos mais. ♥",
  },
  "Aniversário de casamento": {
    colors: ["#1a1000", "#3d2d00", "#1a1000"],
    glowColor: "#f5c518",
    emoji: "💍", badge: "Aniversário de Casamento",
    coverFrase: "Unidos por escolha, laço e amor. Hoje celebramos mais um ano dessa história linda.",
    diasTitulo: "Casados há", diasSufixo: "dias de união",
    diasFrase: (a, b) => `${a} e ${b} provaram que o amor verdadeiro existe.`,
    fotoCaptions: ["Cada foto, uma promessa renovada", "Momentos que o tempo não apaga", "Aqui está um pedaço da nossa vida juntos", "Unidos em cada foto, em cada memória", "O casamento mais bonito que existe", "Uma história que começou com um sim", "Registros que valem mais que ouro", "O amor que cresce a cada dia", "Juntos em cada capítulo", "Nossa história em imagens"],
    mensagemFrase: "O amor de casamento é o mais profundo que existe.",
    musicaFrase: "A música que embala a história de vocês.",
    finalVerbo: "te ama para sempre",
    finalFrase: (d) => d && d > 0 ? `${d.toLocaleString("pt-BR")} dias de casamento. Que venham muito mais. ♥` : "Feliz aniversário de casamento. Hoje e sempre. ♥",
  },
  "Dia das Mães": {
    colors: ["#1a0015", "#2d0028", "#1a0015"],
    glowColor: "#f472b6",
    emoji: "🌸", badge: "Dia das Mães",
    coverFrase: "Para a pessoa que me deu a vida e me ensinou tudo que importa.",
    diasTitulo: "Você me ama há", diasSufixo: "dias incondicionalmente",
    diasFrase: (a, _b) => `${a} te agradece por cada abraço, cada conselho, cada sacrifício.`,
    fotoCaptions: ["Com a melhor mãe do mundo", "Momentos que guardarei para sempre", "Ao lado de quem mais me ama", "Uma memória especial com você", "Porque você merece ser lembrada assim", "Com todo amor do mundo, mãe", "Registros que aquecem o coração", "Ao lado do meu maior amor", "Memórias que não têm preço", "Você ilumina cada foto, mãe"],
    mensagemFrase: "Existem palavras que só fazem sentido ditas para a mãe.",
    musicaFrase: "Uma música especial para o dia mais especial do ano.",
    finalVerbo: "te ama infinitamente",
    finalFrase: () => "Feliz Dia das Mães. Obrigado por tudo que você é. ♥",
  },
  "Dia dos Pais": {
    colors: ["#000d1a", "#001a35", "#000d1a"],
    glowColor: "#3b82f6",
    emoji: "💙", badge: "Dia dos Pais",
    coverFrase: "Para o homem que me mostrou o que é força, dedicação e amor de verdade.",
    diasTitulo: "Você é meu herói há", diasSufixo: "dias",
    diasFrase: (a, _b) => `${a} aprende com você todos os dias. Obrigado por ser esse pai.`,
    fotoCaptions: ["Com o melhor pai do mundo", "Momentos inesquecíveis com você", "Ao lado do meu maior herói", "Uma memória especial, pai", "Porque você merece ser lembrado", "Com todo amor, pai", "Registros que marcam para sempre", "Ao lado do meu exemplo", "Memórias que guardarei sempre", "Você é meu maior orgulho"],
    mensagemFrase: "Para o pai, as palavras precisam ser à altura do amor.",
    musicaFrase: "Uma música que toca fundo no coração.",
    finalVerbo: "te admira todos os dias",
    finalFrase: () => "Feliz Dia dos Pais. Você é meu maior exemplo. ♥",
  },
  "Aniversário": {
    colors: ["#0d0020", "#200040", "#0d0020"],
    glowColor: "#a78bfa",
    emoji: "🎂", badge: "Feliz Aniversário",
    coverFrase: "Hoje o mundo fica mais bonito porque você está nele.",
    diasTitulo: "Você tem", diasSufixo: "dias de vida incrível",
    diasFrase: (_, b) => `${b} faz a vida de quem está ao redor ser mais alegre e mais bonita.`,
    fotoCaptions: ["Aqui está um momento especial com você", "Uma lembrança que merece ser celebrada", "Cada foto é uma razão a mais para sorrir", "Porque você merece ser lembrado assim", "Momentos que ficam para sempre", "Uma foto que vale mais que palavras", "Parte da sua história linda", "Eternizando momentos que importam", "Você ilumina cada foto", "Uma memória pra guardar"],
    mensagemFrase: "No seu aniversário, as palavras vêm do fundo do coração.",
    musicaFrase: "Uma música especial para o seu dia especial.",
    finalVerbo: "deseja um dia incrível",
    finalFrase: () => "Parabéns! Que esse seja o melhor ano da sua vida. ♥",
  },
  "Pedido de namoro": {
    colors: ["#1a0020", "#35003d", "#1a0020"],
    glowColor: "#e879f9",
    emoji: "💍", badge: "Uma Pergunta Especial",
    coverFrase: "Tem algo importante que precisa ser dito. Prepare o coração.",
    diasTitulo: "Faz", diasSufixo: "dias querendo te perguntar isso",
    diasFrase: (a, b) => `${a} não consegue mais imaginar o futuro sem ${b}.`,
    fotoCaptions: ["Nossa história até aqui...", "Cada momento com você foi especial", "Aqui está o porquê dessa pergunta", "Você é o motivo de cada sorriso", "Uma lembrança do que já vivemos", "E pensar que ainda nem começamos...", "Cada foto me convence mais", "Você faz tudo fazer sentido", "Momentos que me fazem querer sempre mais", "É você que eu quero ao meu lado"],
    mensagemFrase: "Há palavras que ficam presas na garganta por tempo demais.",
    musicaFrase: "Essa música toca sempre que eu penso em você.",
    finalVerbo: "Você quer namorar comigo?",
    finalFrase: () => "Do fundo do coração, com muito amor. ♥",
  },
};

const DEFAULT_CONFIG: OcasiaoConfig = {
  colors: ["#0a0015", "#1a0030", "#0a0015"],
  glowColor: "#e84393",
  emoji: "♥", badge: "Um presente especial",
  coverFrase: "Alguém pensou muito para criar algo especial só para você.",
  diasTitulo: "Juntos há", diasSufixo: "dias",
  diasFrase: (a, b) => `${a} e ${b}, uma história que vale ser contada.`,
  fotoCaptions: ["Esse momento ficou guardado para sempre", "Uma memória que nenhuma palavra descreve", "Dentre tantos momentos, esse é especial", "A vida fica mais bonita quando compartilhada", "Fotografias guardam o que a memória não quer esquecer", "Cada foto conta um pedaço da nossa história", "Aqui começa mais um capítulo lindo", "Um sorriso que vale mais que mil palavras", "Momentos assim fazem tudo valer a pena", "Esse é o tipo de lembrança que aquece a alma"],
  mensagemFrase: "Algumas palavras são grandes demais para serem ditas de qualquer jeito.",
  musicaFrase: "Toda vez que essa música toca, ela conta um pedaço da nossa história.",
  finalVerbo: "te ama",
  finalFrase: (d) => d && d > 0 ? `${d.toLocaleString("pt-BR")} dias e contando. ♥` : "Hoje e sempre. ♥",
};

function buildSlides(presente: Presente) {
  const dias = presente.dataEspecial ? differenceInDays(new Date(), new Date(presente.dataEspecial)) : null;
  const slides: { type: string; [key: string]: unknown }[] = [];
  slides.push({ type: "cover" });
  if (presente.dataEspecial && dias !== null && dias > 0) slides.push({ type: "dias", dias });
  presente.fotos.slice(0, 10).forEach((foto, i) =>
    slides.push({ type: "foto", foto, index: i, total: Math.min(presente.fotos.length, 10) })
  );
  slides.push({ type: "mensagem" });
  if (presente.musica) slides.push({ type: "musica" });
  slides.push({ type: "final" });
  return slides;
}

/* ─── Componente principal ─── */
export default function Wrapped({ presente, onClose }: { presente: Presente; onClose: () => void }) {
  const config = CONFIGS[presente.ocasiao] ?? DEFAULT_CONFIG;
  const slides = buildSlides(presente);
  const diasJuntos = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;
  const meses = diasJuntos ? Math.floor(diasJuntos / 30) : null;
  const anos = diasJuntos ? Math.floor(diasJuntos / 365) : null;
  const horas = diasJuntos ? diasJuntos * 24 : null;

  const [current, setCurrent] = useState(0);
  const [entering, setEntering] = useState(true);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slideKey, setSlideKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const SLIDE_DURATION = 7000;

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) { onClose(); return; }
    setEntering(false);
    setTimeout(() => {
      setCurrent(index);
      setProgress(0);
      setSlideKey(k => k + 1);
      setEntering(true);
    }, 300);
  }, [slides.length, onClose]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { goTo(current + 1); return 0; }
        return p + 100 / (SLIDE_DURATION / 100);
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, paused, goTo]);

  const handleTap = (clientX: number) => {
    if (clientX < window.innerWidth * 0.3) goTo(current - 1);
    else goTo(current + 1);
  };

  const slide = slides[current];
  const [c1, c2, c3] = config.colors;
  const glow = config.glowColor;

  return (
    <div
      className="fixed inset-0 z-50 select-none overflow-hidden"
      onClick={e => handleTap(e.clientX)}
      onTouchEnd={e => handleTap(e.changedTouches[0].clientX)}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      {/* ── Background animado ── */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`,
          backgroundSize: "300% 300%",
          animation: "bg-shift 8s ease infinite",
        }}
      />
      {/* Glow central */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${glow}22 0%, transparent 70%)`,
          animation: "pulse-slow 3s ease-in-out infinite",
        }}
      />
      {/* Anel decorativo girando */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full border opacity-10 animate-rotate-slow"
        style={{ borderColor: glow, borderWidth: "1px" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full border opacity-5 animate-rotate-slow"
        style={{ borderColor: glow, borderWidth: "1px", animationDirection: "reverse" }}
      />

      <Particles color={glow} count={14} />

      {/* ── Barra de progresso ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-3 pt-3">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
            <div
              className="h-full rounded-full"
              style={{
                background: "white",
                width: i < current ? "100%" : i === current ? `${progress}%` : "0%",
                transition: "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* Fechar */}
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-8 right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full text-white/50 hover:text-white"
        style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}
      >✕</button>

      {/* ── Conteúdo ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: entering ? 1 : 0,
          transform: entering ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
        }}
        key={slideKey}
      >

        {/* ══ COVER ══ */}
        {slide.type === "cover" && (
          <div className="text-center px-8 max-w-sm mx-auto w-full">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest mb-8"
              style={{
                background: `${glow}22`,
                border: `1px solid ${glow}44`,
                color: "rgba(255,255,255,0.7)",
                animation: "slide-up 0.5s ease forwards",
              }}
            >
              {config.emoji} {config.badge}
            </div>

            {/* Emoji com glow pulsante */}
            <div
              className="text-8xl mb-6 animate-pulse-heart"
              style={{
                filter: `drop-shadow(0 0 30px ${glow}) drop-shadow(0 0 60px ${glow}88)`,
                animation: "pulse-heart 1.5s ease-in-out infinite, scale-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
              }}
            >
              {config.emoji}
            </div>

            <p className="text-white/40 text-xs uppercase tracking-widest mb-3" style={{ animation: "slide-up 0.5s 0.3s ease both" }}>
              Um presente especial
            </p>
            <h1
              className="text-5xl font-black text-white mb-2 leading-tight"
              style={{ animation: "slide-up 0.6s 0.4s ease both" }}
            >
              Para<br />
              <span style={{
                background: `linear-gradient(135deg, #fff 30%, ${glow} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {presente.nomeDestinatario}
              </span>
            </h1>
            <p className="text-white/50 text-base mb-8" style={{ animation: "slide-up 0.5s 0.55s ease both" }}>
              de {presente.nomeRemetente}
            </p>
            <div className="w-px h-10 mx-auto mb-6" style={{ background: `linear-gradient(to bottom, ${glow}88, transparent)` }} />
            <p className="text-white/60 text-sm leading-relaxed italic" style={{ animation: "slide-up 0.5s 0.7s ease both" }}>
              {config.coverFrase}
            </p>
            <p className="text-white/25 text-xs mt-10 animate-pulse">Toque para começar →</p>
          </div>
        )}

        {/* ══ DIAS ══ */}
        {slide.type === "dias" && (
          <div className="text-center px-8 max-w-sm mx-auto w-full">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-4" style={{ animation: "slide-up 0.4s ease both" }}>
              {config.diasTitulo}
            </p>

            {/* Número gigante com count-up */}
            <div
              className="font-black leading-none mb-2"
              style={{
                fontSize: "clamp(4rem, 20vw, 7rem)",
                background: `linear-gradient(135deg, #fff 40%, ${glow} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "scale-in 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
                filter: `drop-shadow(0 0 30px ${glow}66)`,
              }}
            >
              <CountUp target={slide.dias as number} duration={1800} />
            </div>
            <p className="text-xl font-semibold mb-8" style={{ color: `${glow}cc`, animation: "slide-up 0.5s 0.3s ease both" }}>
              {config.diasSufixo}
            </p>

            {/* Cards de stats */}
            <div className="grid grid-cols-3 gap-2 mb-8">
              {[
                { v: anos, l: anos === 1 ? "ano" : "anos", show: !!anos && anos > 0 },
                { v: meses, l: meses === 1 ? "mês" : "meses", show: !!meses && meses > 0 },
                { v: horas ? horas.toLocaleString("pt-BR") : null, l: "horas", show: !!horas },
              ].filter(x => x.show).map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-3 text-center"
                  style={{
                    background: `${glow}15`,
                    border: `1px solid ${glow}30`,
                    animation: `slide-up 0.4s ${0.2 + i * 0.12}s ease both`,
                  }}
                >
                  <p className="text-2xl font-black text-white">{item.v}</p>
                  <p className="text-white/40 text-xs mt-1">{item.l}</p>
                </div>
              ))}
            </div>

            <p className="text-white/70 text-base leading-relaxed italic" style={{ animation: "slide-up 0.5s 0.6s ease both" }}>
              {config.diasFrase(presente.nomeRemetente, presente.nomeDestinatario)}
            </p>
          </div>
        )}

        {/* ══ FOTO ══ */}
        {slide.type === "foto" && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Fundo desfocado com ken burns */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(slide.foto as Foto).url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
              style={{ filter: "blur(24px) brightness(0.4)", transform: "scale(1.15)" }}
            />
            {/* Foto principal com ken burns suave */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(slide.foto as Foto).url}
              alt=""
              className="absolute inset-0 w-full h-full object-contain animate-ken-burns"
            />
            {/* Gradiente topo */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
            {/* Gradiente base */}
            <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/95 to-transparent" />

            {/* Badge de foto */}
            <div className="absolute top-12 inset-x-0 flex justify-center" style={{ animation: "slide-up 0.5s ease both" }}>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-white/70 uppercase tracking-widest"
                style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: `1px solid ${glow}30` }}
              >
                {config.emoji} {(slide.index as number) + 1} de {slide.total as number}
              </span>
            </div>

            {/* Caption */}
            <div className="absolute bottom-10 inset-x-0 px-8 text-center" style={{ animation: "slide-up 0.5s 0.2s ease both" }}>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Nossa história</p>
              <p className="text-white font-bold text-xl leading-snug drop-shadow-2xl">
                {config.fotoCaptions[(slide.index as number) % config.fotoCaptions.length]}
              </p>
              {/* Dots */}
              <div className="flex justify-center mt-4 gap-1">
                {Array.from({ length: slide.total as number }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: i === (slide.index as number) ? "24px" : "6px",
                      background: i === (slide.index as number) ? glow : "rgba(255,255,255,0.3)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Glow nas bordas */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: `inset 0 0 80px ${glow}22` }}
            />
          </div>
        )}

        {/* ══ MENSAGEM ══ */}
        {slide.type === "mensagem" && (
          <div className="text-center px-6 max-w-sm mx-auto w-full">
            <div
              className="text-5xl mb-4"
              style={{
                filter: `drop-shadow(0 0 20px ${glow})`,
                animation: "scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
              }}
            >
              💌
            </div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-3" style={{ animation: "slide-up 0.4s 0.2s ease both" }}>
              Uma mensagem de coração
            </p>
            <div className="w-8 h-px mx-auto mb-5" style={{ background: glow }} />
            <p className="text-white/50 text-sm italic leading-relaxed mb-6" style={{ animation: "slide-up 0.4s 0.3s ease both" }}>
              {config.mensagemFrase}
            </p>

            {/* Card da mensagem com brilho */}
            <div
              className="rounded-3xl p-6 text-left"
              style={{
                background: `${glow}10`,
                border: `1px solid ${glow}30`,
                boxShadow: `0 0 40px ${glow}15`,
                animation: "slide-up 0.5s 0.4s ease both",
              }}
            >
              {/* Aspas decorativas */}
              <div className="text-6xl font-black leading-none mb-2" style={{ color: `${glow}30`, lineHeight: "0.8" }}>&ldquo;</div>
              <p className="text-white text-base leading-relaxed font-light">
                {presente.mensagem}
              </p>
              <div className="mt-5 pt-4 flex items-center gap-2" style={{ borderTop: `1px solid ${glow}20` }}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: glow }}
                >
                  ♥
                </div>
                <p className="text-white/70 text-sm font-semibold">{presente.nomeRemetente}</p>
              </div>
            </div>
          </div>
        )}

        {/* ══ MÚSICA ══ */}
        {slide.type === "musica" && (
          <div className="text-center px-8 max-w-sm mx-auto w-full">
            <div
              className="text-5xl mb-5"
              style={{
                filter: `drop-shadow(0 0 20px ${glow})`,
                animation: "scale-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
              }}
            >
              🎵
            </div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4" style={{ animation: "slide-up 0.4s 0.2s ease both" }}>
              A música de vocês
            </p>

            {/* Card da música */}
            <div
              className="rounded-3xl p-6 mb-6"
              style={{
                background: `${glow}12`,
                border: `1px solid ${glow}30`,
                boxShadow: `0 0 60px ${glow}20`,
                animation: "slide-up 0.5s 0.3s ease both",
              }}
            >
              <p
                className="font-black text-2xl leading-tight mb-1"
                style={{
                  background: `linear-gradient(135deg, #fff, ${glow})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {presente.musica}
              </p>

              {/* Equalizador animado */}
              <div className="flex justify-center items-end gap-0.5 mt-5 h-12">
                {[...Array(30)].map((_, i) => {
                  const h = 8 + ((i * 13 + 5) % 32);
                  return (
                    <div
                      key={i}
                      className="rounded-full"
                      style={{
                        width: "3px",
                        height: `${h}px`,
                        background: `linear-gradient(to top, ${glow}, ${glow}66)`,
                        transformOrigin: "bottom",
                        animation: `bar-dance ${0.4 + (i % 5) * 0.12}s ${(i * 0.05) % 0.5}s ease-in-out infinite`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <p className="text-white/60 text-base leading-relaxed italic" style={{ animation: "slide-up 0.4s 0.5s ease both" }}>
              {config.musicaFrase}
            </p>
          </div>
        )}

        {/* ══ FINAL ══ */}
        {slide.type === "final" && (
          <div className="text-center px-8 max-w-sm mx-auto w-full">
            {/* Emoji grande com glow explosion */}
            <div
              className="text-7xl mb-8"
              style={{
                filter: `drop-shadow(0 0 40px ${glow}) drop-shadow(0 0 80px ${glow}88)`,
                animation: "scale-in 0.7s cubic-bezier(0.34,1.56,0.64,1) both, glow-pulse 2s 0.7s ease-in-out infinite",
              }}
            >
              {config.emoji}
            </div>

            <p className="text-white/40 text-xs uppercase tracking-widest mb-4" style={{ animation: "slide-up 0.4s 0.3s ease both" }}>
              E então,
            </p>

            <div style={{ animation: "slide-up 0.5s 0.4s ease both" }}>
              <h2
                className="text-4xl font-black text-white mb-1 leading-tight"
              >
                {presente.nomeRemetente}
              </h2>
              <p
                className="text-2xl font-bold mb-8 leading-tight"
                style={{ color: glow }}
              >
                {config.finalVerbo}
              </p>
            </div>

            <div className="w-12 h-px mx-auto mb-6" style={{ background: `linear-gradient(to right, transparent, ${glow}, transparent)` }} />

            <p className="text-white/50 text-base leading-relaxed mb-8" style={{ animation: "slide-up 0.4s 0.6s ease both" }}>
              {config.finalFrase(diasJuntos)}
            </p>

            {/* Coração grande pulsante */}
            <div
              className="text-4xl mb-8"
              style={{
                animation: "pulse-heart 1s 0.8s ease-in-out infinite",
                filter: `drop-shadow(0 0 20px ${glow})`,
              }}
            >
              ♥
            </div>

            <button
              onClick={e => { e.stopPropagation(); onClose(); }}
              className="font-semibold px-8 py-3 rounded-full text-sm transition-all hover:scale-105"
              style={{
                background: glow,
                color: "white",
                boxShadow: `0 8px 32px ${glow}66`,
                animation: "slide-up 0.4s 0.9s ease both",
              }}
            >
              Ver presente completo ♥
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
