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
  netflix: {
    bg: "bg-[#141414]",
    accent: "text-[#E50914]",
    card: "bg-[#1f1f1f]",
    text: "text-white",
    border: "border-[#E50914]/30",
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
  const [musicaTocando, setMusicaTocando] = useState(false);
  const [wrappedAberto, setWrappedAberto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [gerandoVideo, setGerandoVideo] = useState<string | null>(null);
  const [videoPronto, setVideoPronto] = useState<{ file: File; url: string; name: string } | null>(null);
  const [gerandoLivro, setGerandoLivro] = useState(false);
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
    }
  }, [slug, searchParams]);

  useEffect(() => {
    fetch(`/api/presentes/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setPresente(data);
        setCarregando(false);
        // Dispara Purchase no Pixel apenas uma vez por presente, e só quando
        // o comprador volta do pagamento (?pago=1). Usa o valor real (premium ou padrão).
        if (
          typeof window !== "undefined" &&
          searchParams.get("pago") === "1" &&
          sessionStorage.getItem(`lg_purchase_${slug}`) !== "1"
        ) {
          const fbq = (window as unknown as Record<string, ((a: string, b: string, c?: Record<string, unknown>) => void) | undefined>).fbq;
          if (fbq) fbq("track", "Purchase", { value: data?.premium ? 19.9 : 16.9, currency: "BRL" });
          sessionStorage.setItem(`lg_purchase_${slug}`, "1");
        }
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

  // Efeito de abertura: chuva suave de pétalas + corações (premium, não "confete de papel")
  useEffect(() => {
    if (!aberto || !presente) return;
    const ehFamilia = ["Dia das Mães", "Dia dos Pais", "Dia das Avós", "Dia dos Avôs"].includes(presente.ocasiao);
    // formas a partir de emojis (renderizam coloridas)
    const sf = (t: string, s = 2) =>
      (confetti as unknown as { shapeFromText: (o: { text: string; scalar: number }) => unknown }).shapeFromText({ text: t, scalar: s });
    const formas = (ehFamilia ? [sf("🌸"), sf("💐"), sf("💖")] : [sf("🌹"), sf("🌸"), sf("❤️"), sf("✨", 1.4)]) as import("canvas-confetti").Shape[];

    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    // 1) "pop" de boas-vindas dos cantos de baixo
    timers.push(setTimeout(() => {
      const pop = (angle: number, x: number) =>
        confetti({ particleCount: 18, spread: 75, angle, startVelocity: 48, gravity: 1, decay: 0.92,
          scalar: 1.8, ticks: 180, origin: { x, y: 1 }, shapes: formas, disableForReducedMotion: true });
      pop(60, 0); pop(120, 1);
    }, 250));

    // 2) chuva suave caindo do topo por ~3,5s
    timers.push(setTimeout(() => {
      const fim = Date.now() + 3500;
      const rain = setInterval(() => {
        if (Date.now() > fim) { clearInterval(rain); return; }
        confetti({
          particleCount: 3, startVelocity: 0, ticks: 340, gravity: 0.5, decay: 0.95,
          scalar: 1.6, drift: (Math.random() - 0.5) * 1.4, flat: false,
          origin: { x: Math.random(), y: -0.1 }, shapes: formas, disableForReducedMotion: true,
        });
      }, 170);
      intervals.push(rain);
    }, 350));

    return () => { timers.forEach(clearTimeout); intervals.forEach(clearInterval); };
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

  // Exporta o presente como vídeo vertical (MP4/WebM) pra postar no Instagram.
  const gerarVideo = async () => {
    if (!presente) return;
    const cTest = document.createElement("canvas") as HTMLCanvasElement & {
      captureStream?: (fps?: number) => MediaStream;
    };
    if (typeof MediaRecorder === "undefined" || typeof cTest.captureStream !== "function") {
      await handleInstagram(); // fallback: imagem (story PNG)
      return;
    }

    try {
      setGerandoVideo("Preparando…");
      const W = 720, H = 1280;
      const canvas = document.createElement("canvas") as HTMLCanvasElement & {
        captureStream: (fps?: number) => MediaStream;
      };
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      const nome = presente.nomeDestinatario || "Você";
      const rem = presente.nomeRemetente || "";
      const msg = presente.mensagem || "";
      const dias = presente.dataEspecial
        ? Math.max(0, Math.floor((Date.now() - new Date(presente.dataEspecial).getTime()) / 86400000))
        : null;

      const loadImg = (src: string) =>
        new Promise<HTMLImageElement | null>((res) => {
          const im = new Image();
          im.crossOrigin = "anonymous";
          im.onload = () => res(im);
          im.onerror = () => res(null);
          im.src = src;
        });

      const fotos = (presente.fotos || []).slice(0, 6);
      const imgs = (await Promise.all(fotos.map((f) => loadImg(f.url)))).filter(
        (x): x is HTMLImageElement => !!x
      );
      // QR final aponta pro site de vendas (quem vê o vídeo postado vai criar o seu)
      let qrImg: HTMLImageElement | null = null;
      try {
        const qrData = await QRCodeLib.toDataURL("https://lovegift.art.br", {
          width: 320, margin: 1, color: { dark: "#0a0008", light: "#ffffff" },
        });
        qrImg = await loadImg(qrData);
      } catch { qrImg = null; }
      const mascote = await loadImg("/images/mascote.png");
      const legendas = [
        "Meu lugar favorito é ao seu lado",
        "Cada instante com você é especial",
        "A gente combina demais",
        "Você é o meu presente",
        "Pra sempre, nós dois",
        "Te amo mais a cada dia",
      ];

      // Fundo de vídeo reutilizável (Veo). Mesma origem → não invalida o canvas.
      const bg = document.createElement("video");
      bg.src = "/videos/fundo-video.mp4";
      bg.loop = true; bg.muted = true; bg.playsInline = true;
      let bgOk = false;
      try {
        await new Promise<void>((res, rej) => {
          bg.oncanplay = () => res();
          bg.onerror = () => rej(new Error("bg"));
          window.setTimeout(() => rej(new Error("timeout")), 4000);
        });
        await bg.play();
        bgOk = true;
      } catch { bgOk = false; }

      // Áudio (best-effort — pode falhar por CORS)
      let audioEl: HTMLAudioElement | null = null;
      let audioCtx: AudioContext | null = null;
      let audioTrack: MediaStreamTrack | null = null;
      if (presente.musicaUrl && /\.mp3(\?|$)/i.test(presente.musicaUrl)) {
        try {
          audioEl = document.createElement("audio");
          audioEl.src = presente.musicaUrl;
          audioEl.crossOrigin = "anonymous";
          audioEl.loop = true;
          await audioEl.play();
          const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtx = new AC();
          const dest = audioCtx.createMediaStreamDestination();
          audioCtx.createMediaElementSource(audioEl).connect(dest);
          audioTrack = dest.stream.getAudioTracks()[0] || null;
        } catch { audioTrack = null; }
      }

      // Fonte elegante (Playfair Display) carregada pro canvas
      try {
        if (!document.getElementById("lg-playfair")) {
          const lk = document.createElement("link");
          lk.id = "lg-playfair"; lk.rel = "stylesheet";
          lk.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;1,500&display=swap";
          document.head.appendChild(lk);
        }
        await Promise.all([
          document.fonts.load("800 80px 'Playfair Display'"),
          document.fonts.load("600 40px 'Playfair Display'"),
          document.fonts.load("italic 500 34px 'Playfair Display'"),
        ]);
        await document.fonts.ready;
      } catch { /* usa serifa do sistema */ }

      const stream = canvas.captureStream(30);
      if (audioTrack) stream.addTrack(audioTrack);
      const mime =
        MediaRecorder.isTypeSupported("video/mp4;codecs=h264,aac") ? "video/mp4;codecs=h264,aac" :
        MediaRecorder.isTypeSupported("video/mp4") ? "video/mp4" :
        MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" :
        "video/webm";
      const ext = mime.startsWith("video/mp4") ? "mp4" : "webm";
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };

      const baixar = (blob: Blob, name: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      };
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const done = new Promise<void>((resolve) => {
        rec.onstop = async () => {
          try { bg.pause(); } catch {}
          try { audioEl?.pause(); await audioCtx?.close(); } catch {}
          const blob = new Blob(chunks, { type: mime });
          const file = new File([blob], `lovegift-${presente.slug}.${ext}`, { type: mime });
          if (isMobile) {
            // No celular o navigator.share PRECISA de um toque "fresco". Durante a
            // renderização (~15s) a ativação do clique original expira, então o share
            // falharia. Guardamos o vídeo e mostramos um player + botão pra o usuário
            // tocar de novo e compartilhar nos Stories (gesto válido).
            setVideoPronto((prev) => {
              if (prev) URL.revokeObjectURL(prev.url);
              return { file, url: URL.createObjectURL(blob), name: file.name };
            });
          } else {
            baixar(blob, file.name); // desktop: download direto
          }
          resolve();
        };
      });

      // ---- helpers de desenho ----
      const coverDraw = (
        src: CanvasImageSource, iw: number, ih: number,
        x: number, y: number, w: number, h: number, zoom = 1
      ) => {
        const r = Math.max(w / iw, h / ih) * zoom;
        const dw = iw * r, dh = ih * r;
        ctx.drawImage(src, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      };
      const rr = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
      };
      const wrap = (text: string, x: number, y: number, maxW: number, lh: number, max = 99) => {
        const words = text.split(" "); let line = ""; let yy = y; let n = 0;
        for (const wd of words) {
          const t = line + wd + " ";
          if (ctx.measureText(t).width > maxW && line) {
            ctx.fillText(line.trim(), x, yy); line = wd + " "; yy += lh;
            if (++n >= max) return yy;
          } else line = t;
        }
        ctx.fillText(line.trim(), x, yy); return yy;
      };
      const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";
      const SERIF = "'Playfair Display', Georgia, serif";
      const setLS = (v: string) => { try { (ctx as unknown as { letterSpacing: string }).letterSpacing = v; } catch {} };
      // rótulo: maiúsculo espaçado + fina régua dourada (sem caixa)
      const label = (text: string, cx: number, cy: number, color = "rgba(255,255,255,0.9)") => {
        ctx.save();
        ctx.font = `600 22px ${SANS}`; setLS("5px");
        ctx.fillStyle = color; ctx.shadowColor = "rgba(0,0,0,0.65)"; ctx.shadowBlur = 8;
        ctx.fillText(text.toUpperCase(), cx, cy);
        ctx.restore(); setLS("0px");
        ctx.save();
        ctx.strokeStyle = "rgba(245,197,24,0.8)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx - 26, cy + 16); ctx.lineTo(cx + 26, cy + 16); ctx.stroke();
        ctx.restore();
      };
      // título em serifa elegante com glow (sem caixa)
      const title = (
        text: string, cx: number, cy: number, size: number,
        o: { italic?: boolean; weight?: string; color?: string; glow?: string; blur?: number } = {}
      ) => {
        const { italic = false, weight = "800", color = "#fff", glow = "rgba(0,0,0,0.55)", blur = 18 } = o;
        ctx.save();
        ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${SERIF}`;
        ctx.fillStyle = color; ctx.shadowColor = glow; ctx.shadowBlur = blur; ctx.shadowOffsetY = 2;
        ctx.fillText(text, cx, cy);
        ctx.restore();
      };
      // botão CTA com gradiente
      const ctaButton = (text: string, cx: number, cy: number, size: number) => {
        ctx.save();
        ctx.font = `700 ${size}px ${SANS}`;
        const w = ctx.measureText(text).width;
        const padX = size * 0.95, h = size * 2.1, bw = w + padX * 2;
        ctx.textBaseline = "middle";
        const g = ctx.createLinearGradient(cx - bw / 2, 0, cx + bw / 2, 0);
        g.addColorStop(0, "#e84393"); g.addColorStop(1, "#c0306f");
        rr(cx - bw / 2, cy - h / 2, bw, h, h / 2);
        ctx.shadowColor = "rgba(232,67,147,0.5)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 6;
        ctx.fillStyle = g; ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        ctx.fillStyle = "#fff"; ctx.fillText(text, cx, cy);
        ctx.restore(); ctx.textBaseline = "alphabetic";
      };
      const drawBg = () => {
        if (bgOk && bg.videoWidth) {
          try {
            // corta os ~15% de baixo do fundo (onde fica a marca d'água do Veo)
            const vw = bg.videoWidth, vh = bg.videoHeight;
            const cropH = vh * 0.85;
            const r = Math.max(W / vw, H / cropH);
            const dw = vw * r, dh = cropH * r;
            ctx.drawImage(bg, 0, 0, vw, cropH, (W - dw) / 2, (H - dh) / 2, dw, dh);
          } catch { /* taint */ }
          ctx.fillStyle = "rgba(13,0,8,0.5)"; ctx.fillRect(0, 0, W, H);
        } else {
          const g = ctx.createLinearGradient(0, 0, W, H);
          g.addColorStop(0, "#2a0014"); g.addColorStop(0.5, "#0d0008"); g.addColorStop(1, "#2a0014");
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        }
      };

      const T_INTRO = 2.6, T_CONT = (dias && dias > 0) ? 2.4 : 0, T_FOTO = 2.0, T_OUTRO = 3.4;
      const T_FOTOS = imgs.length * T_FOTO;
      const TOTAL = T_INTRO + T_CONT + T_FOTOS + T_OUTRO;

      const start = performance.now();
      const render = () => {
        const e = (performance.now() - start) / 1000;
        drawBg();
        ctx.textAlign = "center";

        if (e < T_INTRO) {
          ctx.globalAlpha = Math.min(1, (e / T_INTRO) * 2);
          if (mascote) ctx.drawImage(mascote, W / 2 - 72, H * 0.20 - 72, 144, 144);
          label(presente.ocasiao || "", W / 2, H * 0.40, "#ffd9e6");
          title(nome, W / 2, H * 0.51, 92, { glow: "rgba(232,67,147,0.55)", blur: 28 });
          if (rem) title(`com amor de ${rem}`, W / 2, H * 0.585, 32, { italic: true, weight: "500", color: "rgba(255,255,255,0.88)", glow: "rgba(0,0,0,0.5)", blur: 10 });
          title("uma história pra chamar de nossa", W / 2, H * 0.66, 24, { italic: true, weight: "500", color: "rgba(255,255,255,0.62)", glow: "rgba(0,0,0,0.45)", blur: 8 });
          ctx.globalAlpha = 1;
        } else if (e < T_INTRO + T_CONT) {
          ctx.globalAlpha = Math.min(1, ((e - T_INTRO) / T_CONT) * 3);
          label("O nosso tempo juntos", W / 2, H * 0.36);
          title(Number(dias).toLocaleString("pt-BR"), W / 2, H * 0.53, 150, { glow: "rgba(232,67,147,0.85)", blur: 44 });
          title("dias de nós dois", W / 2, H * 0.61, 42, { italic: true, weight: "500", glow: "rgba(0,0,0,0.5)", blur: 12 });
          title("e cada um deles valeu a pena 💕", W / 2, H * 0.68, 24, { italic: true, weight: "500", color: "rgba(255,255,255,0.62)", glow: "rgba(0,0,0,0.45)", blur: 8 });
          ctx.globalAlpha = 1;
        } else if (e < T_INTRO + T_CONT + T_FOTOS && imgs.length) {
          const idx = Math.min(imgs.length - 1, Math.floor((e - T_INTRO - T_CONT) / T_FOTO));
          const local = ((e - T_INTRO - T_CONT) % T_FOTO) / T_FOTO;
          const im = imgs[idx];
          const m = 56, cx = m, cy = H * 0.12, cw = W - 2 * m, ch = H * 0.62;
          ctx.save();
          rr(cx - 6, cy - 6, cw + 12, ch + 12, 34);
          ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
          ctx.fillStyle = "#fff"; ctx.fill();
          ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
          rr(cx, cy, cw, ch, 30); ctx.clip();
          coverDraw(im, im.naturalWidth, im.naturalHeight, cx, cy, cw, ch, 1.04 + local * 0.08);
          ctx.restore();
          ctx.textAlign = "center";
          title(legendas[idx % legendas.length], W / 2, cy + ch + 60, 30, { italic: true, weight: "500", glow: "rgba(0,0,0,0.55)", blur: 12 });
        } else {
          ctx.globalAlpha = Math.min(1, (e - (T_INTRO + T_CONT + T_FOTOS)) / 0.6);
          ctx.textAlign = "center";
          const msgC = msg.length > 130 ? msg.slice(0, 127) + "…" : msg;
          if (msgC) {
            ctx.save();
            const sg = ctx.createRadialGradient(W / 2, H * 0.18, 0, W / 2, H * 0.18, 380);
            sg.addColorStop(0, "rgba(8,0,5,0.62)"); sg.addColorStop(1, "transparent");
            ctx.fillStyle = sg; ctx.fillRect(0, H * 0.06, W, H * 0.26);
            ctx.font = `italic 500 34px ${SERIF}`; ctx.fillStyle = "#fff";
            ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 12;
            wrap(`“${msgC}”`, W / 2, H * 0.155, W - 150, 48, 4);
            ctx.restore();
          }
          if (qrImg) {
            const s = 250;
            ctx.save();
            ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 22; ctx.shadowOffsetY = 6;
            ctx.fillStyle = "#fff"; rr(W / 2 - s / 2 - 16, H * 0.42 - 16, s + 32, s + 32, 22); ctx.fill();
            ctx.restore();
            ctx.drawImage(qrImg, W / 2 - s / 2, H * 0.42, s, s);
            label("Aponte a câmera e crie o seu", W / 2, H * 0.42 + s + 50, "rgba(255,255,255,0.9)");
          }
          ctaButton("Crie o seu • lovegift.art.br", W / 2, H * 0.9, 27);
          ctx.globalAlpha = 1;
        }

        setGerandoVideo(`Gerando seu vídeo… ${Math.min(99, Math.round((e / TOTAL) * 100))}%`);
        if (e < TOTAL && rec.state === "recording") requestAnimationFrame(render);
        else if (rec.state === "recording") rec.stop();
      };

      rec.start();
      requestAnimationFrame(render);
      await done;
    } catch (err) {
      console.error("gerarVideo", err);
    } finally {
      setGerandoVideo(null);
    }
  };

  // Compartilhar/baixar o vídeo já pronto — chamado por um NOVO toque do usuário
  // (gesto válido), então o navigator.share não falha por ativação expirada.
  const compartilharVideo = async () => {
    if (!videoPronto || !presente) return;
    const { file, url, name } = videoPronto;
    const shareUrl = window.location.href.split("?")[0];
    const nome = presente.nomeDestinatario || "Você";
    if (typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `Presente para ${nome} ♥`, text: shareUrl });
        return;
      } catch (e) {
        if ((e as Error)?.name === "AbortError") return; // usuário cancelou
        // qualquer outro erro → cai pro download abaixo
      }
    }
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
  };

  // ===== LIVRO PDF (físico, pra imprimir) =====
  const gerarLivroPDF = async () => {
    if (!presente || gerandoLivro) return;
    setGerandoLivro(true);
    try {
      const { jsPDF } = await import("jspdf");
      const W = 1240, H = 1754; // A4 retrato ~150dpi
      const SERIF = "'Playfair Display', Georgia, serif";
      const SANS = "system-ui, -apple-system, 'Segoe UI', sans-serif";
      const OURO = "#b8932f", OURO2 = "rgba(184,147,47,0.45)", VINHO = "#7a1038", TINTA = "#4a2030";

      try { await document.fonts.load(`700 90px ${SERIF}`); await document.fonts.load(`italic 500 40px ${SERIF}`); await document.fonts.ready; } catch {}

      const loadImg = (src: string) =>
        new Promise<HTMLImageElement | null>((res) => {
          const im = new Image(); im.crossOrigin = "anonymous";
          im.onload = () => res(im); im.onerror = () => res(null); im.src = src;
        });

      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [W, H], compress: true });
      let first = true;

      // ----- margens com espaço pra ENCADERNAÇÃO -----
      const M = 90;            // margem segura (todos os lados)
      const GUT = 95;          // gutter extra na lombada (lado interno/esquerdo)
      const fL = M + GUT, fT = M, fR = W - M, fB = H - M; // moldura segura
      const cx = (fL + fR) / 2;                            // centro do conteúdo (deslocado p/ direita)
      const cw = fR - fL;
      let ctx2: CanvasRenderingContext2D; // referência usada por LS
      const LS = (v: string) => { try { (ctx2 as unknown as { letterSpacing: string }).letterSpacing = v; } catch {} };

      const novaPagina = () => {
        const c = document.createElement("canvas"); c.width = W; c.height = H;
        const ctx = c.getContext("2d")!; ctx2 = ctx;
        // fundo creme
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "#fffaf4"); g.addColorStop(1, "#fbeee2");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // textura suave de pétalas nos cantos (sutil)
        ctx.fillStyle = "rgba(232,67,147,0.05)";
        ctx.beginPath(); ctx.arc(fR, fT, 220, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(fL, fB, 240, 0, Math.PI * 2); ctx.fill();
        // marca leve da dobra (lombada) na margem interna
        const sp = ctx.createLinearGradient(fL - GUT, 0, fL, 0);
        sp.addColorStop(0, "rgba(122,16,56,0.05)"); sp.addColorStop(1, "transparent");
        ctx.fillStyle = sp; ctx.fillRect(fL - GUT, fT, GUT, fB - fT);
        // moldura dourada dupla (dentro da área segura)
        ctx.strokeStyle = OURO; ctx.lineWidth = 3; ctx.strokeRect(fL, fT, cw, fB - fT);
        ctx.strokeStyle = OURO2; ctx.lineWidth = 1.5; ctx.strokeRect(fL + 16, fT + 16, cw - 32, fB - fT - 32);
        // fleurons dourados nos cantos
        ctx.font = "26px " + SANS; ctx.fillStyle = OURO; ctx.textAlign = "center";
        [[fL + 30, fT + 44], [fR - 30, fT + 44], [fL + 30, fB - 26], [fR - 30, fB - 26]].forEach(([x, y]) => ctx.fillText("❦", x, y));
        return { c, ctx };
      };

      // desenha um coração preenchido (emblema)
      const heart = (ctx: CanvasRenderingContext2D, cxh: number, cyh: number, s: number, fill: string | CanvasGradient) => {
        ctx.save(); ctx.beginPath();
        ctx.moveTo(cxh, cyh + s * 0.35);
        ctx.bezierCurveTo(cxh, cyh + s * 0.1, cxh - s, cyh - s * 0.1, cxh - s, cyh - s * 0.5);
        ctx.bezierCurveTo(cxh - s, cyh - s, cxh - s * 0.35, cyh - s, cxh, cyh - s * 0.5);
        ctx.bezierCurveTo(cxh + s * 0.35, cyh - s, cxh + s, cyh - s, cxh + s, cyh - s * 0.5);
        ctx.bezierCurveTo(cxh + s, cyh - s * 0.1, cxh, cyh + s * 0.1, cxh, cyh + s * 0.35);
        ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.restore();
      };

      // ----- CAPA estilo livro de romance (couro + dourado) -----
      const capaCouro = () => {
        const c = document.createElement("canvas"); c.width = W; c.height = H;
        const ctx = c.getContext("2d")!; ctx2 = ctx;
        // base de couro vinho
        const g = ctx.createRadialGradient(W / 2, H * 0.42, 120, W / 2, H * 0.5, H * 0.75);
        g.addColorStop(0, "#6e1328"); g.addColorStop(0.55, "#4d0c1c"); g.addColorStop(1, "#280610");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // grão do couro (textura)
        for (let i = 0; i < 4200; i++) {
          const x = Math.random() * W, y = Math.random() * H, claro = Math.random() > 0.5;
          ctx.fillStyle = claro ? `rgba(255,210,180,${Math.random() * 0.035})` : `rgba(0,0,0,${Math.random() * 0.06})`;
          ctx.fillRect(x, y, 2, 2);
        }
        // vinheta
        const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.72);
        vg.addColorStop(0, "transparent"); vg.addColorStop(1, "rgba(0,0,0,0.55)");
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
        // lombada (sombra + vinco na margem interna esquerda)
        const sp = ctx.createLinearGradient(0, 0, fL, 0);
        sp.addColorStop(0, "rgba(0,0,0,0.45)"); sp.addColorStop(1, "transparent");
        ctx.fillStyle = sp; ctx.fillRect(0, 0, fL, H);
        ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(fL - 30, 0); ctx.lineTo(fL - 30, H); ctx.stroke();

        // moldura dourada dupla com brilho
        const gold = (x0: number, y0: number, x1: number, y1: number) => {
          const gg = ctx.createLinearGradient(x0, y0, x1, y1);
          gg.addColorStop(0, "#7a5a16"); gg.addColorStop(0.5, "#f1d57e"); gg.addColorStop(1, "#7a5a16"); return gg;
        };
        ctx.strokeStyle = gold(fL, fT, fR, fB); ctx.lineWidth = 6; ctx.strokeRect(fL, fT, cw, fB - fT);
        ctx.strokeStyle = gold(fR, fT, fL, fB); ctx.lineWidth = 2; ctx.strokeRect(fL + 22, fT + 22, cw - 44, fB - fT - 44);

        ctx.textAlign = "center";
        const OUROC = "#e8c45a";
        // fleurons grandes nos cantos + topo/base
        ctx.fillStyle = OUROC;
        ctx.font = "48px " + SANS;
        [[fL + 46, fT + 64], [fR - 46, fT + 64], [fL + 46, fB - 34], [fR - 46, fB - 34]].forEach(([x, y]) => ctx.fillText("❦", x, y));

        // selo topo
        ctx.fillStyle = OUROC; ctx.font = `600 30px ${SANS}`; LS("10px");
        ctx.fillText("NOSSA HISTÓRIA", cx, fT + 150); LS("0px");
        // divisor ornamental
        const divisor = (y: number) => {
          ctx.strokeStyle = gold(cx - 200, y, cx + 200, y); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(cx - 200, y); ctx.lineTo(cx - 30, y); ctx.moveTo(cx + 30, y); ctx.lineTo(cx + 200, y); ctx.stroke();
          ctx.fillStyle = OUROC; ctx.font = "30px " + SANS; ctx.fillText("❧", cx, y + 10);
        };
        divisor(fT + 200);

        // emblema de coração dourado (relevo)
        const hg = ctx.createLinearGradient(cx - 90, 480, cx + 90, 640);
        hg.addColorStop(0, "#f3da86"); hg.addColorStop(0.5, "#c9a227"); hg.addColorStop(1, "#8a6a1e");
        heart(ctx, cx + 3, 583, 92, "rgba(0,0,0,0.5)"); // sombra do relevo
        heart(ctx, cx, 580, 92, hg);
        ctx.strokeStyle = "rgba(255,240,200,0.5)"; ctx.lineWidth = 2;
        // títulos (gravado: sombra escura + dourado)
        const gravado = (txt: string, y: number, size: number, font = SERIF, weight = "800") => {
          ctx.font = `${weight} ${size}px ${font}`;
          ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillText(txt, cx + 3, y + 3);
          const tg = ctx.createLinearGradient(cx, y - size, cx, y + 10);
          tg.addColorStop(0, "#f7e3a1"); tg.addColorStop(1, "#c9a227");
          ctx.fillStyle = tg; ctx.fillText(txt, cx, y);
        };
        gravado(dest, 820, 110);
        ctx.fillStyle = OUROC; ctx.font = `italic 500 56px ${SERIF}`; ctx.fillText("&", cx, 910);
        gravado(rem, 1010, 110);

        ctx.fillStyle = "#e7c9a0"; ctx.font = `italic 500 46px ${SERIF}`;
        ctx.fillText(presente.ocasiao || "", cx, 1200);
        if (presente.dataEspecial) {
          ctx.fillStyle = OUROC; ctx.font = `500 32px ${SANS}`;
          ctx.fillText("desde " + new Date(presente.dataEspecial).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }), cx, 1270);
        }
        divisor(fB - 200);
        ctx.fillStyle = "#caa86a"; ctx.font = `500 26px ${SANS}`; ctx.fillText("lovegift.art.br", cx, fB - 110);
        return { c, ctx };
      };
      const add = (c: HTMLCanvasElement) => {
        if (!first) pdf.addPage([W, H], "portrait");
        first = false;
        pdf.addImage(c.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, W, H);
      };
      const wrap = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number, max = 30) => {
        const words = text.split(" "); let line = "", yy = y, n = 0;
        for (const w of words) {
          const t = line + w + " ";
          if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line.trim(), x, yy); line = w + " "; yy += lh; if (++n >= max) break; }
          else line = t;
        }
        ctx.fillText(line.trim(), x, yy); return yy;
      };

      const rem = presente.nomeRemetente || "";
      const dest = presente.nomeDestinatario || "";
      const legendas = [
        "Meu lugar favorito é ao seu lado",
        "Cada instante com você é especial",
        "A gente combina demais",
        "Você é o meu presente",
        "Pra sempre, nós dois",
        "Te amo mais a cada dia",
      ];

      // ---- CAPA (couro estilo livro de romance) ----
      { const { c } = capaCouro(); add(c); }

      // ---- PÁGINAS DE FOTOS ----
      const fotos = presente.fotos.slice(0, 8);
      for (let i = 0; i < fotos.length; i++) {
        const img = await loadImg(fotos[i].url);
        const { c, ctx } = novaPagina();
        // moldura da foto (dentro da área segura)
        const fx = fL + 44, fy = fT + 120, fw = cw - 88, fh = 980;
        ctx.save();
        ctx.shadowColor = "rgba(122,16,56,0.25)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14;
        ctx.fillStyle = "#fff"; ctx.fillRect(fx - 16, fy - 16, fw + 32, fh + 32);
        ctx.restore();
        ctx.strokeStyle = OURO; ctx.lineWidth = 3; ctx.strokeRect(fx - 16, fy - 16, fw + 32, fh + 32);
        if (img) {
          ctx.save();
          ctx.beginPath(); ctx.rect(fx, fy, fw, fh); ctx.clip();
          const r = Math.max(fw / img.naturalWidth, fh / img.naturalHeight);
          const dw = img.naturalWidth * r, dh = img.naturalHeight * r;
          ctx.drawImage(img, fx + (fw - dw) / 2, fy + (fh - dh) / 2, dw, dh);
          ctx.restore();
        } else {
          ctx.fillStyle = "#f3dbe5"; ctx.fillRect(fx, fy, fw, fh);
        }
        // legenda
        ctx.textAlign = "center"; ctx.fillStyle = VINHO; ctx.font = `italic 500 48px ${SERIF}`;
        wrap(ctx, legendas[i % legendas.length], cx, fy + fh + 110, cw - 80, 60, 2);
        // número da página
        ctx.fillStyle = OURO; ctx.font = `500 28px ${SANS}`;
        ctx.fillText(String(i + 1), cx, fB - 50);
        add(c);
      }

      // ---- MENSAGEM ----
      if (presente.mensagem) {
        const { c, ctx } = novaPagina();
        ctx.textAlign = "center";
        ctx.fillStyle = OURO; ctx.font = `600 30px ${SANS}`; LS("8px");
        ctx.fillText("UMA MENSAGEM PRA VOCÊ", cx, fT + 230); LS("0px");
        ctx.fillStyle = "#e84393"; ctx.font = "200px " + SERIF; ctx.fillText("“", cx, fT + 430);
        ctx.fillStyle = TINTA; ctx.font = `italic 500 56px ${SERIF}`;
        wrap(ctx, presente.mensagem, cx, fT + 610, cw - 130, 88, 14);
        ctx.fillStyle = OURO; ctx.font = `italic 500 44px ${SERIF}`;
        ctx.fillText("— com amor, " + rem, cx, fB - 120);
        add(c);
      }

      // ---- ENCERRAMENTO ----
      {
        const { c, ctx } = novaPagina();
        ctx.textAlign = "center";
        if (diasJuntos && diasJuntos > 0) {
          ctx.fillStyle = OURO; ctx.font = `600 30px ${SANS}`; LS("8px");
          ctx.fillText("O NOSSO TEMPO JUNTOS", cx, fT + 440); LS("0px");
          ctx.fillStyle = "#e84393"; ctx.font = `800 200px ${SERIF}`;
          ctx.fillText(diasJuntos.toLocaleString("pt-BR"), cx, fT + 660);
          ctx.fillStyle = VINHO; ctx.font = `italic 500 56px ${SERIF}`;
          ctx.fillText("dias de amor", cx, fT + 750);
        } else {
          ctx.fillStyle = "#e84393"; ctx.font = "180px " + SANS; ctx.fillText("❤", cx, fT + 660);
        }
        ctx.fillStyle = TINTA; ctx.font = `italic 500 48px ${SERIF}`;
        wrap(ctx, "E que venham muitos e muitos dias mais.", cx, fT + 920, cw - 130, 64, 3);
        ctx.fillStyle = OURO; ctx.font = `600 28px ${SANS}`;
        ctx.fillText("feito com ❤ no LoveGift", cx, fB - 120);
        ctx.fillStyle = "#e84393"; ctx.font = `700 32px ${SANS}`;
        ctx.fillText("lovegift.art.br", cx, fB - 75);
        add(c);
      }

      pdf.save(`livro-${dest || "lovegift"}.pdf`);
    } catch (err) {
      console.error("gerarLivroPDF", err);
      alert("Não consegui gerar o livro agora. Tente de novo 💕");
    } finally {
      setGerandoLivro(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/icons/icone-coracao.png" alt="" className="w-16 h-16 object-contain mx-auto mb-4 animate-pulse-heart" />
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
  const ehCoracao = ["❤️", "❤", "💖", "💕", "♥", "💝", "💗", "💘"].includes(oc.emoji);
  const diasJuntos = presente.dataEspecial
    ? differenceInDays(new Date(), new Date(presente.dataEspecial))
    : null;

  const youtubeId = presente.musicaUrl ? getYoutubeId(presente.musicaUrl) : null;
  // iTunes retorna preview como .m4a — audio nativo, funciona em qualquer device
  const previewUrl = presente.musicaUrl?.includes(".m4a") ? presente.musicaUrl : null;

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
            {ehCoracao ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/icons/icone-coracao.png" alt="" className="w-28 h-28 object-contain mx-auto animate-pulse-heart" style={{ filter: `drop-shadow(0 0 40px ${oc.corHex}b3)` }} />
            ) : (
              <div className="text-8xl animate-pulse-heart" style={{ filter: `drop-shadow(0 0 40px ${oc.corHex}b3)` }}>{oc.emoji}</div>
            )}
          </div>

          <p className="text-white/30 text-xs uppercase tracking-widest mb-2">{oc.titulo}</p>
          <h1 className="font-elegante text-6xl font-extrabold text-white mb-3 leading-tight">
            {presente.nomeDestinatario}
          </h1>
          <div className="w-12 h-px bg-[#e84393]/40 mx-auto my-5" />
          <p className="text-white/40 text-base mb-3">
            Com todo o amor de
          </p>
          <p className="text-white text-xl font-bold mb-10">{presente.nomeRemetente}</p>

          <button
            onClick={() => { setAberto(true); setMusicaTocando(true); }}
            className="w-full text-white font-bold px-10 py-5 rounded-2xl transition-all hover:scale-105 text-lg relative overflow-hidden"
            style={presente.tema === "netflix"
              ? { background: "#E50914", boxShadow: "0 16px 48px rgba(229,9,20,0.5)" }
              : { background: "linear-gradient(135deg, #e84393 0%, #c0306f 100%)", boxShadow: "0 16px 48px rgba(232,67,147,0.5)" }}
          >
            <span className="relative z-10">{presente.tema === "netflix" ? "▶ Assistir" : "Abrir presente ♥"}</span>
          </button>
          <p className="text-white/20 text-xs mt-5 animate-pulse">Toque para revelar a surpresa</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative isolate min-h-screen ${tema.bg} ${tema.text} pb-28`}>

      {/* Fundo romântico (temas escuros) */}
      {(presente.tema === "romantico" || presente.tema === "netflix") && (
        <>
          <div
            aria-hidden
            className="fixed inset-0 -z-10 pointer-events-none bg-cover bg-center opacity-60"
            style={{ backgroundImage: "url('/images/fundo-romantico.jpg')" }}
          />
          <div
            aria-hidden
            className="fixed inset-0 -z-10 pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(10,0,6,0.62) 0%, rgba(10,0,6,0.82) 100%)" }}
          />
        </>
      )}

      {/* Overlay de geração de vídeo */}
      {gerandoVideo && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center text-center px-8"
          style={{ background: "rgba(8,0,5,0.92)", backdropFilter: "blur(8px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mascote.png" alt="" className="w-20 h-20 object-contain animate-bob mb-6" />
          <div className="w-10 h-10 border-2 border-[#e84393]/30 border-t-[#e84393] rounded-full animate-spin mb-5" />
          <p className="text-white font-bold text-lg mb-1">{gerandoVideo}</p>
          <p className="text-white/40 text-sm">Não feche a tela — leva alguns segundinhos 💕</p>
        </div>
      )}

      {/* ── Iframe oculto para autoplay da música ── */}

      {wrappedAberto && (
        <Wrapped presente={presente} onClose={() => setWrappedAberto(false)} />
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
          {ehCoracao ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/images/icons/icone-coracao.png" alt="" className="w-20 h-20 object-contain mx-auto mb-5 animate-pulse-heart" style={{ filter: `drop-shadow(0 0 20px ${oc.corHex}66)` }} />
          ) : (
            <div className="text-6xl mb-5 animate-pulse-heart" style={{ filter: `drop-shadow(0 0 20px ${oc.corHex}66)` }}>{oc.emoji}</div>
          )}
          <p className="text-sm opacity-40 mb-2 uppercase tracking-widest">{oc.titulo}</p>
          <h1 className="font-elegante text-6xl md:text-7xl font-extrabold mb-4 leading-tight">
            {presente.nomeDestinatario}
          </h1>
          <p className="opacity-40 text-base">{oc.subtitulo} — <span className="opacity-80 font-semibold">{presente.nomeRemetente}</span></p>
        </div>
      </section>

      {/* CONTADOR AO VIVO */}
      {presente.dataEspecial && (
        <section className="max-w-md mx-auto px-4 mb-16">
          <p className="flex items-center justify-center gap-2 text-center text-xs opacity-50 uppercase tracking-[0.3em] mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icons/icone-ampulheta.png" alt="" className="w-5 h-5 object-contain" />
            {oc.contadorLabel}
          </p>
          <div className={`${tema.card} border ${tema.border} rounded-3xl px-6 py-9 text-center`}>
            <p
              className={`font-elegante font-extrabold tabular-nums leading-none ${tema.accent}`}
              style={{ fontSize: "clamp(3.5rem, 17vw, 5.5rem)" }}
            >
              {contador.dias.toLocaleString("pt-BR")}
            </p>
            <p className="text-sm opacity-50 uppercase tracking-[0.25em] mt-3">dias juntos</p>
            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { valor: contador.horas, label: "horas" },
                { valor: contador.minutos, label: "min" },
                { valor: contador.segundos, label: "seg" },
              ].map(({ valor, label }) => (
                <div key={label} className="rounded-2xl py-3" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <p className={`font-elegante text-2xl font-bold tabular-nums ${tema.accent}`}>{String(valor).padStart(2, "0")}</p>
                  <p className="text-[10px] opacity-45 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MARCADORES */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 gap-3">
          <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 text-center`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/icons/icone-camera.png" alt="" className="w-9 h-9 object-contain mx-auto mb-1.5" />
            <p className={`font-elegante text-4xl font-extrabold ${tema.accent}`}>{presente.fotos.length}</p>
            <p className="text-xs opacity-50 uppercase tracking-widest mt-1">{presente.fotos.length === 1 ? "foto especial" : "fotos especiais"}</p>
          </div>
          {diasJuntos !== null && diasJuntos > 0 && (
            <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 text-center`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icons/icone-coroa.png" alt="" className="w-9 h-9 object-contain mx-auto mb-1.5" />
              <p className={`font-elegante text-4xl font-extrabold ${tema.accent}`}>{Math.floor(diasJuntos / 30)}</p>
              <p className="text-xs opacity-50 uppercase tracking-widest mt-1">{oc.mesesSufixo}</p>
            </div>
          )}
          {presente.dataEspecial && (
            <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 text-center col-span-${diasJuntos !== null && diasJuntos > 0 ? "1" : "2"} flex flex-col items-center justify-center`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icons/icone-carta.png" alt="" className="w-9 h-9 object-contain mb-1.5" />
              <p className={`font-elegante text-xl font-bold ${tema.accent}`}>
                {new Date(presente.dataEspecial).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
              <p className="text-xs opacity-50 uppercase tracking-widest mt-1">data especial</p>
            </div>
          )}
          {!presente.dataEspecial && (
            <div className={`${tema.card} border ${tema.border} rounded-2xl p-5 text-center`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/icons/icone-musica.png" alt="" className="w-9 h-9 object-contain mx-auto mb-1.5" />
              <p className={`font-semibold ${tema.accent} mt-1 truncate`}>{presente.musica}</p>
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
        <div className="rounded-3xl overflow-hidden shadow-xl" style={{ background: "#111", border: "1px solid rgba(232,67,147,0.2)" }}>

          {/* Cabeçalho com nome da música + botão play */}
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(232,67,147,0.2), rgba(192,48,111,0.2))", border: "1px solid rgba(232,67,147,0.2)" }}>
                {musicaTocando ? (
                  <div className="flex items-end gap-0.5 h-5">
                    {[3,5,4,6,3].map((h, i) => (
                      <div key={i} className="w-0.5 rounded-full"
                        style={{ height: `${h * 2}px`, background: "#e84393",
                          animation: `bar-dance ${0.4 + i * 0.1}s ${i * 0.08}s ease-in-out infinite` }} />
                    ))}
                  </div>
                ) : "🎵"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">
                  {musicaTocando ? "Tocando agora" : "Música escolhida"}
                </p>
                <p className="font-bold text-lg text-white truncate">{presente.musica}</p>
              </div>
              {/* Botão play/pause — aparece se tem áudio disponível */}
              {(previewUrl || youtubeId) && (
                <button
                  onClick={() => setMusicaTocando(t => !t)}
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 active:scale-95"
                  style={{ background: musicaTocando ? "rgba(232,67,147,0.3)" : "linear-gradient(135deg, #e84393, #c0306f)", boxShadow: musicaTocando ? "none" : "0 8px 24px rgba(232,67,147,0.5)", border: musicaTocando ? "1px solid rgba(232,67,147,0.5)" : "none" }}
                >
                  <span className="text-white text-xl" style={{ marginLeft: musicaTocando ? 0 : "3px" }}>
                    {musicaTocando ? "⏸" : "▶"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Player de áudio nativo (iTunes preview .m4a) */}
          {musicaTocando && previewUrl && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio autoPlay loop src={previewUrl} style={{ display: "none" }}
              onEnded={() => {}} />
          )}

          {/* Player YouTube (quando URL for YouTube) */}
          {musicaTocando && youtubeId && !previewUrl && (
            <div className="aspect-video">
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&rel=0`}
                title="música"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/icons/icone-coracao.png" alt="" className="w-20 h-20 object-contain mx-auto animate-pulse-heart mb-5" style={{ filter: "drop-shadow(0 0 20px rgba(232,67,147,0.4))" }} />

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

          {/* Baixar vídeo pro Instagram */}
          <button
            onClick={gerarVideo}
            disabled={!!gerandoVideo}
            className="w-full mb-3 flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #e84393 0%, #c0306f 60%, #f5c518 140%)", boxShadow: "0 10px 30px rgba(232,67,147,0.4)" }}
          >
            {gerandoVideo ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{gerandoVideo}</>
            ) : (
              <>📲 Baixar vídeo pro Instagram</>
            )}
          </button>
          <p className="text-center text-[11px] opacity-30 mb-4">Gera um vídeo vertical com as fotos e a história pra postar nos Stories ✨</p>

          {/* Vídeo pronto — player + compartilhar (toque novo = gesto válido) */}
          {videoPronto && (
            <div className={`mb-4 rounded-2xl border ${tema.border} overflow-hidden`}>
              <video
                src={videoPronto.url}
                controls
                playsInline
                className="w-full bg-black aspect-[9/16] max-h-[60vh] object-contain"
              />
              <div className="p-3">
                <button
                  onClick={compartilharVideo}
                  className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)", boxShadow: "0 8px 24px rgba(220,39,67,0.4)" }}
                >
                  📲 Compartilhar nos Stories
                </button>
                <p className="text-center text-[11px] opacity-40 mt-2">
                  ou toque e segure no vídeo para salvar na galeria
                </p>
              </div>
            </div>
          )}

          {/* Baixar livro PDF pra imprimir */}
          <button
            onClick={gerarLivroPDF}
            disabled={gerandoLivro}
            className="w-full mb-2 flex items-center justify-center gap-2 font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #b8932f 0%, #e8c45a 50%, #b8932f 100%)", color: "#3a1d10", boxShadow: "0 10px 30px rgba(184,147,47,0.4)" }}
          >
            {gerandoLivro ? (
              <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />Montando o livro…</>
            ) : (
              <>📖 Baixar livro pra imprimir (PDF)</>
            )}
          </button>
          <p className="text-center text-[11px] opacity-30 mb-6">Um livro do casal com capa, fotos e molduras — pronto pra imprimir e presentear de verdade 💛</p>

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
              Emocione quem você ama com fotos, música e uma retrospectiva animada. Por apenas R$ 16,90.
            </p>
            <Link
              href="/criar"
              className="inline-block font-bold px-8 py-3.5 rounded-2xl text-white text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #e84393 0%, #c0306f 100%)", boxShadow: "0 8px 24px rgba(232,67,147,0.35)" }}
            >
              Criar meu presente → R$ 16,90
            </Link>
            <p className="text-xs opacity-25 mt-3">Pagamento único · Entrega imediata · Acesso permanente</p>
          </div>
        </div>
      </section>

      {/* Selo discreto LoveGift */}
      <footer className="max-w-md mx-auto px-4 pb-10 pt-1 flex items-center justify-center gap-2 opacity-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/mascote.png" alt="LoveGift" className="w-6 h-6 object-contain" />
        <span className="text-xs text-white/70">
          feito com <span className="text-[#e84393]">❤️</span> no{" "}
          <span className="font-bold text-white">LoveGift</span>
        </span>
      </footer>
    </div>
  );
}
