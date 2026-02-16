"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const ActiveIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #5B7CE6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #5B7CE6;"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const DiscoveredIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #B8BCC2; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
});

const PrimaryIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div class="primary-target-marker" style="background-color: #34A853; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 20px #34A853; display: flex; items-center; justify-center;">
    <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%; animation: pulse 1.5s infinite;"></div>
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface Property {
  name: string;
  units: number;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  status?: string;
}

const CUMMING_COMPLEXES: Property[] = [
  { name: "The Columns at Lake Lanier", units: 240, address: "2100 Columns Dr, Cumming, GA 30041", lat: 34.207, lng: -84.140, phone: "(770) 889-1000", website: "https://www.columnsatlake-lanier.com/" },
  { name: "Arbors at Lake Lanier", units: 180, address: "1510 Arbors Cir, Cumming, GA 30041", lat: 34.215, lng: -84.135, phone: "(770) 781-9100", website: "https://www.arborsatlakelanier.com/" },
  { name: "Saddleview Apartments", units: 156, address: "100 Saddleview Ct, Cumming, GA 30040", lat: 34.220, lng: -84.150, phone: "(770) 889-8800", website: "https://www.saddleviewapts.com/" },
  { name: "Crest at Shakerag", units: 320, address: "Cumming, GA 30041", lat: 34.180, lng: -84.120, phone: "(678) 513-4400", website: "https://www.crestatshakerag.com/" },
  { name: "The Parc at 1312", units: 210, address: "1312 Pilgrim Rd, Cumming, GA 30040", lat: 34.225, lng: -84.145, phone: "(770) 889-1312", website: "https://www.theparcat1312.com/" },
  { name: "Retreat at Cumming", units: 192, address: "Cumming, GA 30040", lat: 34.210, lng: -84.155, phone: "(770) 887-1920", website: "https://www.retreatatcumming.com/" },
  { name: "The Residences at West Vickers", units: 144, address: "Cumming, GA 30040", lat: 34.205, lng: -84.160, phone: "(770) 205-1440", website: "https://www.residencesatwestvickers.com/" },
  { name: "The Statesman", units: 252, address: "1600 Ronald Reagan Blvd, Cumming, GA 30041", lat: 34.178, lng: -84.142, phone: "(678) 658-3614", website: "https://www.harborgroupmanagement.com/apartments/ga/cumming/the-statesman/" },
];

function MapEffect() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

function MapEvents({ onMove }: { onMove: () => void }) {
  useMapEvents({
    moveend: () => onMove(),
    zoomend: () => onMove(),
  });
  return null;
}

export default function TacticalMap({ properties, primaryTargetId }: { properties: any[], primaryTargetId?: string | null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [mapVersion, setMapVersion] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="w-full h-full bg-void animate-pulse" />;

  const activeNames = properties.map(p => p.name.toLowerCase());
  const primaryTarget = properties.find(p => p.id === primaryTargetId);

  return (
    <div className="w-full h-full relative group">
      <MapContainer
        center={[34.2073, -84.1397]}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapEffect />
        <MapEvents onMove={() => setMapVersion(v => v + 1)} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {CUMMING_COMPLEXES.map((p, idx) => {
          const isActive = activeNames.includes(p.name.toLowerCase());
          const isPrimary = primaryTarget?.name.toLowerCase() === p.name.toLowerCase();
          
          return (
            <Marker 
              key={`${idx}-${mapVersion}`} 
              position={[p.lat, p.lng]} 
              icon={isPrimary ? PrimaryIcon : isActive ? ActiveIcon : DiscoveredIcon}
            >
              <Popup className="tactical-popup">
                <div className="p-2 min-w-[180px] bg-surface text-primary font-pixel">
                  <div className={`text-[10px] mb-1 tracking-wider uppercase ${isPrimary ? "text-[var(--accent-bright)] font-bold" : "text-[#5B7CE6]"}`}>
                    {isPrimary ? "PRIMARY_TARGET" : isActive ? "ARMED_PROSPECT" : "DISCOVERED_PROPERTY"}
                  </div>
                  <div className="text-[12px] font-medium mb-2 border-b border-dim pb-1">
                    {p.name.toUpperCase()}
                  </div>
                  <div className="space-y-1.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-faint">UNITS:</span>
                      <span className="text-secondary">{p.units}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-faint">PHONE:</span>
                      <span className="text-secondary">{p.phone}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-dim flex gap-2">
                      <a 
                        href={p.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 px-2 py-1 bg-accent/10 text-accent border border-accent/20 text-center hover:bg-accent/20 transition-colors"
                      >
                        WEBSITE
                      </a>
                      <button className="flex-1 px-2 py-1 bg-white/5 text-secondary border border-white/10 text-center hover:bg-white/10 transition-colors">
                        RECON
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 pointer-events-none">
        <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] text-white font-pixel tracking-widest uppercase">
          Tactical_Grid_v1.1 | {CUMMING_COMPLEXES.length}_Targets
        </div>
      </div>
    </div>
  );
}
