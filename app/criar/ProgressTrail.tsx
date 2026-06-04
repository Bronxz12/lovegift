"use client";

import { motion } from "framer-motion";

const STEPS = [
  { img: "/images/icons/icone-carta.png", label: "História" },
  { img: "/images/icons/icone-camera.png", label: "Fotos" },
  { img: "/images/icons/icone-musica.png", label: "Música" },
  { img: "/images/icons/icone-paleta.png", label: "Estilo" },
  { img: "/images/icons/icone-cartao.png", label: "Pagamento" },
  { img: "/images/icons/icone-coroa.png", label: "Premium" },
];

type ProgressTrailProps = {
  /** etapa atual (1-based) */
  etapa: number;
  /** total de etapas visíveis (5 ou 6 com premium) */
  total: number;
};

/**
 * Trilha de progresso "tutorial de jogo": ícones 3D por etapa (gerados no
 * Nano Banana), linha que enche, etapa atual pulsando e luminosa, futuras
 * apagadas. Elegante, sem placar/XP.
 */
export default function ProgressTrail({ etapa, total }: ProgressTrailProps) {
  const steps = STEPS.slice(0, total);
  const pct = total > 1 ? ((etapa - 1) / (total - 1)) * 100 : 0;

  return (
    <div className="px-1 py-2">
      <div className="relative flex items-center justify-between">
        {/* trilho base */}
        <div className="absolute left-0 right-0 top-[19px] h-[2px] bg-white/10 rounded-full" />
        {/* trilho preenchido */}
        <motion.div
          className="absolute left-0 top-[19px] h-[2px] rounded-full"
          style={{ background: "linear-gradient(90deg, #e84393, #ffce5c)" }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {steps.map((step, i) => {
          const n = i + 1;
          const done = n < etapa;
          const current = n === etapa;
          const active = done || current;
          return (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-1">
              <motion.div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 38,
                  height: 38,
                  background: current ? "rgba(232,67,147,0.12)" : "transparent",
                  boxShadow: current ? "0 0 0 4px rgba(232,67,147,0.15)" : "none",
                }}
                animate={current ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={
                  current
                    ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={step.img}
                  alt={step.label}
                  className="w-[30px] h-[30px] object-contain transition-all duration-300"
                  style={{
                    opacity: active ? 1 : 0.35,
                    filter: active
                      ? "drop-shadow(0 2px 6px rgba(232,67,147,0.45))"
                      : "grayscale(0.7)",
                  }}
                />
              </motion.div>
              <span
                className="text-[9px] uppercase tracking-wider hidden sm:block"
                style={{ color: current ? "#ff8fbf" : "rgba(255,255,255,0.35)" }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
