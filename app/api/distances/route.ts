import { validateCodes, pairGenerator } from "@/lib/util";
import { getCountry } from "@/lib/dataset";
import { haversineKm } from "@/lib/geo";
import { distancesCache, keyFromCodes } from "@/lib/cache";

export async function POST(req: Request) {
  try {
    const { countries } = (await req.json()) as { countries: string[] };
    const codes = validateCodes(countries || []);
    if (codes.length < 2) {
      return new Response(JSON.stringify({ error: "Need at least 2 countries" }), { status: 400 });
    }

    const key = keyFromCodes(codes);
    const cached = distancesCache.get(key);
    if (cached) {
      return new Response(JSON.stringify({ ...cached, cache: "hit", key }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const pairs: { a: string; b: string; km: number }[] = [];
    for (const [a, b] of pairGenerator(codes)) {
      const A = getCountry(a)!;
      const B = getCountry(b)!;
      const km = haversineKm(A.lat, A.lon, B.lat, B.lon);
      pairs.push({ a: A.iso2, b: B.iso2, km: Number(km.toFixed(1)) });
    }
    pairs.sort((x, y) => x.km - y.km);

    const result = { pairs, count: pairs.length, unit: "km" };
    distancesCache.set(key, result);

    return new Response(JSON.stringify({ ...result, cache: "miss", key }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid params";
    return new Response(JSON.stringify({ error: message }), { status: 400 });
  }
}
