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

/* ─── Live timer que atualiza a cada segundo ─── */
function useLiveTimer(dataEspecial: string | null) {
  const [time, setTime] = useState({ anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0 });
  useEffect(() => {
    if (!dataEspecial) return;
    const update = () => {
      const start = new Date(dataEspecial).getTime();
      const now = Date.now();
      const totalSecs = Math.floor((now - start) / 1000);
      const totalMins = Math.floor(totalSecs / 60);
      const totalHours = Math.floor(totalMins / 60);
      const totalDays = Math.floor(totalHours / 24);
      const anos = Math.floor(totalDays / 365);
      const meses = Math.floor((totalDays - anos * 365) / 30);
      const dias = totalDays - anos * 365 - meses * 30;
      setTime({
        anos,
        meses,
        dias,
        horas: totalHours % 24,
        minutos: totalMins % 60,
        segundos: totalSecs % 60,
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [dataEspecial]);
  return time;
}

/* ─── Count-up animado ─── */
function CountUp({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let current = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      current += step;
      if (current >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(current));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return <>{val.toLocaleString("pt-BR")}</>;
}

/* ─── Partículas flutuantes ─── */
function Particles({ color = "#e84393", count = 10 }: { color?: string; count?: number }) {
  const p = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 4}s`,
      dur: `${3 + Math.random() * 4}s`,
      size: `${3 + Math.random() * 6}px`,
    }))
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {p.current.map((x) => (
        <div key={x.id} className="absolute bottom-0 rounded-full"
          style={{ left: x.left, width: x.size, height: x.size, background: color, opacity: 0,
            animation: `particle-float ${x.dur} ${x.delay} ease-out infinite`, filter: "blur(1px)" }} />
      ))}
    </div>
  );
}

/* ─── Bandas coloridas com número gigante ─── */
function ColorBands({ target }: { target: number }) {
  const [phase, setPhase] = useState(0); // 0=bands, 1=clean
  const numStr = target.toLocaleString("pt-BR");

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2200);
    return () => clearTimeout(t);
  }, []);

  const bands = [
    { bg: "#FF6B35", text: "#000" },
    { bg: "#2ECC71", text: "#000" },
    { bg: "#E84393", text: "#fff" },
    { bg: "#F5C518", text: "#000" },
  ];

  if (phase === 0) {
    return (
      <div className="w-full">
        {bands.map((b, i) => (
          <div key={i} className="flex items-center justify-center py-4 w-full"
            style={{ background: b.bg, animation: `slide-up 0.3s ${i * 0.07}s cubic-bezier(0.22,1,0.36,1) both` }}>
            <span className="font-black tabular-nums" style={{ fontSize: "clamp(3rem,14vw,5rem)", color: b.text, lineHeight: 1 }}>
              {numStr}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="text-center px-8 w-full" style={{ animation: "scale-in 0.5s ease both" }}>
      <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Horas juntos</p>
      <p className="font-black tabular-nums leading-none"
        style={{ fontSize: "clamp(4rem,20vw,7rem)", color: "#e84393",
          filter: "drop-shadow(0 0 40px #e8439366)" }}>
        {numStr}
      </p>
      <p className="text-white/40 text-sm mt-4">apenas 12% dos casais chegam a este momento ✨</p>
    </div>
  );
}

/* ─── Captions das fotos ─── */
const PHOTO_SLIDES = [
  { title: "Saudades de momentos 😩", sub: "Muitos momentos bons que queríamos que fossem eternos infelizmente passam, e nós restam só as lembranças 🤍" },
  { title: "Que casal lindo! 😍", sub: "(só isso mesmo)" },
  { title: "Uma memória especial ✨", sub: "Guardada para sempre no coração" },
  { title: "Momentos como esse... 💫", sub: "São os que a gente nunca esquece" },
  { title: "Aqui nesse registro 📸", sub: "Uma parte da nossa história" },
  { title: "Eternizando 💖", sub: "Porque alguns momentos precisam durar pra sempre" },
  { title: "Juntos 🥰", sub: "Cada segundo ao seu lado faz sentido" },
  { title: "Nossa história em fotos 🎞️", sub: "Cada imagem vale mais que mil palavras" },
  { title: "Olha essa aqui! 😭", sub: "Esse momento ficou guardado pra sempre" },
  { title: "Sem palavras 💗", sub: "A foto fala por si só" },
];

/* ─── Monta slides ─── */
function buildSlides(presente: Presente) {
  const slides: { type: string; [key: string]: unknown }[] = [];
  const dias = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;

  slides.push({ type: "cover" });
  if (presente.musica) slides.push({ type: "musica" });
  if (presente.dataEspecial) slides.push({ type: "sobre" });
  if (dias && dias > 0) slides.push({ type: "horas", horas: dias * 24 });
  presente.fotos.slice(0, 8).forEach((foto, i) =>
    slides.push({ type: "foto", foto, index: i, total: Math.min(presente.fotos.length, 8) })
  );
  slides.push({ type: "mensagem" });
  slides.push({ type: "resumo" });
  return slides;
}

/* ════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════ */
export default function Wrapped({ presente, onClose }: { presente: Presente; onClose: () => void }) {
  const slides = buildSlides(presente);
  const liveTimer = useLiveTimer(presente.dataEspecial);
  const diasJuntos = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;
  const glow = "#e84393";

  const [current, setCurrent] = useState(0);
  const [entering, setEntering] = useState(true);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [key, setKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 8000;

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= slides.length) { onClose(); return; }
    setEntering(false);
    setTimeout(() => {
      setCurrent(idx);
      setProgress(0);
      setKey(k => k + 1);
      setEntering(true);
    }, 220);
  }, [slides.length, onClose]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { goTo(current + 1); return 0; }
        return p + 100 / (DURATION / 100);
      });
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, paused, goTo]);

  const handleTap = (clientX: number) => {
    if (clientX < window.innerWidth * 0.3) goTo(current - 1);
    else goTo(current + 1);
  };

  const slide = slides[current];

  return (
    <div className="fixed inset-0 z-50 select-none overflow-hidden bg-black"
      onClick={e => handleTap(e.clientX)}
      onTouchEnd={e => handleTap(e.changedTouches[0].clientX)}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      {/* ── Progress bars ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-3 pt-3">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/20">
            <div className="h-full rounded-full bg-white transition-none"
              style={{ width: i < current ? "100%" : i === current ? `${progress}%` : "0%" }} />
          </div>
        ))}
      </div>

      {/* ── Fechar ── */}
      <button onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-8 right-4 z-30 w-8 h-8 flex items-center justify-center rounded-full text-white/60 hover:text-white"
        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
        ✕
      </button>

      {/* ── Conteúdo animado ── */}
      <div key={key} className="absolute inset-0"
        style={{
          opacity: entering ? 1 : 0,
          transform: entering ? "scale(1) translateY(0)" : "scale(0.97) translateY(10px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
        }}>

        {/* ════ COVER ════ */}
        {slide.type === "cover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #200020 60%, #0a0a0a 100%)" }}>
            <Particles color={glow} count={14} />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold uppercase tracking-widest text-white"
              style={{ background: glow, animation: "slide-up 0.4s ease both" }}>
              ♥ Wrapped
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-black text-white leading-tight mb-4"
              style={{ animation: "slide-up 0.5s 0.1s ease both" }}>
              {presente.nomeRemetente} separou um{" "}
              <span style={{ color: glow }}>presente</span> especial!
            </h1>

            <p className="text-white/50 text-sm leading-relaxed mb-10"
              style={{ animation: "slide-up 0.5s 0.2s ease both" }}>
              Um momento único feito com carinho<br />para celebrar a jornada de vocês
            </p>

            {/* CTA */}
            <button onClick={e => { e.stopPropagation(); goTo(1); }}
              className="font-bold px-8 py-3.5 rounded-full text-base text-white"
              style={{ background: glow, boxShadow: `0 8px 32px ${glow}66`, animation: "slide-up 0.5s 0.3s ease both" }}>
              Ver Presente →
            </button>

            <p className="text-white/20 text-xs mt-8" style={{ animation: "slide-up 0.5s 0.5s ease both" }}>
              ou toque para avançar
            </p>
          </div>
        )}

        {/* ════ MÚSICA ════ */}
        {slide.type === "musica" && (
          <div className="absolute inset-0 flex flex-col"
            style={{ background: "linear-gradient(180deg, #0f0010 0%, #1a0020 100%)" }}>
            {/* Título no topo */}
            <div className="pt-14 px-5 pb-3 text-center" style={{ animation: "slide-up 0.4s ease both" }}>
              <p className="text-white text-base font-bold">Uma retrospectiva do nosso amor 🥰🥰🥰</p>
            </div>

            {/* Foto de capa */}
            {presente.fotos[0] && (
              <div className="mx-5 rounded-2xl overflow-hidden" style={{ height: "220px", flexShrink: 0, animation: "scale-in 0.4s 0.1s ease both" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={presente.fotos[0].url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
              </div>
            )}

            {/* Card música — estilo Spotify */}
            <div className="mx-5 mt-3 rounded-2xl p-4 flex-shrink-0"
              style={{ background: "#1a0020", border: `1px solid ${glow}30`, animation: "slide-up 0.5s 0.2s ease both" }}>
              <div className="flex items-center gap-3 mb-3">
                {/* Thumb */}
                <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
                  style={{ background: `linear-gradient(135deg, ${glow}44, ${glow}22)`, border: `1px solid ${glow}30` }}>
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{presente.musica}</p>
                  <p className="text-white/40 text-xs mt-0.5">A música de vocês</p>
                </div>
                {/* Play */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: glow }}>
                  <span className="text-white ml-0.5">▶</span>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="h-1 rounded-full bg-white/10 mb-1">
                <div className="h-full rounded-full w-2/5" style={{ background: glow }} />
              </div>
              <div className="flex justify-between text-white/30 text-xs mb-3">
                <span>1:24</span><span>-2:17</span>
              </div>

              {/* Equalizador */}
              <div className="flex justify-center items-end gap-0.5 h-8">
                {[...Array(26)].map((_, i) => {
                  const h = 6 + ((i * 13 + 3) % 22);
                  return (
                    <div key={i} className="rounded-full" style={{
                      width: "3px", height: `${h}px`,
                      background: `linear-gradient(to top, ${glow}, ${glow}55)`,
                      transformOrigin: "bottom",
                      animation: `bar-dance ${0.4 + (i % 5) * 0.12}s ${(i * 0.05) % 0.5}s ease-in-out infinite`,
                    }} />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════ SOBRE O CASAL ════ */}
        {slide.type === "sobre" && (
          <div className="absolute inset-0 flex flex-col"
            style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #111 100%)" }}>
            {/* Título */}
            <div className="pt-14 px-5 text-center" style={{ animation: "slide-up 0.4s ease both" }}>
              <p className="text-white text-base font-bold">Sobre o casal</p>
            </div>

            {/* Foto */}
            {presente.fotos[0] && (
              <div className="mx-5 mt-3 rounded-2xl overflow-hidden flex-shrink-0" style={{ height: "190px", animation: "scale-in 0.4s 0.1s ease both" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={presente.fotos[0].url} alt="" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Nomes + contador */}
            <div className="mx-5 mt-3 rounded-2xl p-4"
              style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.07)", animation: "slide-up 0.5s 0.2s ease both" }}>
              <p className="text-white text-xl font-black">
                {presente.nomeRemetente} e {presente.nomeDestinatario}
              </p>
              {presente.dataEspecial && (
                <p className="text-white/40 text-xs mt-1">
                  Juntos desde {new Date(presente.dataEspecial).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </p>
              )}

              {/* Grid 3×2 */}
              <div className="grid grid-cols-3 gap-1.5 mt-4">
                {[
                  { v: liveTimer.anos, l: "Anos" },
                  { v: liveTimer.meses, l: "Meses" },
                  { v: liveTimer.dias, l: "Dias" },
                  { v: liveTimer.horas, l: "Horas" },
                  { v: liveTimer.minutos, l: "Minutos" },
                  { v: liveTimer.segundos, l: "Segundos" },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl py-2.5 text-center"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-2xl font-black text-white tabular-nums leading-none">
                      {String(item.v).padStart(2, "0")}
                    </p>
                    <p className="text-white/35 text-xs mt-1">{item.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ HORAS (bandas coloridas) ════ */}
        {slide.type === "horas" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: "#000" }}>
            <Particles color={glow} count={6} />
            <ColorBands target={slide.horas as number} />
          </div>
        )}

        {/* ════ FOTO ════ */}
        {slide.type === "foto" && (
          <div className="absolute inset-0 flex flex-col" style={{ background: "#0a0a0a" }}>
            {/* Título NO TOPO */}
            <div className="pt-14 px-5 pb-3 flex-shrink-0 text-center" style={{ animation: "slide-up 0.4s ease both" }}>
              <p className="text-white text-lg font-bold">
                {PHOTO_SLIDES[(slide.index as number) % PHOTO_SLIDES.length].title}
              </p>
              <p className="text-white/45 text-xs mt-1 leading-snug px-4">
                {PHOTO_SLIDES[(slide.index as number) % PHOTO_SLIDES.length].sub}
              </p>
            </div>

            {/* Foto card arredondada — full height restante */}
            <div className="flex-1 mx-5 mb-8 rounded-3xl overflow-hidden relative"
              style={{ animation: "scale-in 0.4s 0.1s ease both" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={(slide.foto as Foto).url} alt=""
                className="w-full h-full object-cover animate-ken-burns" />

              {/* Dots */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
                {Array.from({ length: slide.total as number }).map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-300"
                    style={{
                      width: i === (slide.index as number) ? "20px" : "5px",
                      height: "5px",
                      background: i === (slide.index as number) ? glow : "rgba(255,255,255,0.35)",
                    }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ MENSAGEM ════ */}
        {slide.type === "mensagem" && (
          <div className="absolute inset-0 flex flex-col px-5"
            style={{ background: "linear-gradient(180deg, #0a0a0a 0%, #1a0010 100%)" }}>
            <Particles color={glow} count={8} />

            <div className="pt-14 pb-4 text-center" style={{ animation: "slide-up 0.4s ease both" }}>
              <p className="text-white text-base font-bold">Mensagem especial 💌</p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="rounded-3xl p-6"
                style={{
                  background: `${glow}0e`,
                  border: `1px solid ${glow}30`,
                  boxShadow: `0 0 60px ${glow}15`,
                  animation: "slide-up 0.5s 0.15s ease both",
                }}>
                <div className="text-5xl font-black mb-3 leading-none" style={{ color: `${glow}25` }}>&ldquo;</div>
                <p className="text-white text-base leading-relaxed">{presente.mensagem}</p>
                <div className="mt-5 pt-4 flex items-center gap-2.5" style={{ borderTop: `1px solid ${glow}20` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                    style={{ background: glow }}>
                    {presente.nomeRemetente[0].toUpperCase()}
                  </div>
                  <p className="text-white/70 text-sm font-semibold">{presente.nomeRemetente}</p>
                  <span className="text-white/20 text-xs ml-auto">com amor ♥</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════ RESUMO — "Wrapped do Casal" ════ */}
        {slide.type === "resumo" && (
          <div className="absolute inset-0 overflow-y-auto" onClick={e => e.stopPropagation()}
            style={{ background: "#0a0a0a" }}>
            <Particles color={glow} count={10} />

            <div className="px-5 pt-14 pb-10">
              {/* Badge */}
              <div className="flex justify-center mb-5" style={{ animation: "slide-up 0.4s ease both" }}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  WRAPPED DO CASAL
                </div>
              </div>

              {/* Foto circular */}
              {presente.fotos[0] && (
                <div className="flex justify-center mb-4" style={{ animation: "scale-in 0.5s 0.1s ease both" }}>
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 flex-shrink-0"
                    style={{ borderColor: glow, boxShadow: `0 0 30px ${glow}66` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={presente.fotos[0].url} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              {/* Nossa Conexão */}
              <div className="text-center mb-5" style={{ animation: "slide-up 0.5s 0.2s ease both" }}>
                <p className="text-white/35 text-xs uppercase tracking-widest">Nossa Conexão</p>
                <h2 className="text-3xl font-black text-white mt-1">
                  {presente.nomeRemetente}{" "}
                  <span className="text-white/25">&</span>{" "}
                  {presente.nomeDestinatario}
                </h2>
              </div>

              {/* Card de stats */}
              <div className="rounded-2xl overflow-hidden"
                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", animation: "slide-up 0.5s 0.3s ease both" }}>

                {/* Ocasião */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: `${glow}22` }}>💑</div>
                  <div>
                    <p className="text-white/35 text-xs uppercase tracking-wider">Ocasião</p>
                    <p className="text-white font-semibold text-sm mt-0.5">{presente.ocasiao}</p>
                  </div>
                </div>

                {/* Música */}
                {presente.musica && (
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: `${glow}22` }}>🎵</div>
                    <div className="min-w-0">
                      <p className="text-white/35 text-xs uppercase tracking-wider">Música de vocês</p>
                      <p className="text-white font-semibold text-sm mt-0.5 truncate">{presente.musica}</p>
                    </div>
                  </div>
                )}

                {/* Data especial */}
                {presente.dataEspecial && (
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: `${glow}22` }}>📅</div>
                    <div>
                      <p className="text-white/35 text-xs uppercase tracking-wider">Data Especial</p>
                      <p className="text-white font-semibold text-sm mt-0.5">
                        {new Date(presente.dataEspecial).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Total dias */}
                {diasJuntos && diasJuntos > 0 && (
                  <div className="px-5 py-5">
                    <p className="text-white/35 text-xs uppercase tracking-wider mb-2">Total de dias juntos</p>
                    <p className="font-black tabular-nums" style={{ fontSize: "clamp(3rem,14vw,5rem)", color: glow, lineHeight: 1 }}>
                      <CountUp target={diasJuntos} />
                    </p>
                    <p className="text-white/25 text-xs mt-1">dias</p>
                    <p className="text-white/30 text-xs mt-2">
                      = {(diasJuntos * 24).toLocaleString("pt-BR")} horas de amor ✨
                    </p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-8 text-center" style={{ animation: "slide-up 0.5s 0.5s ease both" }}>
                <button onClick={e => { e.stopPropagation(); onClose(); }}
                  className="font-bold px-8 py-3.5 rounded-full text-base text-white"
                  style={{ background: glow, boxShadow: `0 8px 32px ${glow}66` }}>
                  Ver presente completo ♥
                </button>
                <p className="text-white/20 text-xs mt-4">Toque nas laterais para navegar</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
