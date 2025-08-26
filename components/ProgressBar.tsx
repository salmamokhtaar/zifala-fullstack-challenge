"use client";
export default function ProgressBar({ done, total }: { done: number; total: number }) {
const pct = total > 0 ? Math.round((done / total) * 100) : 0;
return (
<div className="w-full">
<div className="flex justify-between text-xs mb-1">
<span>Progress</span>
<span>{done} / {total} ({pct}%)</span>
</div>
<div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded">
<div className="h-2 rounded bg-blue-600" style={{ width: `${pct}%`, transition: 'width 150ms linear' }} />
</div>
</div>
);
}