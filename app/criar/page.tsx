"use client";

import { useState, useRef, useEffect } from "react";
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
  moldura: string;
  email: string;
  fotos: File[];
  premium: boolean;
};

const TEMAS = [
  { id: "romantico", label: "Romântico", desc: "Fundo escuro, tons rosa/vermelho", preview: "bg-gradient-to-br from-pink-950 to-rose-950", accent: "text-pink-400" },
  { id: "minimalista", label: "Minimalista", desc: "Fundo branco, tons clean", preview: "bg-gradient-to-br from-gray-100 to-gray-200", accent: "text-gray-800" },
  { id: "vintage", label: "Vintage", desc: "Fundo creme, tons terrosos", preview: "bg-gradient-to-br from-amber-100 to-orange-100", accent: "text-amber-800" },
];

const MOLDURAS = [
  { id: "nenhuma", label: "Sem moldura", emoji: "⬜", desc: "Fotos limpas, sem borda" },
  { id: "dourada", label: "Dourada", emoji: "✨", desc: "Moldura dourada elegante" },
  { id: "rosas", label: "Rosas", emoji: "🌹", desc: "Pétalas de rosa delicadas" },
  { id: "coracao", label: "Coração", emoji: "💖", desc: "Bordas em formato de coração" },
  { id: "vintage", label: "Vintage", emoji: "🎞️", desc: "Estilo fotografia antiga" },
  { id: "luxo", label: "Luxo", emoji: "👑", desc: "Detalhes dourados premium" },
];

type YTResult = { videoId: string; title: string; channel: string; thumbnail: string; url: string; previewUrl?: string };

export default function CriarPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputPremiumRef = useRef<HTMLInputElement>(null);
  const [etapa, setEtapa] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [contadorMensagem, setContadorMensagem] = useState(0);
  const [fotosPreviews, setFotosPreviews] = useState<string[]>([]);
  const [pixModal, setPixModal] = useState<{ paymentId: number; qrCode: string; qrCodeBase64: string; valor: number; slug: string } | null>(null);
  const [pixCopiado, setPixCopiado] = useState(false);
  const [pixExpirado, setPixExpirado] = useState(false);
  const [pixRenovando, setPixRenovando] = useState(false);
  const [pixSegsRestantes, setPixSegsRestantes] = useState(30 * 60);
  const [buscaMusica, setBuscaMusica] = useState("");
  const [buscaResultados, setBuscaResultados] = useState<YTResult[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [musicaSelecionada, setMusicaSelecionada] = useState<YTResult | null>(null);
  const buscaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [form, setForm] = useState<FormData>({
    nomeRemetente: "", nomeDestinatario: "", ocasiao: "Dia das Mães", dataEspecial: "",
    mensagem: "", musica: "", musicaUrl: "", tema: "romantico", moldura: "nenhuma",
    email: "", fotos: [], premium: false,
  });

  const totalEtapas = form.premium ? 6 : 5;

  const set = (campo: keyof FormData, valor: string | boolean) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  const handleBuscaMusica = (q: string) => {
    setBuscaMusica(q);
    if (buscaTimer.current) clearTimeout(buscaTimer.current);
    if (!q.trim()) { setBuscaResultados([]); return; }
    buscaTimer.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetch(`/api/buscar-musica?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setBuscaResultados(data.items ?? []);
      } catch { setBuscaResultados([]); }
      finally { setBuscando(false); }
    }, 500);
  };

  const selecionarMusica = (item: YTResult) => {
    setMusicaSelecionada(item);
    set("musica", item.title.replace(/\s*\(.*?\)\s*/g, "").trim());
    // Salva o previewUrl (MP3 direto) em vez da URL da página do iTunes
    set("musicaUrl", item.previewUrl || item.url);
    setBuscaResultados([]);
    setBuscaMusica("");
  };

  useEffect(() => () => { if (buscaTimer.current) clearTimeout(buscaTimer.current); }, []);

  const maxFotos = form.premium ? 30 : 10;

  // Redimensiona imagem mantendo qualidade — máx 1920px, qualidade 92%
  const redimensionarFoto = (file: File): Promise<File> =>
    new Promise((resolve) => {
      const MAX = 1920;
      const QUALITY = 0.92;
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const { width, height } = img;
        // Se já é pequena o suficiente, devolve original sem reprocessar
        if (width <= MAX && height <= MAX) { resolve(file); return; }
        const scale = MAX / Math.max(width, height);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => resolve(blob ? new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" }) : file),
          "image/jpeg",
          QUALITY
        );
      };
      img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
      img.src = url;
    });

  const adicionarFotos = async (arquivos: FileList | null) => {
    if (!arquivos) return;
    const novas = Array.from(arquivos).slice(0, maxFotos - form.fotos.length);
    const redimensionadas = await Promise.all(novas.map(redimensionarFoto));
    setForm((prev) => ({ ...prev, fotos: [...prev.fotos, ...redimensionadas] }));
    redimensionadas.forEach((file) => {
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
    if (etapa === 6) return true;
    return true;
  };

  const avancarEtapa5 = () => {
    if (!valido()) return;
    if (form.premium) {
      setEtapa(6); // vai para etapa premium
    } else {
      finalizar();
    }
  };

  const finalizar = async () => {
    setCarregando(true);
    try {
      const fotosUrls: string[] = [];
      for (const foto of form.fotos) {
        const fd = new FormData();
        fd.append("file", foto);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        fotosUrls.push(data.url);
      }

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
          tema: form.premium ? "premium" : form.tema,
          moldura: form.moldura,
          email: form.email,
          fotos: fotosUrls,
          premium: form.premium,
        }),
      });
      const { slug } = await res.json();

      const pagRes = await fetch("/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, premium: form.premium }),
      });
      const pagData = await pagRes.json();

      if (pagData.paymentId && pagData.qrCode) {
        setCarregando(false);
        setPixModal({
          paymentId: pagData.paymentId,
          qrCode: pagData.qrCode,
          qrCodeBase64: pagData.qrCodeBase64,
          valor: pagData.valor,
          slug,
        });
      } else {
        window.location.href = `/presente/${slug}`;
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao processar. Tente novamente.");
      setCarregando(false);
    }
  };

  const preco = form.premium ? "R$ 19,90" : "R$ 9,90";

  // Polling + countdown ao abrir modal Pix
  useEffect(() => {
    if (!pixModal) return;
    setPixExpirado(false);
    setPixSegsRestantes(30 * 60);

    // Countdown visual de 30 min
    const countdown = setInterval(() => {
      setPixSegsRestantes(s => {
        if (s <= 1) { clearInterval(countdown); setPixExpirado(true); return 0; }
        return s - 1;
      });
    }, 1000);

    // Polling de status a cada 3s
    const polling = setInterval(async () => {
      try {
        const res = await fetch(`/api/pagamento/status?id=${pixModal.paymentId}`);
        const data = await res.json();
        if (data.status === "approved") {
          clearInterval(polling);
          clearInterval(countdown);
          await fetch("/api/pagamento/ativar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: pixModal.slug }),
          });
          window.location.href = `/presente/${pixModal.slug}?pago=1`;
        }
      } catch { /* ignora */ }
    }, 3000);

    return () => { clearInterval(polling); clearInterval(countdown); };
  }, [pixModal]);

  const renovarPix = async () => {
    if (!pixModal || pixRenovando) return;
    setPixRenovando(true);
    try {
      const res = await fetch("/api/pagamento/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: pixModal.slug }),
      });
      const data = await res.json();
      if (data.paymentId) {
        setPixModal(prev => prev ? { ...prev, paymentId: data.paymentId, qrCode: data.qrCode, qrCodeBase64: data.qrCodeBase64 } : prev);
        setPixExpirado(false);
      }
    } catch { /* ignora */ }
    setPixRenovando(false);
  };

  const copiarPix = () => {
    if (!pixModal) return;
    navigator.clipboard.writeText(pixModal.qrCode).then(() => {
      setPixCopiado(true);
      setTimeout(() => setPixCopiado(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-[#0d0008] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg, #e84393, #c0306f)" }}>🌸</div>
          <span className="text-lg font-black">
            <span style={{ background: "linear-gradient(135deg, #e84393, #ff6eb4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Love</span>
            <span className="text-white">Gift</span>
          </span>
        </Link>
        {etapa <= totalEtapas && (
          <span className="text-sm text-white/40">Etapa {etapa} de {totalEtapas}</span>
        )}
      </div>

      {/* MODAL PIX */}
      {pixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)" }}>
          <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(160deg, #130009 0%, #0d0008 100%)", border: "1px solid rgba(232,67,147,0.3)" }}>
            {/* Header */}
            <div className="px-6 pt-8 pb-4 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                style={{ background: "linear-gradient(135deg, rgba(232,67,147,0.2), rgba(192,48,111,0.1))", border: "1px solid rgba(232,67,147,0.3)" }}>
                🌸
              </div>
              <h2 className="text-xl font-black text-white mb-1">Pague com Pix</h2>
              <p className="text-white/40 text-sm">Escaneie o QR code com qualquer banco</p>
            </div>

            {/* QR Code */}
            <div className="px-6 pb-4">
              <div className="bg-white rounded-2xl p-4 mx-auto w-fit mb-4">
                {pixModal.qrCodeBase64 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`data:image/png;base64,${pixModal.qrCodeBase64}`}
                    alt="QR Code Pix"
                    className="w-48 h-48"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-gray-400 text-sm text-center">
                    Use o código abaixo
                  </div>
                )}
              </div>

              {/* Valor */}
              <div className="text-center mb-4">
                <span className="text-3xl font-black text-white">
                  R$ {pixModal.valor.toFixed(2).replace(".", ",")}
                </span>
                <p className="text-white/40 text-xs mt-1">pagamento único • acesso permanente</p>
              </div>

              {/* Código copia-cola */}
              <button
                onClick={copiarPix}
                className="w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-all"
                style={{
                  background: pixCopiado ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                  border: pixCopiado ? "1px solid rgba(34,197,94,0.4)" : "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <span className="text-sm font-mono text-white/60 truncate">
                  {pixModal.qrCode.slice(0, 40)}...
                </span>
                <span className={`text-sm font-bold flex-shrink-0 ${pixCopiado ? "text-green-400" : "text-[#e84393]"}`}>
                  {pixCopiado ? "✓ Copiado!" : "Copiar"}
                </span>
              </button>

              {/* Estado: expirado ou aguardando */}
              {pixExpirado ? (
                <div className="mt-4 text-center">
                  <p className="text-yellow-400 text-sm font-semibold mb-3">⚠️ QR Code expirado</p>
                  <button
                    onClick={renovarPix}
                    disabled={pixRenovando}
                    className="w-full py-3 rounded-2xl font-bold text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #e84393, #c0306f)" }}
                  >
                    {pixRenovando ? "Gerando novo código..." : "🔄 Gerar novo código"}
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-4 flex items-center justify-center gap-2 text-white/40 text-xs">
                    <div className="w-3 h-3 rounded-full border-2 border-[#e84393] border-t-transparent animate-spin" />
                    Aguardando confirmação do pagamento...
                  </div>
                  <p className="text-center text-white/25 text-xs mt-2">
                    Expira em {Math.floor(pixSegsRestantes / 60)}:{String(pixSegsRestantes % 60).padStart(2, "0")} · Após o pagamento você será redirecionado
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Barra de progresso */}
      <div className="h-1 bg-white/10">
        <div className="h-full bg-[#e84393] transition-all duration-500"
          style={{ width: `${(Math.min(etapa, totalEtapas) / totalEtapas) * 100}%` }} />
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">

        {/* ETAPA 1 — Informações */}
        {etapa === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Um presente pra ela 🌸</h1>
              <p className="text-white/50">Vamos começar com as informações do presente</p>
            </div>
            <div className="space-y-4">
              {[
                { label: "Seu nome (filho/a)", key: "nomeRemetente", placeholder: "Ex: Lucas" },
                { label: "Nome da sua mãe", key: "nomeDestinatario", placeholder: "Ex: Maria" },
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
                  <option value="Dia das Mães">🌸 Dia das Mães (10 de maio)</option>
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
                <label className="block text-sm font-medium mb-2 text-white/70">
                  Mensagem pessoal <span className="text-white/30 font-normal">{contadorMensagem}/500</span>
                </label>
                <textarea placeholder="Ex: Mãe, obrigado por tudo que você fez por mim. Cada sacrifício, cada abraço, cada palavra de apoio... Eu te amo mais do que consigo expressar." value={form.mensagem} maxLength={500} rows={5}
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
              <p className="text-white/50">Escolha de 1 a {maxFotos} fotos especiais de vocês</p>
            </div>
            <div onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); adicionarFotos(e.dataTransfer.files); }}
              className="border-2 border-dashed border-white/20 rounded-2xl p-10 text-center cursor-pointer hover:border-[#e84393]/50 transition-colors">
              <div className="text-5xl mb-3">📷</div>
              <p className="font-semibold mb-1">Clique ou arraste as fotos aqui</p>
              <p className="text-sm text-white/40">JPG, PNG, WEBP · Máx. 5MB por foto</p>
              <p className="text-sm text-[#e84393] mt-2">{form.fotos.length} de {maxFotos} fotos adicionadas</p>
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
              <h1 className="text-3xl font-bold mb-2">A música favorita dela 🎵</h1>
              <p className="text-white/50">Escolha a música que vai tocar quando ela abrir o presente</p>
            </div>

            {musicaSelecionada && (
              <div className="flex items-center gap-3 bg-[#e84393]/10 border border-[#e84393]/30 rounded-2xl p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={musicaSelecionada.thumbnail} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#e84393] uppercase tracking-widest mb-0.5">Selecionada ✓</p>
                  <p className="font-bold text-white truncate">{musicaSelecionada.title}</p>
                  <p className="text-xs text-white/40 truncate">{musicaSelecionada.channel}</p>
                </div>
                <button onClick={() => { setMusicaSelecionada(null); set("musica", ""); set("musicaUrl", ""); }}
                  className="text-white/30 hover:text-white text-xl flex-shrink-0">✕</button>
              </div>
            )}

            <div className="relative">
              <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#e84393]/50 transition-colors">
                <span className="text-xl">🔍</span>
                <input
                  type="text"
                  placeholder="Ex: Perfect Ed Sheeran, Evidências Chitãozinho..."
                  value={buscaMusica}
                  onChange={(e) => handleBuscaMusica(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none"
                />
                {buscando && <div className="w-4 h-4 border-2 border-[#e84393]/30 border-t-[#e84393] rounded-full animate-spin flex-shrink-0" />}
              </div>

              {buscaResultados.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-2xl overflow-hidden z-20 shadow-2xl">
                  {buscaResultados.map((item) => (
                    <button
                      key={item.videoId}
                      onClick={() => selecionarMusica(item)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.thumbnail} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                        <p className="text-xs text-white/40 truncate">{item.channel}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-center text-white/20 text-xs">ou cole o link direto</p>

            <div className="space-y-3">
              <input type="text" placeholder="Nome da música (ex: Perfect - Ed Sheeran)" value={form.musica}
                onChange={(e) => { set("musica", e.target.value); setMusicaSelecionada(null); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e84393]/50 transition-colors text-sm" />
              <input type="url" placeholder="https://youtube.com/watch?v=..." value={form.musicaUrl}
                onChange={(e) => { set("musicaUrl", e.target.value); setMusicaSelecionada(null); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#e84393]/50 transition-colors text-sm" />
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

        {/* ETAPA 5 — E-mail e resumo */}
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
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-white/60">
                  <span>Presente digital</span>
                  <span>R$ 9,90</span>
                </div>
                {form.premium && (
                  <div className="flex justify-between text-sm" style={{ color: "#f5c518" }}>
                    <span>👑 Upgrade Premium</span>
                    <span>+ R$ 9,90</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="font-bold text-lg">Total</span>
                  <span className="text-2xl font-bold" style={{ color: form.premium ? "#f5c518" : "#e84393" }}>{preco}</span>
                </div>
              </div>
              <p className="text-xs text-white/30 mt-2">Pagamento único · Acesso permanente · Sem mensalidade</p>
            </div>

            {/* UPSELL PREMIUM */}
            <div
              className={`rounded-2xl border-2 overflow-hidden transition-all ${form.premium ? "border-[#f5c518]" : "border-[#f5c518]/40"}`}
              style={{ background: "linear-gradient(135deg, #1a1500 0%, #0f0f00 100%)" }}>
              <div className="px-5 py-3 flex items-center gap-2" style={{ background: "linear-gradient(90deg, #f5c518, #e8b400)" }}>
                <span className="text-lg">👑</span>
                <span className="font-black text-black text-sm uppercase tracking-wider">UPGRADE PREMIUM — só R$ 9,90 a mais</span>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-white/70 text-sm">Eleve seu presente para um nível acima com recursos exclusivos:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {[
                    { icon: "📸", text: "Até 30 fotos (vs 10)" },
                    { icon: "🖼️", text: "Moldura exclusiva" },
                    { icon: "✨", text: "Tema Luxo exclusivo" },
                    { icon: "📖", text: "Wrapped estendido" },
                    { icon: "🔗", text: "Link personalizado" },
                    { icon: "🎁", text: "Visual premium" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-white/80">
                      <span>{icon}</span><span>{text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="premium"
                    checked={form.premium}
                    className="w-4 h-4 accent-[#f5c518]"
                    onChange={(e) => set("premium", e.target.checked)}
                  />
                  <label htmlFor="premium" className="text-sm font-semibold text-[#f5c518] cursor-pointer">
                    Sim! Quero o Premium por + R$ 9,90
                  </label>
                </div>
                {form.premium && (
                  <p className="text-xs text-[#f5c518]/70">
                    ✨ Na próxima etapa você escolhe moldura, tema e adiciona mais fotos!
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEtapa(4)} className="flex-1 border border-white/20 text-white/70 hover:text-white font-semibold py-4 rounded-2xl transition-colors">← Voltar</button>
              <button onClick={avancarEtapa5} disabled={!valido() || carregando}
                className="flex-grow disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{
                  background: form.premium
                    ? "linear-gradient(135deg, #f5c518, #e8b400)"
                    : "linear-gradient(135deg, #e84393, #c0306f)",
                  color: form.premium ? "#000" : "#fff"
                }}>
                {carregando ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processando...</>
                ) : form.premium
                  ? "👑 Personalizar Premium →"
                  : `Pagar R$ 9,90 →`}
              </button>
            </div>

            <p className="text-center text-xs text-white/20">🔒 Pagamento seguro via Mercado Pago</p>
          </div>
        )}

        {/* ETAPA 6 — Personalização Premium */}
        {etapa === 6 && (
          <div className="space-y-6">
            {/* Badge premium */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full w-fit"
              style={{ background: "linear-gradient(90deg, #f5c518, #e8b400)" }}>
              <span>👑</span>
              <span className="text-black font-bold text-sm">Personalização Premium</span>
            </div>

            <div>
              <h1 className="text-3xl font-bold mb-2">Deixe incrível! ✨</h1>
              <p className="text-white/50">Escolha os detalhes exclusivos do seu presente</p>
            </div>

            {/* Mais fotos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">📸 Mais fotos</h3>
                <span className="text-sm text-[#f5c518]">{form.fotos.length}/30 fotos</span>
              </div>
              <p className="text-white/40 text-sm">Você já adicionou {form.fotos.length} foto{form.fotos.length !== 1 ? "s" : ""}. Quer adicionar mais?</p>
              {form.fotos.length < 30 && (
                <button onClick={() => fileInputPremiumRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#f5c518]/40 rounded-2xl py-4 text-[#f5c518] hover:border-[#f5c518]/70 transition-colors font-semibold">
                  + Adicionar mais fotos ({30 - form.fotos.length} disponíveis)
                </button>
              )}
              <input ref={fileInputPremiumRef} type="file" multiple accept="image/jpeg,image/png,image/webp"
                onChange={(e) => adicionarFotos(e.target.files)} className="hidden" />
              {fotosPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {fotosPreviews.map((src, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => removerFoto(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10" />

            {/* Moldura */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg">🖼️ Moldura das fotos</h3>
              <div className="grid grid-cols-2 gap-3">
                {MOLDURAS.map((m) => (
                  <button key={m.id} onClick={() => set("moldura", m.id)}
                    className={`text-left rounded-2xl border-2 p-4 transition-all ${form.moldura === m.id ? "border-[#f5c518] bg-[#f5c518]/10" : "border-white/10 hover:border-white/30"}`}>
                    <div className="text-2xl mb-1">{m.emoji}</div>
                    <p className="font-semibold text-sm">{m.label}</p>
                    <p className="text-xs text-white/40">{m.desc}</p>
                    {form.moldura === m.id && (
                      <div className="mt-2 w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: "#f5c518", color: "#000" }}>✓</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10" />

            {/* Tema Luxo */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg">✨ Tema</h3>
              <div className="space-y-3">
                {/* Tema Luxo exclusivo */}
                <button onClick={() => set("tema", "luxo")}
                  className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all ${form.tema === "luxo" ? "border-[#f5c518] scale-[1.02]" : "border-[#f5c518]/30 hover:border-[#f5c518]/60"}`}>
                  <div className="h-20 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1200, #2d2000, #1a1200)" }}>
                    <span className="text-2xl font-bold" style={{ color: "#f5c518" }}>👑 Luxo</span>
                  </div>
                  <div className="bg-[#f5c518]/5 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-[#f5c518]">Luxo <span className="text-xs text-[#f5c518]/60 ml-1">EXCLUSIVO PREMIUM</span></p>
                      <p className="text-xs text-white/40">Fundo escuro com detalhes dourados</p>
                    </div>
                    {form.tema === "luxo" && <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: "#f5c518", color: "#000" }}>✓</div>}
                  </div>
                </button>
                {/* Outros temas */}
                {TEMAS.map((tema) => (
                  <button key={tema.id} onClick={() => set("tema", tema.id)}
                    className={`w-full text-left rounded-2xl border-2 overflow-hidden transition-all ${form.tema === tema.id ? "border-[#f5c518] scale-[1.02]" : "border-white/10 hover:border-white/30"}`}>
                    <div className={`${tema.preview} h-14 flex items-center justify-center`}>
                      <span className={`text-xl font-bold ${tema.accent}`}>♥ {tema.label}</span>
                    </div>
                    <div className="bg-white/5 px-4 py-2 flex items-center justify-between">
                      <p className="font-semibold text-sm">{tema.label}</p>
                      {form.tema === tema.id && <div className="w-5 h-5 rounded-full bg-[#e84393] flex items-center justify-center text-xs">✓</div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setEtapa(5)} className="flex-1 border border-white/20 text-white/70 hover:text-white font-semibold py-4 rounded-2xl transition-colors">← Voltar</button>
              <button onClick={finalizar} disabled={carregando}
                className="flex-grow disabled:opacity-50 font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #f5c518, #e8b400)", color: "#000" }}>
                {carregando ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Processando...</>
                ) : "👑 Pagar R$ 19,90 e criar presente →"}
              </button>
            </div>

            <p className="text-center text-xs text-white/20">🔒 Pagamento seguro via Mercado Pago</p>
          </div>
        )}

      </div>
    </div>
  );
}
