import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

//staviti u env varijablu
const DEFAULT_LATLNG: [number, number] = [45.8150, 15.9819]; //koordinate Zagreba
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DEFAULT_ICON = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export { DEFAULT_LATLNG, TILE_ATTRIBUTION, TILE_URL, DEFAULT_ICON }
