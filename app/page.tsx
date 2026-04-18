"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const depoimentos = [
  { nome: "João S.", texto: "Ela disse que foi o melhor presente que já ganhou na vida! Valeu cada centavo.", avatar: "JS", cor: "bg-pink-600" },
  { nome: "Carla M.", texto: "A reação dele não teve preço, superou tudo que eu imaginava. Chorou muito!", avatar: "CM", cor: "bg-purple-600" },
  { nome: "Lucas R.", texto: "Simplesmente perfeito, minha namorada chorou quando recebeu. Amei demais!", avatar: "LR", cor: "bg-rose-600" },
  { nome: "Marcos T.", texto: "Precisava de um presente rápido. Em 5 minutos ficou incrível. Recomendo!", avatar: "MT", cor: "bg-fuchsia-600" },
  { nome: "Ana P.", texto: "Meu marido ficou sem palavras. As fotos animadas são lindas demais!", avatar: "AP", cor: "bg-pink-500" },
  { nome: "Pedro L.", texto: "A música personalizada fez ela chorar de emoção. Melhor presente ever.", avatar: "PL", cor: "bg-purple-500" },
  { nome: "Juliana F.", texto: "Fiz de surpresa no aniversário de namoro. Ele amou cada detalhe!", avatar: "JF", cor: "bg-rose-500" },
  { nome: "Rafael K.", texto: "Interface super fácil. Em minutos criei algo que jamais conseguiria sozinho.", avatar: "RK", cor: "bg-fuchsia-500" },
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

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function Home() {
  const [faqAberto, setFaqAberto] = useState<number | null>(null);
  const count = useCountUp(50000, 2000);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* URGENCY BANNER */}
      <div className="bg-gradient-to-r from-[#e84393] via-[#c0306f] to-[#e84393] text-white text-center py-2.5 px-4 text-sm font-semibold animate-pulse-slow">
        🔥 Promoção por tempo limitado — <strong>R$ 9,90</strong> <span className="opacity-70 line-through ml-1">R$ 29,90</span> · Economize 66%
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="text-[#e84393]">♥</span>
            <span>LoveGift</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <Link href="/criar"
            className="text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #e84393, #c0306f)", boxShadow: "0 4px 16px rgba(232,67,147,0.3)" }}>
            Criar presente →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background: "radial-gradient(ellipse at 50% 0%, rgba(232,67,147,0.12) 0%, transparent 65%)"}} />
        <div className="max-w-4xl mx-auto relative">

          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 bg-[#e84393]/10 border border-[#e84393]/25 rounded-full px-5 py-2 text-sm text-[#e84393] mb-8">
            <span className="text-base">⭐</span>
            <span><strong>{count.toLocaleString("pt-BR")}+</strong> presentes criados · Nota <strong>5 estrelas</strong></span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tight">
            O presente que vai<br />
            <span style={{ background: "linear-gradient(135deg, #e84393 0%, #ff6eb4 50%, #c0306f 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              fazer ela chorar.
            </span>
          </h1>

          <p className="text-xl text-white/55 mb-3 max-w-2xl mx-auto leading-relaxed">
            Crie uma retrospectiva animada estilo <strong className="text-white/80">Spotify Wrapped</strong> com as fotos,
            a música e a mensagem que vão partir o coração (de amor) de quem você ama.
          </p>
          <p className="text-sm text-white/25 mb-10">Pronto em 5 minutos · Acesso permanente · Pagamento único R$ 9,90</p>

          <Link href="/criar"
            className="inline-block text-white text-lg font-black px-12 py-5 rounded-full transition-all hover:scale-105 mb-5"
            style={{ background: "linear-gradient(135deg, #e84393 0%, #c0306f 100%)", boxShadow: "0 16px 48px rgba(232,67,147,0.4)" }}>
            Criar meu presente agora →
          </Link>

          <div className="flex items-center justify-center gap-3 mb-14">
            <div className="flex -space-x-2">
              {["AS", "BM", "CL", "DP"].map((init, i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-xs font-bold ${["bg-pink-600", "bg-purple-600", "bg-rose-600", "bg-fuchsia-600"][i]}`}>
                  {init}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/40">+50 mil casais já se emocionaram ♥</p>
          </div>

          {/* Preview do "celular" com Wrapped mockup */}
          <div className="flex justify-center gap-6 items-end">
            {/* Tela do presente */}
            <div className="relative w-52 h-[440px] bg-[#0d0d0d] rounded-[2.5rem] border-2 border-white/10 shadow-2xl overflow-hidden hidden sm:block">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#0a0a0a] rounded-full" />
              <div className="h-full flex flex-col pt-10">
                <div className="flex-1 flex flex-col items-center justify-center px-5 pb-6">
                  <div className="text-[#e84393] text-5xl mb-3" style={{ filter: "drop-shadow(0 0 20px rgba(232,67,147,0.6))" }}>♥</div>
                  <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Para</p>
                  <p className="text-white font-black text-2xl mb-1">Ana</p>
                  <p className="text-white/30 text-xs mb-5">Com amor de João</p>
                  <div className="grid grid-cols-2 gap-1.5 w-full mb-4">
                    {[["📸","3 fotos"],["🎵","Nossa música"],["💌","Mensagem"],["🗓️","856 dias"]].map(([icon, label], i) => (
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
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Aniversário de Namoro</p>
                <div className="text-5xl font-black text-white leading-none mb-1">856</div>
                <p className="text-white/50 text-xs mb-5">dias de amor</p>
                <div className="grid grid-cols-3 gap-1.5 w-full mb-5">
                  {[["2","anos"],["28","meses"],["20.5k","horas"]].map(([n, l], i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-2">
                      <p className="text-white font-black text-sm">{n}</p>
                      <p className="text-white/40 text-[9px]">{l}</p>
                    </div>
                  ))}
                </div>
                <p className="text-white/60 text-xs italic leading-tight">&ldquo;Cada dia foi uma nova razão para ter certeza que fez a escolha certa.&rdquo;</p>
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
              { num: "01", icon: "✍️", title: "Conta sua história", desc: "Nome do casal, ocasião especial e a data que tudo começou" },
              { num: "02", icon: "📸", title: "Adiciona as fotos", desc: "Até 10 fotos que vão virar slides animados no estilo Wrapped" },
              { num: "03", icon: "🎵", title: "Escolhe a música", desc: "A trilha sonora que define vocês dois vai tocar enquanto o presente abre" },
              { num: "04", icon: "💝", title: "Envia e emociona", desc: "Link + QR Code na hora. A reação é garantida" },
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
      <section className="py-24 px-4 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#e84393] text-sm uppercase tracking-widest font-semibold mb-3">Tudo incluso</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Cada detalhe pensado<br />para emocionar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎬",
                badge: "Exclusivo",
                title: "Retrospectiva animada",
                desc: "Suas fotos ganham vida numa sequência cinematográfica estilo Spotify Wrapped. Cada imagem com música, transição e texto personalizado. A reação de quem vê é inevitável.",
              },
              {
                icon: "💌",
                badge: "Personalizado",
                title: "Mensagem do coração",
                desc: "Escreva do jeito que você é, sem limitação. Sua mensagem aparece num card elegante, com a identidade visual do presente. Palavras que ficam para sempre.",
              },
              {
                icon: "🎵",
                badge: "Trilha sonora",
                title: "A música de vocês",
                desc: "Adicione a música que é de vocês dois. Ela toca enquanto o presente é explorado, criando uma experiência que mistura emoção visual e sonora ao mesmo tempo.",
              },
              {
                icon: "📊",
                badge: "Dados reais",
                title: "Estatísticas do amor",
                desc: "Dias juntos, meses, anos, horas — tudo calculado automaticamente a partir da data que vocês começaram. Números que mostram o tamanho do amor.",
              },
              {
                icon: "🔗",
                badge: "Para sempre",
                title: "Link permanente + QR Code",
                desc: "Envie por qualquer app — WhatsApp, Instagram, e-mail. Ou imprima o QR Code e entregue no papel. O presente fica disponível para sempre, sem prazo de expiração.",
              },
              {
                icon: "✨",
                badge: "5 ocasiões",
                title: "Temas por ocasião",
                desc: "Aniversário de namoro, Dia dos Namorados, Aniversário, Pedido de namoro ou Só porque sim. Cada um com gradientes, textos e emojis únicos. Parece feito por designer.",
              },
            ].map((f, i) => (
              <div key={i} className="bg-[#0f0f0f] border border-white/8 rounded-2xl p-6 hover:border-[#e84393]/20 transition-all group">
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
      <section className="py-24 px-4 bg-white/[0.015]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#e84393] text-sm uppercase tracking-widest font-semibold mb-3">Histórias reais</p>
            <h2 className="text-4xl font-black mb-3">Quem usou, se emocionou.</h2>
            <p className="text-white/40">E quem recebeu, nunca esqueceu.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {depoimentos.slice(0, 6).map((d, i) => (
              <div key={i} className="bg-[#0f0f0f] rounded-2xl p-6 border border-white/8 hover:border-white/15 transition-all">
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
            style={{ background: "linear-gradient(135deg, rgba(232,67,147,0.08) 0%, #0f0f0f 60%)" }}>
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
                  "Música do casal integrada (YouTube)",
                  "Mensagem especial no coração do presente",
                  "Estatísticas do relacionamento",
                  "Link permanente + QR Code exclusivo",
                  "5 temas por ocasião",
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
      <section id="faq" className="py-24 px-4 bg-white/[0.015]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#e84393] text-sm uppercase tracking-widest font-semibold mb-3">Dúvidas</p>
            <h2 className="text-4xl font-black mb-4">Perguntas frequentes</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0f0f0f] rounded-2xl border border-white/8 overflow-hidden">
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
            Qual vai ser a reação<br />de quem você ama?
          </h2>
          <p className="text-white/45 mb-4 text-lg">Crie agora e descubra. A emoção acontece em segundos.</p>
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
          <Link href="/" className="flex items-center gap-2 text-white font-bold">
            <span className="text-[#e84393]">♥</span> LoveGift
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
