import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getAddress, getCoordinates } from "./LeafletMap.utils";
import { TILE_ATTRIBUTION, DEFAULT_LATLNG, TILE_URL, DEFAULT_ICON } from "./LeafletMap.config";

import { useEffect, useRef, useState } from "react";
import { Spinner } from "../ui/spinner";

L.Marker.prototype.options.icon = DEFAULT_ICON;

interface LeafletMapProps {
    width?: string;
    height?: string;
}

export function LeafletMap({ width = "1200px", height = "400px" }: LeafletMapProps) {
    const [coordinates, setCoordinates] = useState<[number, number] | null>(DEFAULT_LATLNG);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const mapRef = useRef<L.Map | null>(null);

    const handleAddressChange = (address: string) => {
        setSelectedAddress(address);
    };

    const handleSearch = () => {
        if (!selectedAddress) return;

        getCoordinates(selectedAddress).then(res => {
            if (!res) return;
            setCoordinates(res);
        }).catch(err => {
            console.error(err);
        });
    };

    useEffect(() => {
        if (typeof navigator.geolocation === "undefined") return;

        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            setCoordinates([latitude, longitude]);
        });
    }, []);

    useEffect(() => {
        if (!coordinates || !mapRef.current) return;

        const map = mapRef.current;

        map.flyTo(coordinates, 16, {
            duration: 0.5
        });

        map.on('click', (event) => {
            const lat = event.latlng.lat;
            const lng = event.latlng.lng;
            setCoordinates([lat, lng]);
            getAddress(lat, lng).then(res => {
                setSelectedAddress(res?.formatted_address || "Address not found");
            }).catch(err => {
                console.error(err);
            });
        });
    }, [coordinates]);

    if (!coordinates) {
        return <div
            style={{ width, height }}
            className={`
                relative 
                rounded-[8px] overflow-hidden 
                border border-[#d3d3d3] bg-gray-200 
                flex justify-center items-center
            `}>
            <div className={`flex gap-4 items-center`}>
                <Spinner />
                <span>
                    Loading Map
                </span>
            </div>
        </div>
    }

    return <div style={{ width, height }} className="flex flex-col gap-4">
        <div className="flex gap-4 w-full">
            <input
                type="text"
                value={selectedAddress || ""}
                placeholder="Upišite adresu"
                className="w-full border border-[#d3d3d3] rounded-[8px] px-4 py-2 bg-white"
                onChange={(e) => {
                    handleAddressChange(e.target.value);
                }}
            />
            <button
                type="button"
                className="bg-green-dark text-white px-4 py-2 rounded-[8px] hover:cursor-pointer"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
        <MapContainer
            center={coordinates}
            zoom={15}
            scrollWheelZoom={false}
            className={`h-full relative rounded-[8px] overflow-hidden border border-[#d3d3d3]`}
            ref={mapRef}
        >
            <TileLayer
                attribution={TILE_ATTRIBUTION}
                url={TILE_URL}
            />
            <Marker position={coordinates}>
                <Popup>
                    {selectedAddress}
                </Popup>
            </Marker>
        </MapContainer>
    </div>
};