import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Target, Star, Handshake, Calendar, TrendingUp,
  CreditCard, Clock, ChevronRight, Award, Zap, Users
} from 'lucide-react';
import { useTournamentStore } from '../store/tournamentStore';



// ─── Helpers ────────────────────────────────────────────────────────────────
function flagUrl(code: string, size: '32x24' | '48x36' = '32x24') {
  return `https://flagcdn.com/${size}/${code.toLowerCase()}.png`;
}

function formatKickoff(utcStr: string) {
  const d = new Date(utcStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(utcStr: string) {
  const d = new Date(utcStr);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ─── StatBar Component ──────────────────────────────────────────────────────
function StatBar({
  label, homeVal, awayVal, homeLabel, awayLabel, format = (v: number) => String(v)
}: {
  label: string;
  homeVal: number;
  awayVal: number;
  homeLabel?: string;
  awayLabel?: string;
  format?: (v: number) => string;
}) {
  const total = homeVal + awayVal || 1;
  const homePct = (homeVal / total) * 100;
  const awayPct = (awayVal / total) * 100;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--brand-red)', fontWeight: 600 }}>
          {format(homeVal)}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--info-blue)', fontWeight: 600 }}>
          {format(awayVal)}
        </span>
      </div>
      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
        <div style={{
          width: `${homePct}%`, height: '100%',
          background: 'linear-gradient(90deg, transparent, var(--brand-red))',
          borderRadius: '3px 0 0 3px', transition: 'width 0.8s ease'
        }} />
        <div style={{
          width: `${awayPct}%`, height: '100%',
          background: 'linear-gradient(90deg, var(--info-blue), transparent)',
          borderRadius: '0 3px 3px 0', transition: 'width 0.8s ease'
        }} />
      </div>
    </div>
  );
}

// ─── KPI Card ───────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon, label, value, sub, color, delay
}: {
  icon: any; label: string; value: string; sub?: string; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card"
      style={{ padding: '20px 22px', position: 'relative', overflow: 'hidden', cursor: 'default' }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 120, height: 120,
        borderRadius: '50%', background: `radial-gradient(circle, ${color}22, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `${color}1A`, border: `1px solid ${color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 30, fontWeight: 700, lineHeight: 1, color: 'var(--text-primary)', marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: sub ? 4 : 0 }}>
        {label}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</div>}
    </motion.div>
  );
}

// ─── Event Icon ─────────────────────────────────────────────────────────────
function eventIcon(type: string) {
  switch (type) {
    case 'goal': return '⚽';
    case 'yellow_card': return '🟨';
    case 'red_card': return '🟥';
    case 'substitution': return '↕️';
    case 'penalty': return '🎯';
    case 'var': return '📺';
    case 'own_goal': return '⚽';
    default: return '📌';
  }
}

// ─── Stage Label Map ────────────────────────────────────────────────────────
const STAGE_MAP: Record<string, string> = {
  group: 'Group Stage', r32: 'Round of 32', r16: 'Round of 16',
  qf: 'Quarter-Finals', sf: 'Semi-Finals', final: 'Final', third: '3rd Place'
};

// ─── Tournament Progress Steps ──────────────────────────────────────────────
const PROGRESS_STEPS = [
  { key: 'group', label: 'Group Stage', matches: '48 matches', done: true, active: true },
  { key: 'r32', label: 'Round of 32', matches: '16 matches', done: false, active: false },
  { key: 'r16', label: 'Round of 16', matches: '8 matches', done: false, active: false },
  { key: 'qf', label: 'Quarter-Finals', matches: '4 matches', done: false, active: false },
  { key: 'sf', label: 'Semi-Finals', matches: '2 matches', done: false, active: false },
  { key: 'final', label: 'Final', matches: 'Jul 19', done: false, active: false },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { matches, players, topScorers } = useTournamentStore();
  const [activeTab, setActiveTab] = useState<'goals' | 'assists' | 'rating'>('goals');
  const [liveMinute, setLiveMinute] = useState(67);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const completedMatches = matches.filter(m => m.status === 'completed');
  const recentResults = [...completedMatches].reverse();
  const todayMatches = matches.slice(0, 4);
  const liveMatch = matches.find(m => m.status === 'live') ?? recentResults[0] ?? matches[0] ?? null;

  // Simulate live minute advancing
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setLiveMinute(prev => prev < 90 ? prev + 1 : prev);
    }, 15000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  // Leaderboard data calculation
  // Build a robust leaderboard from dynamic events
  const playerMap: Record<string, { name: string, goals: number, countryCode: string, clubName: string }> = {};
  matches.forEach(m => {
    if (m.status === 'completed' || m.status === 'live') {
      m.events.forEach(ev => {
        if ((ev.type === 'goal' || ev.type === 'penalty') && ev.playerName) {
          if (!playerMap[ev.playerName]) {
            playerMap[ev.playerName] = { 
              name: ev.playerName, 
              goals: 0, 
              countryCode: ev.team === 'home' ? m.homeTeam.countryCode : m.awayTeam.countryCode, 
              clubName: 'National Team' 
            };
          }
          playerMap[ev.playerName].goals += 1;
        }
      });
    }
  });

  const sortedByGoals = topScorers?.length > 0 ? topScorers.slice(0, 20) : [...players].sort((a, b) => b.tournamentStats.goals - a.tournamentStats.goals).slice(0, 20);
  const sortedByAssists = [...players].sort((a, b) => b.tournamentStats.assists - a.tournamentStats.assists).slice(0, 20);
  const sortedByRating = [...players].sort((a, b) => b.tournamentStats.avgRating - a.tournamentStats.avgRating).slice(0, 20);

  const leaderboardData = activeTab === 'goals' ? sortedByGoals
    : activeTab === 'assists' ? sortedByAssists
    : sortedByRating;

  const leaderboardStat = (p: typeof players[0]) =>
    activeTab === 'goals' ? p.tournamentStats.goals
    : activeTab === 'assists' ? p.tournamentStats.assists
    : p.tournamentStats.avgRating;

  const leaderboardMax = Math.max(...leaderboardData.map(p => leaderboardStat(p)));

  // Dynamic KPI Calculations
  let totalGoals = 0;
  let totalYellowCards = 0;
  let totalRedCards = 0;
  let matchesPlayed = 0;

  const playerGoalMap: Record<string, number> = {};

  matches.forEach(m => {
    if (m.status === 'completed' || m.status === 'live') {
      matchesPlayed++;
      totalGoals += (m.score?.home || 0) + (m.score?.away || 0);
      
      m.events.forEach(ev => {
        if (ev.type === 'yellow_card') totalYellowCards++;
        if (ev.type === 'red_card') totalRedCards++;
        if ((ev.type === 'goal' || ev.type === 'penalty') && ev.playerName) {
          playerGoalMap[ev.playerName] = (playerGoalMap[ev.playerName] || 0) + 1;
        }
      });
    }
  });

  const avgGoals = matchesPlayed > 0 ? (totalGoals / matchesPlayed).toFixed(2) : '0.00';

  let topScorerName = '';
  let topScorerGoals = 0;
  Object.entries(playerGoalMap).forEach(([name, goals]) => {
    if (goals > topScorerGoals) {
      topScorerGoals = goals;
      topScorerName = name;
    }
  });

  // Fallback top scorer from players array if no live goals
  if (topScorerGoals === 0 && sortedByGoals.length > 0) {
    topScorerName = sortedByGoals[0].name;
    topScorerGoals = sortedByGoals[0].tournamentStats.goals;
  }

  const topAssisterName = sortedByAssists.length > 0 ? sortedByAssists[0].name : '';
  const topAssisterAssists = sortedByAssists.length > 0 ? sortedByAssists[0].tournamentStats.assists : 0;

  return (
    <div className="page-container">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hero-gradient"
        style={{
          borderRadius: 20, padding: '56px 40px 48px', marginBottom: 28,
          position: 'relative', overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Animated mesh gradient */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg, rgba(200,16,46,0.12) 0%, rgba(255,215,0,0.06) 50%, rgba(59,130,246,0.08) 100%)',
          animation: 'gradient-shift 8s ease infinite',
          backgroundSize: '400% 400%',
        }} />
        {/* Large decorative orbs */}
        <div style={{ position: 'absolute', top: -80, right: 60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,16,46,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: 40, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        {/* Trophy emoji watermark */}
        <div style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', fontSize: 160, opacity: 0.04, pointerEvents: 'none', userSelect: 'none' }}>🏆</div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span className="badge badge-live" style={{ fontSize: 11 }}>
              <span className="live-dot" style={{ marginRight: 5 }} /> LIVE TOURNAMENT
            </span>
            <span className="badge badge-gold">Group Stage</span>
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(52px, 8vw, 88px)', lineHeight: 1, marginBottom: 8 }}>
            <span className="gradient-text">FIFA World Cup</span>
            <br />
            <span style={{ color: 'white' }}>2026 Hub</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 520, lineHeight: 1.6, marginBottom: 24 }}>
            Real-time stats, live match tracking, and deep analytics for the greatest sporting event on Earth. USA · Canada · Mexico.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 30, background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)' }}>
              <span style={{ color: 'var(--brand-gold)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 18 }}>48</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Teams</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 30, background: 'rgba(200,16,46,0.1)', border: '1px solid rgba(200,16,46,0.25)' }}>
              <span style={{ color: 'var(--brand-red)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 18 }}>104</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Matches</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 30, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <span style={{ color: 'var(--info-blue)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 18 }}>16</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Venues</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 30, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
              <span style={{ color: 'var(--success-green)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 18 }}>$1B</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Prize Pool</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ─── KPI GRID ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <KpiCard icon={Target} label="Total Goals" value={String(totalGoals)} sub="Tournament total" color="#C8102E" delay={0.05} />
        <KpiCard icon={Star} label="Top Scorer" value={topScorerName || '-'} sub={topScorerName ? `${topScorerGoals} goals` : 'N/A'} color="#FFD700" delay={0.10} />
        <KpiCard icon={Handshake} label="Top Assister" value={topAssisterName || '-'} sub={topAssisterName ? `${topAssisterAssists} assists` : 'N/A'} color="#22C55E" delay={0.15} />
        <KpiCard icon={Calendar} label="Matches Played" value={`${matchesPlayed}/${matches.length || 104}`} sub="Overall" color="#3B82F6" delay={0.20} />
        <KpiCard icon={TrendingUp} label="Avg Goals/Match" value={avgGoals} sub="Per match" color="#F59E0B" delay={0.25} />
        <KpiCard icon={CreditCard} label="Disciplinary" value={`${totalYellowCards} / ${totalRedCards}`} sub="Yellow / Red cards" color="#EF4444" delay={0.30} />
      </div>

      {/* ─── TWO-COLUMN: LIVE MATCH + SCHEDULE ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 28 }}>

        {/* Live Match Scoreboard */}
        {liveMatch ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="card"
          style={{ padding: 0, overflow: 'hidden' }}
        >
          {/* Header bar */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(200,16,46,0.2), rgba(10,15,30,0.4))',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '14px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {liveMatch.status === 'live' ? (
                <span className="badge badge-live">
                  <span className="live-dot" style={{ marginRight: 5 }} /> LIVE
                </span>
              ) : liveMatch.status === 'completed' ? (
                <span className="badge badge-green">FT</span>
              ) : (
                <span className="badge badge-amber">UPCOMING</span>
              )}
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {STAGE_MAP[liveMatch.stage] ?? 'Group Stage'} — Match {liveMatch.matchNumber}
              </span>
            </div>
            {liveMatch.status === 'live' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <Clock size={14} style={{ color: 'var(--brand-red)' }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--live-red)', fontWeight: 700 }}>
                  {liveMatch.liveMinute || liveMinute}'
                </span>
              </div>
            )}
          </div>

          {/* Scoreboard */}
          <div style={{ padding: '28px 32px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(200,16,46,0.04) 0%, transparent 60%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              {/* Home Team */}
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{liveMatch.homeTeam.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{liveMatch.homeTeam.countryCode}</div>
                  </div>
                  <img
                    src={flagUrl(liveMatch.homeTeam.countryCode, '48x36')}
                    alt={liveMatch.homeTeam.name}
                    style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, border: '2px solid var(--border-subtle)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>

              {/* Score */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: 96, lineHeight: 1,
                    color: 'var(--text-primary)', textShadow: '0 0 40px rgba(200,16,46,0.3)'
                  }}>
                    {liveMatch.score?.home ?? 0}
                  </span>
                  <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, color: 'var(--text-muted)', lineHeight: 1 }}>–</span>
                  <span style={{
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: 96, lineHeight: 1,
                    color: 'var(--text-primary)', textShadow: '0 0 40px rgba(59,130,246,0.3)'
                  }}>
                    {liveMatch.score?.away ?? 0}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                  {liveMatch.status === 'live' ? (
                    <>
                      <span className="live-dot" />
                      <span style={{ fontSize: 13, color: 'var(--live-red)', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                        {liveMatch.liveMinute || liveMinute}' — LIVE
                      </span>
                    </>
                  ) : liveMatch.status === 'completed' ? (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                      FULL TIME
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, color: 'var(--brand-gold)', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatKickoff(liveMatch.kickoffUtc)}
                    </span>
                  )}
                </div>
              </div>

              {/* Away Team */}
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 12, marginBottom: 10 }}>
                  <img
                    src={flagUrl(liveMatch.awayTeam.countryCode, '48x36')}
                    alt={liveMatch.awayTeam.name}
                    style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6, border: '2px solid var(--border-subtle)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{liveMatch.awayTeam.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{liveMatch.awayTeam.countryCode}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Stats Bars */}
            {liveMatch.stats && (
              <div style={{ marginTop: 20, borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14, textAlign: 'center' }}>
                  Live Match Statistics
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flex: 1, fontSize: 12, color: 'var(--brand-red)', fontWeight: 700, textAlign: 'right', marginBottom: 4 }}>
                    {liveMatch.homeTeam.name.split(' ')[0]}
                  </div>
                  <div style={{ flex: 1, fontSize: 12, color: 'var(--info-blue)', fontWeight: 700, textAlign: 'left', marginBottom: 4 }}>
                    {liveMatch.awayTeam.name.split(' ')[0]}
                  </div>
                </div>
                <StatBar label="Possession" homeVal={liveMatch.stats.possession[0]} awayVal={liveMatch.stats.possession[1]} format={v => `${v}%`} />
                <StatBar label="Shots" homeVal={liveMatch.stats.shotsTotal[0]} awayVal={liveMatch.stats.shotsTotal[1]} />
                <StatBar label="xG" homeVal={liveMatch.stats.xG[0]} awayVal={liveMatch.stats.xG[1]} format={v => v.toFixed(1)} />
                <StatBar label="Corners" homeVal={liveMatch.stats.corners[0]} awayVal={liveMatch.stats.corners[1]} />
              </div>
            )}
          </div>

          {/* Event Timeline */}
          {liveMatch.events.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '16px 20px' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
                Match Events
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {liveMatch.events.map(ev => (
                  <div key={ev.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '8px 12px', borderRadius: 8,
                    background: ev.team === 'home' ? 'rgba(200,16,46,0.05)' : 'rgba(59,130,246,0.05)',
                    borderLeft: `2px solid ${ev.team === 'home' ? 'var(--brand-red)' : 'var(--info-blue)'}`,
                  }}>
                    <span style={{ fontSize: 16 }}>{eventIcon(ev.type)}</span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 700,
                      color: 'var(--brand-gold)', width: 32, flexShrink: 0
                    }}>{ev.minute}'</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ev.playerName}
                      </div>
                      {ev.assistPlayerName && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Assist: {ev.assistPlayerName}</div>
                      )}
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: ev.team === 'home' ? 'var(--brand-red)' : 'var(--info-blue)',
                      textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0
                    }}>
                      {ev.team === 'home' ? liveMatch.homeTeam.countryCode : liveMatch.awayTeam.countryCode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No matches available
          </div>
        )}

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
          style={{ padding: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 className="section-title">Today's Fixtures</h2>
            <button className="btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }}>View All <ChevronRight size={12} style={{ display: 'inline' }} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayMatches.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 10,
                  background: m.status === 'live' ? 'rgba(200,16,46,0.08)' : 'var(--surface-elevated)',
                  border: `1px solid ${m.status === 'live' ? 'rgba(200,16,46,0.25)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                {/* Status badge */}
                <div style={{ width: 44, flexShrink: 0, textAlign: 'center' }}>
                  {m.status === 'live' ? (
                    <span className="badge badge-live" style={{ fontSize: 10 }}>LIVE</span>
                  ) : m.status === 'completed' ? (
                    <span className="badge badge-green" style={{ fontSize: 10 }}>FT</span>
                  ) : (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                      {formatKickoff(m.kickoffUtc)}
                    </div>
                  )}
                </div>

                {/* Home */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{m.homeTeam.name.split(' ').slice(-1)[0]}</span>
                  <img src={flagUrl(m.homeTeam.countryCode)} alt={m.homeTeam.name} style={{ width: 24, height: 18, objectFit: 'cover', borderRadius: 3 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>

                {/* Score or vs */}
                <div style={{ width: 44, textAlign: 'center', flexShrink: 0 }}>
                  {m.score ? (
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 700, color: 'white' }}>
                      {m.score.home}–{m.score.away}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>vs</span>
                  )}
                </div>

                {/* Away */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <img src={flagUrl(m.awayTeam.countryCode)} alt={m.awayTeam.name} style={{ width: 24, height: 18, objectFit: 'cover', borderRadius: 3 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{m.awayTeam.name.split(' ').slice(-1)[0]}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mini stats strip */}
          <div style={{
            marginTop: 16, padding: '12px 14px', borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(255,215,0,0.06), rgba(200,16,46,0.06))',
            border: '1px solid var(--border-gold)', display: 'flex', justifyContent: 'space-around', textAlign: 'center'
          }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700, color: 'var(--brand-gold)' }}>1</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live</div>
            </div>
            <div style={{ width: 1, background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700, color: 'var(--success-green)' }}>5</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Completed</div>
            </div>
            <div style={{ width: 1, background: 'var(--border-subtle)' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700, color: 'var(--info-blue)' }}>8</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Upcoming</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── TWO COLUMN: LEADERBOARD + TOURNAMENT PROGRESS ─────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

        {/* Top Performers Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card"
          style={{ padding: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <h2 className="section-title"><Award size={18} style={{ color: 'var(--brand-gold)', marginRight: 4 }} />Top Performers</h2>
            <div className="tab-bar">
              {(['goals', 'assists', 'rating'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-btn${activeTab === tab ? ' active' : ''}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {leaderboardData.map((player, idx) => {
              const stat = leaderboardStat(player);
              const barWidth = (stat / leaderboardMax) * 100;
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10,
                    background: idx === 0 ? 'rgba(255,215,0,0.06)' : 'var(--surface-elevated)',
                    border: `1px solid ${idx === 0 ? 'rgba(255,215,0,0.2)' : 'var(--border-subtle)'}`,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Rank */}
                  <span style={{
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: 22,
                    color: idx === 0 ? 'var(--brand-gold)' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : 'var(--text-muted)',
                    width: 26, flexShrink: 0, lineHeight: 1,
                  }}>
                    {idx + 1}
                  </span>

                  {/* Flag */}
                  <img
                    src={flagUrl(player.countryCode)}
                    alt={player.countryCode}
                    style={{ width: 28, height: 21, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />

                  {/* Player info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {player.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{player.clubName}</div>
                  </div>

                  {/* Stat + bar */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 20, fontWeight: 700, color: idx === 0 ? 'var(--brand-gold)' : 'var(--text-primary)', lineHeight: 1 }}>
                      {typeof stat === 'number' && stat % 1 !== 0 ? stat.toFixed(1) : stat}
                    </div>
                    <div style={{ marginTop: 4, height: 3, width: 60, borderRadius: 2, background: 'var(--surface-card)' }}>
                      <div style={{
                        height: '100%', width: `${barWidth}%`, borderRadius: 2,
                        background: idx === 0 ? 'var(--brand-gold)' : 'var(--brand-red)',
                        transition: 'width 0.6s ease'
                      }} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tournament Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
          style={{ padding: '20px' }}
        >
          <h2 className="section-title" style={{ marginBottom: 24 }}>
            <Zap size={18} style={{ color: 'var(--brand-gold)' }} /> Tournament Progress
          </h2>

          <div style={{ position: 'relative' }}>
            {/* Vertical connector line */}
            <div style={{
              position: 'absolute', left: 19, top: 20, bottom: 20,
              width: 2, background: 'linear-gradient(180deg, var(--brand-red) 0%, var(--brand-gold) 30%, var(--border-subtle) 60%)',
              borderRadius: 1
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', zIndex: 1 }}>
              {PROGRESS_STEPS.map((step, i) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '12px 16px 12px 0',
                  }}
                >
                  {/* Step circle */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step.active ? 'var(--brand-red)' : step.done ? 'rgba(34,197,94,0.2)' : 'var(--surface-elevated)',
                    border: `2px solid ${step.active ? 'var(--brand-red)' : step.done ? 'var(--success-green)' : 'var(--border-subtle)'}`,
                    boxShadow: step.active ? '0 0 20px rgba(200,16,46,0.5)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    {step.done || step.active ? (
                      <span style={{ fontSize: step.active ? 14 : 12 }}>
                        {step.active ? '▶' : '✓'}
                      </span>
                    ) : (
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>{i + 1}</span>
                    )}
                  </div>

                  {/* Step info */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700,
                      color: step.active ? 'white' : step.done ? 'var(--success-green)' : 'var(--text-muted)',
                      marginBottom: 2,
                    }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{step.matches}</div>
                  </div>

                  {/* Badge */}
                  {step.active && (
                    <span className="badge badge-live" style={{ flexShrink: 0 }}>
                      <span className="live-dot" style={{ marginRight: 4 }} /> Active
                    </span>
                  )}
                  {!step.active && !step.done && i <= 3 && (
                    <span className="badge badge-amber" style={{ flexShrink: 0, fontSize: 10 }}>Soon</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Progress summary */}
          <div style={{ marginTop: 20, padding: '14px', borderRadius: 10, background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Overall Tournament Progress</div>
            <div style={{ height: 8, borderRadius: 4, background: 'var(--surface-card)', overflow: 'hidden', marginBottom: 6 }}>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.round((matchesPlayed / (matches.length || 104)) * 100)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, var(--brand-red), var(--brand-gold))' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
              <span>Matchday 1</span>
              <span style={{ color: 'var(--brand-gold)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                {Math.round((matchesPlayed / (matches.length || 104)) * 100)}%
              </span>
              <span>July 19 Final</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── RECENT RESULTS ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{ padding: '20px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-title"><Users size={18} style={{ color: 'var(--brand-red)', marginRight: 4 }} />Recent Results</h2>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>All {recentResults.length} completed matches</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {recentResults.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{
                padding: '14px 16px', borderRadius: 12,
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
              whileHover={{ scale: 1.02, borderColor: 'var(--border-gold)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="badge badge-green" style={{ fontSize: 10 }}>FT</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {STAGE_MAP[m.stage] ?? 'Group'} · {formatDate(m.kickoffUtc)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <img src={flagUrl(m.homeTeam.countryCode)} alt={m.homeTeam.name} style={{ width: 28, height: 21, objectFit: 'cover', borderRadius: 3 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.homeTeam.name.split(' ').slice(-1)[0]}
                  </span>
                </div>

                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 28, color: 'var(--brand-gold)', letterSpacing: '0.05em', flexShrink: 0 }}>
                  {m.score?.home ?? 0} – {m.score?.away ?? 0}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.awayTeam.name.split(' ').slice(-1)[0]}
                  </span>
                  <img src={flagUrl(m.awayTeam.countryCode)} alt={m.awayTeam.name} style={{ width: 28, height: 21, objectFit: 'cover', borderRadius: 3 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              </div>

              {/* Goals count */}
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                <span>⚽</span>
                <span>{m.events.filter(e => e.type === 'goal' || e.type === 'own_goal').length} goals</span>
                {m.manOfTheMatch && (
                  <>
                    <span style={{ color: 'var(--border-subtle)' }}>·</span>
                    <span>⭐ MOTM</span>
                  </>
                )}
                {m.attendance && (
                  <>
                    <span style={{ color: 'var(--border-subtle)' }}>·</span>
                    <span>👥 {(m.attendance / 1000).toFixed(0)}K</span>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
