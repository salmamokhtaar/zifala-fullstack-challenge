import { haversineKm } from "@/lib/geo";

type Entry = { iso2: string; name?: string; capital?: string; lat: number; lon: number };

export async function POST(req: Request) {
  try {
    const { entries } = (await req.json()) as { entries: Entry[] };
    if (!Array.isArray(entries) || entries.length < 2) {
      return Response.json({ error: "Provide >= 2 entries" }, { status: 400 });
    }
    const map = new Map<string, Entry>();
    for (const e of entries) {
      if (!e?.iso2 || !Number.isFinite(e.lat) || !Number.isFinite(e.lon)) continue;
      map.set(e.iso2.toUpperCase(), e);
    }

    const codes = [...map.keys()].sort();
    const pairs: { a: string; b: string; km: number }[] = [];
    for (let i = 0; i < codes.length; i++) {
      for (let j = i + 1; j < codes.length; j++) {
        const a = codes[i], b = codes[j];
        const A = map.get(a)!, B = map.get(b)!;
        const km = haversineKm(A.lat, A.lon, B.lat, B.lon);
        pairs.push({ a, b, km: Number(km.toFixed(1)) });
      }
    }
    pairs.sort((x, y) => x.km - y.km);
    return Response.json({ pairs, count: pairs.length, unit: "km", codes });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Bad request";
    return Response.json({ error: message }, { status: 400 });
  }
}
