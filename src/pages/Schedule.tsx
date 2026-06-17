import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, List, Clock, MapPin, ChevronLeft, ChevronRight,
  Globe, Filter, Zap
} from 'lucide-react';

import { STADIUMS } from '../data/stadiums';
import { useTournamentStore } from '../store/tournamentStore';
import type { Match, MatchStage } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewMode = 'list' | 'calendar';
type StageFilter = 'all' | MatchStage;
type HostFilter = 'all' | 'USA' | 'Canada' | 'Mexico';

// ─── Constants ────────────────────────────────────────────────────────────────
const TIMEZONES = [
  { label: 'UTC',  value: 'UTC' },
  { label: 'EST',  value: 'America/New_York' },
  { label: 'GMT',  value: 'Europe/London' },
  { label: 'IST',  value: 'Asia/Kolkata' },
  { label: 'CET',  value: 'Europe/Paris' },
  { label: 'PST',  value: 'America/Los_Angeles' },
  { label: 'JST',  value: 'Asia/Tokyo' },
  { label: 'BRT',  value: 'America/Sao_Paulo' },
];

const STAGE_LABELS: Record<string, string> = {
  all: 'All', group: 'Group', r32: 'R32', r16: 'R16', qf: 'QF', sf: 'SF', final: 'Final', third: '3rd',
};

const HOST_LABELS: Record<string, string> = {
  all: 'All', USA: 'USA', Canada: 'Canada', Mexico: 'Mexico',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatInTZ(utcStr: string, tz: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, ...opts }).format(new Date(utcStr));
}

function getDateKey(utcStr: string, tz: string): string {
  return formatInTZ(utcStr, tz, { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function formatTime(utcStr: string, tz: string): string {
  return formatInTZ(utcStr, tz, { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDateHeader(utcStr: string, tz: string): string {
  return formatInTZ(utcStr, tz, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getStadium(stadiumId: string) {
  return STADIUMS.find(s => s.id === stadiumId);
}

function getStatusColor(status: string): string {
  if (status === 'completed') return '#22C55E';
  if (status === 'live' || status === 'ht') return '#FF3B3B';
  return '#5A6478';
}

function getStatusLabel(status: string): string {
  if (status === 'completed') return 'FT';
  if (status === 'live') return 'LIVE';
  if (status === 'ht') return 'HT';
  return 'SCH';
}

function getStageLabel(stage: string, groupId?: string): string {
  if (stage === 'group' && groupId) return `Group ${groupId}`;
  return STAGE_LABELS[stage] || stage.toUpperCase();
}

// ─── Match Card ───────────────────────────────────────────────────────────────
function MatchCard({ match, tz }: { match: Match; tz: string }) {
  const navigate = useNavigate();
  const stadium = getStadium(match.stadiumId);
  const statusColor = getStatusColor(match.status);
  const isLive = match.status === 'live' || match.status === 'ht';
  const isCompleted = match.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate(`/matches/${match.id}`)}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `4px solid ${statusColor}`,
        borderRadius: '10px',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Status badge */}
      <div style={{ minWidth: '48px', textAlign: 'center' }}>
        {isLive ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div className="live-dot" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#FF3B3B' }}>
              {match.liveMinute ? `${match.liveMinute}'` : 'LIVE'}
            </span>
          </div>
        ) : (
          <span style={{
            fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
            color: isCompleted ? '#22C55E' : 'var(--text-muted)',
          }}>
            {getStatusLabel(match.status)}
          </span>
        )}
      </div>

      {/* Home team */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>
          {match.homeTeam.name}
        </span>
        <img
          src={`https://flagcdn.com/32x24/${match.homeTeam.countryCode.toLowerCase()}.png`}
          alt={match.homeTeam.name}
          style={{ width: 32, height: 24, objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
        />
      </div>

      {/* Score or time */}
      <div style={{ minWidth: '80px', textAlign: 'center' }}>
        {isCompleted || isLive ? (
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '28px',
            lineHeight: 1,
            color: isLive ? '#FF3B3B' : 'var(--text-primary)',
          }}>
            {match.score ? `${match.score.home} - ${match.score.away}` : '- -'}
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--brand-gold)' }}>
              {formatTime(match.kickoffUtc, tz)}
            </div>
          </div>
        )}
      </div>

      {/* Away team */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src={`https://flagcdn.com/32x24/${match.awayTeam.countryCode.toLowerCase()}.png`}
          alt={match.awayTeam.name}
          style={{ width: 32, height: 24, objectFit: 'cover', borderRadius: '3px', flexShrink: 0 }}
        />
        <span style={{ fontSize: '14px', fontWeight: 600 }}>{match.awayTeam.name}</span>
      </div>

      {/* Meta info */}
      <div style={{ minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }} className="hide-mobile">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '2px 6px', borderRadius: '3px',
            background: 'rgba(255,215,0,0.12)', color: 'var(--brand-gold)',
          }}>
            {getStageLabel(match.stage, match.groupId)}
          </span>
        </div>
        {stadium && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
            <MapPin size={10} />
            <span>{stadium.city}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Calendar Cell ────────────────────────────────────────────────────────────
function CalendarGrid({
  tz,
  filteredMatches,
  selectedDay,
  setSelectedDay,
}: {
  tz: string;
  filteredMatches: Match[];
  selectedDay: string | null;
  setSelectedDay: (d: string | null) => void;
}) {
  const [calMonth, setCalMonth] = useState<{ year: number; month: number }>({ year: 2026, month: 6 });

  const matchCountByDay = useMemo(() => {
    const map: Record<string, number> = {};
    filteredMatches.forEach(m => {
      const key = getDateKey(m.kickoffUtc, tz);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [filteredMatches, tz]);

  const { year, month } = calMonth;
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = new Date(year, month - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const goMonth = (dir: 1 | -1) => {
    setCalMonth(prev => {
      let m = prev.month + dir;
      let y = prev.year;
      if (m > 12) { m = 1; y++; }
      if (m < 1) { m = 12; y--; }
      return { year: y, month: m };
    });
    setSelectedDay(null);
  };

  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button onClick={() => goMonth(-1)} style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <ChevronLeft size={16} />
        </button>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '0.05em' }}>{monthName}</h3>
        <button onClick={() => goMonth(1)} style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '8px 12px', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          // Build a date key in format MM/DD/YYYY for the current month
          const dateKey = `${String(month).padStart(2,'0')}/${String(day).padStart(2,'0')}/${year}`;
          const count = matchCountByDay[dateKey] || 0;
          const isSelected = selectedDay === dateKey;
          const hasMatches = count > 0;

          return (
            <motion.div
              key={day}
              whileHover={hasMatches ? { scale: 1.05 } : {}}
              onClick={() => hasMatches ? setSelectedDay(isSelected ? null : dateKey) : undefined}
              style={{
                background: isSelected
                  ? 'var(--brand-red)'
                  : hasMatches
                    ? 'var(--surface-elevated)'
                    : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSelected ? 'var(--brand-red)' : hasMatches ? 'var(--border-gold)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                padding: '8px 4px',
                textAlign: 'center',
                cursor: hasMatches ? 'pointer' : 'default',
                minHeight: '52px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: hasMatches ? 700 : 400, color: hasMatches ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {day}
              </span>
              {hasMatches && (
                <div style={{
                  background: isSelected ? 'rgba(255,255,255,0.3)' : 'var(--brand-gold)',
                  color: isSelected ? 'white' : '#0A0F1E',
                  borderRadius: '10px',
                  padding: '1px 6px',
                  fontSize: '10px',
                  fontWeight: 700,
                  lineHeight: 1.4,
                }}>
                  {count}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Schedule Page ───────────────────────────────────────────────────────
export default function Schedule() {
  const { matches, players, teams } = useTournamentStore();

  const navigate = useNavigate();
  const { selectedTimezone, setTimezone } = useTournamentStore();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [hostFilter, setHostFilter] = useState<HostFilter>('all');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Filter matches
  const filteredMatches = useMemo(() => {
    return matches.filter(m => {
      if (stageFilter !== 'all' && m.stage !== stageFilter) return false;
      if (hostFilter !== 'all') {
        const stadium = getStadium(m.stadiumId);
        if (!stadium || stadium.country !== hostFilter) return false;
      }
      return true;
    });
  }, [stageFilter, hostFilter]);

  // Group matches by date for list view
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    const sorted = [...filteredMatches].sort((a, b) =>
      new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime()
    );
    sorted.forEach(m => {
      const key = getDateKey(m.kickoffUtc, selectedTimezone);
      if (!groups[key]) groups[key] = [];
      groups[key].push(m);
    });
    return groups;
  }, [filteredMatches, selectedTimezone]);

  // Matches for selected calendar day
  const calendarDayMatches = useMemo(() => {
    if (!selectedDay) return [];
    return filteredMatches.filter(m => getDateKey(m.kickoffUtc, selectedTimezone) === selectedDay);
  }, [selectedDay, filteredMatches, selectedTimezone]);

  const liveCount = matches.filter(m => m.status === 'live').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-navy)', paddingBottom: '48px' }}>
      {/* ── Hero Header ── */}
      <div className="hero-gradient" style={{ padding: '32px 0 28px' }}>
        <div className="page-container" style={{ paddingBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Calendar size={24} style={{ color: 'var(--brand-gold)' }} />
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '40px', letterSpacing: '0.05em', lineHeight: 1 }}>
                  Match Schedule
                </h1>
                {liveCount > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,59,59,0.15)', border: '1px solid rgba(255,59,59,0.4)', borderRadius: '20px', padding: '4px 10px' }}>
                    <div className="live-dot" />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#FF3B3B' }}>{liveCount} LIVE</span>
                  </div>
                )}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {filteredMatches.length} matches · FIFA World Cup 2026™
              </p>
            </div>

            {/* Timezone selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} style={{ color: 'var(--text-secondary)' }} />
              <select
                className="input"
                value={selectedTimezone}
                onChange={e => setTimezone(e.target.value)}
                style={{ width: 'auto', minWidth: '120px' }}
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container">
        {/* ── Controls Bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          {/* View toggle */}
          <div className="tab-bar" style={{ display: 'flex' }}>
            <button
              className={`tab-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <List size={14} /> List
            </button>
            <button
              className={`tab-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Calendar size={14} /> Calendar
            </button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={13} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stage</span>
            </div>
            {(Object.keys(STAGE_LABELS) as StageFilter[]).map(s => (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  background: stageFilter === s ? 'var(--brand-red)' : 'var(--surface-elevated)',
                  color: stageFilter === s ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {STAGE_LABELS[s]}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Host</span>
            {(Object.keys(HOST_LABELS) as HostFilter[]).map(h => (
              <button
                key={h}
                onClick={() => setHostFilter(h)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  background: hostFilter === h ? 'var(--brand-gold)' : 'var(--surface-elevated)',
                  color: hostFilter === h ? '#0A0F1E' : 'var(--text-secondary)',
                  transition: 'all 0.15s',
                }}
              >
                {HOST_LABELS[h]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Object.keys(groupedByDate).length === 0 && (
                <div style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
                  <Calendar size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
                  <p style={{ fontSize: '16px' }}>No matches match your filters.</p>
                </div>
              )}
              {Object.entries(groupedByDate).map(([dateKey, matches]) => (
                <div key={dateKey} style={{ marginBottom: '32px' }}>
                  {/* Date header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    marginBottom: '12px', paddingBottom: '8px',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, var(--brand-red), #8B0000)',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {matches.length} {matches.length === 1 ? 'Match' : 'Matches'}
                    </div>
                    <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatDateHeader(matches[0].kickoffUtc, selectedTimezone)}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      <Clock size={12} />
                      <span>{TIMEZONES.find(t => t.value === selectedTimezone)?.label || selectedTimezone}</span>
                    </div>
                  </div>
                  {matches.map(m => (
                    <MatchCard key={m.id} match={m} tz={selectedTimezone} />
                  ))}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
              }}>
                <CalendarGrid
                  tz={selectedTimezone}
                  filteredMatches={filteredMatches}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                />
              </div>

              <AnimatePresence>
                {selectedDay && calendarDayMatches.length > 0 && (
                  <motion.div
                    key="day-matches"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Zap size={16} style={{ color: 'var(--brand-gold)' }} />
                      <h3 style={{ fontSize: '16px', fontWeight: 700 }}>
                        {calendarDayMatches.length} {calendarDayMatches.length === 1 ? 'Match' : 'Matches'} on {formatDateHeader(calendarDayMatches[0].kickoffUtc, selectedTimezone)}
                      </h3>
                    </div>
                    {calendarDayMatches.map(m => (
                      <MatchCard key={m.id} match={m} tz={selectedTimezone} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {!selectedDay && (
                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '14px' }}>Click a highlighted date to see matches for that day.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
