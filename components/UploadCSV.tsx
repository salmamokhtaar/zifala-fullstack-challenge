"use client";
import { useRef } from "react";

type Row = { a: string; b: string; km: number };
type Entry = { iso2: string; name?: string; capital?: string; lat: number; lon: number };

export default function UploadCSV({
  onLoaded,
}: {
  onLoaded: (data: { entries: Entry[]; pairs: Row[]; codes: string[] }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    const text = await file.text();
    // Expect header: iso2,name,capital,lat,lon
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(",").map((s) => s.trim().toLowerCase());
    const idx = {
      iso2: headers.indexOf("iso2"),
      name: headers.indexOf("name"),
      capital: headers.indexOf("capital"),
      lat: headers.indexOf("lat"),
      lon: headers.indexOf("lon"),
    };
    const entries: Entry[] = [];
    for (const line of lines) {
      const cells = line.split(",");
      const iso2 = cells[idx.iso2]?.trim();
      const name = cells[idx.name]?.trim();
      const capital = cells[idx.capital]?.trim();
      const lat = Number(cells[idx.lat]);
      const lon = Number(cells[idx.lon]);
      if (!iso2 || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      entries.push({ iso2: iso2.toUpperCase(), name, capital, lat, lon });
    }

    const res = await fetch("/api/distances/custom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });
    const data = await res.json();
    if (data?.pairs) onLoaded(data);
  }

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        title="Upload CSV with iso2,name,capital,lat,lon"
      >
        Upload CSV
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
    </>
  );
}
