"use client";

import { useState } from "react";
import type { Business, Property } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Globe,
  MapPin,
  Package,
  User,
} from "lucide-react";
import { Panel, ProgressBar, StatBox as StatBoxDS } from "../design-system";

// ═══════════════════════════════════════════════════════════
// Business Tab — Properties, revenue, profile, inventory
// ═══════════════════════════════════════════════════════════

interface BusinessTabProps {
  business: Business;
  properties: Property[];
  primaryTargetId?: string | null;
}

export default function BusinessTab({ business, properties, primaryTargetId }: BusinessTabProps) {
  return (
    <div className="space-y-12 fade-in">
      {/* Properties Pipeline */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={12} className="text-[var(--accent)]" />
          <span className="font-pixel text-[10px] text-[var(--text-secondary)] tracking-wider">
            {"> PROPERTIES"}
          </span>
          <span className="font-pixel text-[9px] text-[var(--text-faint)]">
            [{properties.length}]
          </span>
        </div>

        {/* Pipeline summary */}
        <div className="flex gap-3 mb-3">
          {["prospect", "meeting", "negotiation", "contract", "active"].map(
            (status) => {
              const count = properties.filter((p) => p.status === status).length;
              if (count === 0) return null;
              return (
                <div key={status} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2"
                    style={{
                      backgroundColor: `var(--status-${status === "contract" ? "active" : status})`,
                    }}
                  />
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {count} {status}
                  </span>
                </div>
              );
            }
          )}
        </div>

        {/* Property list */}
        <div className="space-y-1">
          {properties.map((prop) => (
            <PropertyRow 
              key={prop.id} 
              property={prop} 
              isPrimary={prop.id === primaryTargetId}
            />
          ))}
        </div>
      </section>

      {/* Revenue */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-pixel text-[10px] text-[var(--text-secondary)] tracking-wider">
            {"> REVENUE"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatBoxDS
            label="MONTHLY"
            value={`$${business.revenue.monthlyRecurring.toLocaleString()}`}
          />
          <StatBoxDS
            label="TOTAL"
            value={`$${business.revenue.totalEarned.toLocaleString()}`}
          />
          <StatBoxDS
            label="TARGET"
            value={`$${business.revenue.target.toLocaleString()}/mo`}
          />
        </div>
        {business.revenue.target > 0 && (
          <div className="mt-3">
            <ProgressBar
              current={business.revenue.monthlyRecurring}
              max={business.revenue.target}
              label={`Progress to $${business.revenue.target.toLocaleString()}/mo`}
              size="sm"
            />
          </div>
        )}
      </section>

      {/* Business Profile */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-pixel text-[10px] text-[var(--text-secondary)] tracking-wider">
            {"> PROFILE"}
          </span>
        </div>
        <Panel className="p-4 space-y-4">
          <div>
            <span className="font-pixel text-[11px] text-[var(--accent-bright)]">
              {business.name}
            </span>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">
              {business.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <MapPin size={10} />
            <span>{business.location}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <Globe size={10} />
            <span>
              {business.website.url}{" "}
              <span className={`font-pixel text-[8px] ${business.website.status === "live" ? "text-[var(--accent)]" : "text-[var(--text-faint)]"}`}>
                [{business.website.status.toUpperCase()}]
              </span>
            </span>
          </div>

          <div className="border-t border-[var(--border-dim)] pt-3">
            <span className="font-pixel text-[8px] text-[var(--text-faint)]">SERVICES</span>
            <div className="mt-2 space-y-2">
              {business.services.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={10} className="text-[var(--text-faint)]" />
                    <span className="text-[12px] text-[var(--text-secondary)]">
                      {s.name}
                    </span>
                    {s.popular && (
                      <span className="font-pixel text-[7px] text-[var(--gold)]">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[12px] text-[var(--text-primary)]">
                    ${s.pricePerUnit}/unit
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────

function PropertyRow({ property, isPrimary }: { property: Property; isPrimary?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  const statusColor: Record<string, string> = {
    prospect: "var(--status-prospect)",
    meeting: "var(--status-meeting)",
    negotiation: "var(--status-negotiation)",
    contract: "var(--status-active)",
    active: "var(--status-active)",
    churned: "var(--status-churned)",
  };

  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`
          w-full flex items-center gap-3 px-3 py-3 text-left border transition-colors
          ${isPrimary 
            ? "border-[var(--accent)] bg-[var(--accent-glow)] shadow-[inset_0_0_10px_rgba(52,168,83,0.1)]" 
            : "border-[var(--border-dim)] bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)]"
          }
        `}
      >
        {expanded ? (
          <ChevronDown size={10} className="text-[var(--text-faint)]" />
        ) : (
          <ChevronRight size={10} className="text-[var(--text-faint)]" />
        )}
        <div
          className="w-2 h-2 flex-shrink-0"
          style={{ backgroundColor: statusColor[property.status] || "var(--text-faint)" }}
        />
        <span className={`text-[13px] flex-1 ${isPrimary ? "text-[var(--accent-bright)] font-medium" : "text-[var(--text-primary)]"}`}>
          {property.name}
          {isPrimary && <span className="ml-2 font-pixel text-[8px] text-[var(--accent)] tracking-widest">[PRIMARY_TARGET]</span>}
        </span>
        <span className="text-[11px] text-[var(--text-muted)]">
          {property.units} units
        </span>
        <span className="font-pixel text-[8px] text-[var(--text-faint)] uppercase">
          {property.status}
        </span>
      </button>

        {expanded && (
        <div className={`
          px-3 pb-3 border border-t-0 bg-[var(--bg-surface)]
          ${isPrimary ? "border-[var(--accent)]" : "border-[var(--border-dim)]"}
        `}>
          <div className="text-[12px] text-[var(--text-muted)] py-2 leading-relaxed whitespace-pre-wrap">
            {property.notes}
          </div>
          {property.contacts.length > 0 && (
            <div className="space-y-2 mt-1">
              {property.contacts.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px]">
                  <User size={10} className="text-[var(--text-faint)] mt-0.5" />
                  <div>
                    <span className="text-[var(--text-secondary)]">{c.name}</span>
                    <span className="text-[var(--text-faint)]"> — {c.role}</span>
                    {c.lastContact && (
                      <span className="text-[var(--text-faint)] ml-2">
                        Last: {formatDate(c.lastContact)}
                      </span>
                    )}
                    {c.notes && (
                      <p className="text-[var(--text-muted)] mt-0.5">{c.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-[10px] text-[var(--text-faint)] mt-2">
            Added {formatDate(property.createdDate)} · {property.address}
          </div>

          {/* Spark & Pitch Links */}
          <div className="mt-4 pt-3 border-t border-[var(--border-dim)] flex gap-2">
            <a 
              href={`/${property.id === 'prop-statesman' ? 'the-statesman' : property.id === 'prop-columns' ? 'the-columns-at-pilgrim-mill' : property.id === 'prop-arbors' ? 'arbors-at-lake-lanier' : property.id === 'prop-saddleview' ? 'saddleview-apartments' : property.id.replace('prop-', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-accent/10 text-accent border border-accent/20 text-[11px] font-medium hover:bg-accent/20 transition-all"
            >
              <Globe size={12} />
              SPARK_PAGE
            </a>
            <a 
              href={`/${property.id === 'prop-statesman' ? 'the-statesman' : property.id === 'prop-columns' ? 'the-columns-at-pilgrim-mill' : property.id === 'prop-arbors' ? 'arbors-at-lake-lanier' : property.id === 'prop-saddleview' ? 'saddleview-apartments' : property.id.replace('prop-', '')}/pitch`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 text-secondary border border-white/10 text-[11px] font-medium hover:bg-white/10 transition-all"
            >
              <ExternalLink size={12} />
              PITCH_DECK
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

