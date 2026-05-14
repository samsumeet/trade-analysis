import { NextRequest, NextResponse } from "next/server";

const GOOGLE_NEWS_RSS_URL = "https://news.google.com/rss/search";
const MAX_ITEMS = 3;

interface NewsItem {
  title: string;
  link: string;
  publishedAt: string | null;
  source: string | null;
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractTagValue(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeXmlEntities(match[1].trim()) : null;
}

function parseRssItems(xml: string): NewsItem[] {
  const items = xml.match(/<item>([\s\S]*?)<\/item>/gi) ?? [];

  return items.slice(0, MAX_ITEMS).map((item) => ({
    title: extractTagValue(item, "title") ?? "Untitled article",
    link: extractTagValue(item, "link") ?? "",
    publishedAt: extractTagValue(item, "pubDate"),
    source: extractTagValue(item, "source")
  }));
}

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const ticker = request.nextUrl.searchParams.get("ticker")?.trim().toUpperCase() ?? "";

  if (!ticker || !/^[A-Z.\-]{1,10}$/.test(ticker)) {
    return NextResponse.json({ error: "A valid stock ticker is required." }, { status: 400 });
  }

  const searchParams = new URLSearchParams({
    q: `${ticker} stock`,
    hl: "en-US",
    gl: "US",
    ceid: "US:en"
  });

  try {
    const response = await fetch(`${GOOGLE_NEWS_RSS_URL}?${searchParams.toString()}`, {
      cache: "no-store",
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml"
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Unable to load Google News feed (${response.status}).` },
        { status: response.status }
      );
    }

    const xml = await response.text();
    const items = parseRssItems(xml).filter((item) => item.link);

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to load news feed."
      },
      { status: 502 }
    );
  }
}
