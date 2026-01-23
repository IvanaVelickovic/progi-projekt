import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  lat?: number | null;
  lng?: number | null;
  height?: string;
  zoom?: number;
}

export default function LeafletMap({
  lat,
  lng,
  height = "h-[220px]",
  zoom = 13,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (lat == null || lng == null) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    }).setView([lat, lng], zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    markerRef.current = L.marker([lat, lng]).addTo(map);
    mapRef.current = map;

    map.invalidateSize();
  }, [lat, lng, zoom]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (lat == null || lng == null) return;

    const pos: L.LatLngExpression = [lat, lng];

    mapRef.current.setView(pos);
    markerRef.current?.setLatLng(pos);

    mapRef.current.invalidateSize();
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className={`w-1/2 rounded-md overflow-hidden ${height}`}
    />
  );
}
