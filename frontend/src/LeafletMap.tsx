import { useEffect, useRef } from "react";
import L from "leaflet";

interface Props {
  lat: number | null;
  lng: number | null;
  onSelectLocation: (lat: number, lng: number) => void;
  height?: string;
}

export default function LeafletMap({
  lat,
  lng,
  onSelectLocation,
  height,
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(
      [lat ?? 45.815, lng ?? 15.9819],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng).addTo(map);
      }

      onSelectLocation(lat, lng);
    });

    mapRef.current = map;
  }, [lat, lng, onSelectLocation]);

  // Ako već postoji lokacija → prikaži marker
  useEffect(() => {
    if (!mapRef.current || lat === null || lng === null) return;

    const pos: L.LatLngExpression = [lat, lng];

    if (markerRef.current) {
      markerRef.current.setLatLng(pos);
    } else {
      markerRef.current = L.marker(pos).addTo(mapRef.current);
    }

    mapRef.current.setView(pos);
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-md ${height ?? "h-[180px]"}`}
    />
  );
}