import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Globe, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTournamentStore } from '../store/tournamentStore';
import { STADIUMS } from '../data/stadiums';

// Custom glowing icon for stadiums
const stadiumIcon = new L.DivIcon({
  className: 'custom-stadium-icon',
  html: `<div style="width: 16px; height: 16px; background: var(--brand-gold); border-radius: 50%; box-shadow: 0 0 15px var(--brand-gold); border: 2px solid white;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

// A simple approximate mapping of some countries to lat/lng just to show them on the map
// For a production app, you'd use a GeoJSON for full country highlighting.
const COUNTRY_COORDS: Record<string, [number, number]> = {
  'ARG': [-38.4, -63.6], 'FRA': [46.2, 2.2], 'BRA': [-14.2, -51.9], 'ENG': [52.3, -1.1],
  'ESP': [40.4, -3.7], 'POR': [39.3, -8.2], 'NED': [52.1, 5.2], 'ITA': [41.8, 12.5],
  'GER': [51.1, 10.4], 'CRO': [45.1, 15.2], 'USA': [37.0, -95.7], 'MEX': [23.6, -102.5],
  'CAN': [56.1, -106.3], 'JPN': [36.2, 138.2], 'SEN': [14.4, -14.4], 'MAR': [31.7, -7.0]
};

export default function GlobalMap() {
  const { teams } = useTournamentStore();

  const qualifiedTeams = useMemo(() => {
    return teams.filter(t => COUNTRY_COORDS[t.countryCode]);
  }, [teams]);

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient"
        style={{
          borderRadius: 20, padding: '24px 40px', marginBottom: 20,
          position: 'relative', overflow: 'hidden', flexShrink: 0,
          border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span className="badge badge-gold">Interactive Explorer</span>
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 36, lineHeight: 1, marginBottom: 4, color: 'white' }}>
            World Cup <span className="gradient-text">Global Map</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 600 }}>
            Explore the 16 host cities across North America and view the qualified nations from around the globe.
          </p>
        </div>
        <Globe size={80} style={{ color: 'rgba(255,215,0,0.1)', position: 'absolute', right: 40 }} />
      </motion.div>

      {/* ─── MAP CONTAINER ─────────────────────────────────────────────── */}
      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative', border: '1px solid var(--border-gold)' }}>
        <MapContainer 
          center={[39.8, -98.5]} // Center on North America
          zoom={4} 
          style={{ height: '100%', width: '100%', background: '#0a0f1e' }}
          zoomControl={false}
        >
          {/* Dark themed tile layer (CartoDB Dark Matter) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {/* Render Stadiums */}
          {STADIUMS.map(stadium => (
            <Marker key={stadium.id} position={[stadium.lat, stadium.lng]} icon={stadiumIcon}>
              <Popup className="custom-popup">
                <div style={{ padding: '4px', background: 'var(--surface-elevated)', color: 'white' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{stadium.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {stadium.city}, {stadium.country}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 8, color: 'var(--brand-gold)' }}>
                    Capacity: {stadium.capacity.toLocaleString()}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Qualified Teams (simplified points) */}
          {qualifiedTeams.map(team => {
            const coords = COUNTRY_COORDS[team.countryCode];
            return (
              <CircleMarker 
                key={`team-${team.countryCode}`} 
                center={coords} 
                radius={8} 
                pathOptions={{ color: 'var(--info-blue)', fillColor: 'var(--info-blue)', fillOpacity: 0.4, weight: 2 }}
              >
                <Popup>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={`https://flagcdn.com/32x24/${team.countryCode.toLowerCase()}.png`} alt="" style={{ width: 32, borderRadius: 2 }} />
                    <strong style={{ color: 'black' }}>{team.name}</strong>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
        
        {/* Map Overlay Legend */}
        <div style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000, background: 'rgba(10,15,30,0.85)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-subtle)', backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 12, height: 12, background: 'var(--brand-gold)', borderRadius: '50%', boxShadow: '0 0 10px var(--brand-gold)' }} />
            <span style={{ fontSize: 12, color: 'white' }}>Host City / Stadium</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, background: 'var(--info-blue)', borderRadius: '50%', opacity: 0.6 }} />
            <span style={{ fontSize: 12, color: 'white' }}>Qualified Nation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
