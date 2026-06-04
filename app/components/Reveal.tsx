"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** atraso em segundos antes de revelar */
  delay?: number;
  /** distância em px que o conteúdo sobe ao revelar */
  y?: number;
  className?: string;
};

/**
 * Revela o conteúdo com fade + slide-up quando entra na viewport.
 * Anima apenas uma vez. Respeita prefers-reduced-motion (entra estático).
 */
export default function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
