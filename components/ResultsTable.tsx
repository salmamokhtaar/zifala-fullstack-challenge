"use client";
import { useMemo, useState } from "react";
// We read the local dataset to decorate A/B codes with names & capitals
import countries from "@/lib/capitals.json";

type Pair = { a: string; b: string; km: number };

type Decorated = {
  aCode: string;
  aName: string;
  aCapital: string;
  bCode: string;
  bName: string;
  bCapital: string;
  km: number;
};

type SortKey = "km" | "aName" | "bName";
type Props = { items: Pair[] };

export default function ResultsTable({ items }: Props) {
  // Build a quick lookup map: ISO2 -> {name, capital}
  const byCode = useMemo(() => {
    const m = new Map<string, { name: string; capital: string }>();
    for (const c of countries as any[]) m.set(c.iso2, { name: c.name, capital: c.capital });
    return m;
  }, []);

  // Decorate pairs with human-friendly info
  const rows: Decorated[] = useMemo(() => {
    return items.map((p) => {
      const A = byCode.get(p.a) ?? { name: p.a, capital: "" };
      const B = byCode.get(p.b) ?? { name: p.b, capital: "" };
      return {
        aCode: p.a,
        aName: A.name,
        aCapital: A.capital,
        bCode: p.b,
        bName: B.name,
        bCapital: B.capital,
        km: p.km,
      };
    });
  }, [items, byCode]);

  const [sortKey, setSortKey] = useState<SortKey>("km");
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((x, y) => {
      let d = 0;
      if (sortKey === "km") d = x.km - y.km;
      else if (sortKey === "aName") d = x.aName.localeCompare(y.aName);
      else d = x.bName.localeCompare(y.bName);
      return asc ? d : -d;
    });
    return arr;
  }, [rows, sortKey, asc]);

  function setSort(k: SortKey) {
    if (k === sortKey) setAsc((v) => !v);
    else {
      setSortKey(k);
      setAsc(true);
    }
  }

  const Arrow = ({ active }: { active: boolean }) => (
    <span className="inline-block w-3 text-xs">{active ? (asc ? "▲" : "▼") : ""}</span>
  );

  return (
    <div className="overflow-hidden rounded-2xl border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-left">
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => setSort("aName")}
              title="Sort by Country A"
            >
              Country A (Capital) <Arrow active={sortKey === "aName"} />
            </th>
            <th
              className="p-3 cursor-pointer select-none"
              onClick={() => setSort("bName")}
              title="Sort by Country B"
            >
              Country B (Capital) <Arrow active={sortKey === "bName"} />
            </th>
            <th
              className="p-3 text-right cursor-pointer select-none"
              onClick={() => setSort("km")}
              title="Sort by distance"
            >
              Distance (km) <Arrow active={sortKey === "km"} />
            </th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((r, i) => (
            <tr key={`${r.aCode}-${r.bCode}-${i}`} className="odd:bg-white even:bg-gray-50">
              <td className="p-3">
                <div className="font-medium">{r.aName}</div>
                <div className="text-xs opacity-70">
                  {r.aCapital || "—"} <span className="opacity-50">({r.aCode})</span>
                </div>
              </td>
              <td className="p-3">
                <div className="font-medium">{r.bName}</div>
                <div className="text-xs opacity-70">
                  {r.bCapital || "—"} <span className="opacity-50">({r.bCode})</span>
                </div>
              </td>
              <td className="p-3 text-right tabular-nums">{r.km.toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
            </tr>
          ))}

          {sorted.length === 0 && (
            <tr>
              <td colSpan={3} className="p-6 text-center text-gray-500">
                No results yet — select at least two countries and press <span className="font-medium">Start</span>.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
