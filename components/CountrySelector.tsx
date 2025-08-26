"use client";
import { useEffect, useMemo, useState } from "react";

type Country = { iso2: string; name: string; capital: string; lat: number; lon: number };

export default function CountrySelector({
  value,
  onChange,
  onClear,            // NEW (optional)
}: {
  value: string[];
  onChange: (codes: string[]) => void;
  onClear?: () => void;  // NEW (optional)
}) {
  const [all, setAll] = useState<Country[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((d) => setAll(d.countries ?? []))
      .catch(() => setAll([]));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter(
      (c) =>
        c.iso2.toLowerCase().includes(s) ||
        c.name.toLowerCase().includes(s) ||
        (c.capital || "").toLowerCase().includes(s)
    );
  }, [q, all]);

  const toggle = (code: string) => {
    if (value.includes(code)) onChange(value.filter((x) => x !== code));
    else onChange([...value, code]);
  };

  function handleClear() {
    setQ("");          // clear search box
    onChange([]);      // clear selection
    onClear?.();       // let parent reset progress/results/map
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search countries..."
          className="w-full rounded-xl border px-3 py-2"
        />
        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border px-3 py-2"
          aria-label="Clear selection"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-auto rounded-2xl border p-2">
        {filtered.map((c) => {
          const selected = value.includes(c.iso2);
          return (
            <button
              key={c.iso2}
              type="button"
              onClick={() => toggle(c.iso2)}
              className={
                "text-left rounded-xl border px-3 py-2 transition " +
                (selected ? "bg-blue-600 text-white" : "hover:bg-gray-50")
              }
            >
              <div className="font-semibold">
                {c.name} <span className="opacity-70">({c.iso2})</span>
              </div>
              <div className="text-xs opacity-70">{c.capital}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
