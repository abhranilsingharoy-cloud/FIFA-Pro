import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Users, Star, Calendar,
  User, Award, ChevronRight,
} from 'lucide-react';
import { MATCHES } from '../data/matches';
import { STADIUMS } from '../data/stadiums';
import { PLAYERS } from '../data/players';
import type { MatchEvent } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStadium = (id: string) => STADIUMS.find(s => s.id === id);
const getPlayer = (id: string) => PLAYERS.find(p => p.id === id);

function formatDate(utcStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  }).format(new Date(utcStr));
}

function getStageLabel(stage: string, groupId?: string): string {
  if (stage === 'group' && groupId) return `Group ${groupId}`;
  const map: Record<string, string> = { r32: 'Round of 32', r16: 'Round of 16', qf: 'Quarter-Final', sf: 'Semi-Final', final: 'Final', third: '3rd Place' };
  return map[stage] || stage.toUpperCase();
}

// ─── Event Icon ───────────────────────────────────────────────────────────────
function EventIcon({ type }: { type: MatchEvent['type'] }) {
  const styles: React.CSSProperties = {
    width: '28px', height: '28px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', flexShrink: 0,
  };

  switch (type) {
    case 'goal':
      return <div style={{ ...styles, background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)' }}>⚽</div>;
    case 'own_goal':
      return <div style={{ ...styles, background: 'rgba(200,16,46,0.2)', border: '1px solid rgba(200,16,46,0.4)' }}>⚽</div>;
    case 'yellow_card':
      return <div style={{ ...styles, background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)' }}>🟨</div>;
    case 'red_card':
      return <div style={{ ...styles, background: 'rgba(200,16,46,0.2)', border: '1px solid rgba(200,16,46,0.4)' }}>🟥</div>;
    case 'substitution':
      return <div style={{ ...styles, background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}>↕️</div>;
    case 'penalty':
      return <div style={{ ...styles, background: 'rgba(255,215,0,0.2)', border: '1px solid rgba(255,215,0,0.4)' }}>⚽</div>;
    case 'var':
      return <div style={{ ...styles, background: 'rgba(160,170,191,0.2)', border: '1px solid rgba(160,170,191,0.4)', fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>VAR</div>;
    default:
      return <div style={{ ...styles, background: 'var(--surface-elevated)' }}>•</div>;
  }
}

// ─── Timeline Event ───────────────────────────────────────────────────────────
function TimelineEvent({ event }: { event: MatchEvent }) {
  const isHome = event.team === 'home';

  return (
    <motion.div
      initial={{ opacity: 0, x: isHome ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexDirection: isHome ? 'row' : 'row-reverse',
        marginBottom: '10px',
      }}
    >
      {/* Team side content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isHome ? 'flex-end' : 'flex-start',
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        padding: '8px 12px',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {event.playerName || '—'}
        </div>
        {event.assistPlayerName && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
            ↳ {event.assistPlayerName}
          </div>
        )}
        {event.subOnPlayerName && (
          <div style={{ fontSize: '11px', color: '#60A5FA', marginTop: '1px' }}>
            ↑ {event.subOnPlayerName}
          </div>
        )}
        {event.description && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontStyle: 'italic' }}>
            {event.description}
          </div>
        )}
      </div>

      {/* Center: icon + minute */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '48px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-gold)', fontFamily: "'JetBrains Mono', monospace" }}>
          {event.minute}{event.stoppageTime ? `+${event.stoppageTime}` : ''}'
        </span>
        <EventIcon type={event.type} />
      </div>

      {/* Empty side */}
      <div style={{ flex: 1 }} />
    </motion.div>
  );
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────
function StatBar({ label, home, away, isPercent }: { label: string; home: number; away: number; isPercent?: boolean }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  const awayPct = (away / total) * 100;

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 600, color: 'var(--brand-red)', minWidth: '36px', textAlign: 'left' }}>
          {home}{isPercent ? '%' : ''}
        </span>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
          {label}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 600, color: 'var(--info-blue)', minWidth: '36px', textAlign: 'right' }}>
          {away}{isPercent ? '%' : ''}
        </span>
      </div>
      <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', gap: '2px' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${homePct}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ height: '100%', background: 'linear-gradient(90deg, transparent, var(--brand-red))', borderRadius: '3px 0 0 3px' }}
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${awayPct}%` }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--info-blue), transparent)', borderRadius: '0 3px 3px 0' }}
        />
      </div>
    </div>
  );
}

// ─── Mock Lineup Data ─────────────────────────────────────────────────────────
const MOCK_HOME_XI = [
  { pos: 'GK', name: 'Goalkeeper' },
  { pos: 'DEF', name: 'Right Back' }, { pos: 'DEF', name: 'Centre Back' },
  { pos: 'DEF', name: 'Centre Back' }, { pos: 'DEF', name: 'Left Back' },
  { pos: 'MID', name: 'Defensive Mid' }, { pos: 'MID', name: 'Central Mid' },
  { pos: 'MID', name: 'Central Mid' },
  { pos: 'FWD', name: 'Right Wing' }, { pos: 'FWD', name: 'Striker' }, { pos: 'FWD', name: 'Left Wing' },
];

const MOCK_AWAY_XI = [...MOCK_HOME_XI];

const POS_COLORS: Record<string, { bg: string; color: string }> = {
  GK:  { bg: 'rgba(255,215,0,0.15)',   color: '#FFD700' },
  DEF: { bg: 'rgba(59,130,246,0.15)',  color: '#60A5FA' },
  MID: { bg: 'rgba(34,197,94,0.15)',   color: '#4ADE80' },
  FWD: { bg: 'rgba(200,16,46,0.15)',   color: '#F87171' },
};

// ─── Main MatchDetail Page ────────────────────────────────────────────────────
export default function MatchDetail() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();

  const match = useMemo(() => MATCHES.find(m => m.id === matchId), [matchId]);
  const stadium = match ? getStadium(match.stadiumId) : undefined;
  const motmPlayer = match?.manOfTheMatch ? getPlayer(match.manOfTheMatch) : undefined;

  if (!match) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--brand-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>404</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Match not found</p>
        <button className="btn-primary" onClick={() => navigate('/matches')}>← Back to Matches</button>
      </div>
    );
  }

  const isLive = match.status === 'live' || match.status === 'ht';
  const isCompleted = match.status === 'completed';
  const hasScore = !!match.score;

  const sortedEvents = [...match.events].sort((a, b) => a.minute - b.minute || (a.stoppageTime || 0) - (b.stoppageTime || 0));

  const stats = match.stats;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-navy)', paddingBottom: '64px' }}>
      {/* ── Scoreboard Hero ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0D1525 0%, var(--brand-navy) 100%)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: '32px',
      }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-30%', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(200,16,46,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-30%', right: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="page-container" style={{ paddingBottom: 0 }}>
          {/* Back button + meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 14px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              {getStageLabel(match.stage, match.groupId)} · Match #{match.matchNumber}
            </span>
            {isLive && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,59,59,0.15)', border: '1px solid rgba(255,59,59,0.4)', borderRadius: '20px', padding: '4px 12px' }}>
                <div className="live-dot" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FF3B3B' }}>
                  {match.liveMinute ? `${match.liveMinute}'` : 'LIVE'}
                </span>
              </div>
            )}
          </div>

          {/* Main scoreboard */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            {/* Home team */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1, minWidth: '140px' }}
            >
              <img
                src={`https://flagcdn.com/32x24/${match.homeTeam.countryCode.toLowerCase()}.png`}
                alt={match.homeTeam.name}
                style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: '6px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
              />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '0.04em', textAlign: 'center' }}>
                {match.homeTeam.name}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Home</div>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{ textAlign: 'center', minWidth: '140px' }}
            >
              {hasScore ? (
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '96px',
                  lineHeight: 1,
                  color: isLive ? '#FF3B3B' : 'var(--text-primary)',
                  letterSpacing: '0.04em',
                  textShadow: isLive ? '0 0 40px rgba(255,59,59,0.4)' : 'none',
                }}>
                  {match.score!.home}
                  <span style={{ color: 'var(--text-muted)', fontSize: '64px', margin: '0 8px' }}>–</span>
                  {match.score!.away}
                </div>
              ) : (
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '56px', color: 'var(--text-muted)', lineHeight: 1, letterSpacing: '0.05em' }}>
                  vs
                </div>
              )}
              <div style={{ marginTop: '8px' }}>
                {isLive ? (
                  <span className="badge badge-live" style={{ fontSize: '12px' }}>🔴 LIVE</span>
                ) : isCompleted ? (
                  <span className="badge badge-green" style={{ fontSize: '12px' }}>Full Time</span>
                ) : (
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(match.kickoffUtc))}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Away team */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', flex: 1, minWidth: '140px' }}
            >
              <img
                src={`https://flagcdn.com/32x24/${match.awayTeam.countryCode.toLowerCase()}.png`}
                alt={match.awayTeam.name}
                style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: '6px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
              />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '0.04em', textAlign: 'center' }}>
                {match.awayTeam.name}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Away</div>
            </motion.div>
          </div>

          {/* Match meta info */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', marginTop: '24px' }}>
            {stadium && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <MapPin size={13} style={{ color: 'var(--brand-gold)' }} />
                <span>{stadium.name}, {stadium.city}</span>
              </div>
            )}
            {match.attendance && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <Users size={13} style={{ color: 'var(--brand-gold)' }} />
                <span>{match.attendance.toLocaleString()} attendance</span>
              </div>
            )}
            {match.referee && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <User size={13} style={{ color: 'var(--brand-gold)' }} />
                <span>Ref: {match.referee}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
              <Calendar size={13} style={{ color: 'var(--brand-gold)' }} />
              <span>{new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(match.kickoffUtc))}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* ── LEFT: Timeline + Lineups ── */}
          <div>
            {/* Match Timeline */}
            {sortedEvents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}
              >
                <h2 className="section-title" style={{ marginBottom: '20px' }}>Match Timeline</h2>
                <div style={{ position: 'relative' }}>
                  {/* Center line */}
                  <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'var(--border-subtle)', transform: 'translateX(-50%)', zIndex: 0 }} />
                  {/* Team headers */}
                  <div style={{ display: 'flex', marginBottom: '12px', position: 'relative', zIndex: 1 }}>
                    <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--brand-red)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px' }}>{match.homeTeam.name}</div>
                    <div style={{ minWidth: '48px' }} />
                    <div style={{ flex: 1, textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--info-blue)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px' }}>{match.awayTeam.name}</div>
                  </div>
                  {sortedEvents.map(ev => (
                    <TimelineEvent key={ev.id} event={ev} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Lineups */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}
            >
              <h2 className="section-title" style={{ marginBottom: '20px' }}>Line-ups</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Home XI */}
                <div>
                  <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--brand-red)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {match.homeTeam.name}
                  </div>
                  {MOCK_HOME_XI.map((p, i) => {
                    const c = POS_COLORS[p.pos] || POS_COLORS.MID;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', marginBottom: '4px', background: 'var(--surface-elevated)' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px', background: c.bg, color: c.color, minWidth: '28px', textAlign: 'center' }}>{p.pos}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.name}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Away XI */}
                <div>
                  <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 700, color: 'var(--info-blue)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {match.awayTeam.name}
                  </div>
                  {MOCK_AWAY_XI.map((p, i) => {
                    const c = POS_COLORS[p.pos] || POS_COLORS.MID;
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', marginBottom: '4px', background: 'var(--surface-elevated)' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 5px', borderRadius: '3px', background: c.bg, color: c.color, minWidth: '28px', textAlign: 'center' }}>{p.pos}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{p.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Stats + MOTM ── */}
          <div>
            {/* Live Stats */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}
              >
                <h2 className="section-title" style={{ marginBottom: '20px' }}>
                  {isLive ? 'Live Stats' : 'Match Stats'}
                </h2>
                {/* Team labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-red)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{match.homeTeam.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--info-blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{match.awayTeam.name}</span>
                </div>
                <StatBar label="Possession" home={stats.possession[0]} away={stats.possession[1]} isPercent />
                <StatBar label="Shots" home={stats.shotsTotal[0]} away={stats.shotsTotal[1]} />
                <StatBar label="On Target" home={stats.shotsOnTarget[0]} away={stats.shotsOnTarget[1]} />
                <StatBar label="xG" home={Math.round(stats.xG[0] * 10) / 10} away={Math.round(stats.xG[1] * 10) / 10} />
                <StatBar label="Corners" home={stats.corners[0]} away={stats.corners[1]} />
                <StatBar label="Fouls" home={stats.fouls[0]} away={stats.fouls[1]} />
                <StatBar label="Offsides" home={stats.offsides[0]} away={stats.offsides[1]} />
                <StatBar label="Pass Acc." home={stats.passAccuracy[0]} away={stats.passAccuracy[1]} isPercent />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🟨 {stats.yellowCards[0]}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🟥 {stats.redCards[0]}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Cards</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🟨 {stats.yellowCards[1]}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>🟥 {stats.redCards[1]}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Man of the Match */}
            {isCompleted && motmPlayer && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(255,140,0,0.06) 100%)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Award size={20} style={{ color: 'var(--brand-gold)' }} />
                  <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '0.04em', color: 'var(--brand-gold)' }}>
                    Man of the Match
                  </h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--brand-gold), #FF8C00)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px',
                    boxShadow: '0 0 24px rgba(255,215,0,0.3)',
                  }}>
                    ⭐
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '26px', letterSpacing: '0.04em', lineHeight: 1 }}>{motmPlayer.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <img
                        src={`https://flagcdn.com/32x24/${motmPlayer.countryCode.toLowerCase()}.png`}
                        alt=""
                        style={{ width: 20, height: 15, objectFit: 'cover', borderRadius: '2px' }}
                      />
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{motmPlayer.clubName}</span>
                      <span style={{ fontSize: '11px', color: 'var(--brand-gold)', fontWeight: 700, marginLeft: '4px' }}>★ {motmPlayer.tournamentStats.avgRating}</span>
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px' }}>
                  {[
                    { label: 'Goals', value: motmPlayer.tournamentStats.goals },
                    { label: 'Assists', value: motmPlayer.tournamentStats.assists },
                    { label: 'Rating', value: motmPlayer.tournamentStats.avgRating },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'rgba(255,215,0,0.08)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: 'var(--brand-gold)', lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Venue Info */}
            {stadium && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}
              >
                <h2 className="section-title" style={{ marginBottom: '16px' }}>Venue</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Stadium</span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{stadium.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>City</span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{stadium.city}, {stadium.country}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Capacity</span>
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{stadium.wcCapacity.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Surface</span>
                    <span style={{ fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>{stadium.surface}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Roof</span>
                    <span style={{ fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>{stadium.roofType}</span>
                  </div>
                  {stadium.nearestAirport && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Airport</span>
                      <span style={{ fontWeight: 600, fontSize: '12px', textAlign: 'right', maxWidth: '60%' }}>{stadium.nearestAirport}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
