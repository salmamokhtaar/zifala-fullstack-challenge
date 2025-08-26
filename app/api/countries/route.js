import { listCountries } from "@/lib/dataset";


export const runtime = "edge";


export async function GET() {
return new Response(JSON.stringify({ countries: listCountries() }), {
headers: { "Content-Type": "application/json" },
});
}