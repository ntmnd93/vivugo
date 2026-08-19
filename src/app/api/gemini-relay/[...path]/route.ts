import { NextRequest, NextResponse } from "next/server";

// Transparent proxy to Google's Generative Language API, deployed on Vercel
// (whose serverless regions Google's API accepts) so a VPS in a
// geo-restricted country ("User location is not supported for the API use")
// can still reach Gemini. Forwards method/headers/body/query as-is — the
// caller's own x-goog-api-key header carries auth, this relay holds no
// secrets of its own.
const UPSTREAM_ORIGIN = "https://generativelanguage.googleapis.com";

const HOP_BY_HOP_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
  "keep-alive",
  "accept-encoding",
]);

async function relay(req: NextRequest, path: string[]) {
  const targetUrl = `${UPSTREAM_ORIGIN}/${path.join("/")}${req.nextUrl.search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer(),
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) responseHeaders.set(key, value);
  });

  return new NextResponse(upstream.body, { status: upstream.status, headers: responseHeaders });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return relay(req, (await params).path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return relay(req, (await params).path);
}
