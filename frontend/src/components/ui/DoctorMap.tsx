"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React from "react";
import { Doctor } from "@/types/type";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function DoctorMap({ doctors }: { doctors: Doctor[] }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {doctors.map((doctor) => (
        <Marker key={doctor.id} position={[doctor.lat, doctor.lng]}>
          <Popup>
            <b>{doctor.name}</b>
            <br />
            {doctor.specialty}
            <br />
            {doctor.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
