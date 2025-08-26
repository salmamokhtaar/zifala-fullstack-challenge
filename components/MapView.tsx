"use client";
import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dataset from "@/lib/capitals.json";

type Pair = { a: string; b: string; km: number };

const codeMap = new Map(
  (dataset as any[]).map((c) => [c.iso2, { lat: c.lat, lon: c.lon, name: c.name, capital: c.capital }])
);

export default function MapView({ pairs, limit = 20 }: { pairs: Pair[]; limit?: number }) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // only the top N pairs (already sorted asc in your app after POST)
  const top = useMemo(() => pairs.slice(0, limit), [pairs, limit]);

  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    mapRef.current = L.map(divRef.current, { zoomControl: true }).setView([20, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 8,
    }).addTo(mapRef.current);

    layerRef.current = L.layerGroup().addTo(mapRef.current);
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    const group = layerRef.current;
    group.clearLayers();

    const bounds: L.LatLngExpression[] = [];

    top.forEach((p, idx) => {
      const A = codeMap.get(p.a);
      const B = codeMap.get(p.b);
      if (!A || !B) return;

      const aLL = L.latLng(A.lat, A.lon);
      const bLL = L.latLng(B.lat, B.lon);

      bounds.push(aLL, bLL);

      // line
      const poly = L.polyline([aLL, bLL], { weight: 2, opacity: 0.8 });
      poly.addTo(group);

      // markers
      const ma = L.circleMarker(aLL, { radius: 5 }).addTo(group);
      const mb = L.circleMarker(bLL, { radius: 5 }).addTo(group);

      ma.bindPopup(`<b>${A.name}</b><br/>${A.capital} (${p.a})`);
      mb.bindPopup(`<b>${B.name}</b><br/>${B.capital} (${p.b})`);

      // optional: show index / distance on the line
      poly.bindTooltip(`#${idx + 1}: ${p.km.toFixed(1)} km`);
    });

    if (bounds.length) {
      mapRef.current.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] });
    }
  }, [top]);

  return <div ref={divRef} className="h-[420px] w-full rounded-2xl border overflow-hidden" />;
}
