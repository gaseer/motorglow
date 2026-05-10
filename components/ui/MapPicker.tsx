"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapPickerProps {
  onLocationSelect: (address: string) => void;
  onClose: () => void;
}

function LocationMarker({ onSelect }: { onSelect: (address: string) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    },
  });

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.display_name) {
        onSelect(data.display_name);
      }
    } catch (e) {
      console.error("Reverse geocoding failed", e);
    }
  };

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

export default function MapPicker({ onLocationSelect, onClose }: MapPickerProps) {
  const [internalAddress, setInternalAddress] = useState("");
  // Default bounds to something generic, e.g. center of India
  const center: L.LatLngTuple = [20.5937, 78.9629];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="h-[300px] w-full rounded-[16px] overflow-hidden border border-[#E5E5E5] relative shadow-sm z-0">
        <MapContainer center={center} zoom={4} scrollWheelZoom={true} style={{ height: "100%", width: "100%", zIndex: 0 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onSelect={setInternalAddress} />
        </MapContainer>
      </div>

      <div className="bg-[#F5F5F5] min-h-[48px] p-3 rounded-[12px] text-[13px] text-[#0D0D0D] flex items-center shadow-inner border border-[#E5E5E5] overflow-y-auto max-h-[100px]">
        {internalAddress ? (
          <div><strong>Selected:</strong> {internalAddress}</div>
        ) : (
          <div className="text-[#6B6B6B]">Click anywhere on the map to drop a pin.</div>
        )}
      </div>

      <div className="flex gap-3 shrink-0">
        <button 
          onClick={onClose}
          className="flex-1 py-3 text-sm font-semibold rounded-[12px] border border-[#E5E5E5] bg-white text-[#0D0D0D] hover:bg-[#F5F5F5] transition-colors"
        >
          Cancel
        </button>
        <button 
          disabled={!internalAddress}
          onClick={() => { onLocationSelect(internalAddress); onClose(); }}
          className="flex-1 py-3 text-sm font-semibold rounded-[12px] bg-[#C8F135] text-[#0D0D0D] hover:bg-[#b5da30] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
}
