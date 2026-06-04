"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AberturaProps = {
  /** chamado quando a abertura termina (vídeo acaba, é pulada, ou falha) */
  onComplete: () => void;
};

/**
 * Abertura cinematográfica do fluxo /criar: vídeo (gerado no Google Flow / Veo)
 * de portas ornamentadas se abrindo com luz quente e pétalas de rosa. Ao
 * terminar, revela o fluxo. Toca uma vez (controlado pelo pai).
 * Respeita prefers-reduced-motion e tem fallback se o vídeo não carregar.
 */
export default function AberturaCinematografica({ onComplete }: AberturaProps) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [saindo, setSaindo] = useState(false);
  const finalizado = useRef(false);

  const finalizar = () => {
    if (finalizado.current) return;
    finalizado.current = true;
    setSaindo(true);
    window.setTimeout(onComplete, 600); // deixa o fade-out acontecer
  };

  useEffect(() => {
    if (reduce) {
      onComplete();
      return;
    }
    // Garante autoplay em navegadores que exigem play() explícito
    videoRef.current?.play().catch(() => {});
    // Fallback: se o vídeo não disparar "ended" (erro/codec), segue mesmo assim
    const t = window.setTimeout(finalizar, 12000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  if (reduce) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-hidden bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: saindo ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <video
        ref={videoRef}
        src="/videos/abertura.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finalizar}
        onError={finalizar}
      />

      {/* Vinheta para legibilidade do texto */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 28%, transparent 62%, rgba(0,0,0,0.65) 100%)",
        }}
      />

      {/* Título */}
      <motion.div
        className="absolute top-0 left-0 right-0 pt-12 px-6 text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <p className="text-white/70 text-[11px] uppercase tracking-[0.35em] mb-2">LoveGift</p>
        <h1 className="text-2xl font-black text-white leading-tight max-w-xs mx-auto drop-shadow-lg">
          Vamos montar um presente inesquecível
        </h1>
      </motion.div>

      {/* Pular */}
      <motion.button
        onClick={finalizar}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 hover:text-white text-sm font-semibold px-6 py-2.5 rounded-full"
        style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        whileTap={{ scale: 0.96 }}
      >
        Pular intro →
      </motion.button>
    </motion.div>
  );
}
