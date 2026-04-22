"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type FormData = {
  nomeRemetente: string;
  nomeDestinatario: string;
  ocasiao: string;
  dataEspecial: string;
  mensagem: string;
  musica: string;
  musicaUrl: string;
  tema: string;
  email: string;
  fotos: File[];
};

const TEMAS = [
  { id: "romantico", label: "Romântico", desc: "Fundo escuro, tons rosa/vermelho", preview: "bg-gradient-to-br from-pink-950 to-rose-950", accent: "text-pink-400" },
  { id: "minimalista", label: "Minimalista", desc: "Fundo branco, tons clean", preview: "bg-gradient-to-br from-gray-100 to-gray-200", accent: "text-gray-800" },
  { id: "vintage", label: "Vintage", desc: "Fundo creme, tons terrosos", preview: "bg-gradient-to-br from-amber-100 to-orange-100", accent: "text-amber-800" },
];

export default function CriarPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [etapa, setEtapa] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [contadorMensagem, setContadorMensagem] = useState(0);
  const [fotosPreviews, setFotosPreviews] = useState<string[]>([]);
  const [form, setForm] = useState<FormData>({
    nomeRemetente: "", nomeDestinatario: "", ocasiao: "", dataEspecial: "",
    mensagem: "", musica: "", musicaUrl: "", tema: "romantico", email: "", fotos: [],
  });

  const set = (campo: keyof FormData, valor: string) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const adicionarFotos = (arquivos: FileList | null) => {
    if (!arquivos) return;
    const novas = Array.from(arquivos).slice(0, 20 - form.fotos.length);
    setForm((prev) => ({ ...prev, fotos: [...prev.fotos, ...novas] }));
    novas.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setFotosPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removerFoto = (i: number) => {
    setForm((prev) => ({ ...prev, fotos: prev.fotos.filter((_, j) => j !== i) }));
    setFotosPreviews((prev) => prev.filter((_, j) => j !== i));
  };

  const valido = () => {
    if (etapa === 1) return !!(form.nomeRemetente && form.nomeDestinatario && form.ocasiao && form.mensagem);
    if (etapa === 2) return form.fotos.length > 0;
    if (etapa === 3) return !!form.musica;
    if (etapa === 4) return true;
    if (etapa === 5) return !!form.email;
    return true;
  };

  const finalizar = async () => {
    setCarregando(true);
    try {
      // 1. Upload das fotos
      const fotosUrls: string[] = [];
      for (const foto of form.fotos) {
        const fd = new FormData();
        fd.append("file", foto);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        fotosUrls.push(data.url);
      }

      // 2. Salva o presente
      const res = await fetch("/api/presentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeRemetente: form.nomeRemetente,
          nomeDestinatario: form.nomeDestinatario,
          ocasiao: form.ocasiao,
          dataEspecial: form.dataEspecial || null,
          mensagem: form.mensagem,
          musica: form.musica,
          musicaUrl: form.musicaUrl || null,
          tema: form.tema,
          email: form.email,
          fotos: fotosUrls,
        }),
      });
      const { slug } = await res.json();

      // 3. Cria preferência de pagamento
      const pagRes = await fetch("/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const pagData = await pagRes.json();

      // 4. Redireciona para o Mercado Pago
      if (pagData.url) {
        window.location.href = pagData.url;
      } else {
        // Sem MP configurado — mostra preview direto (modo dev)
        window.location.href = `/presente/${slug}`;
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao processar. Tente novamente.");
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#e84393]">♥</span> LoveGift
        </Link>
        {etapa <= 5 && <span className="text-sm text-white/40">Etapa {etapa} de 5</span>}
      </div>

      {/* Barra de progresso */}
      <div className="h-1 bg-white/10">
        <div className="h-full bg-[#e84393] transition-all duration-500" style={{ width: `${(Math.min(etapa, 5) / 5) * 100}%` }} />
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">

        {/* ETAPA 1 — Informações */}
        {etapa === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Conte sua história 💌</h1>
              <p className="text-white/50">Vamos começar com as informações do casal</p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Seu nome", key: "nomeRemetente", placeholder: "Ex: João" },
                { label: "Nome de quem vai receber", key: "nomeDestinatario", placeholder: "Ex: Ana" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-2 text-white/70">{label}</label>
                  <input type="text" placeholder={placeholder} value={form[key as keyof FormData] as string}
                    onChange={(e) => set(key as keyof FormData, e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e84393]/50 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Ocasião</label>
                <select value={form.ocasiao} onChange={(e) => set("ocasiao", e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e84393]/50 transition-colors">
                  <option value="">Selecione a ocasião</option>
                  <optgroup label="💑 Relacionamentos">
                    {["Aniversário de namoro", "Aniversário de casamento", "Dia dos Namorados", "Pedido de namoro", "Reconciliação"].map(o => <option key={o} value={o}>{o}</option>)}
                  </optgroup>
                  <optgroup label="🎂 Aniversários">
                    {["Aniversário", "Aniversário de 15 anos", "Aniversário de 18 anos"].map(o => <option key={o} value={o}>{o}</option>)}
                  </optgroup>
                  <optgroup label="🌸 Datas comemorativas">
                    {["Dia das Mães", "Dia dos Pais", "Dia das Avós", "Dia dos Avôs", "Natal", "Páscoa", "Dia da Mulher"].map(o => <option key={o} value={o}>{o}</option>)}
                  </optgroup>
                  <optgroup label="💝 Outros">
                    {["Só porque sim", "Formatura", "Novo emprego", "Outra"].map(o => <option key={o} value={o}>{o}</option>)}
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Data especial (opcional)</label>
                <input type="date" value={form.dataEspecial} onChange={(e) => set("dataEspecial", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e84393]/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">
                  Mensagem pessoal <span className="text-white/30 font-normal">{contadorMensagem}/500</span>
                </label>
                <textarea placeholder="Escreva uma mensagem do coração..." value={form.mensagem} maxLength={500} rows={5}
                  onChange={(e) => { set("mensagem", e.target.value); setContadorMensagem(e.target.value.length); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e84393]/50 transition-colors resize-none" />
              </div>
            </div>
            <button onClick={() => valido() && setEtapa(2)} disabled={!valido()}
              className="w-full bg-[#e84393] hover:bg-[#c0306f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02]">
              Próximo →
            </button>
          </div>
        )}

        {/* ETAPA 2 — Fotos */}
        {etapa === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Adicione as fotos 📸</h1>
              <p className="text-white/50">Escolha de 1 a 20 fotos especiais de vocês</p>
            </div>
            <div onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); adicionarFotos(e.dataTransfer.files); }}
              className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-[#e84393]/50 transition-colors">
              <div className="text-5xl mb-3">📷</div>
              <p className="font-semibold mb-1">Clique ou arraste as fotos aqui</p>
              <p className="text-sm text-white/40">JPG, PNG, WEBP · Máx. 5MB por foto</p>
              <p className="text-sm text-[#e84393] mt-2">{form.fotos.length} de 20 fotos adicionadas</p>
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp"
              onChange={(e) => adicionarFotos(e.target.files)} className="hidden" />
            {fotosPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {fotosPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removerFoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setEtapa(1)} className="flex-1 border border-white/20 text-white/70 hover:text-white font-semibold py-4 rounded-2xl transition-colors">← Voltar</button>
              <button onClick={() => valido() && setEtapa(3)} disabled={!valido()}
                className="flex-grow bg-[#e84393] hover:bg-[#c0306f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02]">Próximo →</button>
            </div>
          </div>
        )}

        {/* ETAPA 3 — Música */}
        {etapa === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">A música de vocês 🎵</h1>
              <p className="text-white/50">Qual é a trilha sonora do relacionamento?</p>
            </div>
            <div className="bg-[#111] rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎵</span>
                <span className="text-sm text-white/50 font-medium uppercase tracking-widest">Player personalizado</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Nome da música e artista</label>
                <input type="text" placeholder="Ex: Perfect - Ed Sheeran" value={form.musica}
                  onChange={(e) => set("musica", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e84393]/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Link do YouTube <span className="text-white/30 font-normal">(opcional)</span></label>
                <input type="url" placeholder="https://youtube.com/watch?v=..." value={form.musicaUrl}
                  onChange={(e) => set("musicaUrl", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e84393]/50 transition-colors" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEtapa(2)} className="flex-1 border border-white/20 text-white/70 hover:text-white font-semibold py-4 rounded-2xl transition-colors">← Voltar</button>
              <button onClick={() => valido() && setEtapa(4)} disabled={!valido()}
                className="flex-grow bg-[#e84393] hover:bg-[#c0306f] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02]">Próximo →</button>
            </div>
          </div>
        )}

        {/* ETAPA 4 — Tema */}
        {etapa === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Estilo visual 🎨</h1>
              <p className="text-white/50">Como você quer que seu presente apareça?</p>
            </div>
            <div className="space-y-4">
              {TEMAS.map((tema) => (
                <button key={tema.id} onClick={() => set("tema", tema.id)}
                  className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all ${form.tema === tema.id ? "border-[#e84393] scale-[1.02]" : "border-white/10 hover:border-white/30"}`}>
                  <div className={`${tema.preview} h-20 flex items-center justify-center`}>
                    <span className={`text-2xl font-bold ${tema.accent}`}>♥ {tema.label}</span>
                  </div>
                  <div className="bg-white/5 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{tema.label}</p>
                      <p className="text-xs text-white/40">{tema.desc}</p>
                    </div>
                    {form.tema === tema.id && <div className="w-5 h-5 rounded-full bg-[#e84393] flex items-center justify-center text-xs">✓</div>}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEtapa(3)} className="flex-1 border border-white/20 text-white/70 hover:text-white font-semibold py-4 rounded-2xl transition-colors">← Voltar</button>
              <button onClick={() => setEtapa(5)}
                className="flex-grow bg-[#e84393] hover:bg-[#c0306f] text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02]">Próximo →</button>
            </div>
          </div>
        )}

        {/* ETAPA 5 — E-mail e Pagamento */}
        {etapa === 5 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quase lá! 💳</h1>
              <p className="text-white/50">Informe seu e-mail para receber o link do presente</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-white/70">Seu e-mail</label>
                <input type="email" placeholder="seu@email.com" value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e84393]/50 transition-colors" />
                <p className="text-xs text-white/30 mt-2">Você receberá o link do presente por e-mail após o pagamento.</p>
              </div>
            </div>

            {/* Resumo do pedido */}
            <div className="bg-[#111] rounded-2xl p-6 border border-[#e84393]/20">
              <h2 className="font-bold text-lg mb-4">Resumo do pedido</h2>
              <div className="space-y-2 text-sm text-white/70 mb-4">
                <div className="flex justify-between"><span>Presente para</span><span className="text-white font-medium">{form.nomeDestinatario}</span></div>
                <div className="flex justify-between"><span>Ocasião</span><span className="text-white">{form.ocasiao}</span></div>
                <div className="flex justify-between"><span>Fotos</span><span className="text-white">{form.fotos.length} fotos</span></div>
                <div className="flex justify-between"><span>Tema</span><span className="text-white capitalize">{form.tema}</span></div>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="text-2xl font-bold text-[#e84393]">R$ 9,90</span>
              </div>
              <p className="text-xs text-white/30 mt-2">Pagamento único · Acesso permanente · Sem mensalidade</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEtapa(4)} className="flex-1 border border-white/20 text-white/70 hover:text-white font-semibold py-4 rounded-2xl transition-colors">← Voltar</button>
              <button onClick={finalizar} disabled={!valido() || carregando}
                className="flex-grow bg-[#e84393] hover:bg-[#c0306f] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                {carregando ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processando...</>
                ) : "Pagar R$ 9,90 →"}
              </button>
            </div>

            <p className="text-center text-xs text-white/20">🔒 Pagamento seguro via Mercado Pago</p>
          </div>
        )}
      </div>
    </div>
  );
}
