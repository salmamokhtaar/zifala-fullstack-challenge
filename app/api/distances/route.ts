import { validateCodes, computePairsSorted } from "@/lib/util";


export const runtime = "edge";


export async function POST(req: Request) {
try {
const body = await req.json();
const codes = validateCodes(body?.countries);
const { pairs, count } = computePairsSorted(codes);
return new Response(
JSON.stringify({ pairs, count, unit: "km" }),
{ headers: { "Content-Type": "application/json" } }
);
} catch (err: any) {
return new Response(JSON.stringify({ error: err.message || "Bad Request" }), { status: 400 });
}
}