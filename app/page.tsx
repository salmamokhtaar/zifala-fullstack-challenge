"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import CountrySelector from "@/components/CountrySelector";
import ProgressBar from "@/components/ProgressBar";
import ResultsTable from "@/components/ResultsTable";
import DownloadCSV from "@/components/DownloadCSV";
import UploadCSV from "@/components/UploadCSV";

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
  const esRef = useRef<EventSource | null>(null);

  const canStart = codes.length >= 2 && !running;
  const canToggleMap = codes.length >= 2 && (running || pairs.length > 0);

  const clearAll = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
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

    setPairs([]);
    setDone(0);
    setTotal((codes.length * (codes.length - 1)) / 2);
    setRunning(true);

    const es = new EventSource(
      `/api/distances/stream?countries=${encodeURIComponent(JSON.stringify(codes))}`
    );
    esRef.current = es;

    es.onmessage = (evt) => {
      const m: Msg = JSON.parse(evt.data);
      setDone(m.done);
      setTotal(m.total);
      setPairs((arr) => [...arr, m.latest]);
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
      if (data?.pairs) setPairs(data.pairs);

      setRunning(false);
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [codes]);

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-10">
      {/* Simple header */}
      <header className="space-y-2">
        <h1 className="text-5xl font-bold text-green-700 leading-tight">
          Capital Distance Finder
        </h1>
        <p className="text-gray-700">
          Select countries, stream progress live, and get all unique pairs sorted by the shortest
          distance between their capitals.
        </p>
      </header>

      {/* 1) Choose Countries */}
      <section className="space-y-4">
        <h2 className="font-semibold">1) Choose Countries</h2>

        <CountrySelector
          value={codes}
          onChange={(v) => {
            setCodes(v);
            if (v.length < 2) setShowMap(false);
          }}
          onClear={clearAll}
        />

        <div className="text-sm text-gray-600">
          Selected: {codes.length ? codes.join(", ") : "—"}
        </div>

        {/* Actions toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={start}
              disabled={!canStart}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              title={canStart ? "Compute distances" : "Pick at least two countries"}
            >
              {running ? "Running…" : "Start"}
            </button>

            <button
              onClick={() => canToggleMap && setShowMap((s) => !s)}
              disabled={!canToggleMap}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              title={
                canToggleMap
                  ? "Toggle map view"
                  : "Select ≥ 2 countries and start to enable the map"
              }
            >
              {showMap ? "Hide Map" : "Map View"}
            </button>
          </div>

          {/* Right: CSV utilities */}
          <div className="flex items-center gap-2">
            {/* Upload always available */}
            <UploadCSV
              onLoaded={({ pairs: uploadedPairs, codes }) => {
                setCodes(codes);
                setPairs(uploadedPairs);
                setDone(uploadedPairs.length);
                setTotal(uploadedPairs.length);
                setRunning(false);
              }}
            />

            {/* Download only when we have results */}
            {pairs.length > 0 && <DownloadCSV rows={pairs} />}

            {/* Optional sample CSV link */}
            <a
              href="/sample-capitals.csv"
              download
              className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
              title="Download a sample CSV format"
            >
              Sample CSV
            </a>
          </div>
        </div>

        {codes.length < 2 && (
          <div className="text-sm text-red-600">Pick at least two countries to begin.</div>
        )}
      </section>

      {/* 2) Live Progress */}
      <section className="space-y-3">
        <h2 className="font-semibold">2) Live Progress</h2>
        <ProgressBar done={done} total={total} />
        <div className="text-sm text-gray-600">{total > 0 ? `${done} / ${total} (${Math.round((done / total) * 100)}%)` : "—"}</div>
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
          <div className="text-sm text-gray-600">Pairs: {pairs.length}</div>
          {/* Keep a second download here if you like redundancy, or remove if you prefer just the toolbar one */}
          {/* {pairs.length > 0 && <DownloadCSV rows={pairs} />} */}
        </div>
        <ResultsTable items={pairs} />
      </section>
    </main>
  );
}
