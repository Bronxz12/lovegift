"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import QRCodeLib from "qrcode";
import { differenceInDays } from "date-fns";
import confetti from "canvas-confetti";
import Wrapped from "./Wrapped";
import Link from "next/link";

type Foto = { id: string; url: string; ordem: number };


type OcasiaoConfig = {
  emoji: string;
  cor: string;
  corHex: string;
  titulo: string;
  subtitulo: string;
  confettiCores: string[];
  timelineInicio: string;
  timelineHoje: string;
  contadorLabel: string;
  // textos dinâmicos por contexto
  fotosTitulo: string;        // título da seção de fotos
  musicaTitulo: string;       // título da seção de música
  jornadaTitulo: string;      // título da seção de linha do tempo
  wrappedBtn: string;         // botão flutuante
  diasSufixo: string;         // "juntos" / "de amor" / "de conquistas"
  mesesSufixo: string;        // "meses juntos" / "meses de amor"
  encerramentoFrase: string;  // frase final antes dos dias
  encerramento: string;       // label do te ama
};

const OCASIAO_CONFIG: Record<string, OcasiaoConfig> = {
  "Aniversário de namoro": {
    emoji: "💑", cor: "text-[#e84393]", corHex: "#e84393",
    titulo: "Feliz aniversário de namoro", subtitulo: "Cada dia ao seu lado é um presente",
    confettiCores: ["#e84393","#ff6eb4","#ffffff","#c0306f","#ffb3d9"],
    timelineInicio: "O começo da nossa história", timelineHoje: "Mais um capítulo lindo",
    contadorLabel: "juntos há",
    fotosTitulo: "📸 Nossa história em fotos",
    musicaTitulo: "🎵 Nossa música",
    jornadaTitulo: "🗓️ Nossa jornada",
    wrappedBtn: "▶ Ver nossa história",
    diasSufixo: "juntos",
    mesesSufixo: "meses juntos",
    encerramentoFrase: "Já são",
    encerramento: "te ama",
  },
  "Aniversário de casamento": {
    emoji: "💍", cor: "text-[#f5c518]", corHex: "#f5c518",
    titulo: "Feliz aniversário de casamento", subtitulo: "Unidos para sempre",
    confettiCores: ["#f5c518","#fff8dc","#ffffff","#e8b400","#fffacd"],
    timelineInicio: "O dia em que nos tornamos um", timelineHoje: "Nossa união continua forte",
    contadorLabel: "casados há",
    fotosTitulo: "📸 Nossa história em fotos",
    musicaTitulo: "🎵 Nossa música",
    jornadaTitulo: "🗓️ Nossa jornada",
    wrappedBtn: "▶ Ver nossa história",
    diasSufixo: "casados",
    mesesSufixo: "meses casados",
    encerramentoFrase: "Já são",
    encerramento: "te ama",
  },
  "Dia dos Namorados": {
    emoji: "❤️", cor: "text-[#ff4466]", corHex: "#ff4466",
    titulo: "Feliz Dia dos Namorados", subtitulo: "Você é meu maior presente",
    confettiCores: ["#ff4466","#ff8099","#ffffff","#cc0033","#ffb3c1"],
    timelineInicio: "O início da nossa história de amor", timelineHoje: "Celebrando nosso amor",
    contadorLabel: "juntos há",
    fotosTitulo: "📸 Nossa história em fotos",
    musicaTitulo: "🎵 Nossa música",
    jornadaTitulo: "🗓️ Nossa jornada",
    wrappedBtn: "▶ Ver nossa história",
    diasSufixo: "juntos",
    mesesSufixo: "meses juntos",
    encerramentoFrase: "Já são",
    encerramento: "te ama",
  },
  "Pedido de namoro": {
    emoji: "💝", cor: "text-[#e84393]", corHex: "#e84393",
    titulo: "Quero você comigo", subtitulo: "Para sempre e sempre",
    confettiCores: ["#e84393","#ff6eb4","#ffffff","#c0306f","#ffb3d9"],
    timelineInicio: "O momento que tudo mudou", timelineHoje: "O começo da nossa história",
    contadorLabel: "desde que te conheci",
    fotosTitulo: "📸 Momentos especiais",
    musicaTitulo: "🎵 Nossa música",
    jornadaTitulo: "🗓️ Nossa história",
    wrappedBtn: "▶ Ver nossa história",
    diasSufixo: "desde que te conheci",
    mesesSufixo: "meses juntos",
    encerramentoFrase: "Já são",
    encerramento: "te ama",
  },
  "Aniversário": {
    emoji: "🎂", cor: "text-[#a78bfa]", corHex: "#a78bfa",
    titulo: "Feliz aniversário", subtitulo: "Que esse dia seja tão especial quanto você",
    confettiCores: ["#a78bfa","#f472b6","#fbbf24","#34d399","#60a5fa"],
    timelineInicio: "Desde que você chegou ao mundo", timelineHoje: "Mais um ano incrível",
    contadorLabel: "anos de vida",
    fotosTitulo: "📸 Memórias especiais",
    musicaTitulo: "🎵 A música escolhida",
    jornadaTitulo: "🗓️ Sua trajetória",
    wrappedBtn: "▶ Ver o presente",
    diasSufixo: "de vida",
    mesesSufixo: "meses de vida",
    encerramentoFrase: "Já são",
    encerramento: "te deseja feliz aniversário",
  },
  "Aniversário de 15 anos": {
    emoji: "👑", cor: "text-[#f59e0b]", corHex: "#f59e0b",
    titulo: "Feliz 15 anos, princesa", subtitulo: "Uma vida inteira de conquistas pela frente",
    confettiCores: ["#f59e0b","#fcd34d","#ffffff","#d97706","#fef3c7"],
    timelineInicio: "Seu primeiro dia nesse mundo", timelineHoje: "15 anos de pura alegria",
    contadorLabel: "anos de vida",
    fotosTitulo: "📸 Sua história em fotos",
    musicaTitulo: "🎵 Sua música",
    jornadaTitulo: "🗓️ Sua trajetória",
    wrappedBtn: "▶ Ver o presente",
    diasSufixo: "de vida",
    mesesSufixo: "meses de vida",
    encerramentoFrase: "Já são",
    encerramento: "te ama",
  },
  "Aniversário de 18 anos": {
    emoji: "🎉", cor: "text-[#6366f1]", corHex: "#6366f1",
    titulo: "Feliz 18 anos", subtitulo: "Bem-vindo à liberdade",
    confettiCores: ["#6366f1","#a78bfa","#f472b6","#fbbf24","#34d399"],
    timelineInicio: "Seu primeiro dia nesse mundo", timelineHoje: "18 anos de conquistas",
    contadorLabel: "anos de vida",
    fotosTitulo: "📸 Sua história em fotos",
    musicaTitulo: "🎵 Sua música",
    jornadaTitulo: "🗓️ Sua trajetória",
    wrappedBtn: "▶ Ver o presente",
    diasSufixo: "de vida",
    mesesSufixo: "meses de vida",
    encerramentoFrase: "Já são",
    encerramento: "te ama",
  },
  "Dia das Mães": {
    emoji: "🌸", cor: "text-[#f472b6]", corHex: "#f472b6",
    titulo: "Feliz Dia das Mães", subtitulo: "Obrigado por tudo que você é",
    confettiCores: ["#f472b6","#fb7185","#ffffff","#ec4899","#fce7f3"],
    timelineInicio: "Desde que você me deu a vida", timelineHoje: "Sempre ao seu lado",
    contadorLabel: "anos de amor incondicional",
    fotosTitulo: "📸 Momentos com ela",
    musicaTitulo: "🎵 A música favorita dela",
    jornadaTitulo: "🗓️ A história de vocês",
    wrappedBtn: "▶ Ver Wrapped de Mãe 🌸",
    diasSufixo: "de amor incondicional",
    mesesSufixo: "meses de amor",
    encerramentoFrase: "São",
    encerramento: "te ama, mãe",
  },
  "Dia dos Pais": {
    emoji: "💙", cor: "text-[#3b82f6]", corHex: "#3b82f6",
    titulo: "Feliz Dia dos Pais", subtitulo: "Meu herói de todos os dias",
    confettiCores: ["#3b82f6","#60a5fa","#ffffff","#1d4ed8","#bfdbfe"],
    timelineInicio: "Desde que você me mostrou o caminho", timelineHoje: "Sempre meu exemplo",
    contadorLabel: "anos sendo meu herói",
    fotosTitulo: "📸 Momentos com ele",
    musicaTitulo: "🎵 A música favorita dele",
    jornadaTitulo: "🗓️ A história de vocês",
    wrappedBtn: "▶ Ver Wrapped de Pai 💙",
    diasSufixo: "de amor e gratidão",
    mesesSufixo: "meses de amor",
    encerramentoFrase: "São",
    encerramento: "te ama, pai",
  },
  "Natal": {
    emoji: "🎄", cor: "text-[#22c55e]", corHex: "#22c55e",
    titulo: "Feliz Natal", subtitulo: "Que essa data seja cheia de amor",
    confettiCores: ["#22c55e","#ef4444","#ffffff","#fbbf24","#86efac"],
    timelineInicio: "Desde o nosso primeiro Natal juntos", timelineHoje: "Mais um Natal especial",
    contadorLabel: "natais juntos",
    fotosTitulo: "📸 Memórias especiais",
    musicaTitulo: "🎵 A música do Natal",
    jornadaTitulo: "🗓️ Momentos juntos",
    wrappedBtn: "▶ Ver o presente",
    diasSufixo: "de momentos especiais",
    mesesSufixo: "meses juntos",
    encerramentoFrase: "Já são",
    encerramento: "te ama",
  },
  "Formatura": {
    emoji: "🎓", cor: "text-[#8b5cf6]", corHex: "#8b5cf6",
    titulo: "Parabéns pela formatura", subtitulo: "Você conseguiu — e eu sempre soube",
    confettiCores: ["#8b5cf6","#a78bfa","#fbbf24","#ffffff","#ede9fe"],
    timelineInicio: "O primeiro dia de uma grande jornada", timelineHoje: "A conquista de um sonho",
    contadorLabel: "anos de dedicação",
    fotosTitulo: "📸 Sua trajetória em fotos",
    musicaTitulo: "🎵 A música da conquista",
    jornadaTitulo: "🗓️ Sua jornada",
    wrappedBtn: "▶ Ver o presente",
    diasSufixo: "de dedicação",
    mesesSufixo: "meses de esforço",
    encerramentoFrase: "Foram",
    encerramento: "está muito orgulhoso de você",
  },
};

const getOcasiaoConfig = (ocasiao: string): OcasiaoConfig =>
  OCASIAO_CONFIG[ocasiao] ?? {
    emoji: "♥", cor: "text-[#e84393]", corHex: "#e84393",
    titulo: "Um presente especial para você", subtitulo: "Com todo o carinho",
    confettiCores: ["#e84393","#ff6eb4","#ffffff","#c0306f","#ffb3d9"],
    timelineInicio: "O começo de tudo", timelineHoje: "Mais um capítulo lindo",
    contadorLabel: "juntos há",
    fotosTitulo: "📸 Momentos especiais",
    musicaTitulo: "🎵 Música escolhida",
    jornadaTitulo: "🗓️ A jornada",
    wrappedBtn: "▶ Ver o presente",
    diasSufixo: "de memórias",
    mesesSufixo: "meses",
    encerramentoFrase: "Já são",
    encerramento: "te ama",
  };
type Presente = {
  id: string;
  slug: string;
  nomeRemetente: string;
  nomeDestinatario: string;
  ocasiao: string;
  dataEspecial: string | null;
  mensagem: string;
  musica: string;
  musicaUrl: string | null;
  tema: string;
  premium: boolean;
  fotos: Foto[];
};

const TEMAS: Record<string, { bg: string; accent: string; card: string; text: string; border: string }> = {
  romantico: {
    bg: "bg-[#0a0a0a]",
    accent: "text-[#e84393]",
    card: "bg-white/5",
    text: "text-white",
    border: "border-[#e84393]/20",
  },
  minimalista: {
    bg: "bg-gray-50",
    accent: "text-gray-800",
    card: "bg-white",
    text: "text-gray-800",
    border: "border-gray-200",
  },
  vintage: {
    bg: "bg-amber-50",
    accent: "text-amber-800",
    card: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-300",
  },
};

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export default function PresentePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const [presente, setPresente] = useState<Presente | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [qrCode, setQrCode] = useState("");
  const [aberto, setAberto] = useState(false);
  const [wrappedAberto, setWrappedAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [upsellAberto, setUpsellAberto] = useState(false);
  const [contador, setContador] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const slideInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const contadorInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const pago = searchParams.get("pago");
    if (pago === "1") {
      fetch("/api/pagamento/ativar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      }).catch(() => {});
      if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).fbq) {
        (window as unknown as Record<string, (a: string, b: string, c?: Record<string, unknown>) => void>).fbq("track", "Purchase", { value: 9.90, currency: "BRL" });
      }
      // Mostra upsell premium após 3s (só se não for premium)
      const t = setTimeout(() => setUpsellAberto(true), 3000);
      return () => clearTimeout(t);
    }
  }, [slug, searchParams]);

  useEffect(() => {
    fetch(`/api/presentes/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPresente(data);
        setCarregando(false);
        if (typeof window !== "undefined") {
          QRCodeLib.toDataURL(window.location.href.split("?")[0], {
            width: 200,
            margin: 2,
            color: { dark: "#000000", light: "#ffffff" },
          }).then(setQrCode);
        }
        // Notifica o remetente que o presente foi aberto
        fetch("/api/notificar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        }).catch(() => {});
      })
      .catch(() => setCarregando(false));
  }, [slug]);

  useEffect(() => {
    if (!presente || presente.fotos.length <= 1) return;
    slideInterval.current = setInterval(() => {
      setFotoAtual((prev) => (prev + 1) % presente.fotos.length);
    }, 4000);
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [presente]);

  // Confetti na abertura (cores personalizadas por ocasião)
  useEffect(() => {
    if (!aberto || !presente) return;
    const cfg = getOcasiaoConfig(presente.ocasiao);
    const fire = (angle: number, origin: { x: number; y: number }) => {
      confetti({ particleCount: 60, spread: 55, angle, origin, colors: cfg.confettiCores });
    };
    const t = setTimeout(() => {
      fire(60, { x: 0, y: 0.65 });
      fire(120, { x: 1, y: 0.65 });
    }, 300);
    return () => clearTimeout(t);
  }, [aberto, presente]);

  // Contador ao vivo
  useEffect(() => {
    if (!presente?.dataEspecial) return;
    const dataBase = new Date(presente.dataEspecial);
    const tick = () => {
      const diff = Date.now() - dataBase.getTime();
      if (diff <= 0) return;
      const totalSeg = Math.floor(diff / 1000);
      const dias = Math.floor(totalSeg / 86400);
      const horas = Math.floor((totalSeg % 86400) / 3600);
      const minutos = Math.floor((totalSeg % 3600) / 60);
      const segundos = totalSeg % 60;
      setContador({ dias, horas, minutos, segundos });
    };
    tick();
    contadorInterval.current = setInterval(tick, 1000);
    return () => { if (contadorInterval.current) clearInterval(contadorInterval.current); };
  }, [presente]);

  const handleCopiarLink = () => {
    const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
    navigator.clipboard.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    });
  };

  const handleWhatsapp = () => {
    const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
    const texto = encodeURIComponent(`Tenho um presente especial para você ♥ ${url}`);
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  };

  const handleInstagram = async () => {
    const url = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
    try {
      const W = 1080, H = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Fundo
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#1a0010");
      bg.addColorStop(0.4, "#0a0a0a");
      bg.addColorStop(1, "#1a0010");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Glow central
      const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, 500);
      glow.addColorStop(0, "rgba(232,67,147,0.22)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      const draw = () => {
        const nome = presente?.nomeDestinatario ?? "Você";
        const rem = presente?.nomeRemetente ?? "";
        const msg = presente?.mensagem ?? "";
        const msgCurta = msg.length > 100 ? msg.slice(0, 97) + "…" : msg;

        // Logo
        ctx.font = "bold 52px sans-serif";
        ctx.fillStyle = "#e84393";
        ctx.textAlign = "center";
        ctx.fillText("♥ LoveGift", W / 2, 130);

        // Foto ou coração
        const fotoUrl = presente?.fotos?.[0]?.url ?? null;
        const drawCard = (imgOrNull: HTMLImageElement | null) => {
          const cx = W / 2, cy = H * 0.37, r = 32, s = 480;
          const x = cx - s / 2, y = cy - s / 2;
          // Borda rosa
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(x - 4, y - 4, s + 8, s + 8, r + 4);
          ctx.fillStyle = "rgba(232,67,147,0.4)";
          ctx.fill();
          // Clip para foto
          ctx.beginPath();
          ctx.roundRect(x, y, s, s, r);
          ctx.clip();
          if (imgOrNull) {
            const ratio = Math.max(s / imgOrNull.width, s / imgOrNull.height);
            const dw = imgOrNull.width * ratio, dh = imgOrNull.height * ratio;
            ctx.drawImage(imgOrNull, cx - dw / 2, cy - dh / 2, dw, dh);
          } else {
            ctx.fillStyle = "rgba(232,67,147,0.15)";
            ctx.fillRect(x, y, s, s);
            ctx.font = "200px sans-serif";
            ctx.fillStyle = "#e84393";
            ctx.fillText("♥", cx, cy + 70);
          }
          ctx.restore();

          // PARA
          ctx.font = "36px sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.letterSpacing = "6px";
          ctx.fillText("PARA", W / 2, H * 0.57);
          ctx.letterSpacing = "0px";

          // Nome
          ctx.font = "bold 90px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.fillText(nome, W / 2, H * 0.63);

          // Mensagem
          if (msgCurta) {
            ctx.font = "italic 36px sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            const words = `"${msgCurta}"`.split(" ");
            let line = "", lineY = H * 0.70;
            for (const word of words) {
              const test = line + word + " ";
              if (ctx.measureText(test).width > 900 && line) {
                ctx.fillText(line.trim(), W / 2, lineY);
                line = word + " ";
                lineY += 52;
              } else {
                line = test;
              }
            }
            if (line) ctx.fillText(line.trim(), W / 2, lineY);
          }

          // Remetente
          if (rem) {
            ctx.font = "34px sans-serif";
            ctx.fillStyle = "#e84393";
            ctx.fillText(`— ${rem} ♥`, W / 2, H * 0.83);
          }

          // Botão CTA
          const btnW = 640, btnH = 90, btnX = W / 2 - btnW / 2, btnY = H - 220;
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(btnX, btnY, btnW, btnH, 45);
          const btnGrad = ctx.createLinearGradient(btnX, 0, btnX + btnW, 0);
          btnGrad.addColorStop(0, "#e84393");
          btnGrad.addColorStop(1, "#c0306f");
          ctx.fillStyle = btnGrad;
          ctx.fill();
          ctx.restore();
          ctx.font = "bold 40px sans-serif";
          ctx.fillStyle = "#ffffff";
          ctx.fillText("Abra seu presente ♥", W / 2, btnY + 60);

          // URL
          ctx.font = "28px sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.fillText("lovegift.com.br", W / 2, H - 90);

          // Exporta
          canvas.toBlob(async (blob) => {
            if (!blob) throw new Error("canvas vazio");
            const file = new File([blob], "lovegift-story.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: `Um presente para ${nome} ♥`,
                text: `Abra em: ${url}`,
              });
            } else {
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "lovegift-story.png";
              a.click();
            }
          }, "image/png");
        };

        if (fotoUrl) {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => drawCard(img);
          img.onerror = () => drawCard(null);
          img.src = fotoUrl;
        } else {
          drawCard(null);
        }
      };

      draw();
    } catch {
      navigator.clipboard.writeText(url).then(() => {
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      });
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse-heart">♥</div>
          <p className="text-white/50">Abrindo seu presente...</p>
        </div>
      </div>
    );
  }

  if (!presente) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white text-center px-4">
        <div>
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold mb-2">Presente não encontrado</h1>
          <p className="text-white/50">O link pode estar incorreto ou expirado.</p>
        </div>
      </div>
    );
  }

  const tema = TEMAS[presente.tema] || TEMAS.romantico;
  const oc = getOcasiaoConfig(presente.ocasiao);
  const diasJuntos = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;

  const youtubeId = presente.musicaUrl ? getYoutubeId(presente.musicaUrl) : null;

  if (!aberto) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Fundo com foto desfocada */}
        {presente.fotos.length > 0 && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={presente.fotos[0].url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25 blur-2xl scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]/85" />
          </>
        )}
        {/* Partículas de brilho com cor da ocasião */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-10 animate-pulse"
              style={{
                background: oc.corHex,
                width: `${80 + i * 40}px`,
                height: `${80 + i * 40}px`,
                top: `${10 + i * 15}%`,
                left: `${5 + i * 18}%`,
                animationDelay: `${i * 0.5}s`,
                filter: "blur(30px)",
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${oc.corHex}26 0%, transparent 65%)` }} />

        <div className="relative max-w-sm mx-auto w-full">
          {/* Badge da ocasião */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/50 uppercase tracking-widest mb-8">
            {oc.emoji} {presente.ocasiao}
          </div>

          {/* Emoji animado da ocasião */}
          <div className="relative mb-6">
            <div className="text-8xl animate-pulse-heart" style={{ filter: `drop-shadow(0 0 40px ${oc.corHex}b3)` }}>{oc.emoji}</div>
          </div>

          <p className="text-white/30 text-xs uppercase tracking-widest mb-2">{oc.titulo}</p>
          <h1 className="text-5xl font-black text-white mb-3 leading-tight">
            {presente.nomeDestinatario}
          </h1>
          <div className="w-12 h-px bg-[#e84393]/40 mx-auto my-5" />
          <p className="text-white/40 text-base mb-3">
            Com todo o amor de
          </p>
          <p className="text-white text-xl font-bold mb-10">{presente.nomeRemetente}</p>

          <button
            onClick={() => setAberto(true)}
            className="w-full text-white font-bold px-10 py-5 rounded-2xl transition-all hover:scale-105 text-lg relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #e84393 0%, #c0306f 100%)", boxShadow: "0 16px 48px rgba(232,67,147,0.5)" }}
          >
            <span className="relative z-10">Abrir presente ♥</span>
          </button>
          <p className="text-white/20 text-xs mt-5 animate-pulse">Toque para revelar a surpresa</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${tema.bg} ${tema.text} pb-28`}>
      {wrappedAberto && (
        <Wrapped presente={presente} onClose={() => setWrappedAberto(false)} />
      )}

      {/* MODAL UPSELL PREMIUM */}
      {upsellAberto && !presente.premium && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(160deg, #1a1200 0%, #0a0a0a 100%)", border: "1px solid rgba(245,199,24,0.3)" }}>
            {/* Header dourado */}
            <div className="px-6 py-4 text-center" style={{ background: "linear-gradient(135deg, #f5c518, #e8b400)" }}>
              <div className="text-3xl mb-1">👑</div>
              <p className="font-black text-black text-lg">Eleve seu presente para Premium!</p>
              <p className="text-black/70 text-sm">Por apenas <strong>+ R$ 9,90</strong></p>
            </div>
            {/* Features */}
            <div className="p-6 space-y-3">
              <p className="text-white/60 text-sm text-center mb-4">Seu presente ficou incrível! Quer deixá-lo ainda mais especial?</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "🎧", text: "Spotify embed" },
                  { icon: "📸", text: "Até 30 fotos" },
                  { icon: "✨", text: "Tema Luxo" },
                  { icon: "🎬", text: "Vídeo destaque" },
                  { icon: "🔗", text: "Link personalizado" },
                  { icon: "🎁", text: "Moldura premium" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-white/80 bg-white/5 rounded-xl px-3 py-2">
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 space-y-2">
                <a href={`/premium/${slug}`}
                  className="block w-full text-center font-black py-4 rounded-2xl text-black transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #f5c518, #e8b400)", boxShadow: "0 8px 32px rgba(245,199,24,0.4)" }}>
                  👑 Quero o Premium — R$ 9,90
                </a>
                <button onClick={() => setUpsellAberto(false)}
                  className="block w-full text-center text-white/40 text-sm py-2 hover:text-white/70 transition-colors">
                  Não, obrigado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante Ver História */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
        <button
          onClick={() => setWrappedAberto(true)}
          className="flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 whitespace-nowrap"
          style={{ background: "linear-gradient(135deg, #e84393 0%, #c0306f 100%)", boxShadow: "0 8px 32px rgba(232,67,147,0.55)" }}
        >
          {oc.wrappedBtn}
        </button>
      </div>

      {/* BLOCO 1 — Cabeçalho */}
      <section className="text-center py-20 px-4 relative overflow-hidden">
        {presente.fotos.length > 0 && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={presente.fotos[0].url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10 blur-3xl scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
          </>
        )}
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs uppercase tracking-widest mb-6"
            style={{ background: `${oc.corHex}1a`, border: `1px solid ${oc.corHex}33`, color: oc.corHex }}>
            {oc.emoji} {presente.ocasiao}
          </div>
          <div className="text-6xl mb-5 animate-pulse-heart" style={{ filter: `drop-shadow(0 0 20px ${oc.corHex}66)` }}>{oc.emoji}</div>
          <p className="text-sm opacity-40 mb-2 uppercase tracking-widest">{oc.titulo}</p>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            {presente.nomeDestinatario}
          </h1>
          <p className="opacity-40 text-base">{oc.subtitulo} — <span className="opacity-80 font-semibold">{presente.nomeRemetente}</span></p>
        </div>
      </section>

      {/* CONTADOR AO VIVO */}
      {presente.dataEspecial && (
        <section className="max-w-2xl mx-auto px-4 mb-16">
          <p className="text-center text-xs opacity-40 uppercase tracking-widest mb-4">⏳ {oc.contadorLabel}</p>
          <div className="grid grid-cols-4 gap-3">
            {[
              { valor: contador.dias, label: "dias" },
              { valor: contador.horas, label: "horas" },
              { valor: contador.minutos, label: "min" },
              { valor: contador.segundos, label: "seg" },
            ].map(({ valor, label }) => (
              <div key={label} className={`${tema.card} border ${tema.border} rounded-2xl p-4 text-center`}>
                <p className={`text-3xl font-black tabular-nums ${tema.accent}`}>
                  {String(valor).padStart(2, "0")}
                </p>
                <p className="text-xs opacity-50 uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MARCADORES */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 gap-3">
          <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 text-center`}>
            <p className={`text-3xl font-black ${tema.accent}`}>{presente.fotos.length}</p>
            <p className="text-xs opacity-50 uppercase tracking-widest mt-1">{presente.fotos.length === 1 ? "foto especial" : "fotos especiais"}</p>
          </div>
          {diasJuntos !== null && diasJuntos > 0 && (
            <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 text-center`}>
              <p className={`text-3xl font-black ${tema.accent}`}>{Math.floor(diasJuntos / 30)}</p>
              <p className="text-xs opacity-50 uppercase tracking-widest mt-1">{oc.mesesSufixo}</p>
            </div>
          )}
          {presente.dataEspecial && (
            <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 text-center col-span-${diasJuntos !== null && diasJuntos > 0 ? "1" : "2"}`}>
              <p className={`text-lg font-black ${tema.accent}`}>
                {new Date(presente.dataEspecial).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
              <p className="text-xs opacity-50 uppercase tracking-widest mt-1">data especial</p>
            </div>
          )}
          {!presente.dataEspecial && (
            <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 text-center`}>
              <p className="text-2xl">🎵</p>
              <p className={`text-sm font-semibold ${tema.accent} mt-1 truncate`}>{presente.musica}</p>
              <p className="text-xs opacity-50 uppercase tracking-widest mt-1">nossa música</p>
            </div>
          )}
        </div>
      </section>

      {/* BLOCO 2 — Mensagem */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <h2 className="text-center text-xl font-bold mb-6 opacity-60 uppercase tracking-widest text-sm">💌 Mensagem especial</h2>
        <div className={`${tema.card} border ${tema.border} rounded-3xl p-8 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 text-[120px] opacity-5 leading-none select-none">&ldquo;</div>
          <p className="text-xl leading-relaxed font-light opacity-90 relative z-10">&ldquo;{presente.mensagem}&rdquo;</p>
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#e84393]/20 border border-[#e84393]/30 flex items-center justify-center text-sm">♥</div>
            <p className={`font-bold ${tema.accent}`}>{presente.nomeRemetente}</p>
          </div>
        </div>
      </section>

      {/* BLOCO 3 — Slideshow de Fotos */}
      {presente.fotos.length > 0 && (
        <section className="mb-16">
          <h2 className="text-center font-bold mb-8 px-4 text-sm uppercase tracking-widest opacity-60">{oc.fotosTitulo}</h2>
          <div className="relative max-w-lg mx-auto px-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl">
              {presente.fotos.map((foto, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={foto.id}
                  src={foto.url}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                    i === fotoAtual ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                />
              ))}

              {/* Gradiente de baixo */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Número da foto */}
              {presente.fotos.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur rounded-full px-3 py-1 text-white text-xs font-semibold">
                  {fotoAtual + 1}/{presente.fotos.length}
                </div>
              )}

              {/* Controles */}
              {presente.fotos.length > 1 && (
                <>
                  <button
                    onClick={() => setFotoAtual((prev) => (prev - 1 + presente.fotos.length) % presente.fotos.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white text-xl hover:bg-black/70 transition-colors"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setFotoAtual((prev) => (prev + 1) % presente.fotos.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white text-xl hover:bg-black/70 transition-colors"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Dots */}
            {presente.fotos.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {presente.fotos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setFotoAtual(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === fotoAtual ? "bg-[#e84393] w-6" : "bg-white/20 w-1.5"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* BLOCO 4 — Música */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <h2 className="text-center font-bold mb-6 text-sm uppercase tracking-widest opacity-60">{oc.musicaTitulo}</h2>
        <div className="bg-[#111] rounded-3xl overflow-hidden border border-white/10 shadow-xl">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(232,67,147,0.2) 0%, rgba(192,48,111,0.2) 100%)", border: "1px solid rgba(232,67,147,0.2)" }}>
                🎵
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Tocando agora</p>
                <p className="font-bold text-lg text-white truncate">{presente.musica}</p>
              </div>
            </div>
          </div>
          {youtubeId && (
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}`}
                title="Nossa música"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* BLOCO 5 — Linha do Tempo */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <h2 className="text-center font-bold mb-8 text-sm uppercase tracking-widest opacity-60">{oc.jornadaTitulo}</h2>
        <div className="relative pl-8">
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[#e84393]/50 via-[#e84393]/20 to-transparent" />
          {[
            {
              data: presente.dataEspecial
                ? new Date(presente.dataEspecial).toLocaleDateString("pt-BR")
                : "Um dia especial",
              icon: oc.emoji,
              titulo: oc.timelineInicio,
              desc: `${presente.nomeRemetente} e ${presente.nomeDestinatario} — ${oc.subtitulo.toLowerCase()}`,
            },
            {
              data: "Hoje",
              icon: "⭐",
              titulo: oc.timelineHoje,
              desc: diasJuntos && diasJuntos > 0
                ? `São ${diasJuntos.toLocaleString("pt-BR")} dias de amor, crescimento e cumplicidade`
                : "Cada dia ao seu lado é um presente em si mesmo",
            },
          ].map((item, i) => (
            <div key={i} className="relative mb-10 last:mb-0">
              <div className="absolute -left-5 w-8 h-8 rounded-full flex items-center justify-center text-base shadow-lg" style={{ background: `linear-gradient(135deg, ${oc.corHex}, ${oc.corHex}99)` }}>
                {item.icon}
              </div>
              <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 ml-4`}>
                <p className={`text-xs ${tema.accent} font-bold uppercase tracking-widest mb-1`}>{item.data}</p>
                <h3 className="font-bold mb-1">{item.titulo}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOCO 6 — Encerramento */}
      <section className="text-center px-4 mb-10">
        <div className={`text-6xl ${tema.accent} animate-pulse-heart mb-5`} style={{ filter: "drop-shadow(0 0 20px rgba(232,67,147,0.4))" }}>♥</div>
        <h2 className="text-3xl md:text-4xl font-black mb-3">
          {presente.nomeRemetente} {oc.encerramento} ♥
        </h2>
        {diasJuntos !== null && diasJuntos > 0 && (
          <p className="text-base opacity-50 mb-10">
            {oc.encerramentoFrase} <strong className={`${tema.accent} opacity-100`}>{diasJuntos.toLocaleString("pt-BR")} dias</strong> {oc.diasSufixo}
          </p>
        )}
      </section>

      {/* BLOCO 7 — QR Code + Compartilhar */}
      <section className="max-w-md mx-auto px-4 mb-12">
        <div className={`${tema.card} border ${tema.border} rounded-3xl p-7`}>
          <h3 className="text-center font-bold mb-1 text-sm uppercase tracking-widest opacity-50">Compartilhe este presente</h3>
          <p className="text-center text-xs opacity-30 mb-6">Envie o link para quem você ama</p>

          {/* Botões de share */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              onClick={handleWhatsapp}
              className="flex flex-col items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-bold py-3 rounded-xl transition-all hover:scale-105 text-xs"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.11 1.523 5.836L.057 23.997l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.034-1.387l-.36-.214-3.742.981 1-3.641-.235-.374A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
              </svg>
              WhatsApp
            </button>
            <button
              onClick={handleInstagram}
              className="flex flex-col items-center justify-center gap-1.5 text-white font-bold py-3 rounded-xl transition-all hover:scale-105 text-xs"
              style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </button>
            <button
              onClick={handleCopiarLink}
              className={`flex flex-col items-center justify-center gap-1.5 font-bold py-3 rounded-xl transition-all hover:scale-105 text-xs border ${
                copiado
                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                  : "bg-white/5 border-white/10 text-white hover:bg-white/10"
              }`}
            >
              <span className="text-lg leading-none">{copiado ? "✓" : "🔗"}</span>
              {copiado ? "Copiado!" : "Copiar link"}
            </button>
          </div>

          {/* QR Code */}
          {qrCode && (
            <div className="text-center">
              <p className="text-xs opacity-30 mb-3 uppercase tracking-widest">ou escaneie o QR Code</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="QR Code do presente" className="w-32 h-32 mx-auto rounded-xl opacity-80" />
            </div>
          )}
        </div>
      </section>

      {/* CTA — Crie o seu */}
      <section className="max-w-md mx-auto px-4 pb-4">
        <div className="rounded-3xl p-7 text-center border border-[#e84393]/20 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(232,67,147,0.08) 0%, rgba(192,48,111,0.04) 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(232,67,147,0.08) 0%, transparent 70%)" }} />
          <div className="relative">
            <p className="text-2xl mb-3">🎁</p>
            <h3 className="font-black text-xl mb-2 text-white">Crie um presente igual</h3>
            <p className="text-sm opacity-50 mb-5 leading-relaxed">
              Emocione quem você ama com fotos, música e uma retrospectiva animada. Por apenas R$ 9,90.
            </p>
            <Link
              href="/criar"
              className="inline-block font-bold px-8 py-3.5 rounded-2xl text-white text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #e84393 0%, #c0306f 100%)", boxShadow: "0 8px 24px rgba(232,67,147,0.35)" }}
            >
              Criar meu presente → R$ 9,90
            </Link>
            <p className="text-xs opacity-25 mt-3">Pagamento único · Entrega imediata · Acesso permanente</p>
          </div>
        </div>
      </section>
    </div>
  );
}
