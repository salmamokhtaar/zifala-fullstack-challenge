"use client";


export default function DownloadCSV({ rows }: { rows: { a: string; b: string; km: number }[] }) {
function download() {
const header = "a,b,km\n";
const body = rows.map(r => `${r.a},${r.b},${r.km}`).join("\n");
const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url; a.download = "capital-distances.csv"; a.click();
URL.revokeObjectURL(url);
}
return (
<button onClick={download} className="px-4 py-2 rounded-xl bg-green-600 text-white hover:opacity-90">
Download CSV
</button>
);
}