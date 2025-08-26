"use client";
import { useCallback, useRef, useState } from "react";
import CountrySelector from "@/components/CountrySelector";
import ProgressBar from "@/components/ProgressBar";
import ResultsTable from "@/components/ResultsTable";
import DownloadCSV from "@/components/DownloadCSV";

type Pair = { a: string; b: string; km: number };
type Msg = { done: number; total: number; latest: Pair };

export default function Page() {
  const [codes, setCodes] = useState<string[]>([]);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [running, setRunning] = useState(false);
  const endedRef = useRef(false);

  const start = useCallback(() => {
    if (codes.length < 2) {
      alert("Please select at least two countries.");
      return;
    }
    setPairs([]);
    setDone(0);
    setTotal((codes.length * (codes.length - 1)) / 2);
    setRunning(true);
    endedRef.current = false;

    const countries = encodeURIComponent(JSON.stringify(codes));
    const es = new EventSource(`/api/distances/stream?countries=${countries}`);

    es.onmessage = (evt) => {
      const m: Msg = JSON.parse(evt.data);
      setDone(m.done);
      setTotal(m.total);
      setPairs((arr) => [...arr, m.latest]); // live (unsorted)
    };

    es.addEventListener("end", async () => {
      endedRef.current = true;
      es.close();
      const res = await fetch("/api/distances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countries: codes }),
      });
      const data = await res.json();
      if (data?.pairs) setPairs(data.pairs); // sorted
      setRunning(false);
    });

    es.addEventListener("error", () => {
      // optionally show a toast; EventSource will auto-retry
    });
  }, [codes]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Capital Distance Finder</h1>
      <p className="opacity-75">
        Select countries, stream progress live, and get all unique pairs sorted by
        shortest distance between their capitals.
      </p>

      <section className="space-y-3">
        <h2 className="font-semibold">1) Choose Countries</h2>
        <CountrySelector value={codes} onChange={setCodes} />

        <div className="text-sm opacity-70">
          Selected: {codes.length ? codes.join(", ") : "—"}
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={start}
            disabled={running || codes.length < 2}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50"
          >
            {running ? "Running…" : "Start"}
          </button>
          {codes.length < 2 && (
            <span className="text-sm text-red-600">Pick at least two countries.</span>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">2) Live Progress</h2>
        <ProgressBar done={done} total={total} />
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">3) Results</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm opacity-70">Pairs: {pairs.length}</div>
          <DownloadCSV rows={pairs} />
        </div>
        <ResultsTable items={pairs} />
      </section>
    </main>
  );
}
