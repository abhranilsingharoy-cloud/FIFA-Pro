import { useTournamentStore } from '../store/tournamentStore';
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { ArrowLeft, Trophy, Users, Target, Shield, Shirt, Star, TrendingUp } from 'lucide-react';


import type { Position } from '../types';

/* ── MOCK SQUAD DATA GENERATOR ─────────────────────────────────────── */
type SquadPlayer = {
  number: number;
  name: string;
  position: Position;
  club: string;
  age: number;
  goals: number;
  assists: number;
  rating: number;
};

const CLUBS_BY_CONF: Record<string, string[]> = {
  UEFA: ['Real Madrid', 'Barcelona', 'Manchester City', 'Bayern Munich', 'PSG', 'Arsenal', 'Chelsea', 'Juventus', 'Inter Milan', 'AC Milan', 'Liverpool', 'Atletico Madrid', 'Borussia Dortmund', 'Ajax', 'Porto'],
  CONMEBOL: ['Flamengo', 'Boca Juniors', 'River Plate', 'Palmeiras', 'Nacional', 'Santos', 'Athletico', 'Peñarol'],
  CONCACAF: ['LA Galaxy', 'Club America', 'Toronto FC', 'Tigres', 'Chivas', 'Columbus Crew', 'Inter Miami'],
  CAF: ['Al Ahly', 'Zamalek', 'TP Mazembe', 'Esperance', 'Kaizer Chiefs', 'Wydad'],
  AFC: ['Al Hilal', 'Al Nassr', 'Kawasaki Frontale', 'Jeonbuk', 'Ulsan', 'Vissel Kobe'],
};

const FIRST_NAMES = ['Liam','Noah','Oliver','James','Lucas','Mason','Ethan','Logan','Aiden','Jackson','Carlos','Mateo','Luis','Diego','Alejandro','Marco','Antoine','Pierre','Laurent','Théo','Kai','Leon','Felix','Lukas','Max','Takumi','Ryo','Hiroshi','Yuki','Kenji'];
const LAST_NAMES = ['Silva','Santos','Oliveira','Costa','Ferreira','Martins','Rodrigues','García','López','Martínez','Hernández','González','Müller','Schneider','Fischer','Weber','Wagner','Nakamura','Tanaka','Suzuki','Yamamoto','Traoré','Diallo','Coulibaly','Koné','Mbeki'];

function generateSquad(team: { confederation: string; countryCode: string; wins: number }): SquadPlayer[] {
  const clubs = CLUBS_BY_CONF[team.confederation] ?? CLUBS_BY_CONF.UEFA;
  const seed = team.countryCode.charCodeAt(0) + team.countryCode.charCodeAt(1);

  function seededRand(n: number, offset: number = 0): number {
    return ((seed * (n + offset + 13) * 1234567) % 997) / 997;
  }

  const positions: Position[] = ['GK', 'GK', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'DEF', 'MID', 'MID', 'MID', 'MID', 'MID', 'FWD', 'FWD', 'FWD', 'FWD', 'FWD'];
  const players: SquadPlayer[] = [];
  const usedNumbers = new Set<number>();

  for (let i = 0; i < 18; i++) {
    let num = Math.floor(seededRand(i, 1) * 30) + 1;
    while (usedNumbers.has(num)) num = num % 30 + 1;
    usedNumbers.add(num);

    const fn = FIRST_NAMES[Math.floor(seededRand(i, 2) * FIRST_NAMES.length)];
    const ln = LAST_NAMES[Math.floor(seededRand(i, 3) * LAST_NAMES.length)];
    const pos = positions[i];
    const club = clubs[Math.floor(seededRand(i, 4) * clubs.length)];
    const age = 19 + Math.floor(seededRand(i, 5) * 17);
    const goals = pos === 'FWD' ? Math.floor(seededRand(i, 6) * 5) : pos === 'MID' ? Math.floor(seededRand(i, 6) * 3) : 0;
    const assists = pos !== 'GK' ? Math.floor(seededRand(i, 7) * 4) : 0;
    const baseRating = pos === 'GK' ? 7.0 : 6.8;
    const rating = Math.round((baseRating + seededRand(i, 8) * 1.8) * 10) / 10;

    players.push({ number: num, name: `${fn} ${ln}`, position: pos, club, age, goals, assists, rating });
  }
  return players.sort((a, b) => {
    const order: Record<Position, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
    return order[a.position] - order[b.position] || a.number - b.number;
  });
}

/* ── POSITION COLORS ─────────────────────────────────────────────── */
const POS_COLORS: Record<Position, { bg: string; color: string }> = {
  GK:  { bg: 'rgba(255,215,0,0.2)',    color: 'var(--brand-gold)' },
  DEF: { bg: 'rgba(59,130,246,0.2)',  color: '#60A5FA' },
  MID: { bg: 'rgba(34,197,94,0.2)',   color: '#4ADE80' },
  FWD: { bg: 'rgba(200,16,46,0.2)',   color: '#F87171' },
};

const STAGE_LABELS: Record<string, string> = {
  group: 'Group Stage', r32: 'R32', r16: 'R16', qf: 'Quarter-Final', sf: 'Semi-Final', final: 'Final', third: '3rd Place',
};

/* ── STAT BAR ─────────────────────────────────────────────────────── */
function StatBar({ label, value, max, color = 'var(--brand-red)' }: { label: string; value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
      </div>
      <div style={{ height: 6, background: 'var(--surface-elevated)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 3 }}
        />
      </div>
    </div>
  );
}

/* ── MAIN COMPONENT ─────────────────────────────────────────────────── */
export default function TeamDetail() {
  const { matches, players, teams } = useTournamentStore();

  const { countryCode } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();
  const [posFilter, setPosFilter] = useState<Position | 'ALL'>('ALL');
  const [sortCol, setSortCol] = useState<'number' | 'name' | 'goals' | 'assists' | 'rating'>('number');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [statsTab, setStatsTab] = useState<'attacking' | 'defending' | 'possession' | 'disciplinary'>('attacking');

  const team = useMemo(() => {
    return teams.find(t => t.countryCode.toLowerCase() === (countryCode ?? '').toLowerCase());
  }, [countryCode]);

  const squad = useMemo(() => team ? generateSquad(team) : [], [team]);

  const teamMatches = useMemo(() => {
    if (!team) return [];
    return matches.filter(m =>
      m.homeTeam.countryCode === team.countryCode || m.awayTeam.countryCode === team.countryCode
    );
  }, [team]);

  const filteredSquad = useMemo(() => {
    let list = posFilter === 'ALL' ? squad : squad.filter(p => p.position === posFilter);
    list = [...list].sort((a, b) => {
      let diff = 0;
      if (sortCol === 'number') diff = a.number - b.number;
      else if (sortCol === 'name') diff = a.name.localeCompare(b.name);
      else if (sortCol === 'goals') diff = a.goals - b.goals;
      else if (sortCol === 'assists') diff = a.assists - b.assists;
      else if (sortCol === 'rating') diff = a.rating - b.rating;
      return sortDir === 'asc' ? diff : -diff;
    });
    return list;
  }, [squad, posFilter, sortCol, sortDir]);

  function toggleSort(col: typeof sortCol) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir(col === 'goals' || col === 'rating' || col === 'assists' ? 'desc' : 'asc'); }
  }

  const attackingData = [
    { name: 'Goals', value: team?.goalsFor ?? 0, max: 12 },
    { name: 'Shots', value: (team?.wins ?? 0) * 8 + (team?.draws ?? 0) * 5 + 6, max: 40 },
    { name: 'xG', value: Math.round((team?.goalsFor ?? 0) * 1.1 * 10) / 10, max: 15 },
  ];

  const winRate = team ? Math.round((team.wins / Math.max(team.matchesPlayed, 1)) * 100) : 0;

  if (!team) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--brand-navy)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        gap: 16,
      }}>
        <Shield size={64} color="var(--text-muted)" />
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: 'var(--text-muted)', letterSpacing: 2 }}>
          TEAM NOT FOUND
        </p>
        <button className="btn-primary" onClick={() => navigate('/teams')}>← Back to Nations</button>
      </div>
    );
  }

  const flagCode = team.flag || team.countryCode.toLowerCase();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-navy)' }}>
      {/* HERO BANNER */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${team.primaryColor}55 0%, ${team.primaryColor}22 40%, var(--brand-navy) 100%)`,
        borderBottom: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        minHeight: 280,
      }}>
        {/* Background flag watermark */}
        <div style={{
          position: 'absolute', right: -40, top: -20, width: 350, height: 260,
          opacity: 0.08, pointerEvents: 'none',
        }}>
          <img
            src={`https://flagcdn.com/w320/${flagCode}.png`}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px)' }}
          />
        </div>

        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at 60% 50%, ${team.primaryColor}30 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px 32px', position: 'relative' }}>
          {/* Back button */}
          <button
            onClick={() => navigate('/teams')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-subtle)',
              borderRadius: 8, padding: '8px 14px',
              color: 'var(--text-secondary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer', marginBottom: 24, transition: 'all 0.2s',
            }}
          >
            <ArrowLeft size={14} /> All Nations
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* Flag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
              style={{
                borderRadius: 16, overflow: 'hidden',
                border: '3px solid rgba(255,255,255,0.15)',
                boxShadow: `0 8px 32px ${team.primaryColor}50, 0 4px 16px rgba(0,0,0,0.4)`,
              }}
            >
              <img
                src={`https://flagcdn.com/w160/${flagCode}.png`}
                alt={team.name}
                style={{ display: 'block', width: 128, height: 96, objectFit: 'cover' }}
              />
            </motion.div>

            {/* Team info */}
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 64, lineHeight: 1, letterSpacing: 2,
                  marginBottom: 10,
                }}
              >
                {team.name}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}
              >
                <span style={{
                  background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)',
                  color: 'var(--brand-gold)', fontSize: 12, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 6, letterSpacing: 0.5,
                }}>
                  ⚡ FIFA #{team.fifaRanking}
                </span>
                <span style={{
                  background: `${team.primaryColor}30`, border: `1px solid ${team.primaryColor}60`,
                  color: 'var(--text-primary)', fontSize: 12, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 6,
                }}>
                  {team.confederation}
                </span>
                <span style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-secondary)', fontSize: 12, fontWeight: 600,
                  padding: '4px 10px', borderRadius: 6,
                }}>
                  GROUP {team.groupId}
                </span>
              </motion.div>
            </div>

            {/* Quick KPIs */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'W', value: team.wins, color: '#4ADE80' },
                { label: 'D', value: team.draws, color: 'var(--text-secondary)' },
                { label: 'L', value: team.losses, color: '#F87171' },
                { label: 'PTS', value: team.points, color: 'var(--brand-gold)' },
                { label: 'GF', value: team.goalsFor, color: '#60A5FA' },
                { label: 'GA', value: team.goalsAgainst, color: '#FB923C' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color,
                    lineHeight: 1,
                  }}>{value}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: 1 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* MANAGER CARD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, padding: 24,
              }}
            >
              <h2 className="section-title" style={{ marginBottom: 16 }}>Manager</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 700, color: 'white',
                  flexShrink: 0,
                  boxShadow: `0 0 20px ${team.primaryColor}50`,
                }}>
                  {team.manager.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{team.manager}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>
                    🌍 {team.managerNationality}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{
                      background: 'rgba(34,197,94,0.15)', color: '#4ADE80',
                      border: '1px solid rgba(34,197,94,0.3)',
                      fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                    }}>
                      {winRate}% Win Rate
                    </span>
                    <span style={{
                      background: 'rgba(59,130,246,0.15)', color: '#60A5FA',
                      border: '1px solid rgba(59,130,246,0.3)',
                      fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                    }}>
                      {team.matchesPlayed} Matches
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SQUAD TABLE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, overflow: 'hidden',
              }}
            >
              <div style={{ padding: '20px 20px 0' }}>
                <h2 className="section-title" style={{ marginBottom: 14 }}>
                  <Shirt size={20} color="var(--brand-gold)" />
                  Squad
                </h2>
                {/* Position filter */}
                <div className="tab-bar" style={{ marginBottom: 0 }}>
                  {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map(pos => (
                    <button
                      key={pos}
                      className={`tab-btn ${posFilter === pos ? 'active' : ''}`}
                      onClick={() => setPosFilter(pos)}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ marginTop: 8 }}>
                  <thead>
                    <tr>
                      {[
                        { key: 'number', label: '#' },
                        { key: 'name', label: 'Name' },
                        { key: null, label: 'Position' },
                        { key: null, label: 'Club' },
                        { key: 'goals', label: 'G' },
                        { key: 'assists', label: 'A' },
                        { key: 'rating', label: '⭐ Rating' },
                      ].map(({ key, label }) => (
                        <th
                          key={label}
                          onClick={() => key && toggleSort(key as typeof sortCol)}
                          style={{ cursor: key ? 'pointer' : 'default', userSelect: 'none' }}
                        >
                          {label}
                          {key && sortCol === key && (sortDir === 'asc' ? ' ↑' : ' ↓')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSquad.map((player, idx) => {
                      const posStyle = POS_COLORS[player.position];
                      return (
                        <motion.tr
                          key={player.number}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                        >
                          <td style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: 'var(--text-muted)' }}>
                            {player.number}
                          </td>
                          <td style={{ fontWeight: 600 }}>{player.name}</td>
                          <td>
                            <span style={{
                              background: posStyle.bg, color: posStyle.color,
                              fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                              letterSpacing: 0.5,
                            }}>
                              {player.position}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{player.club}</td>
                          <td style={{ fontFamily: "'JetBrains Mono', monospace", color: '#4ADE80', fontWeight: 700 }}>
                            {player.goals}
                          </td>
                          <td style={{ fontFamily: "'JetBrains Mono', monospace", color: '#60A5FA', fontWeight: 700 }}>
                            {player.assists}
                          </td>
                          <td>
                            <span style={{
                              fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
                              color: player.rating >= 8 ? 'var(--brand-gold)' : player.rating >= 7.5 ? '#4ADE80' : 'var(--text-secondary)',
                            }}>
                              {player.rating.toFixed(1)}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* MATCH HISTORY */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, padding: 24,
              }}
            >
              <h2 className="section-title" style={{ marginBottom: 18 }}>
                <Trophy size={18} color="var(--brand-gold)" />
                Match History
              </h2>
              {teamMatches.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No matches found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {teamMatches.map((match, idx) => {
                    const isHome = match.homeTeam.countryCode === team.countryCode;
                    const opponent = isHome ? match.awayTeam : match.homeTeam;
                    const myScore = match.score ? (isHome ? match.score.home : match.score.away) : null;
                    const oppScore = match.score ? (isHome ? match.score.away : match.score.home) : null;
                    const result = myScore !== null && oppScore !== null
                      ? myScore > oppScore ? 'W' : myScore < oppScore ? 'L' : 'D'
                      : match.status === 'scheduled' ? 'TBD' : '-';
                    const resultColor = result === 'W' ? '#4ADE80' : result === 'L' ? '#F87171' : result === 'D' ? 'var(--text-secondary)' : 'var(--text-muted)';

                    return (
                      <motion.div
                        key={match.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          background: 'var(--surface-elevated)',
                          borderRadius: 10, padding: '12px 16px',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: 6, background: `${resultColor}20`,
                          border: `1px solid ${resultColor}40`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 800, color: resultColor, flexShrink: 0,
                        }}>
                          {result}
                        </div>
                        <img
                          src={`https://flagcdn.com/24x18/${opponent.countryCode.toLowerCase()}.png`}
                          alt={opponent.name}
                          style={{ borderRadius: 3, border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>vs {opponent.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            {STAGE_LABELS[match.stage]} · {new Date(match.kickoffUtc).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        {myScore !== null && oppScore !== null && (
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: resultColor }}>
                            {myScore} – {oppScore}
                          </div>
                        )}
                        {match.status === 'scheduled' && (
                          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>UPCOMING</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* TEAM STATS PANEL */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, overflow: 'hidden',
              }}
            >
              <div style={{ padding: '20px 20px 0' }}>
                <h2 className="section-title" style={{ marginBottom: 14 }}>
                  <TrendingUp size={18} color="var(--brand-gold)" />
                  Team Statistics
                </h2>
                <div className="tab-bar" style={{ marginBottom: 0, flexWrap: 'wrap' }}>
                  {(['attacking', 'defending', 'possession', 'disciplinary'] as const).map(tab => (
                    <button
                      key={tab}
                      className={`tab-btn ${statsTab === tab ? 'active' : ''}`}
                      onClick={() => setStatsTab(tab)}
                      style={{ fontSize: 11, padding: '6px 10px' }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={statsTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  style={{ padding: 20 }}
                >
                  {statsTab === 'attacking' && (
                    <>
                      <StatBar label="Goals Scored" value={team.goalsFor} max={12} color="linear-gradient(90deg, #22C55E, #4ADE80)" />
                      <StatBar label="Shots Total" value={team.wins * 14 + team.draws * 10 + 8} max={80} color="linear-gradient(90deg, var(--brand-red), #F87171)" />
                      <StatBar label="Shots on Target" value={team.wins * 8 + team.draws * 5 + 4} max={45} color="linear-gradient(90deg, #C8102E, #FF6B6B)" />
                      <StatBar label="xG" value={Math.round(team.goalsFor * 1.1 * 10) / 10} max={15} color="linear-gradient(90deg, #F59E0B, #FFD700)" />
                      <StatBar label="Big Chances" value={team.wins * 4 + team.draws * 2 + 1} max={20} color="linear-gradient(90deg, #8B5CF6, #A78BFA)" />

                      {/* Bar chart */}
                      <div style={{ marginTop: 20 }}>
                        <ResponsiveContainer width="100%" height={140}>
                          <BarChart data={attackingData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <XAxis dataKey="name" tick={{ fill: '#A0AABF', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#A0AABF', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip
                              contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 12 }}
                              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {attackingData.map((_, i) => (
                                <Cell key={i} fill={['#22C55E', '#C8102E', '#F59E0B'][i]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  )}
                  {statsTab === 'defending' && (
                    <>
                      <StatBar label="Goals Conceded" value={team.goalsAgainst} max={12} color="linear-gradient(90deg, #C8102E, #F87171)" />
                      <StatBar label="Tackles Won" value={team.wins * 18 + team.draws * 12 + 10} max={80} color="linear-gradient(90deg, #3B82F6, #60A5FA)" />
                      <StatBar label="Interceptions" value={team.wins * 10 + team.draws * 7 + 5} max={50} color="linear-gradient(90deg, #06B6D4, #67E8F9)" />
                      <StatBar label="Clearances" value={team.wins * 8 + team.draws * 6 + 4} max={40} color="linear-gradient(90deg, #8B5CF6, #A78BFA)" />
                      <StatBar label="Blocks" value={team.wins * 5 + team.draws * 3 + 2} max={25} color="linear-gradient(90deg, #F59E0B, #FCD34D)" />
                      <StatBar label="Clean Sheets" value={team.wins} max={team.matchesPlayed} color="linear-gradient(90deg, #22C55E, #86EFAC)" />
                    </>
                  )}
                  {statsTab === 'possession' && (
                    <>
                      <StatBar label="Avg Possession %" value={45 + team.wins * 4 + team.points} max={80} color="linear-gradient(90deg, #3B82F6, #60A5FA)" />
                      <StatBar label="Passes per Game" value={350 + team.wins * 50 + team.points * 10} max={700} color="linear-gradient(90deg, #06B6D4, #67E8F9)" />
                      <StatBar label="Pass Accuracy %" value={78 + team.wins * 3} max={100} color="linear-gradient(90deg, #22C55E, #4ADE80)" />
                      <StatBar label="Progressive Carries" value={team.wins * 20 + 15} max={80} color="linear-gradient(90deg, #F59E0B, #FFD700)" />
                      <StatBar label="Final Third Entries" value={team.wins * 12 + team.draws * 8 + 6} max={55} color="linear-gradient(90deg, #8B5CF6, #A78BFA)" />
                    </>
                  )}
                  {statsTab === 'disciplinary' && (
                    <>
                      <StatBar label="Fouls Committed" value={team.losses * 15 + team.draws * 12 + team.wins * 9} max={60} color="linear-gradient(90deg, #F59E0B, #FCD34D)" />
                      <StatBar label="Yellow Cards" value={team.losses * 3 + team.draws * 2 + team.wins * 1} max={12} color="linear-gradient(90deg, #EAB308, #FDE047)" />
                      <StatBar label="Red Cards" value={team.losses > 1 ? 1 : 0} max={3} color="linear-gradient(90deg, #C8102E, #F87171)" />
                      <StatBar label="Offsides" value={team.wins * 5 + team.draws * 3 + 2} max={20} color="linear-gradient(90deg, #64748B, #94A3B8)" />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* TEAM INFO CARD */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 16, padding: 20,
              }}
            >
              <h2 className="section-title" style={{ marginBottom: 16 }}>
                <Users size={16} color="var(--brand-gold)" />
                Team Info
              </h2>
              {[
                { label: 'Squad Size', value: team.squadSize },
                { label: 'Avg Age', value: `${team.avgAge}` },
                { label: 'Confederation', value: team.confederation },
                { label: 'Matches Played', value: team.matchesPlayed },
                { label: 'Goal Difference', value: `${team.goalsFor - team.goalsAgainst >= 0 ? '+' : ''}${team.goalsFor - team.goalsAgainst}` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{value}</span>
                </div>
              ))}
            </motion.div>

            {/* POINTS DISPLAY */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: `linear-gradient(135deg, ${team.primaryColor}40, ${team.primaryColor}15)`,
                border: `1px solid ${team.primaryColor}50`,
                borderRadius: 16, padding: 24, textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: 2 }}>TOURNAMENT POINTS</div>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 80, lineHeight: 1,
                background: 'linear-gradient(135deg, var(--brand-gold), #FF8C00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {team.points}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
                {[
                  { v: team.wins, l: 'W', c: '#4ADE80' },
                  { v: team.draws, l: 'D', c: 'var(--text-secondary)' },
                  { v: team.losses, l: 'L', c: '#F87171' },
                ].map(({ v, l, c }) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: c }}>{v}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
