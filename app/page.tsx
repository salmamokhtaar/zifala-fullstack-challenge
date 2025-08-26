"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CountrySelector from "@/components/CountrySelector";
import ProgressBar from "@/components/ProgressBar";
import ResultsTable from "@/components/ResultsTable";
import DownloadCSV from "@/components/DownloadCSV";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type Pair = { a: string; b: string; km: number };
type Msg = { done: number; total: number; latest: Pair };

export default function Page() {
  const [codes, setCodes] = useState<string[]>([]);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [running, setRunning] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const esRef = useRef<EventSource | null>(null);      // NEW

  const canStart = codes.length >= 2 && !running;
  const canToggleMap = codes.length >= 2 && (running || pairs.length > 0);

  const clearAll = useCallback(() => {
    // stop any running stream
    esRef.current?.close();
    esRef.current = null;

    // reset everything
    setCodes([]);
    setPairs([]);
    setDone(0);
    setTotal(0);
    setRunning(false);
    setShowMap(false);
  }, []);

  const start = useCallback(() => {
    if (codes.length < 2) {
      alert("Please select at least two countries.");
      return;
    }

    // reset progress & results for a fresh run
    setPairs([]);
    setDone(0);
    setTotal((codes.length * (codes.length - 1)) / 2);
    setRunning(true);

    const es = new EventSource(
      `/api/distances/stream?countries=${encodeURIComponent(JSON.stringify(codes))}`
    );
    esRef.current = es; // keep handle so Clear can cancel

    es.onmessage = (evt) => {
      const m: Msg = JSON.parse(evt.data);
      setDone(m.done);
      setTotal(m.total);
      setPairs((arr) => [...arr, m.latest]); // live unsorted
    };

    es.addEventListener("end", async () => {
      es.close();
      esRef.current = null;

      const res = await fetch("/api/distances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countries: codes }),
      });
      const data = await res.json();
      if (data?.pairs) setPairs(data.pairs); // sorted

      setRunning(false);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    es.addEventListener("error", () => {
      // optional: toast; EventSource will auto-retry while server is available
    });
  }, [codes]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
       <h1 className="text-7xl font-bold text-green-700">Capital Distance Finder</h1>
  <p className="opacity-75">
    Select countries, stream progress live, and get all unique pairs sorted by the shortest
    distance between their capitals.
  </p>

      {/* 1) Choose Countries */}
      <section className="space-y-3">
        <h2 className="font-semibold">1) Choose Countries</h2>

        {/* Pass onClear to reset everything */}
        <CountrySelector
          value={codes}
          onChange={(v) => {
            setCodes(v);
            if (v.length < 2) setShowMap(false);
          }}
          onClear={clearAll}
        />

        <div className="text-sm opacity-70">
          Selected: {codes.length ? codes.join(", ") : "—"}
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={start}
            disabled={!canStart}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? "Running…" : "Start"}
          </button>

          <button
            onClick={() => canToggleMap && setShowMap((s) => !s)}
            disabled={!canToggleMap}
            className="px-4 py-2 rounded-xl border disabled:opacity-50 disabled:cursor-not-allowed"
            title={!canToggleMap ? "Select ≥ 2 countries and press Start to enable the map" : ""}
            aria-disabled={!canToggleMap}
          >
            {showMap ? "Hide Map" : "Map View"}
          </button>

          {/* Optional: explicit global Reset button (same as Clear) */}
          {/* icommrnted because i have clear button */}
          {/* <button
            onClick={clearAll}
            className="px-4 py-2 rounded-xl border"
            title="Reset selection, progress, results and map"
          >
            Reset All
          </button> */}
        </div>

        {codes.length < 2 && (
          <div className="text-sm text-red-600">Pick at least two countries to begin.</div>
        )}
      </section>

      {/* 2) Live Progress */}
      <section className="space-y-3">
        <h2 className="font-semibold">2) Live Progress</h2>
        <ProgressBar done={done} total={total} />
      </section>

      {/* Map */}
      {showMap && pairs.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold">Map View (Top 20)</h2>
          <MapView pairs={pairs} limit={20} />
        </section>
      )}

      {/* 3) Results */}
      <section ref={resultsRef} className="space-y-3">
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
