"use client";
import { useEffect, useMemo, useState } from "react";


type Country = { iso2: string; name: string; capital: string; lat: number; lon: number };


export default function CountrySelector({ onChange }: { onChange: (codes: string[]) => void }) {
const [countries, setCountries] = useState<Country[]>([]);
const [query, setQuery] = useState("");
const [selected, setSelected] = useState<string[]>(["SO","KE","ET","DJ"]);


useEffect(() => {
fetch("/api/countries").then(r => r.json()).then((d) => setCountries(d.countries));
}, []);


useEffect(() => onChange(selected), [selected, onChange]);


const filtered = useMemo(() => {
const q = query.trim().toLowerCase();
return q ? countries.filter(c => (c.name + c.iso2 + c.capital).toLowerCase().includes(q)) : countries;
}, [countries, query]);


return (
<div className="space-y-2">
<div className="flex items-center gap-2">
<input
className="w-full rounded-xl border px-3 py-2 bg-white/60 dark:bg-white/10"
placeholder="Search countries…"
value={query}
onChange={(e) => setQuery(e.target.value)}
/>
<button
className="rounded-xl border px-3 py-2" onClick={() => setSelected([])}
title="Clear selection"
>Clear</button>
</div>


<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-72 overflow-auto border rounded-xl p-2">
{filtered.map(c => {
const active = selected.includes(c.iso2);
return (
<button
key={c.iso2}
onClick={() => setSelected(s => active ? s.filter(x=>x!==c.iso2) : [...new Set([...s, c.iso2])])}
className={`text-left rounded-lg px-3 py-2 border ${active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
>
<div className="font-semibold">{c.name} <span className="opacity-70">({c.iso2})</span></div>
<div className="text-xs opacity-70">{c.capital}</div>
</button>
);
})}
</div>


<div className="text-sm opacity-70">Selected: {selected.join(", ") || "—"}</div>
</div>
);
}