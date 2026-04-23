import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q || q.trim().length < 2) return NextResponse.json({ items: [] });

  // Usa iTunes Search API — gratuita, sem chave, sem limite
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&entity=song&limit=8&country=BR`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    const data = await res.json();

    const items = (data.results ?? []).map((track: {
      trackId: number;
      trackName: string;
      artistName: string;
      artworkUrl100: string;
      previewUrl?: string;
      trackViewUrl?: string;
    }) => ({
      videoId: String(track.trackId),
      title: `${track.trackName} — ${track.artistName}`,
      channel: track.artistName,
      thumbnail: track.artworkUrl100?.replace("100x100", "300x300") ?? "",
      url: track.trackViewUrl ?? `https://music.apple.com/search?term=${encodeURIComponent(track.trackName)}`,
      previewUrl: track.previewUrl ?? null,
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 });
  }
}
