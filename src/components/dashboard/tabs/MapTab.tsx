"use client";

import { useState } from "react";
import type { Property } from "@/lib/types";
import { MapPin, Building2, Search, Plus, ExternalLink } from "lucide-react";
import { Panel, Badge } from "../design-system";

// ═══════════════════════════════════════════════════════════
// Map Tab — Visualized territory and property discovery
// ═══════════════════════════════════════════════════════════

interface MapTabProps {
  properties: Property[];
}

const CUMMING_COMPLEXES = [
  { name: "The Columns at Lake Lanier", units: 240, address: "2100 Columns Dr, Cumming, GA 30041" },
  { name: "Arbors at Lake Lanier", units: 180, address: "1510 Arbors Cir, Cumming, GA 30041" },
  { name: "Saddleview Apartments", units: 156, address: "100 Saddleview Ct, Cumming, GA 30040" },
  { name: "Crest at Shakerag", units: 320, address: "Cumming, GA 30041" },
  { name: "The Parc at 1312", units: 210, address: "1312 Pilgrim Rd, Cumming, GA 30040" },
  { name: "Retreat at Cumming", units: 192, address: "Cumming, GA 30040" },
  { name: "The Residences at West Vickers", units: 144, address: "Cumming, GA 30040" },
];

export default function MapTab({ properties }: MapTabProps) {
  const [search, setSearch] = useState("");
  
  const filteredDiscovery = CUMMING_COMPLEXES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) &&
    !properties.some(p => p.name.toLowerCase() === c.name.toLowerCase())
  );

  const activeTerritory = properties.filter(p => p.status === "active" || p.status === "contract");
  const pipelineTerritory = properties.filter(p => p.status !== "active" && p.status !== "contract");

  return (
    <div className="space-y-10 fade-in">
      {/* Territory Header */}
      <section className="grid grid-cols-2 gap-4">
        <Panel className="bg-accent-glow border-accent/20">
          <div className="text-label text-dim mb-1">ACTIVE_TERRITORY</div>
          <div className="text-body font-medium text-primary flex items-center gap-2">
            <MapPin size={14} className="text-accent" />
            {activeTerritory.length} Properties
          </div>
        </Panel>
        <Panel>
          <div className="text-label text-dim mb-1">PIPELINE_REACH</div>
          <div className="text-body font-medium text-primary flex items-center gap-2">
            <Building2 size={14} className="text-dim" />
            {pipelineTerritory.length} Properties
          </div>
        </Panel>
      </section>

      {/* Map Visualization (Themed List) */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-accent" />
            <span className="font-pixel text-[10px] text-secondary tracking-wider">
              {"> CUMMING_GA_GRID"}
            </span>
          </div>
          <div className="relative">
            <Search size={10} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
            <input 
              type="text" 
              placeholder="SEARCH_GRID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface border border-dim pl-7 pr-3 py-1 text-label text-primary focus:border-accent outline-none transition-colors w-40"
            />
          </div>
        </div>

        <div className="space-y-3">
          {/* Active Properties in Map */}
          {properties.map(p => (
            <div key={p.id} className="group relative">
              <Panel className="border-accent/30 bg-accent-glow/5 hover:border-accent transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(52,168,83,0.5)]" />
                    <div>
                      <div className="text-body font-medium text-primary">{p.name.toUpperCase()}</div>
                      <div className="text-label text-faint">{p.units} UNITS • {p.status.toUpperCase()}</div>
                    </div>
                  </div>
                  <Badge variant="statusActive">IN_SYSTEM</Badge>
                </div>
              </Panel>
            </div>
          ))}

          {/* Discovery Properties */}
          {filteredDiscovery.map((c, idx) => (
            <div key={idx} className="group relative">
              <Panel className="border-dashed border-dim hover:border-bright transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-dim group-hover:bg-bright transition-colors" />
                    <div>
                      <div className="text-body font-medium text-dim group-hover:text-secondary transition-colors">{c.name.toUpperCase()}</div>
                      <div className="text-label text-faint">{c.units} UNITS • DISCOVERED</div>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-label text-accent hover:text-accent-bright transition-all">
                    <Plus size={10} />
                    ADD_TO_PIPELINE
                  </button>
                </div>
              </Panel>
            </div>
          ))}

          {filteredDiscovery.length === 0 && search && (
            <div className="text-center py-10 border border-dashed border-dim">
              <div className="text-label text-faint mb-2">NO_MATCH_IN_CUMMING_GRID</div>
              <button className="text-label text-accent hover:underline flex items-center gap-1 mx-auto">
                <Plus size={10} /> ADD_NEW_MANUALLY
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Greater Area Expansion */}
      <section>
        <Panel className="border-dim bg-elevated/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-label text-secondary mb-1">GREATER_AREA_EXPANSION</div>
              <p className="text-label text-faint">Ready to expand beyond Cumming? Add complexes in Alpharetta, Milton, or Roswell.</p>
            </div>
            <button className="px-4 py-2 bg-surface border border-dim text-label text-secondary hover:border-bright transition-all flex items-center gap-2">
              <ExternalLink size={12} />
              EXPAND_GRID
            </button>
          </div>
        </Panel>
      </section>
    </div>
  );
}
