import { getCountry } from "./dataset";
import { haversineKm, type Pair } from "./geo";


export function validateCodes(input: string[]): string[] {
if (!Array.isArray(input) || input.length < 2) throw new Error("Provide at least 2 country codes");
const cleaned = [...new Set(input.map((s) => String(s).trim().toUpperCase()))];
for (const c of cleaned) {
if (!getCountry(c)) throw new Error(`Unknown code: ${c}`);
}
return cleaned;
}


export function computePairsSorted(codes: string[]): { pairs: Pair[]; count: number } {
const out: Pair[] = [];
for (let i = 0; i < codes.length; i++) {
for (let j = i + 1; j < codes.length; j++) {
const A = getCountry(codes[i])!;
const B = getCountry(codes[j])!;
const km = haversineKm(A.lat, A.lon, B.lat, B.lon);
out.push({ a: A.iso2, b: B.iso2, km });
}
}
out.sort((x, y) => x.km - y.km || x.a.localeCompare(y.a) || x.b.localeCompare(y.b));
return { pairs: out, count: out.length };
}


export function* pairGenerator(codes: string[]) {
for (let i = 0; i < codes.length; i++) {
for (let j = i + 1; j < codes.length; j++) {
yield [codes[i], codes[j]] as [string, string];
}
}
}