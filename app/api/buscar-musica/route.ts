import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q) return NextResponse.json({ items: [] });

  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return NextResponse.json({ error: "API key não configurada" }, { status: 500 });

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(q)}&key=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Se a API retornou erro, repassa para debug
    if (data.error) {
      return NextResponse.json({ error: data.error.message, details: data.error }, { status: 400 });
    }

    const items = (data.items ?? []).map((item: {
      id: { videoId: string };
      snippet: {
        title: string;
        channelTitle: string;
        thumbnails: { medium: { url: string } };
      };
    }) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 });
  }
}
