import L from "leaflet";
import api from "../../api";
import LeafletMap from "../../LeafletMap";

/* FIX za Leaflet marker */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== TIP ===== */
interface BiographyData {
  bio: string;
  location: {
    lat: number | null;
    lng: number | null;
    label: string;
  };
}

interface Props {
  biographyData: BiographyData;
  setBiographyData: React.Dispatch<React.SetStateAction<BiographyData>>;
}

/* ===== MAP CLICK ===== */

const BiographyTabContent = ({ biographyData, setBiographyData }: Props) => {
  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBiographyData((prev) => ({
      ...prev,
      bio: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting biography data:", biographyData);
    try {
      const payload = {
        biography: biographyData.bio,
        latitude: biographyData.location.lat,
        longitude: biographyData.location.lng,
      };

      await api.post("/api/Instructor/update-biography", payload);

      alert("Biografija i lokacija spremljeni!");
    } catch (err) {
      alert("Greška pri spremanju.");
      console.error(err);
    }
  };

  return (
    <form className="flex flex-col h-full w-[90%]" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Biografija</label>
        <textarea
          value={biographyData.bio}
          onChange={handleBioChange}
          className="border border-gray-400 rounded-md px-2 py-1 h-[100px]"
        />

        <label className="font-semibold">Lokacija:</label>

        <LeafletMap
          height="h-[170px]"
          lat={biographyData.location.lat}
          lng={biographyData.location.lng}
          onSelectLocation={(lat, lng) =>
            setBiographyData((prev) => ({
              ...prev,
              location: {
                lat,
                lng,
                label: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
              },
            }))
          }
        />

        {biographyData.location.label && (
          <p className="text-sm text-gray-600">
            Odabrana lokacija: {biographyData.location.label}
          </p>
        )}
      </div>

      {/* Sticky gumb na dnu */}
      <button
        type="submit"
        className="mt-auto bg-[#1e6b84] text-white px-5 py-2 rounded-md self-center"
      >
        Spremi promjene
      </button>
    </form>
  );
};

export default BiographyTabContent;
