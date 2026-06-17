import { useTournamentStore } from '../store/tournamentStore';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, Users, ChevronUp, ChevronDown, Shield } from 'lucide-react';

import type { Team, Confederation } from '../types';

type SortKey = 'ranking' | 'goals' | 'points' | 'alpha';

const CONFEDERATIONS: (Confederation | 'ALL')[] = ['ALL', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC'];

const CONFEDERATION_COLORS: Record<string, string> = {
  UEFA: '#003087',
  CONMEBOL: '#006341',
  CONCACAF: '#1E4A8A',
  CAF: '#D4AF37',
  AFC: '#C8102E',
  OFC: '#5B2C6F',
};

const GROUP_COLORS: Record<string, string> = {
  A: '#C8102E', B: '#FF6B35', C: '#FFD700', D: '#00B4D8',
  E: '#06D6A0', F: '#845EC2', G: '#FF9671', H: '#00C9A7',
};

function getGoalBarWidth(goals: number, maxGoals: number): number {
  return maxGoals > 0 ? (goals / maxGoals) * 100 : 0;
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

// De-duplicate teams by countryCode (some appear in multiple groups in data)
function dedupeTeams(teams: Team[]): Team[] {
  const seen = new Set<string>();
  return teams.filter(t => {
    if (seen.has(t.countryCode)) return false;
    seen.add(t.countryCode);
    return true;
  });
}

export default function Teams() {
  const { matches, players, teams } = useTournamentStore();

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [confederation, setConfederation] = useState<Confederation | 'ALL'>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('points');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const allTeams = useMemo(() => dedupeTeams(teams), []);

  const maxGoalsFor = useMemo(() => Math.max(...allTeams.map(t => t.goalsFor), 1), [allTeams]);
  const maxGoalsAgainst = useMemo(() => Math.max(...allTeams.map(t => t.goalsAgainst), 1), [allTeams]);

  const filtered = useMemo(() => {
    let list = [...allTeams];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.manager.toLowerCase().includes(q));
    }
    if (confederation !== 'ALL') {
      list = list.filter(t => t.confederation === confederation);
    }
    list.sort((a, b) => {
      let diff = 0;
      if (sortKey === 'ranking') diff = a.fifaRanking - b.fifaRanking;
      else if (sortKey === 'goals') diff = a.goalsFor - b.goalsFor;
      else if (sortKey === 'points') diff = a.points - b.points;
      else diff = a.name.localeCompare(b.name);
      return sortDir === 'asc' ? diff : -diff;
    });
    return list;
  }, [allTeams, search, confederation, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'alpha' ? 'asc' : 'desc'); }
  }

  const SortIcon = ({ k }: { k: SortKey }) => (
    sortKey === k
      ? sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
      : null
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-navy)' }}>
      {/* PAGE HEADER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0A0F1E 0%, #0D1829 50%, #120A18 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '32px 24px 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute', top: -80, right: -80, width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(200,16,46,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--brand-red), #8B0000)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(200,16,46,0.4)',
            }}>
              <Shield size={24} color="white" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, lineHeight: 1, letterSpacing: 2 }}>
                NATIONS
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {allTeams.length} nations competing at FIFA World Cup 2026™
              </p>
            </div>
          </motion.div>

          {/* CONFEDERATION TABS */}
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 0 }}>
            {CONFEDERATIONS.map(conf => (
              <button
                key={conf}
                onClick={() => setConfederation(conf)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px 8px 0 0',
                  border: 'none',
                  background: confederation === conf ? 'var(--surface-card)' : 'transparent',
                  color: confederation === conf ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: 'pointer',
                  letterSpacing: 0.5,
                  borderBottom: confederation === conf ? '2px solid var(--brand-gold)' : '2px solid transparent',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {conf === 'ALL' ? '🌍 ALL' : conf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 24px 48px' }}>
        {/* SEARCH + SORT BAR */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28,
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 220 }}>
            <Search size={16} style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }} />
            <input
              className="input"
              placeholder="Search nation or manager..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['ranking', 'goals', 'points', 'alpha'] as SortKey[]).map(k => (
              <button
                key={k}
                onClick={() => toggleSort(k)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: `1px solid ${sortKey === k ? 'var(--brand-gold)' : 'var(--border-subtle)'}`,
                  background: sortKey === k ? 'rgba(255,215,0,0.1)' : 'var(--surface-card)',
                  color: sortKey === k ? 'var(--brand-gold)' : 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: 0.5,
                  transition: 'all 0.2s',
                }}
              >
                {k === 'ranking' ? 'FIFA Rank' : k === 'alpha' ? 'A–Z' : k.charAt(0).toUpperCase() + k.slice(1)}
                <SortIcon k={k} />
              </button>
            ))}
          </div>
          <div style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--text-muted)', fontSize: 13,
          }}>
            <Users size={14} />
            <span>{filtered.length} nations</span>
          </div>
        </motion.div>

        {/* GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${confederation}-${search}-${sortKey}-${sortDir}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 18,
            }}
          >
            {filtered.map(team => (
              <TeamCard
                key={team.countryCode}
                team={team}
                maxGoalsFor={maxGoalsFor}
                maxGoalsAgainst={maxGoalsAgainst}
                onClick={() => navigate(`/teams/${team.countryCode.toLowerCase()}`)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}
          >
            <Shield size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p style={{ fontSize: 18, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2 }}>
              NO NATIONS FOUND
            </p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Try a different search or filter</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ── TEAM CARD ─────────────────────────────────────────────────────── */
function TeamCard({
  team, maxGoalsFor, maxGoalsAgainst, onClick,
}: {
  team: Team;
  maxGoalsFor: number;
  maxGoalsAgainst: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const confColor = CONFEDERATION_COLORS[team.confederation] ?? '#444';
  const groupColor = GROUP_COLORS[team.groupId] ?? '#888';
  const flagCode = team.flag || team.countryCode.toLowerCase();

  return (
    <motion.div
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${hovered ? 'rgba(255,215,0,0.4)' : 'var(--border-subtle)'}`,
        borderRadius: 16,
        padding: '20px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? '0 12px 40px rgba(255,215,0,0.15), 0 4px 20px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow using team color */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 200, height: 200,
        background: `radial-gradient(circle, ${team.primaryColor}18 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'opacity 0.3s',
        opacity: hovered ? 1 : 0.5,
      }} />

      {/* TOP ROW: Flag + Name + Ranking */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14, position: 'relative' }}>
        <div style={{
          borderRadius: 10,
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.1)',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <img
            src={`https://flagcdn.com/48x36/${flagCode}.png`}
            alt={team.name}
            style={{ display: 'block', width: 64, height: 48, objectFit: 'cover' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1, lineHeight: 1.1 }}>
            {team.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
            {/* FIFA ranking badge */}
            <span style={{
              background: 'rgba(255,215,0,0.15)',
              border: '1px solid rgba(255,215,0,0.3)',
              color: 'var(--brand-gold)',
              fontSize: 10, fontWeight: 700,
              padding: '2px 7px', borderRadius: 4, letterSpacing: 0.5,
            }}>
              #{team.fifaRanking}
            </span>
            {/* Group badge */}
            <span style={{
              background: `${groupColor}25`,
              border: `1px solid ${groupColor}60`,
              color: groupColor,
              fontSize: 10, fontWeight: 700,
              padding: '2px 7px', borderRadius: 4, letterSpacing: 0.5,
            }}>
              GROUP {team.groupId}
            </span>
          </div>
        </div>
        {/* Confederation badge top-right */}
        <div style={{
          flexShrink: 0,
          background: `${confColor}25`,
          border: `1px solid ${confColor}50`,
          color: 'var(--text-secondary)',
          fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
          padding: '3px 6px', borderRadius: 4,
        }}>
          {team.confederation}
        </div>
      </div>

      {/* MANAGER */}
      <div style={{
        fontSize: 12, color: 'var(--text-muted)',
        marginBottom: 14,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ fontSize: 10 }}>👔</span>
        <span>{team.manager}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>· {team.managerNationality}</span>
      </div>

      {/* W/D/L RECORD */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <span style={{
          background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
          color: '#4ADE80', fontSize: 12, fontWeight: 700,
          padding: '4px 10px', borderRadius: 6, flex: 1, textAlign: 'center',
        }}>
          W{team.wins}
        </span>
        <span style={{
          background: 'rgba(100,100,100,0.2)', border: '1px solid rgba(160,170,191,0.2)',
          color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700,
          padding: '4px 10px', borderRadius: 6, flex: 1, textAlign: 'center',
        }}>
          D{team.draws}
        </span>
        <span style={{
          background: 'rgba(200,16,46,0.15)', border: '1px solid rgba(200,16,46,0.3)',
          color: '#F87171', fontSize: 12, fontWeight: 700,
          padding: '4px 10px', borderRadius: 6, flex: 1, textAlign: 'center',
        }}>
          L{team.losses}
        </span>
      </div>

      {/* GOALS BARS */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Goals For</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80', fontFamily: "'JetBrains Mono', monospace" }}>
            {team.goalsFor}
          </span>
        </div>
        <div style={{
          height: 5, background: 'var(--surface-elevated)', borderRadius: 3, overflow: 'hidden', marginBottom: 6,
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getGoalBarWidth(team.goalsFor, maxGoalsFor)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #22C55E, #4ADE80)', borderRadius: 3 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Goals Against</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#F87171', fontFamily: "'JetBrains Mono', monospace" }}>
            {team.goalsAgainst}
          </span>
        </div>
        <div style={{
          height: 5, background: 'var(--surface-elevated)', borderRadius: 3, overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getGoalBarWidth(team.goalsAgainst, maxGoalsAgainst)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #C8102E, #F87171)', borderRadius: 3 }}
          />
        </div>
      </div>

      {/* DIVIDER */}
      <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 12 }} />

      {/* POINTS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>POINTS</div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 40, lineHeight: 1,
            background: 'linear-gradient(135deg, var(--brand-gold), #FF8C00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {team.points}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>GD</div>
          <div style={{
            fontSize: 20, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            color: team.goalsFor - team.goalsAgainst >= 0 ? '#4ADE80' : '#F87171',
          }}>
            {team.goalsFor - team.goalsAgainst >= 0 ? '+' : ''}{team.goalsFor - team.goalsAgainst}
          </div>
        </div>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: hovered ? 'var(--brand-gold)' : 'var(--text-muted)',
          transition: 'background 0.2s',
        }} />
      </div>

      {/* Hover arrow indicator */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.2 }}
        style={{
          position: 'absolute', bottom: 20, right: 20,
          color: 'var(--brand-gold)', fontSize: 18,
        }}
      >
        →
      </motion.div>
    </motion.div>
  );
}
