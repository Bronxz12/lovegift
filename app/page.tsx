"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";


const depoimentos = [
  { nome: "Lucas R.", texto: "Minha mãe chorou do começo ao fim. Ela disse que foi o presente mais bonito que já recebeu na vida.", avatar: "LR", cor: "bg-pink-600" },
  { nome: "Camila F.", texto: "Ela ligou me agradecendo por 20 minutos. Nunca vi minha mãe tão emocionada. Valeu muito mais que o preço!", avatar: "CF", cor: "bg-purple-600" },
  { nome: "Rodrigo M.", texto: "Fiz para minha mãe no Dia das Mães. Ela assistiu 3 vezes e compartilhou com toda a família. Perfeito!", avatar: "RM", cor: "bg-rose-600" },
  { nome: "Fernanda S.", texto: "Precisava de algo especial para minha mãe. Em 5 minutos ficou incrível. Ela amou cada foto!", avatar: "FS", cor: "bg-fuchsia-600" },
  { nome: "Bruno T.", texto: "Coloquei a música favorita da minha mãe e ela chorou na hora que abriu. Melhor presente que já dei.", avatar: "BT", cor: "bg-pink-500" },
  { nome: "Isabela P.", texto: "Minha mãe mora longe e esse presente fez ela sentir que eu estava do lado dela. Muito obrigada!", avatar: "IP", cor: "bg-purple-500" },
  { nome: "Diego A.", texto: "Interface super fácil. Em minutos criei algo que minha mãe vai guardar para sempre.", avatar: "DA", cor: "bg-rose-500" },
  { nome: "Mariana K.", texto: "Fiz para minha avó também! As duas choraram juntas assistindo. Vale cada centavo.", avatar: "MK", cor: "bg-fuchsia-500" },
];

const faqs = [
  { q: "Quanto tempo leva para criar?", r: "Menos de 5 minutos! O processo é todo guiado e intuitivo. Você preenche os dados, sobe as fotos e pronto." },
  { q: "O presente fica disponível para sempre?", r: "Sim! O link e QR Code ficam ativos permanentemente. Você pode acessar quando quiser, em qualquer dispositivo." },
  { q: "Posso editar depois de criar?", r: "No momento o presente é gerado de forma definitiva. Em breve teremos opção de edição disponível." },
  { q: "Como funciona o QR Code?", r: "Ao finalizar, você recebe um QR Code único que, ao ser escaneado, abre diretamente a página do presente." },
  { q: "Precisa de cadastro para receber o presente?", r: "Não! Quem recebe o link ou QR Code acessa o presente sem precisar criar conta ou instalar nada." },
  { q: "Quais formas de pagamento?", r: "Aceitamos cartão de crédito, débito e Pix. O acesso é liberado imediatamente após a confirmação." },
  { q: "E se eu não ficar satisfeito?", r: "Garantia de 7 dias. Se não ficar satisfeito com o resultado, devolvemos 100% do seu dinheiro sem perguntas." },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 }); return; }
      const dias = Math.floor(diff / 86400000);
      const horas = Math.floor((diff % 86400000) / 3600000);
      const minutos = Math.floor((diff % 3600000) / 60000);
      const segundos = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ dias, horas, minutos, segundos });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return timeLeft;
}

export default function Home() {
  const [faqAberto, setFaqAberto] = useState<number | null>(null);
  const diasMaes = useRef(new Date("2026-05-10T00:00:00")).current;
  const countdown = useCountdown(diasMaes);

  return (
    <div className="min-h-screen bg-[#0d0008] text-white overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="sticky top-0 left-0 right-0 z-50 bg-[#0d0008]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo redesenhado */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #e84393, #c0306f)", boxShadow: "0 4px 12px rgba(232,67,147,0.4)" }}>
              🌸
            </div>
            <span className="text-xl font-black tracking-tight">
              <span style={{ background: "linear-gradient(135deg, #e84393, #ff6eb4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Love</span>
              <span className="text-white">Gift</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <Link href="/criar"
            className="text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #e84393, #c0306f)", boxShadow: "0 4px 16px rgba(232,67,147,0.35)" }}>
            Criar presente →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[92vh] flex flex-col items-center justify-center px-4 py-16 text-center">

        {/* Fundo com gradiente rico */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 90% 65% at 50% -5%, rgba(232,67,147,0.28) 0%, transparent 68%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(160,20,80,0.18) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 10% 70%, rgba(200,40,100,0.12) 0%, transparent 60%), #0d0008" }} />

        {/* Pétalas decorativas flutuando */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: "8%", left: "6%", size: "2rem", delay: "0s", dur: "6s" },
            { top: "15%", left: "88%", size: "1.4rem", delay: "1s", dur: "7s" },
            { top: "35%", left: "3%", size: "1.2rem", delay: "2s", dur: "8s" },
            { top: "60%", left: "92%", size: "1.6rem", delay: "0.5s", dur: "9s" },
            { top: "75%", left: "8%", size: "1rem", delay: "3s", dur: "6s" },
            { top: "20%", left: "50%", size: "0.9rem", delay: "1.5s", dur: "7s" },
          ].map((p, i) => (
            <div key={i} className="absolute opacity-20 select-none"
              style={{
                top: p.top, left: p.left, fontSize: p.size,
                animation: `particle-float ${p.dur} ${p.delay} ease-in-out infinite`,
              }}>🌸</div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative z-10">

          {/* Pill de contagem regressiva */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur rounded-full px-5 py-2.5 mb-10">
            <span className="text-sm">🌸</span>
            <span className="text-white/60 text-sm">Dia das Mães em</span>
            <div className="flex items-center gap-1.5">
              {[
                { v: countdown.dias, l: "d" },
                { v: countdown.horas, l: "h" },
                { v: countdown.minutos, l: "m" },
                { v: countdown.segundos, l: "s" },
              ].map((item, i) => (
                <span key={i} className="flex items-baseline gap-0.5">
                  <span className="font-black text-white tabular-nums" style={{ minWidth: "1.5ch" }}>
                    {String(item.v).padStart(2, "0")}
                  </span>
                  <span className="text-white/35 text-xs">{item.l}</span>
                  {i < 3 && <span className="text-white/20 text-xs ml-0.5">·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Headline principal */}
          <h1 className="text-5xl md:text-7xl font-black mb-7 leading-[1.05] tracking-tight">
            O presente que vai<br />
            <span style={{ background: "linear-gradient(135deg, #ff80be 0%, #e84393 45%, #c0306f 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              fazer sua mãe chorar.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-2 max-w-xl mx-auto leading-relaxed">
            Uma retrospectiva animada com as fotos, a música e a mensagem
            que ela vai guardar para sempre no coração.
          </p>
          <p className="text-sm text-white/25 mb-10">Pronto em 5 minutos · Pagamento único R$ 9,90</p>

          {/* CTA */}
          <Link href="/criar"
            className="inline-flex items-center gap-2 text-white text-base font-black px-10 py-4.5 rounded-full transition-all hover:scale-105 mb-3 py-4"
            style={{ background: "linear-gradient(135deg, #e84393 0%, #c0306f 100%)", boxShadow: "0 16px 56px rgba(232,67,147,0.45)" }}>
            🌸 Criar presente para minha mãe →
          </Link>

          <p className="text-white/20 text-xs mb-14">🔒 Pix · Cartão · Boleto · Acesso imediato após pagamento</p>


          {/* Preview do "celular" com Wrapped mockup */}
          <div className="flex justify-center gap-6 items-end">
            {/* Tela do presente */}
            <div className="relative w-52 h-[440px] bg-[#0d0d0d] rounded-[2.5rem] border-2 border-white/10 shadow-2xl overflow-hidden hidden sm:block">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#0d0008] rounded-full" />
              <div className="h-full flex flex-col pt-10">
                <div className="flex-1 flex flex-col items-center justify-center px-5 pb-6">
                  <div className="text-[#e84393] text-5xl mb-3" style={{ filter: "drop-shadow(0 0 20px rgba(232,67,147,0.6))" }}>♥</div>
                  <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Para</p>
                  <p className="text-white font-black text-2xl mb-1">Mamãe 🌸</p>
                  <p className="text-white/30 text-xs mb-5">Com amor de Lucas ♥</p>
                  <div className="grid grid-cols-2 gap-1.5 w-full mb-4">
                    {[["📸","5 fotos"],["🎵","Sua música"],["💌","Mensagem"],["🌸","Dia das Mães"]].map(([icon, label], i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-2 text-center">
                        <div className="text-lg mb-0.5">{icon}</div>
                        <div className="text-white/40 text-[9px]">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full bg-[#e84393] rounded-xl p-2.5 text-center">
                    <p className="text-white text-[10px] font-bold">▶ Ver nossa história</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tela do Wrapped */}
            <div className="relative w-56 h-[480px] overflow-hidden rounded-[2.5rem] border-2 border-white/10 shadow-2xl"
              style={{ background: "linear-gradient(135deg, #4a0020 0%, #6b021a 50%, #3d0015 100%)" }}>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#0a0a0a]/50 rounded-full" />
              {/* Progress bar */}
              <div className="absolute top-10 left-4 right-4 flex gap-1">
                {[100, 100, 45, 0, 0, 0].map((p, i) => (
                  <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: `${p}%` }} />
                  </div>
                ))}
              </div>
              <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                <div className="text-4xl mb-3 animate-bounce">♥</div>
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Dia das Mães 🌸</p>
                <div className="text-5xl font-black text-white leading-none mb-1">9.490</div>
                <p className="text-white/50 text-xs mb-5">dias de amor e gratidão</p>
                <div className="grid grid-cols-3 gap-1.5 w-full mb-5">
                  {[["26","anos"],["312","meses"],["227k","horas"]].map(([n, l], i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-2">
                      <p className="text-white font-black text-sm">{n}</p>
                      <p className="text-white/40 text-[9px]">{l}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/60 text-xs italic leading-tight">&ldquo;Obrigado por ser meu lar, minha força e meu maior amor.&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARROSSEL depoimentos */}
      <section className="py-10 overflow-hidden border-y border-white/5">
        <div className="flex animate-scroll" style={{width: "max-content"}}>
          {[...depoimentos, ...depoimentos].map((d, i) => (
            <div key={i} className="inline-flex items-center gap-3 bg-white/5 rounded-2xl px-5 py-4 mx-2.5 w-72 flex-shrink-0 border border-white/5">
              <div className={`w-10 h-10 rounded-full ${d.cor} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                {d.avatar}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold">{d.nome}</p>
                  <p className="text-[#e84393] text-xs">★★★★★</p>
                </div>
                <p className="text-xs text-white/50 line-clamp-2">{d.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#e84393] text-sm uppercase tracking-widest font-semibold mb-3">Simples assim</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Do zero ao presente<br />em 5 minutos</h2>
            <p className="text-white/40 text-lg">Sem precisar de design, sem instalar nada</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { num: "01", icon: "✍️", title: "Conta a história", desc: "Seu nome, o nome da sua mãe, a data especial e uma mensagem do coração" },
              { num: "02", icon: "📸", title: "Adiciona as fotos", desc: "Até 10 fotos que vão virar slides animados — momentos que valem para sempre" },
              { num: "03", icon: "🎵", title: "Escolhe a música", desc: "A música favorita dela vai tocar enquanto o presente é aberto. Lágrimas garantidas" },
              { num: "04", icon: "🌸", title: "Envia e emociona", desc: "Link + QR Code na hora. Pode enviar pelo WhatsApp ou imprimir e entregar pessoalmente" },
            ].map((step, i) => (
              <div key={i} className="relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-[#e84393]/30 transition-all hover:bg-white/5">
                <div className="text-[#e84393]/20 text-5xl font-black mb-4 leading-none">{step.num}</div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold mb-2 text-lg">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-white/20 text-xl z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES — O que está incluído */}
      <section className="py-24 px-4 bg-[#180010]/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#e84393] text-sm uppercase tracking-widest font-semibold mb-3">Tudo incluso</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Cada detalhe pensado<br />para emocionar sua mãe</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎬",
                badge: "Exclusivo",
                title: "Retrospectiva animada",
                desc: "As fotos de vocês ganham vida numa sequência cinematográfica estilo Spotify Wrapped. Cada imagem com música, transição e texto. A reação da sua mãe é inevitável.",
              },
              {
                icon: "💌",
                badge: "Personalizado",
                title: "Mensagem do coração",
                desc: "Escreva tudo que você sente pela sua mãe — sem limitação. A mensagem aparece num card elegante no presente. Palavras que ela vai reler muitas vezes.",
              },
              {
                icon: "🎵",
                badge: "Trilha sonora",
                title: "A música favorita dela",
                desc: "Escolha a música que sua mãe ama. Ela toca enquanto o presente é explorado, criando uma experiência que mistura emoção visual e sonora ao mesmo tempo.",
              },
              {
                icon: "📊",
                badge: "Dados reais",
                title: "Estatísticas do amor",
                desc: "Dias, meses, anos e horas de amor — tudo calculado automaticamente. Números que traduzem o tamanho do que ela representa na sua vida.",
              },
              {
                icon: "🔗",
                badge: "Para sempre",
                title: "Link permanente + QR Code",
                desc: "Envie pelo WhatsApp, Instagram ou e-mail. Ou imprima o QR Code e entregue pessoalmente. O presente fica ativo para sempre — ela pode abrir quando quiser.",
              },
              {
                icon: "🌸",
                badge: "Dia das Mães",
                title: "Tema especial de Mães",
                desc: "Tema exclusivo criado para o Dia das Mães. Cores, textos e animações pensados para tornar esse presente único e inesquecível para ela.",
              },
            ].map((f, i) => (
              <div key={i} className="bg-[#130009] border border-white/8 rounded-2xl p-6 hover:border-[#e84393]/20 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{f.icon}</div>
                  <span className="text-[10px] font-bold text-[#e84393] bg-[#e84393]/10 border border-[#e84393]/20 rounded-full px-2.5 py-1 uppercase tracking-wider">{f.badge}</span>
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="border border-green-500/20 rounded-3xl p-8 text-center" style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.05) 0%, rgba(22,163,74,0.03) 100%)" }}>
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-2xl font-black mb-3 text-green-400">Garantia de 7 dias</h3>
            <p className="text-white/50 text-base leading-relaxed max-w-lg mx-auto">
              Se por qualquer motivo você não ficar satisfeito com o seu presente, devolvemos <strong className="text-white">100% do seu dinheiro</strong> dentro de 7 dias — sem burocracia, sem perguntas.
            </p>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS GRID */}
      <section className="py-24 px-4 bg-[#180010]/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#e84393] text-sm uppercase tracking-widest font-semibold mb-3">Histórias reais</p>
            <h2 className="text-4xl font-black mb-3">Quem deu, se emocionou.</h2>
            <p className="text-white/40">E as mães que receberam, nunca vão esquecer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {depoimentos.slice(0, 6).map((d, i) => (
              <div key={i} className="bg-[#130009] rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, j) => <span key={j} className="text-[#e84393] text-sm">★</span>)}
                </div>
                <p className="text-sm text-white/70 italic leading-relaxed mb-5">&ldquo;{d.texto}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className={`w-9 h-9 rounded-full ${d.cor} flex items-center justify-center text-xs font-bold`}>
                    {d.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{d.nome}</p>
                    <p className="text-xs text-white/25">há {(i + 1) * 3} dias</p>
                  </div>
                  <div className="ml-auto text-green-400 text-xs font-semibold">✓ Verificado</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section id="precos" className="py-24 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-[#e84393] text-sm uppercase tracking-widest font-semibold mb-3">Preço</p>
          <h2 className="text-4xl font-black mb-3">Menos que um buquê.<br />Vale muito mais.</h2>
          <p className="text-white/40 mb-12">Pagamento único. Sem assinatura. Sem surpresas.</p>

          <div className="rounded-3xl p-8 border border-[#e84393]/30 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(232,67,147,0.1) 0%, #130009 60%)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(232,67,147,0.1) 0%, transparent 60%)" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-white text-xs font-black px-4 py-1.5 rounded-full mb-6"
                style={{ background: "linear-gradient(135deg, #e84393, #c0306f)" }}>
                ✦ OFERTA POR TEMPO LIMITADO
              </div>
              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="text-white/25 line-through text-2xl">R$ 29,90</span>
                <span className="bg-[#e84393]/20 text-[#e84393] text-sm font-black px-2.5 py-1 rounded-full border border-[#e84393]/30">-66%</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-2xl text-white/60 font-bold">R$</span>
                <span className="text-7xl font-black" style={{ background: "linear-gradient(135deg, #e84393, #ff6eb4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>9</span>
                <span className="text-3xl text-white/50 font-bold">,90</span>
              </div>
              <p className="text-white/30 text-sm mb-8">pagamento único · sem mensalidade</p>

              <ul className="text-left space-y-3 mb-8">
                {[
                  "Retrospectiva animada estilo Wrapped",
                  "Até 10 fotos personalizadas",
                  "Música favorita dela integrada",
                  "Mensagem especial no coração do presente",
                  "Estatísticas dos anos de amor",
                  "Link permanente + QR Code exclusivo",
                  "Tema especial Dia das Mães 🌸",
                  "🛡️ Garantia de 7 dias",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/75">
                    <span className="text-[#e84393] font-bold text-base flex-shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>

              <Link href="/criar"
                className="block w-full text-white font-black py-4.5 rounded-2xl text-lg transition-all hover:scale-105 py-4"
                style={{ background: "linear-gradient(135deg, #e84393 0%, #c0306f 100%)", boxShadow: "0 12px 36px rgba(232,67,147,0.4)" }}>
                Criar meu presente agora →
              </Link>
              <p className="text-white/20 text-xs mt-4 text-center">🔒 Pix, Cartão ou Boleto · Processado pelo Mercado Pago</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 bg-[#180010]/60">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#e84393] text-sm uppercase tracking-widest font-semibold mb-3">Dúvidas</p>
            <h2 className="text-4xl font-black mb-4">Perguntas frequentes</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#130009] rounded-2xl border border-white/8 overflow-hidden">
                <button
                  onClick={() => setFaqAberto(faqAberto === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold hover:bg-white/[0.03] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  <span className={`text-[#e84393] text-xl transition-transform duration-200 flex-shrink-0 ${faqAberto === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {faqAberto === i && (
                  <div className="px-6 pb-5 text-white/55 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-28 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(232,67,147,0.1) 0%, transparent 65%)" }} />
        <div className="max-w-2xl mx-auto relative">
          <div className="text-7xl mb-8 animate-pulse-heart" style={{ filter: "drop-shadow(0 0 30px rgba(232,67,147,0.5))" }}>♥</div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Qual vai ser a reação<br />da sua mãe? 🌸
          </h2>
          <p className="text-white/45 mb-4 text-lg">Ela merece um presente que vá além do buquê. Crie agora em 5 minutos.</p>
          <p className="text-[#e84393] font-bold mb-10 text-base">Por apenas R$ 9,90 — pagamento único, acesso permanente.</p>
          <Link href="/criar"
            className="inline-block text-white text-xl font-black px-14 py-5 rounded-full transition-all hover:scale-105 mb-5"
            style={{ background: "linear-gradient(135deg, #e84393 0%, #c0306f 100%)", boxShadow: "0 16px 56px rgba(232,67,147,0.45)" }}>
            Criar meu presente agora →
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-5 text-white/25 text-xs">
            <span>🔒 Pagamento seguro</span>
            <span>⚡ Acesso imediato</span>
            <span>♾️ Link permanente</span>
            <span>🛡️ Garantia de 7 dias</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/25">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
              style={{ background: "linear-gradient(135deg, #e84393, #c0306f)" }}>🌸</div>
            <span className="font-black">
              <span style={{ background: "linear-gradient(135deg, #e84393, #ff6eb4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Love</span>
              <span className="text-white">Gift</span>
            </span>
          </Link>
          <div className="flex gap-6">
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <p>© 2025 LoveGift. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
