import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Building2,
  Users,
  MapPin,
  Plane,
  ChevronRight,
  Layers,
  Wind,
  RotateCcw,
  Home,
} from 'lucide-react';
import { STADIUMS } from '../data/stadiums';
import type { Stadium } from '../types';

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom gold marker for key venues
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const KEY_VENUES = ['metlife', 'estadio_azteca', 'sofi', 'cowboys'];

const countryFlag = (country: string) => {
  if (country === 'USA') return '🇺🇸';
  if (country === 'Canada') return '🇨🇦';
  if (country === 'Mexico') return '🇲🇽';
  return '🏟️';
};

const countryAccent = (country: string) => {
  if (country === 'USA') return '#B22234';
  if (country === 'Canada') return '#FF0000';
  if (country === 'Mexico') return '#006847';
  return 'var(--brand-gold)';
};

const surfaceIcon = (surface: string) => {
  if (surface === 'natural') return { icon: <Layers size={14} />, label: 'Natural Grass' };
  if (surface === 'hybrid') return { icon: <Layers size={14} />, label: 'Hybrid Grass' };
  return { icon: <Layers size={14} />, label: 'Artificial Turf' };
};

const roofIcon = (roof: string) => {
  if (roof === 'open') return { icon: <Wind size={14} />, label: 'Open Air' };
  if (roof === 'retractable') return { icon: <RotateCcw size={14} />, label: 'Retractable' };
  return { icon: <Home size={14} />, label: 'Covered' };
};

const formatCapacity = (cap: number) =>
  cap.toLocaleString();

const StadiumCard: React.FC<{ stadium: Stadium; index: number }> = ({ stadium, index }) => {
  const isKey = KEY_VENUES.includes(stadium.id);
  const accent = countryAccent(stadium.country);
  const surf = surfaceIcon(stadium.surface);
  const roof = roofIcon(stadium.roofType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{ position: 'relative' }}
    >
      <Link
        to={`/stadiums/${stadium.id}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          className="card"
          style={{
            padding: 0,
            overflow: 'hidden',
            cursor: 'pointer',
            border: isKey
              ? '1px solid rgba(255,215,0,0.35)'
              : '1px solid var(--border-subtle)',
            boxShadow: isKey ? '0 0 20px rgba(255,215,0,0.12)' : undefined,
            transition: 'all 0.25s ease',
          }}
        >
          {/* Color bar top */}
          <div
            style={{
              height: 4,
              background: isKey
                ? 'linear-gradient(90deg, var(--brand-gold), var(--brand-red))'
                : `linear-gradient(90deg, ${accent}, transparent)`,
            }}
          />

          <div style={{ padding: '16px 18px' }}>
            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 20 }}>{countryFlag(stadium.country)}</span>
                  {isKey && (
                    <span className="badge badge-gold" style={{ fontSize: 9 }}>KEY VENUE</span>
                  )}
                </div>
                <h3 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 20,
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                  marginBottom: 2,
                }}>
                  {stadium.name}
                </h3>
                {stadium.nickname && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{stadium.nickname}"
                  </p>
                )}
              </div>
              <ChevronRight size={18} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 4 }} />
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13 }}>
              <MapPin size={13} color="var(--brand-gold)" />
              <span>{stadium.city}, {stadium.country}</span>
            </div>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              padding: '10px 0',
              borderTop: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: 10,
            }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Capacity</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Users size={14} color="var(--brand-gold)" />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {formatCapacity(stadium.capacity)}
                  </span>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>WC Matches</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building2 size={14} color="var(--brand-red)" />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, fontWeight: 600, color: stadium.matches.length > 0 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {stadium.matches.length} {stadium.matches.length === 1 ? 'match' : 'matches'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags row */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 4,
                background: 'rgba(255,255,255,0.04)',
                fontSize: 11, color: 'var(--text-secondary)',
              }}>
                {surf.icon}
                <span>{surf.label}</span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '3px 8px', borderRadius: 4,
                background: 'rgba(255,255,255,0.04)',
                fontSize: 11, color: 'var(--text-secondary)',
              }}>
                {roof.icon}
                <span>{roof.label}</span>
              </div>
              {stadium.altitude && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(245,158,11,0.1)',
                  fontSize: 11, color: 'var(--warning-amber)',
                }}>
                  <span>⛰️ {stadium.altitude}m alt.</span>
                </div>
              )}
            </div>

            {/* Airport row */}
            {stadium.nearestAirport && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, color: 'var(--text-muted)', fontSize: 12 }}>
                <Plane size={12} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stadium.nearestAirport}</span>
              </div>
            )}

            {/* Built year */}
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
              Built {stadium.builtYear}{stadium.renovatedYear ? ` · Renovated ${stadium.renovatedYear}` : ''}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function Stadiums() {
  const [filter, setFilter] = useState<'all' | 'USA' | 'Canada' | 'Mexico'>('all');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  const filteredStadiums = filter === 'all'
    ? STADIUMS
    : STADIUMS.filter(s => s.country === filter);

  const totalCapacity = STADIUMS.reduce((acc, s) => acc + s.capacity, 0);
  const usaCount = STADIUMS.filter(s => s.country === 'USA').length;
  const canadaCount = STADIUMS.filter(s => s.country === 'Canada').length;
  const mexicoCount = STADIUMS.filter(s => s.country === 'Mexico').length;

  return (
    <div className="page-container">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 28 }}
      >
        <h1 className="section-title" style={{ fontSize: 36, marginBottom: 8 }}>
          WC2026 Venues
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 600 }}>
          16 world-class stadiums across the United States, Canada, and Mexico. The biggest World Cup in history.
        </p>
      </motion.div>

      {/* Quick stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 28,
        }}
      >
        {[
          { label: 'Total Stadiums', value: '16', sub: 'Across 3 nations', color: 'var(--brand-gold)' },
          { label: '🇺🇸 USA', value: String(usaCount), sub: 'Host venues', color: '#B22234' },
          { label: '🇨🇦 Canada', value: String(canadaCount), sub: 'Host venues', color: '#FF0000' },
          { label: '🇲🇽 Mexico', value: String(mexicoCount), sub: 'Host venues', color: '#006847' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ padding: '14px 18px', borderLeft: `3px solid ${stat.color}` }}
          >
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{stat.label}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{stat.sub}</p>
          </div>
        ))}
      </motion.div>

      {/* Interactive Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        style={{ marginBottom: 32 }}
      >
        <div
          className="card"
          style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}
        >
          <div style={{
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <h2 className="section-title" style={{ fontSize: 22 }}>
              <MapPin size={18} color="var(--brand-gold)" />
              Interactive Stadium Map
            </h2>
            <span className="badge badge-green">Live Locations</span>
          </div>

          {mapReady && (
            <div style={{ height: 420 }}>
              <MapContainer
                center={[38, -97]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {STADIUMS.map((stadium) => (
                  <Marker
                    key={stadium.id}
                    position={[stadium.lat, stadium.lng]}
                    icon={KEY_VENUES.includes(stadium.id) ? goldIcon : redIcon}
                  >
                    <Popup>
                      <div style={{
                        background: 'var(--surface-card)',
                        color: 'var(--text-primary)',
                        fontFamily: "'DM Sans', sans-serif",
                        minWidth: 200,
                        borderRadius: 8,
                        padding: 4,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <span style={{ fontSize: 16 }}>{countryFlag(stadium.country)}</span>
                          <strong style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16 }}>
                            {stadium.name}
                          </strong>
                          {KEY_VENUES.includes(stadium.id) && (
                            <span style={{ fontSize: 9, background: 'rgba(255,215,0,0.2)', color: '#FFD700', padding: '2px 6px', borderRadius: 3, fontWeight: 700 }}>⭐ KEY</span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
                          📍 {stadium.city}, {stadium.country}
                        </div>
                        <div style={{ fontSize: 12, marginBottom: 4 }}>
                          👥 Capacity: <strong>{formatCapacity(stadium.capacity)}</strong>
                        </div>
                        <div style={{ fontSize: 12, marginBottom: 8 }}>
                          🏟️ {stadium.matches.length} WC {stadium.matches.length === 1 ? 'match' : 'matches'}
                        </div>
                        <a
                          href={`/stadiums/${stadium.id}`}
                          style={{
                            display: 'inline-block',
                            background: 'var(--brand-red)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          View Details →
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          <div style={{
            padding: '10px 20px',
            display: 'flex',
            gap: 20,
            borderTop: '1px solid var(--border-subtle)',
            fontSize: 12,
            color: 'var(--text-muted)',
          }}>
            <span>⭐ Gold markers = Key/Final venues</span>
            <span>🔴 Red markers = Group stage & other venues</span>
            <span style={{ marginLeft: 'auto' }}>Total capacity: {totalCapacity.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Country filter tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="section-title" style={{ fontSize: 24 }}>
          <Building2 size={20} color="var(--brand-gold)" />
          All Stadiums
        </h2>
        <div className="tab-bar">
          {(['all', 'USA', 'Canada', 'Mexico'] as const).map((f) => (
            <button
              key={f}
              className={`tab-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All 16' : f === 'USA' ? `🇺🇸 USA (${usaCount})` : f === 'Canada' ? `🇨🇦 Canada (${canadaCount})` : `🇲🇽 Mexico (${mexicoCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Stadium cards grid */}
      <div className="page-grid-4">
        {filteredStadiums.map((stadium, idx) => (
          <StadiumCard key={stadium.id} stadium={stadium} index={idx} />
        ))}
      </div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: 40,
          padding: '20px 24px',
          background: 'rgba(255,215,0,0.04)',
          border: '1px solid var(--border-gold)',
          borderRadius: 12,
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}
      >
        <span style={{ fontSize: 24 }}>🌎</span>
        <div>
          <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--brand-gold)' }}>First-Ever Tri-Nation World Cup</p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            FIFA World Cup 2026 is the first World Cup hosted by three countries simultaneously — the United States, Canada, and Mexico.
            With 48 teams and 104 matches, it will be the largest World Cup in history.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
