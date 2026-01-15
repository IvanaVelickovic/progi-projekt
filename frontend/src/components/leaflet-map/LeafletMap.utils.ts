import axios from "axios";
import type { ReverseGeoencodingResponse } from "./LeafletMap.types";

interface GeocodeResponse {
    features?: Array<{
        properties?: {
            lat?: number;
            lon?: number;
        };
    }>;
}

const getCoordinates = async (
    address: string,
): Promise<[number, number] | null> => {
    try {
        const { data } = await axios.get<GeocodeResponse>(
            `${import.meta.env.VITE_API_URL}/search`,
            {
                params: { text: address, apiKey: import.meta.env.VITE_API_KEY },
                validateStatus: s => s >= 200 && s < 300,
            },
        );

        const props = data.features?.[0]?.properties;

        return typeof props?.lat === "number" && typeof props?.lon === "number"
            ? [props.lat, props.lon]
            : null;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Geocoding failed", error.response?.status);
        }
        return null;
    }
};



interface ApiResponse {
    type: "FeatureCollection";
    features: Array<{
        type: "Feature";
        geometry: {
            type: "Point";
            coordinates: [number, number];
        };
        properties: {
            country_code: string;
            housenumber?: string;
            street?: string;
            address_line1?: string;
            address_line2?: string;
            city?: string;
            country: string;
            distance: number;
            formatted: string;
            lat: number;
            lon: number;
            postcode?: string;
            state?: string;
            state_code?: string;
            [key: string]: any;
        };
    }>;
    query: {
        lat: number;
        lon: number;
        plus_code: string;
    };
}

const getAddress = async (
    lat: number,
    lon: number,
): Promise<ReverseGeoencodingResponse | null> => {
    try {
        const { data } = await axios.get<ApiResponse>(
            `${import.meta.env.VITE_API_URL}/reverse`,
            {
                params: { lat, lon, apiKey: import.meta.env.VITE_API_KEY },
                validateStatus: (s) => s >= 200 && s < 300,
            },
        );

        const feature = data.features?.[0];
        if (!feature) return null;

        const props = feature.properties;

        return {
            location: {
                lat: props.lat,
                lng: props.lon,
            },
            address: props.address_line1 || props.formatted,
            formatted_address: props.formatted,
            address_components: {
                country: props.country,
                city: props.city || '',
                postcode: props.postcode || '',
                street: props.street || '',
            },
            additional_information: {
                country_code: props.country_code,
                suburb: props.suburb || '',
                distance: props.distance,
                state: props.state || '',
            },
        };
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Reverse geocoding failed", error.response?.status);
        }
        return null;
    }
};

export { getCoordinates, getAddress }