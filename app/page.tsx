"use client";

import Link from "next/link";
import { useState } from "react";

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
];

export default function Home() {
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/5">
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
          <Link href="/criar" className="bg-[#e84393] hover:bg-[#c0306f] text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
            Criar presente →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background: "radial-gradient(ellipse at center, rgba(232,67,147,0.08) 0%, transparent 70%)"}} />
        <div className="max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 bg-[#e84393]/10 border border-[#e84393]/30 rounded-full px-4 py-2 text-sm text-[#e84393] mb-8">
            <span>✨</span>
            <span>+50.000 presentes criados · Nota 5 estrelas</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Declare seu amor de<br />
            <span className="text-[#e84393]">forma única.</span>
          </h1>

          <p className="text-xl text-white/60 mb-4 max-w-2xl mx-auto">
            Crie um presente digital inesquecível com fotos, música e retrospectiva animada estilo Spotify Wrapped.
            Pronto em 5 minutos. Por apenas <strong className="text-white">R$ 9,90</strong>.
          </p>
          <p className="text-sm text-white/30 mb-10">Sem mensalidade · Acesso permanente · Entrega imediata</p>

          <Link href="/criar" className="inline-block bg-[#e84393] hover:bg-[#c0306f] text-white text-lg font-bold px-10 py-4 rounded-full transition-all hover:scale-105 shadow-lg" style={{boxShadow: "0 10px 40px rgba(232,67,147,0.3)"}}>
            Criar presente por R$ 9,90 →
          </Link>

          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {["AS", "BM", "CL", "DP"].map((init, i) => (
                <div key={i} className={`w-9 h-9 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center text-xs font-bold ${["bg-pink-600", "bg-purple-600", "bg-rose-600", "bg-fuchsia-600"][i]}`}>
                  {init}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/50">Mais de <strong className="text-white">50 mil</strong> casais emocionados</p>
          </div>

          {/* Mock celular */}
          <div className="mt-16 flex justify-center">
            <div className="relative w-56 h-[480px] bg-[#1a1a1a] rounded-[3rem] border-4 border-white/10 shadow-2xl overflow-hidden">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0a0a0a] rounded-full" />
              <div className="p-4 pt-12 h-full flex flex-col">
                <div className="text-center mb-4">
                  <div className="text-[#e84393] text-3xl animate-pulse-heart">♥</div>
                  <p className="text-xs text-white/50 mt-1">Para Ana</p>
                  <p className="text-xs text-white/30">Com amor de João</p>
                </div>
                <div className="grid grid-cols-2 gap-1 mb-3">
                  {["bg-pink-900/50", "bg-purple-900/50", "bg-rose-900/50", "bg-fuchsia-900/50"].map((c, i) => (
                    <div key={i} className={`${c} rounded-lg h-16 flex items-center justify-center text-2xl`}>
                      {["📸", "🎵", "💌", "🗓️"][i]}
                    </div>
                  ))}
                </div>
                <div className="bg-[#e84393]/20 rounded-xl p-3 mt-auto">
                  <p className="text-[10px] text-white/70 text-center italic">&ldquo;Você é o melhor que me aconteceu&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARROSSEL */}
      <section className="py-12 overflow-hidden border-y border-white/5">
        <div className="flex animate-scroll" style={{width: "max-content"}}>
          {[...depoimentos, ...depoimentos].map((d, i) => (
            <div key={i} className="inline-flex items-center gap-3 bg-white/5 rounded-2xl px-5 py-4 mx-3 w-72 flex-shrink-0">
              <div className={`w-10 h-10 rounded-full ${d.cor} flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                {d.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{d.nome}</p>
                <p className="text-xs text-white/50 mt-0.5 line-clamp-2">{d.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-white/50 text-lg">Simples, rápido e emocionante</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "01", icon: "✍️", title: "Conte sua história", desc: "Preencha os dados do casal e escolha a ocasião especial" },
              { num: "02", icon: "📸", title: "Personalize cada detalhe", desc: "Adicione fotos, escolha a música e o estilo visual" },
              { num: "03", icon: "🔗", title: "Receba o link e QR Code", desc: "Entrega instantânea após a confirmação" },
              { num: "04", icon: "💝", title: "Emocione quem você ama", desc: "Envie e prepare-se para uma reação inesquecível" },
            ].map((step, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-[#e84393]/30 transition-colors">
                <div className="text-[#e84393]/30 text-4xl font-bold mb-4">{step.num}</div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-white/50">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tudo que você precisa para emocionar</h2>
            <p className="text-white/50 text-lg">Recursos pensados para criar momentos inesquecíveis</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "📸", title: "Retrospectiva Animada", desc: "Suas fotos em uma sequência animada elegante, estilo Spotify Wrapped. Cada imagem conta um momento especial.", emojis: ["📷", "🌅", "💑", "🎉"] },
              { icon: "📅", title: "Linha do Tempo", desc: "Marcos do relacionamento em uma timeline elegante. Do primeiro encontro até hoje, tudo registrado.", emojis: ["💕", "🥂", "✈️", "🏠"] },
              { icon: "🎵", title: "Música Personalizada", desc: "A trilha sonora do casal tocando enquanto o presente é visualizado. Pura emoção.", emojis: ["🎶", "♪", "🎸", "🎹"] },
            ].map((f, i) => (
              <div key={i} className="bg-[#111] rounded-3xl p-6 border border-white/10">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-white/50 text-sm mb-6">{f.desc}</p>
                <div className="grid grid-cols-4 gap-2">
                  {f.emojis.map((e, j) => (
                    <div key={j} className="aspect-square bg-white/5 rounded-xl flex items-center justify-center text-xl">
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS GRID */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">O que dizem nossos clientes</h2>
            <p className="text-white/50">Histórias reais de quem já emocionou alguém especial</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {depoimentos.slice(0, 6).map((d, i) => (
              <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${d.cor} flex items-center justify-center text-sm font-bold`}>
                    {d.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{d.nome}</p>
                    <p className="text-xs text-white/30">há {(i + 1) * 3} dias</p>
                  </div>
                  <div className="ml-auto text-[#e84393] text-xs">★★★★★</div>
                </div>
                <p className="text-sm text-white/70 italic">&ldquo;{d.texto}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section id="precos" className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Um presente que vale cada centavo</h2>
          <p className="text-white/50 mb-12">Pagamento único, sem mensalidade</p>
          <div className="bg-[#111] rounded-3xl p-8 border border-[#e84393]/30" style={{background: "linear-gradient(135deg, rgba(232,67,147,0.1) 0%, #111 100%)"}}>
            <div className="inline-flex items-center gap-2 bg-[#e84393] text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
              ✦ MAIS POPULAR
            </div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-white/30 line-through text-2xl">R$ 29,90</span>
              <span className="bg-[#e84393] text-white text-xs font-bold px-2 py-1 rounded-full">-66%</span>
            </div>
            <div className="text-6xl font-bold mb-2">
              R$&nbsp;<span className="text-[#e84393]">9</span><span className="text-2xl text-white/50">,90</span>
            </div>
            <p className="text-white/40 text-sm mb-8">Pagamento único · Sem mensalidade · Acesso permanente</p>
            <ul className="text-left space-y-3 mb-8">
              {["Retrospectiva animada com suas fotos", "Música personalizada do casal", "Linha do tempo elegante", "Link permanente + QR Code", "3 temas visuais para escolher", "Compatível com celular e computador"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                  <span className="text-[#e84393] text-base">✓</span>{item}
                </li>
              ))}
            </ul>
            <Link href="/criar" className="block w-full bg-[#e84393] hover:bg-[#c0306f] text-white font-bold py-4 rounded-2xl transition-all hover:scale-105" style={{boxShadow: "0 8px 30px rgba(232,67,147,0.3)"}}>
              Criar meu presente agora →
            </Link>
            <p className="text-white/25 text-xs mt-4 text-center">🔒 Pagamento seguro via Mercado Pago · Pix, Cartão ou Boleto</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Perguntas frequentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setFaqAberto(faqAberto === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold hover:bg-white/5 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`text-[#e84393] text-xl transition-transform duration-200 ${faqAberto === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {faqAberto === i && (
                  <div className="px-6 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-4 text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-6 animate-pulse-heart">♥</div>
          <h2 className="text-4xl font-bold mb-4">Pronto para emocionar?</h2>
          <p className="text-white/50 mb-3">Crie agora e surpreenda a pessoa mais especial da sua vida.</p>
          <p className="text-[#e84393] font-semibold mb-10">Por apenas R$ 9,90 — pagamento único, sem mensalidade.</p>
          <Link href="/criar" className="inline-block bg-[#e84393] hover:bg-[#c0306f] text-white text-lg font-bold px-12 py-5 rounded-full transition-all hover:scale-105" style={{boxShadow: "0 10px 40px rgba(232,67,147,0.3)"}}>
            Criar meu presente agora →
          </Link>
          <p className="text-white/20 text-sm mt-6">🔒 Pagamento seguro · Acesso imediato após confirmação</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
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
