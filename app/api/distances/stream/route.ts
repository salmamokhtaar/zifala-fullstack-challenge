import { validateCodes, pairGenerator } from "@/lib/util";
import { getCountry } from "@/lib/dataset";
import { haversineKm } from "@/lib/geo";

export const runtime = "edge"; // Vercel-friendly SSE

function sse(obj: unknown) {
  return `data: ${JSON.stringify(obj)}\n\n`;
}

export async function GET(req: Request) {
  let codes: string[] = [];
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("countries");
    codes = validateCodes(q ? JSON.parse(q) : []);
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Invalid params" }),
      { status: 400 }
    );
  }

  const total = (codes.length * (codes.length - 1)) / 2;

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      controller.enqueue(enc.encode(`: connected\nretry: 5000\n\n`));
      const keepAlive = setInterval(
        () => controller.enqueue(enc.encode(`: ping\n\n`)),
        15000
      );

      let done = 0;
      try {
        for (const [a, b] of pairGenerator(codes)) {
          const A = getCountry(a)!;
          const B = getCountry(b)!;
          const km = haversineKm(A.lat, A.lon, B.lat, B.lon);
          const msg = { done: ++done, total, latest: { a: A.iso2, b: B.iso2, km } };
          controller.enqueue(enc.encode(sse(msg)));
          if (done % 200 === 0) await new Promise((r) => setTimeout(r, 0));
        }
        controller.enqueue(enc.encode(`event: end\ndata: done\n\n`));
      } catch (e) {
        controller.enqueue(
          enc.encode(`event: error\ndata: ${JSON.stringify(String(e))}\n\n`)
        );
      } finally {
        clearInterval(keepAlive);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
