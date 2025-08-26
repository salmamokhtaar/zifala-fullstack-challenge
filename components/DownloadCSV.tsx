"use client";

import dataset from "@/lib/capitals.json";

type Pair = { a: string; b: string; km: number };

const byCode = new Map(
  (dataset as any[]).map((c) => [
    c.iso2,
    { name: c.name as string, capital: c.capital as string, lat: c.lat as number, lon: c.lon as number },
  ])
);

function csvEscape(val: string | number) {
  const s = String(val ?? "");
  // Quote if contains comma, quote, or newline
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export default function DownloadCSV({ rows }: { rows: Pair[] }) {
  function download() {
    if (!rows?.length) return;

    const header = [
      "First Country",
      "First Capital",
      "lat1",
      "lon1",
      "Second Country",
      "Second Capital",
      "lat2",
      "lon2",
      "km",
    ].join(",");

    const body = rows
      .map((r) => {
        const A = byCode.get(r.a) ?? { name: r.a, capital: "", lat: "", lon: "" } as any;
        const B = byCode.get(r.b) ?? { name: r.b, capital: "", lat: "", lon: "" } as any;
        return [
          csvEscape(A.name),
          csvEscape(A.capital),
          csvEscape(A.lat),
          csvEscape(A.lon),
          csvEscape(B.name),
          csvEscape(B.capital),
          csvEscape(B.lat),
          csvEscape(B.lon),
          csvEscape(Number(r.km.toFixed(1))),
        ].join(",");
      })
      .join("\n");

    // BOM so Excel recognizes UTF-8
    const csv = "\uFEFF" + header + "\n" + body;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Capital Distance Finder 2025.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      disabled={!rows?.length}
      className="px-4 py-2 rounded-xl bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
      title={!rows?.length ? "Run a comparison first to download results" : "Download CSV"}
    >
      Download CSV
    </button>
  );
}
