import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  Plane,
  Layers,
  Wind,
  RotateCcw,
  Home,
  Mountain,
  ArrowLeft,
  Clock,
  Trophy,
  ChevronRight,
  Navigation,
} from 'lucide-react';
import { STADIUMS } from '../data/stadiums';
import { MATCHES } from '../data/matches';
import type { Match, MatchStage } from '../types';

const formatCapacity = (cap: number) => cap.toLocaleString();

const countryFlag = (country: string) => {
  if (country === 'USA') return '🇺🇸';
  if (country === 'Canada') return '🇨🇦';
  if (country === 'Mexico') return '🇲🇽';
  return '🏟️';
};

const teamFlagUrl = (code: string) =>
  `https://flagcdn.com/32x24/${code.toLowerCase()}.png`;

const stageLabel = (stage: MatchStage): string => {
  const map: Record<MatchStage, string> = {
    group: 'Group Stage',
    r32: 'Round of 32',
    r16: 'Round of 16',
    qf: 'Quarter-Final',
    sf: 'Semi-Final',
    final: 'FINAL',
    third: '3rd Place',
  };
  return map[stage] ?? stage;
};

const stageBadgeStyle = (stage: MatchStage): React.CSSProperties => {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 8px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };
  if (stage === 'final') return { ...base, background: 'rgba(255,215,0,0.2)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.4)' };
  if (stage === 'sf') return { ...base, background: 'rgba(200,16,46,0.2)', color: '#FF6B6B', border: '1px solid rgba(200,16,46,0.4)' };
  if (stage === 'qf') return { ...base, background: 'rgba(59,130,246,0.2)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.4)' };
  if (stage === 'r16') return { ...base, background: 'rgba(34,197,94,0.2)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.4)' };
  if (stage === 'r32') return { ...base, background: 'rgba(168,85,247,0.2)', color: '#C084FC', border: '1px solid rgba(168,85,247,0.4)' };
  return { ...base, background: 'rgba(160,170,191,0.15)', color: 'var(--text-secondary)', border: '1px solid rgba(160,170,191,0.2)' };
};

const statusBadge = (status: string, score?: { home: number; away: number }) => {
  if (status === 'completed' && score !== undefined) {
    return <span className="badge badge-green">FT</span>;
  }
  if (status === 'live') {
    return (
      <span className="badge badge-live">
        <span className="live-dot" style={{ marginRight: 5 }} /> LIVE
      </span>
    );
  }
  return <span className="badge" style={{ background: 'rgba(160,170,191,0.1)', color: 'var(--text-muted)' }}>Scheduled</span>;
};

const formatDate = (utcStr: string) => {
  const d = new Date(utcStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (utcStr: string) => {
  const d = new Date(utcStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
};

const getHeroGradient = (country: string): string => {
  if (country === 'USA') return 'linear-gradient(135deg, #0A0F1E 0%, #1A0812 40%, #2D0A12 100%)';
  if (country === 'Canada') return 'linear-gradient(135deg, #0A0F1E 0%, #1A0808 40%, #2D0808 100%)';
  if (country === 'Mexico') return 'linear-gradient(135deg, #0A0F1E 0%, #081A0E 40%, #082D0E 100%)';
  return 'linear-gradient(135deg, #0A0F1E 0%, #0D1829 100%)';
};

const getCountryAccent = (country: string): string => {
  if (country === 'USA') return '#B22234';
  if (country === 'Canada') return '#FF0000';
  if (country === 'Mexico') return '#006847';
  return 'var(--brand-gold)';
};

const MatchCard: React.FC<{ match: Match; index: number }> = ({ match, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.08 }}
    className="card"
    style={{ padding: '14px 18px', marginBottom: 10 }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
      {/* Left: date + stage */}
      <div style={{ minWidth: 120 }}>
        <div style={{ ...stageBadgeStyle(match.stage), marginBottom: 6 }}>
          {stageLabel(match.stage)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 12 }}>
          <Calendar size={11} />
          <span>{formatDate(match.kickoffUtc)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
          <Clock size={11} />
          <span>{formatTime(match.kickoffUtc)}</span>
        </div>
      </div>

      {/* Center: teams + score */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, minWidth: 220 }}>
        {/* Home team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>
            {match.homeTeam.name}
          </span>
          <img
            src={teamFlagUrl(match.homeTeam.countryCode)}
            alt={match.homeTeam.countryCode}
            style={{ width: 24, height: 18, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        {/* Score */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 16px',
          background: 'var(--surface-elevated)',
          borderRadius: 8,
          minWidth: 80,
          justifyContent: 'center',
        }}>
          {match.score ? (
            <>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: 'var(--brand-gold)' }}>
                {match.score.home}
              </span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>–</span>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: 'var(--brand-gold)' }}>
                {match.score.away}
              </span>
            </>
          ) : (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>vs</span>
          )}
        </div>

        {/* Away team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <img
            src={teamFlagUrl(match.awayTeam.countryCode)}
            alt={match.awayTeam.countryCode}
            style={{ width: 24, height: 18, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Right: status + attendance */}
      <div style={{ textAlign: 'right', minWidth: 100 }}>
        {statusBadge(match.status, match.score)}
        {match.attendance && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <Users size={11} />
            <span>{match.attendance.toLocaleString()}</span>
          </div>
        )}
        {match.referee && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Ref: {match.referee}</div>
        )}
      </div>
    </div>
  </motion.div>
);

const SpecRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; highlight?: boolean }> = ({
  icon, label, value, highlight = false,
}) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid var(--border-subtle)',
    gap: 12,
  }}>
    <div style={{ color: 'var(--brand-gold)', flexShrink: 0, width: 20, display: 'flex', justifyContent: 'center' }}>
      {icon}
    </div>
    <span style={{ fontSize: 13, color: 'var(--text-secondary)', minWidth: 140, flexShrink: 0 }}>{label}</span>
    <span style={{
      fontSize: 14,
      fontWeight: 600,
      color: highlight ? 'var(--brand-gold)' : 'var(--text-primary)',
      flex: 1,
    }}>
      {value}
    </span>
  </div>
);

export default function StadiumDetail() {
  const { stadiumId } = useParams<{ stadiumId: string }>();

  const stadium = useMemo(
    () => STADIUMS.find((s) => s.id === stadiumId),
    [stadiumId],
  );

  const stadiumMatches = useMemo(
    () => MATCHES.filter((m) => m.stadiumId === stadiumId)
      .sort((a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime()),
    [stadiumId],
  );

  if (!stadium) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 80 }}>
        <p style={{ fontSize: 48, marginBottom: 16 }}>🏟️</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, marginBottom: 8 }}>Stadium Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>We couldn't find that stadium.</p>
        <Link to="/stadiums" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
          ← Back to Stadiums
        </Link>
      </div>
    );
  }

  const heroGradient = getHeroGradient(stadium.country);
  const accent = getCountryAccent(stadium.country);
  const flag = countryFlag(stadium.country);
  const isKey = ['metlife', 'estadio_azteca', 'sofi', 'cowboys'].includes(stadium.id);

  return (
    <div>
      {/* Hero Banner */}
      <div
        style={{
          background: heroGradient,
          position: 'relative',
          overflow: 'hidden',
          padding: '60px 0 48px',
        }}
      >
        {/* Decorative glow */}
        <div style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 500,
          height: 500,
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="page-container" style={{ paddingTop: 0, paddingBottom: 0, position: 'relative', zIndex: 1 }}>
          {/* Back button */}
          <Link
            to="/stadiums"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'var(--text-secondary)', textDecoration: 'none',
              fontSize: 13, marginBottom: 24,
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 6,
              border: '1px solid var(--border-subtle)',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={14} />
            All Stadiums
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            {/* Flag + badges */}
            <div>
              <span style={{ fontSize: 64, display: 'block', lineHeight: 1, marginBottom: 8 }}>{flag}</span>
            </div>
            <div style={{ flex: 1 }}>
              {/* Tags */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                  background: `${accent}22`, color: accent,
                  border: `1px solid ${accent}44`,
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {stadium.country}
                </span>
                {isKey && (
                  <span className="badge badge-gold">⭐ Key Venue</span>
                )}
                <span className="badge badge-green">{stadium.matches.length} WC Matches</span>
                {stadium.altitude && (
                  <span className="badge badge-amber">⛰️ High Altitude</span>
                )}
              </div>

              {/* Stadium name */}
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(40px, 8vw, 80px)',
                lineHeight: 1,
                color: 'var(--text-primary)',
                marginBottom: 4,
                letterSpacing: '0.02em',
              }}>
                {stadium.name}
              </h1>
              {stadium.nickname && (
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 18,
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                  marginBottom: 16,
                }}>
                  "{stadium.nickname}"
                </p>
              )}

              {/* Key stats inline */}
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} color={accent} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{stadium.city}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Users size={16} color={accent} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    {formatCapacity(stadium.capacity)} capacity
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={16} color={accent} />
                  <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                    Built {stadium.builtYear}
                    {stadium.renovatedYear ? ` · Renovated ${stadium.renovatedYear}` : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginTop: 32 }}>

          {/* Left column */}
          <div>
            {/* Venue Specs Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="card"
              style={{ padding: '20px 24px', marginBottom: 24 }}
            >
              <h2 className="section-title" style={{ fontSize: 22, marginBottom: 16 }}>
                Venue Specifications
              </h2>

              <SpecRow icon={<Building2 size={16} />} label="Full Name" value={stadium.name} />
              <SpecRow icon={<MapPin size={16} />} label="City" value={stadium.city} />
              <SpecRow icon={<span style={{ fontSize: 14 }}>{flag}</span>} label="Country" value={stadium.country} />
              <SpecRow
                icon={<Navigation size={16} />}
                label="GPS Coordinates"
                value={
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                    {stadium.lat.toFixed(4)}°N, {Math.abs(stadium.lng).toFixed(4)}°W
                  </span>
                }
              />
              <SpecRow
                icon={<Calendar size={16} />}
                label="Year Built"
                value={
                  <>
                    {stadium.builtYear}
                    {stadium.renovatedYear && (
                      <span style={{ color: 'var(--brand-gold)', marginLeft: 8, fontSize: 13 }}>
                        · Renovated {stadium.renovatedYear}
                      </span>
                    )}
                  </>
                }
              />
              <SpecRow
                icon={<Users size={16} />}
                label="Standard Capacity"
                value={<span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatCapacity(stadium.capacity)}</span>}
                highlight
              />
              <SpecRow
                icon={<Trophy size={16} />}
                label="WC Capacity"
                value={<span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{formatCapacity(stadium.wcCapacity)}</span>}
                highlight
              />
              <SpecRow
                icon={<Layers size={16} />}
                label="Playing Surface"
                value={
                  <span style={{ textTransform: 'capitalize' }}>
                    {stadium.surface === 'natural' ? '🌿 Natural Grass' :
                      stadium.surface === 'hybrid' ? '🌿 Hybrid Grass' :
                        '🔵 Artificial Turf'}
                  </span>
                }
              />
              <SpecRow
                icon={
                  stadium.roofType === 'open' ? <Wind size={16} /> :
                    stadium.roofType === 'retractable' ? <RotateCcw size={16} /> :
                      <Home size={16} />
                }
                label="Roof Type"
                value={
                  <span style={{ textTransform: 'capitalize' }}>
                    {stadium.roofType === 'open' ? '🌤️ Open Air' :
                      stadium.roofType === 'retractable' ? '🔄 Retractable Roof' :
                        '🏠 Fully Covered'}
                  </span>
                }
              />
              {stadium.altitude && (
                <SpecRow
                  icon={<Mountain size={16} />}
                  label="Altitude"
                  value={
                    <span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{stadium.altitude.toLocaleString()}m</span>
                      <span className="badge badge-amber" style={{ marginLeft: 8 }}>High Altitude</span>
                    </span>
                  }
                />
              )}
              {stadium.nearestAirport && (
                <SpecRow
                  icon={<Plane size={16} />}
                  label="Nearest Airport"
                  value={stadium.nearestAirport}
                />
              )}
            </motion.div>

            {/* Matches Hosted */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h2 className="section-title" style={{ fontSize: 22, marginBottom: 16 }}>
                <Trophy size={20} color="var(--brand-gold)" />
                WC2026 Matches at {stadium.name}
              </h2>

              {stadiumMatches.length === 0 ? (
                <div
                  className="card"
                  style={{
                    padding: '40px 24px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Trophy size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Schedule TBD</p>
                  <p style={{ fontSize: 13 }}>Match assignments for this venue will be announced soon.</p>
                </div>
              ) : (
                <div>
                  {stadiumMatches.map((match, idx) => (
                    <MatchCard key={match.id} match={match} index={idx} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right sidebar */}
          <div>
            {/* Getting There */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="card"
              style={{ padding: '20px', marginBottom: 20 }}
            >
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 20,
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Plane size={18} color="var(--brand-gold)" />
                Getting There
              </h3>

              {stadium.nearestAirport && (
                <div style={{
                  padding: '12px',
                  background: 'var(--surface-elevated)',
                  borderRadius: 8,
                  marginBottom: 12,
                }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    Nearest Airport
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{stadium.nearestAirport}</p>
                </div>
              )}

              {/* Map embed */}
              <div style={{
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                marginBottom: 12,
              }}>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${stadium.lng - 0.05}%2C${stadium.lat - 0.03}%2C${stadium.lng + 0.05}%2C${stadium.lat + 0.03}&layer=mapnik&marker=${stadium.lat}%2C${stadium.lng}`}
                  style={{ width: '100%', height: 220, border: 'none', display: 'block' }}
                  title={`Map of ${stadium.name}`}
                />
              </div>

              <a
                href={`https://www.openstreetmap.org/?mlat=${stadium.lat}&mlon=${stadium.lng}#map=15/${stadium.lat}/${stadium.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '8px',
                  borderRadius: 6,
                  background: 'rgba(59,130,246,0.12)',
                  color: 'var(--info-blue)',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                <Navigation size={14} />
                Open in OpenStreetMap
                <ChevronRight size={14} />
              </a>
            </motion.div>

            {/* Quick facts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="card"
              style={{ padding: '20px' }}
            >
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 20,
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <Trophy size={18} color="var(--brand-gold)" />
                Quick Facts
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--surface-elevated)',
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Capacity Rank</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: 'var(--brand-gold)' }}>
                    #{[...STADIUMS].sort((a, b) => b.capacity - a.capacity).findIndex(s => s.id === stadium.id) + 1} of 16
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--surface-elevated)',
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>WC Matches</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {stadiumMatches.length}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--surface-elevated)',
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Surface</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {stadium.surface}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--surface-elevated)',
                  borderRadius: 8,
                }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Roof</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {stadium.roofType}
                  </span>
                </div>
                {stadium.altitude && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'rgba(245,158,11,0.08)',
                    borderRadius: 8,
                    border: '1px solid rgba(245,158,11,0.2)',
                  }}>
                    <span style={{ fontSize: 13, color: 'var(--warning-amber)' }}>⛰️ Altitude</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: 'var(--warning-amber)' }}>
                      {stadium.altitude.toLocaleString()}m
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              style={{ marginTop: 16 }}
            >
              <Link
                to="/stadiums"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowLeft size={16} />
                Back to All Stadiums
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
