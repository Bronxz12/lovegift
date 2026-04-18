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
  coverBadge: string;
  coverFrase: string;
  diasTitulo: string;
  diasSufixo: string;
  diasFrase: (a: string, b: string) => string;
  diasExtra: string;
  fotoCaptions: string[];
  mensagemFrase: string;
  musicaFrase: string;
  musicaExtra: string;
  finalEmoji: string;
  finalTitulo: (a: string) => string;
  finalVerbo: string;
  finalFrase: (d: number | null) => string;
};

const FOTO_CAPTIONS_DEFAULT = [
  "Esse momento ficou guardado para sempre no coração",
  "Uma memória que nenhuma palavra consegue descrever",
  "Dentre tantos momentos, esse é especial demais",
  "A vida fica mais bonita quando compartilhada com você",
  "Fotografias guardam o que a memória não quer esquecer",
  "Cada foto conta um pedaço da nossa história",
  "Aqui começa mais um capítulo lindo",
  "Um sorriso que vale mais que mil palavras",
  "Momentos assim fazem tudo valer a pena",
  "Esse é o tipo de lembrança que aquece a alma",
];

const CONFIGS: Record<string, OcasiaoConfig> = {
  "Aniversário de namoro": {
    gradients: ["from-rose-950 via-pink-900 to-red-950","from-red-950 via-rose-900 to-pink-950","from-pink-950 via-red-900 to-rose-950","from-rose-900 via-pink-950 to-red-900","from-red-900 via-rose-950 to-pink-900"],
    coverEmoji: "♥",
    coverBadge: "Aniversário de Namoro",
    coverFrase: "Hoje celebramos mais um capítulo da história mais bonita que já vivemos juntos.",
    diasTitulo: "Juntos há",
    diasSufixo: "dias de amor",
    diasFrase: (a, b) => `${a} e ${b} escolheram um ao outro todos os dias.`,
    diasExtra: "Cada dia foi uma nova razão para ter certeza de que fez a escolha certa.",
    fotoCaptions: ["Esse momento ficou gravado no coração para sempre","Uma lembrança que aquece a alma nos dias frios","Aqui está um pedacinho da nossa história de amor","Cada foto guarda um sorriso que não tem preço","Dentre tantos momentos, esse é inesquecível","Porque algumas memórias precisam durar para sempre","A vida ao seu lado tem um sabor diferente","O amor que transborda em cada foto","Momentos simples que significam tudo","Esse registro vale mais que qualquer palavra"],
    mensagemFrase: "Alguns sentimentos são grandes demais para caber no peito. Eles transbordam em palavras.",
    musicaFrase: "Toda vez que essa música toca, é impossível não pensar em você.",
    musicaExtra: "Ela carrega um pedaço da nossa história que jamais será esquecido.",
    finalEmoji: "♥",
    finalTitulo: (a) => `${a}`,
    finalVerbo: "te ama com tudo que tem",
    finalFrase: (d) => d && d > 0 ? `${d.toLocaleString("pt-BR")} dias juntos, e cada um deles valeu a pena.` : "Feliz aniversário de namoro. Que venham muitos mais. ♥",
  },
  "Dia dos Namorados": {
    gradients: ["from-red-950 via-rose-900 to-pink-950","from-pink-950 via-red-900 to-rose-950","from-rose-950 via-pink-900 to-red-950","from-red-900 via-rose-950 to-pink-900","from-pink-900 via-red-950 to-rose-900"],
    coverEmoji: "💕",
    coverBadge: "Dia dos Namorados",
    coverFrase: "Hoje é o dia de celebrar o amor mais bonito que existe: o nosso.",
    diasTitulo: "Apaixonados há",
    diasSufixo: "dias",
    diasFrase: (a, b) => `${a} e ${b} — um amor que só cresce.`,
    diasExtra: "Feliz Dia dos Namorados. Você merece todo o amor do mundo.",
    fotoCaptions: FOTO_CAPTIONS_DEFAULT,
    mensagemFrase: "No Dia dos Namorados, as palavras precisam ser à altura do sentimento.",
    musicaFrase: "Essa é a música que toca quando eu penso em você.",
    musicaExtra: "Ela diz tudo que às vezes as palavras não conseguem.",
    finalEmoji: "💕",
    finalTitulo: (a) => `${a}`,
    finalVerbo: "te ama muito",
    finalFrase: (d) => d && d > 0 ? `${d.toLocaleString("pt-BR")} dias apaixonados e contando.` : "Feliz Dia dos Namorados. Hoje e sempre. ♥",
  },
  "Aniversário": {
    gradients: ["from-violet-950 via-purple-900 to-fuchsia-950","from-fuchsia-950 via-violet-900 to-purple-950","from-purple-950 via-fuchsia-900 to-violet-950","from-violet-900 via-purple-950 to-fuchsia-900","from-fuchsia-900 via-violet-950 to-purple-900"],
    coverEmoji: "🎂",
    coverBadge: "Feliz Aniversário",
    coverFrase: "Hoje o mundo fica mais bonito porque você está nele. Esse presente é só uma forma de dizer isso.",
    diasTitulo: "Você tem",
    diasSufixo: "dias de vida incrível",
    diasFrase: (_, b) => `${b} faz a vida de quem está ao redor ser mais leve, mais alegre e mais bonita.`,
    diasExtra: "Que cada um dos seus próximos dias seja ainda melhor que o anterior.",
    fotoCaptions: ["Aqui está um momento especial com você","Uma lembrança que merece ser celebrada","Cada foto é uma razão a mais para sorrir","Porque você merece ser lembrado assim","Momentos que ficam para sempre","Uma foto que vale mais que palavras","Aqui está parte da sua história linda","Cada clique, um sorriso guardado","Você ilumina cada foto em que aparece","Eternizando momentos que importam"],
    mensagemFrase: "No seu aniversário, as palavras precisam ser especiais. E essa mensagem vem do fundo do coração.",
    musicaFrase: "Uma música especial para o seu dia especial.",
    musicaExtra: "Que ela toque sempre que você precisar lembrar o quanto é amado.",
    finalEmoji: "🎂",
    finalTitulo: (a) => `${a}`,
    finalVerbo: "deseja um dia incrível",
    finalFrase: () => "Parabéns! Que esse seja o melhor aniversário que você já teve. ♥",
  },
  "Pedido de namoro": {
    gradients: ["from-pink-950 via-rose-900 to-fuchsia-950","from-fuchsia-950 via-pink-900 to-rose-950","from-rose-950 via-fuchsia-900 to-pink-950","from-pink-900 via-rose-950 to-fuchsia-900","from-fuchsia-900 via-pink-950 to-rose-900"],
    coverEmoji: "💍",
    coverBadge: "Uma Pergunta Especial",
    coverFrase: "Tem algo importante que precisa ser dito. Prepare o coração.",
    diasTitulo: "Faz",
    diasSufixo: "dias querendo te perguntar isso",
    diasFrase: (a, b) => `${a} não consegue mais imaginar o futuro sem ${b}.`,
    diasExtra: "Alguns sentimentos crescem tanto que chegam um momento que precisam ser ditos.",
    fotoCaptions: ["Nossa história até aqui...","Cada momento com você foi especial","Aqui está o porquê dessa pergunta","Você é o motivo de cada sorriso","Uma lembrança do que já vivemos","E pensar que ainda nem começamos...","Cada foto me convence mais","Você faz tudo fazer sentido","Momentos que me fazem querer sempre mais","É você que eu quero ao meu lado"],
    mensagemFrase: "Há palavras que ficam presas na garganta por tempo demais. Chegou a hora de dizê-las.",
    musicaFrase: "Essa música toca sempre que eu penso em você.",
    musicaExtra: "E ela toca cada vez mais, porque eu penso em você cada vez mais.",
    finalEmoji: "💍",
    finalTitulo: (a) => `${a} quer saber:`,
    finalVerbo: "Você quer namorar comigo?",
    finalFrase: () => "Do fundo do coração, com muito amor. ♥",
  },
  "Só porque sim": {
    gradients: ["from-teal-950 via-cyan-900 to-blue-950","from-blue-950 via-teal-900 to-cyan-950","from-cyan-950 via-blue-900 to-teal-950","from-teal-900 via-cyan-950 to-blue-900","from-blue-900 via-teal-950 to-cyan-900"],
    coverEmoji: "✨",
    coverBadge: "Só porque você merece",
    coverFrase: "Sem motivo especial. Sem data comemorativa. Só porque você existe e isso já é motivo de sobra.",
    diasTitulo: "Faz",
    diasSufixo: "dias que você ilumina minha vida",
    diasFrase: (a, b) => `${a} pensou em ${b} hoje. E quis que você soubesse disso.`,
    diasExtra: "Às vezes o melhor presente é saber que alguém pensa em você sem precisar de motivo.",
    fotoCaptions: FOTO_CAPTIONS_DEFAULT,
    mensagemFrase: "Às vezes a gente não precisa de data especial para dizer coisas importantes.",
    musicaFrase: "Essa música me lembra de você.",
    musicaExtra: "E cada vez que ela toca, eu sorrio sem conseguir evitar.",
    finalEmoji: "✨",
    finalTitulo: (a) => `${a}`,
    finalVerbo: "pensa em você",
    finalFrase: () => "Não porque é obrigação. Mas porque é amor. ♥",
  },
};

const DEFAULT_CONFIG: OcasiaoConfig = {
  gradients: ["from-pink-950 via-rose-900 to-purple-950","from-purple-950 via-violet-900 to-indigo-950","from-rose-950 via-pink-900 to-fuchsia-950","from-indigo-950 via-purple-900 to-pink-950","from-fuchsia-950 via-rose-900 to-pink-950"],
  coverEmoji: "♥",
  coverBadge: "Um presente especial",
  coverFrase: "Alguém pensou muito para criar algo especial só para você.",
  diasTitulo: "Juntos há",
  diasSufixo: "dias",
  diasFrase: (a, b) => `${a} e ${b}, uma história que vale ser contada.`,
  diasExtra: "Cada dia ao lado de quem a gente ama tem um sabor diferente.",
  fotoCaptions: FOTO_CAPTIONS_DEFAULT,
  mensagemFrase: "Algumas palavras são grandes demais para serem ditas de qualquer jeito.",
  musicaFrase: "Toda vez que essa música toca, ela conta um pedaço da nossa história.",
  musicaExtra: "E que história linda essa é.",
  finalEmoji: "♥",
  finalTitulo: (a) => `${a}`,
  finalVerbo: "te ama",
  finalFrase: (d) => d && d > 0 ? `${d.toLocaleString("pt-BR")} dias e contando. ♥` : "Hoje e sempre. ♥",
};

function buildSlides(presente: Presente) {
  const dias = presente.dataEspecial ? differenceInDays(new Date(), new Date(presente.dataEspecial)) : null;
  const slides: { type: string; [key: string]: unknown }[] = [];
  slides.push({ type: "cover" });
  if (presente.dataEspecial && dias !== null && dias > 0) slides.push({ type: "dias", dias, data: presente.dataEspecial });
  presente.fotos.slice(0, 10).forEach((foto, i) => slides.push({ type: "foto", foto, index: i, total: Math.min(presente.fotos.length, 10) }));
  slides.push({ type: "mensagem" });
  slides.push({ type: "musica" });
  slides.push({ type: "final" });
  return slides;
}

export default function Wrapped({ presente, onClose }: { presente: Presente; onClose: () => void }) {
  const config = CONFIGS[presente.ocasiao] ?? DEFAULT_CONFIG;
  const slides = buildSlides(presente);
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState<"in" | "out">("in");
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const SLIDE_DURATION = 6000;

  const diasJuntos = presente.dataEspecial ? differenceInDays(new Date(), new Date(presente.dataEspecial)) : null;
  const horas = diasJuntos ? diasJuntos * 24 : null;
  const meses = diasJuntos ? Math.floor(diasJuntos / 30) : null;
  const anos = diasJuntos ? Math.floor(diasJuntos / 365) : null;

  const goTo = useCallback((index: number) => {
    if (index < 0) { onClose(); return; }
    if (index >= slides.length) { onClose(); return; }
    setAnimDir("out");
    setTimeout(() => { setCurrent(index); setProgress(0); setAnimDir("in"); }, 200);
  }, [slides.length, onClose]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setProgress((p) => { if (p >= 100) { goTo(current + 1); return 0; } return p + 100 / (SLIDE_DURATION / 100); });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, paused, goTo]);

  const handleTap = (clientX: number) => {
    if (clientX < window.innerWidth * 0.3) goTo(current - 1);
    else goTo(current + 1);
  };

  const slide = slides[current];
  const gradient = config.gradients[current % config.gradients.length];
  const fotoCaptions = config.fotoCaptions;

  return (
    <div
      className="fixed inset-0 z-50 select-none overflow-hidden"
      onClick={(e) => handleTap(e.clientX)}
      onTouchEnd={(e) => handleTap(e.changedTouches[0].clientX)}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-700`} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.04) 0%, transparent 60%)" }} />

      {/* Barra de progresso */}
      <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 px-3 pt-3">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: i < current ? "100%" : i === current ? `${progress}%` : "0%", transition: "none" }} />
          </div>
        ))}
      </div>

      {/* Fechar */}
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-8 right-4 z-20 text-white/50 hover:text-white text-lg w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
        ✕
      </button>

      {/* Conteúdo */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${animDir === "in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

        {/* ── COVER ── */}
        {slide.type === "cover" && (
          <div className="text-center px-8 max-w-sm mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs text-white/70 uppercase tracking-widest mb-8">
              {config.coverBadge}
            </div>
            <div className="text-7xl mb-6 animate-bounce">{config.coverEmoji}</div>
            <p className="text-white/50 text-sm uppercase tracking-widest mb-3">Um presente especial</p>
            <h1 className="text-5xl font-black text-white mb-2 leading-tight">Para<br />{presente.nomeDestinatario}</h1>
            <p className="text-white/40 text-base mb-8">de {presente.nomeRemetente}</p>
            <div className="w-px h-12 bg-white/20 mx-auto mb-8" />
            <p className="text-white/60 text-base leading-relaxed italic">{config.coverFrase}</p>
            <p className="text-white/25 text-xs mt-10 animate-pulse">Toque para começar →</p>
          </div>
        )}

        {/* ── DIAS ── */}
        {slide.type === "dias" && (
          <div className="text-center px-8 max-w-sm mx-auto w-full">
            <p className="text-white/50 text-xs uppercase tracking-widest mb-6">{config.diasTitulo}</p>
            <div className="text-8xl font-black text-white leading-none mb-2">
              {(slide.dias as number).toLocaleString("pt-BR")}
            </div>
            <p className="text-2xl font-semibold text-white/70 mb-10">{config.diasSufixo}</p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {anos !== null && anos > 0 && (
                <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                  <p className="text-2xl font-black text-white">{anos}</p>
                  <p className="text-white/50 text-xs mt-1">{anos === 1 ? "ano" : "anos"}</p>
                </div>
              )}
              {meses !== null && meses > 0 && (
                <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                  <p className="text-2xl font-black text-white">{meses}</p>
                  <p className="text-white/50 text-xs mt-1">{meses === 1 ? "mês" : "meses"}</p>
                </div>
              )}
              {horas !== null && (
                <div className="bg-white/10 backdrop-blur rounded-2xl p-3 border border-white/10">
                  <p className="text-2xl font-black text-white">{horas.toLocaleString("pt-BR")}</p>
                  <p className="text-white/50 text-xs mt-1">horas</p>
                </div>
              )}
            </div>

            <p className="text-white/70 text-base leading-relaxed italic mb-3">
              {config.diasFrase(presente.nomeRemetente, presente.nomeDestinatario)}
            </p>
            <p className="text-white/40 text-sm leading-relaxed">{config.diasExtra}</p>
          </div>
        )}

        {/* ── FOTO ── */}
        {slide.type === "foto" && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={(slide.foto as Foto).url} alt="" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />
            <div className="absolute top-12 left-0 right-0 text-center px-8">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-xs text-white/60 uppercase tracking-widest">
                {(slide.index as number) + 1} de {slide.total as number}
              </span>
            </div>
            <div className="absolute bottom-16 left-0 right-0 px-8">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-2 text-center">Nossa história</p>
              <p className="text-white font-semibold text-xl text-center leading-snug">
                {fotoCaptions[(slide.index as number) % fotoCaptions.length]}
              </p>
              <div className="flex justify-center mt-4 gap-1">
                {Array.from({ length: slide.total as number }).map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all ${i === (slide.index as number) ? "w-6 bg-white" : "w-1.5 bg-white/30"}`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MENSAGEM ── */}
        {slide.type === "mensagem" && (
          <div className="text-center px-8 max-w-sm mx-auto">
            <div className="text-5xl mb-6">💌</div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Uma mensagem de coração</p>
            <div className="w-12 h-px bg-white/20 mx-auto mb-6" />
            <p className="text-white/50 text-sm italic leading-relaxed mb-8">{config.mensagemFrase}</p>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6">
              <p className="text-white text-lg leading-relaxed font-light">
                &ldquo;{presente.mensagem}&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">♥</div>
                <p className="text-white/60 text-sm font-semibold">{presente.nomeRemetente}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── MÚSICA ── */}
        {slide.type === "musica" && (
          <div className="text-center px-8 max-w-sm mx-auto">
            <div className="text-5xl mb-6">🎵</div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-4">A música de vocês</p>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 mb-6">
              <p className="text-white font-black text-2xl leading-tight mb-2">{presente.musica}</p>
              <div className="flex justify-center items-end gap-0.5 mt-4 h-10">
                {[...Array(28)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-white/60 rounded-full animate-pulse"
                    style={{ height: `${12 + ((i * 11 + 7) % 22)}px`, animationDelay: `${(i * 0.07) % 0.7}s`, animationDuration: `${0.5 + (i % 4) * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
            <p className="text-white/60 text-base leading-relaxed italic mb-3">{config.musicaFrase}</p>
            <p className="text-white/35 text-sm leading-relaxed">{config.musicaExtra}</p>
          </div>
        )}

        {/* ── FINAL ── */}
        {slide.type === "final" && (
          <div className="text-center px-8 max-w-sm mx-auto">
            <div className="text-6xl mb-8">{config.finalEmoji}</div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-6">E então,</p>
            <h2 className="text-4xl font-black text-white mb-2 leading-tight">{config.finalTitulo(presente.nomeRemetente)}</h2>
            <p className="text-3xl font-bold text-white/80 mb-8 leading-tight">{config.finalVerbo}</p>
            <div className="w-12 h-px bg-white/20 mx-auto mb-6" />
            <p className="text-white/50 text-base leading-relaxed mb-10">{config.finalFrase(diasJuntos)}</p>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="bg-white/15 backdrop-blur border border-white/25 text-white font-semibold px-8 py-3 rounded-full text-sm hover:bg-white/25 transition-all"
            >
              Ver presente completo ♥
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
