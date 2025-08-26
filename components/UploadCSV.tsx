"use client";

import { useRef } from "react";

type UploadResult = {
  entries: { iso2: string; name?: string; capital?: string; lat: number; lon: number }[];
  pairs: { a: string; b: string; km: number }[];
  codes: string[];
};

export default function UploadCSV({
  onLoaded,
  showSampleLink = false,          // default: don't show a Sample link here
  samplePath = "/sample-capitals.csv",
}: {
  onLoaded: (r: UploadResult) => void;
  showSampleLink?: boolean;
  samplePath?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    const text = await file.text();
    // very light CSV parsing (expecting headers iso2,lat,lon,capital,name)
    const [header, ...rows] = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const cols = header.split(",").map((c) => c.trim().toLowerCase());
    const iIso = cols.indexOf("iso2");
    const iLat = cols.indexOf("lat");
    const iLon = cols.indexOf("lon");
    const iCap = cols.indexOf("capital");
    const iName = cols.indexOf("name");

    const entries = rows
      .map((r) => r.split(","))
      .map((cells) => ({
        iso2: (cells[iIso] || "").toUpperCase(),
        lat: Number(cells[iLat]),
        lon: Number(cells[iLon]),
        capital: iCap >= 0 ? cells[iCap] : undefined,
        name: iName >= 0 ? cells[iName] : undefined,
      }))
      .filter((e) => e.iso2 && Number.isFinite(e.lat) && Number.isFinite(e.lon));

    const res = await fetch("/api/upload-pairs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entries }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || "Upload failed");
      return;
    }
    onLoaded(data as UploadResult);
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
        Upload CSV
      </button>

      {showSampleLink && (
        <a
          href={samplePath}
          download
          className="text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900"
        >
          Sample CSV
        </a>
      )}
    </div>
  );
}
