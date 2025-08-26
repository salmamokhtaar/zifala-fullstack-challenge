"use client";
import { useMemo, useState } from "react";


type Pair = { a: string; b: string; km: number };


type SortKey = "km" | "a" | "b";


type Props = { items: Pair[] };


export default function ResultsTable({ items }: Props) {
const [sortKey, setSortKey] = useState<SortKey>("km");
const [asc, setAsc] = useState(true);


const sorted = useMemo(() => {
const arr = [...items];
arr.sort((x, y) => {
const k = sortKey;
const d = k === "km" ? x.km - y.km : String(x[k]).localeCompare(String(y[k]));
return asc ? d : -d;
});
return arr;
}, [items, sortKey, asc]);


function setSort(k: SortKey) {
if (k === sortKey) setAsc(a => !a); else { setSortKey(k); setAsc(true); }
}


return (
<div className="overflow-auto border rounded-xl">
<table className="min-w-full text-sm">
<thead className="sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
<tr>
<th className="p-2 text-left cursor-pointer" onClick={()=>setSort("a")}>A {sortKey==="a" && (asc?"▲":"▼")}</th>
<th className="p-2 text-left cursor-pointer" onClick={()=>setSort("b")}>B {sortKey==="b" && (asc?"▲":"▼")}</th>
<th className="p-2 text-left cursor-pointer" onClick={()=>setSort("km")}>km {sortKey==="km" && (asc?"▲":"▼")}</th>
</tr>
</thead>
<tbody>
{sorted.map((p, i) => (
<tr key={i} className="odd:bg-gray-50 dark:odd:bg-gray-900">
<td className="p-2 font-mono">{p.a}</td>
<td className="p-2 font-mono">{p.b}</td>
<td className="p-2">{p.km.toLocaleString()}</td>
</tr>
))}
</tbody>
</table>
</div>
);
}