import { useTournamentStore } from '../store/tournamentStore';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, CheckCircle, Radio, Clock, ChevronRight } from 'lucide-react';

import { STADIUMS } from '../data/stadiums';
import type { Match } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getStadium(id: string) {
  return STADIUMS.find(s => s.id === id);
}

function formatKickoff(utcStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZoneName: 'short',
  }).format(new Date(utcStr));
}

function getStageLabel(stage: string, groupId?: string): string {
  if (stage === 'group' && groupId) return `Group ${groupId}`;
  const map: Record<string, string> = { r32: 'Round of 32', r16: 'Round of 16', qf: 'Quarter-Final', sf: 'Semi-Final', final: 'Final', third: '3rd Place' };
  return map[stage] || stage.toUpperCase();
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, liveMinute }: { status: string; liveMinute?: number }) {
  if (status === 'live') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div className="live-dot" />
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#FF3B3B' }}>
          {liveMinute ? `${liveMinute}'` : 'LIVE'}
        </span>
      </div>
    );
  }
  if (status === 'ht') return <span className="badge badge-amber">HT</span>;
  if (status === 'completed') return <span className="badge badge-green">FT</span>;
  return <span className="badge" style={{ background: 'rgba(90,100,120,0.2)', color: 'var(--text-muted)', border: '1px solid rgba(90,100,120,0.3)' }}>Upcoming</span>;
}

// ─── Single Match Card ────────────────────────────────────────────────────────
function MatchCard({ match }: { match: Match }) {
  const navigate = useNavigate();
  const stadium = getStadium(match.stadiumId);
  const isLive = match.status === 'live' || match.status === 'ht';
  const isCompleted = match.status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => navigate(`/matches/${match.id}`)}
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${isLive ? 'rgba(255,59,59,0.3)' : 'var(--border-subtle)'}`,
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Live glow */}
      {isLive && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, #FF3B3B, transparent)',
          animation: 'pulse-live 2s ease-in-out infinite',
        }} />
      )}

      {/* Top row: stage + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {getStageLabel(match.stage, match.groupId)}
        </span>
        <StatusBadge status={match.status} liveMinute={match.liveMinute} />
      </div>

      {/* Teams & Score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Home team */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <img
            src={`https://flagcdn.com/32x24/${match.homeTeam.countryCode.toLowerCase()}.png`}
            alt={match.homeTeam.name}
            style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          />
          <span style={{ fontSize: '13px', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
            {match.homeTeam.name}
          </span>
        </div>

        {/* Center score/time */}
        <div style={{ minWidth: '90px', textAlign: 'center' }}>
          {(isCompleted || isLive) && match.score ? (
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '36px',
              lineHeight: 1,
              color: isLive ? '#FF3B3B' : 'var(--text-primary)',
              letterSpacing: '0.04em',
            }}>
              {match.score.home} <span style={{ fontSize: '24px', color: 'var(--text-muted)' }}>–</span> {match.score.away}
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-gold)', fontFamily: "'JetBrains Mono', monospace" }}>
                {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).format(new Date(match.kickoffUtc))}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(match.kickoffUtc))}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '18px', fontFamily: "'Bebas Neue', sans-serif", marginTop: '4px', letterSpacing: '0.05em' }}>vs</div>
            </div>
          )}
        </div>

        {/* Away team */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <img
            src={`https://flagcdn.com/32x24/${match.awayTeam.countryCode.toLowerCase()}.png`}
            alt={match.awayTeam.name}
            style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          />
          <span style={{ fontSize: '13px', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {stadium ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <MapPin size={10} />
            <span>{stadium.name}, {stadium.city}</span>
          </div>
        ) : <span />}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px' }}>
          <span>Details</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tab Section ──────────────────────────────────────────────────────────────
function TabSection({ matches, emptyMsg }: { matches: Match[]; emptyMsg: string }) {
  if (matches.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 32px', color: 'var(--text-muted)' }}>
        <Clock size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
        <p style={{ fontSize: '16px' }}>{emptyMsg}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
      {matches.map((m, i) => (
        <motion.div key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: i * 0.04 } }}>
          <MatchCard match={m} />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Matches Page ────────────────────────────────────────────────────────
export default function Matches() {
  const { matches, players, teams } = useTournamentStore();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'completed' | 'live' | 'upcoming'>('live');
  const [search, setSearch] = useState('');

  const tabs = [
    { key: 'live' as const, label: 'Live', icon: <Radio size={14} />, statuses: ['live', 'ht'] },
    { key: 'upcoming' as const, label: 'Upcoming', icon: <Clock size={14} />, statuses: ['scheduled'] },
    { key: 'completed' as const, label: 'Completed', icon: <CheckCircle size={14} />, statuses: ['completed'] },
  ];

  const currentStatuses = tabs.find(t => t.key === activeTab)?.statuses ?? [];

  const filteredMatches = useMemo(() => {
    let filtered = matches.filter(m => currentStatuses.includes(m.status));
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(m =>
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q)
      );
    }
    // Sort: upcoming by kickoff asc, others by kickoff desc
    if (activeTab === 'upcoming') {
      filtered = [...filtered].sort((a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime());
    } else {
      filtered = [...filtered].sort((a, b) => new Date(b.kickoffUtc).getTime() - new Date(a.kickoffUtc).getTime());
    }
    return filtered;
  }, [matches, activeTab, search, currentStatuses]);

  const liveCount = matches.filter(m => m.status === 'live' || m.status === 'ht').length;
  const completedCount = matches.filter(m => m.status === 'completed').length;
  const upcomingCount = matches.filter(m => m.status === 'scheduled').length;

  const emptyMessages: Record<string, string> = {
    live: 'No matches are currently live.',
    upcoming: 'No upcoming matches found.',
    completed: 'No completed matches found.',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-navy)', paddingBottom: '48px' }}>
      {/* ── Header ── */}
      <div className="hero-gradient" style={{ padding: '32px 0 0' }}>
        <div className="page-container" style={{ paddingBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', letterSpacing: '0.05em', lineHeight: 1, marginBottom: '6px' }}>
                All Matches
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                FIFA World Cup 2026™ · {matches.length} total matches
              </p>
            </div>

            {/* Stats pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,59,59,0.12)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: '8px', padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#FF3B3B', lineHeight: 1 }}>{liveCount}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#FF3B3B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live</div>
              </div>
              <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: 'var(--brand-gold)', lineHeight: 1 }}>{upcomingCount}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Upcoming</div>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '8px 14px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', color: '#22C55E', lineHeight: 1 }}>{completedCount}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completed</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border-subtle)' }}>
            {tabs.map(tab => {
              const count = matches.filter(m => tab.statuses.includes(m.status)).length;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '12px 20px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: `2px solid ${isActive ? 'var(--brand-red)' : 'transparent'}`,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '14px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '-1px',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.key === 'live' && count > 0 && (
                    <span style={{ background: '#FF3B3B', color: 'white', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: 700 }}>{count}</span>
                  )}
                  {tab.key !== 'live' && (
                    <span style={{ background: 'var(--surface-elevated)', color: 'var(--text-muted)', borderRadius: '10px', padding: '1px 6px', fontSize: '10px', fontWeight: 700 }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="page-container">
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by team name…"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Matches grid */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TabSection matches={filteredMatches} emptyMsg={emptyMessages[activeTab]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
