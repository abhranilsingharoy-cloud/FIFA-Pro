import { useTournamentStore } from '../store/tournamentStore';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Grid, List, Crown } from 'lucide-react';

import CountryFlag from '../components/ui/CountryFlag';
import RatingBadge from '../components/ui/RatingBadge';

const POSITIONS = ['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const;
const SORT_OPTIONS = [
  { value: 'goals', label: 'Goals' },
  { value: 'assists', label: 'Assists' },
  { value: 'avgRating', label: 'Rating' },
  { value: 'minutesPlayed', label: 'Minutes' },
  { value: 'shotsOnTarget', label: 'Shots' },
];

function PlayerAvatar({ name, isLegend, color }: { name: string; isLegend?: boolean; color?: string }) {
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      background: isLegend
        ? `linear-gradient(135deg, ${color || '#C8102E'}, #FFD700)`
        : 'linear-gradient(135deg, #2D3651, #3D4F6E)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Bebas Neue, sans-serif', fontSize: 20,
      color: 'white', flexShrink: 0, position: 'relative',
      boxShadow: isLegend ? `0 0 16px ${color || '#FFD700'}60` : 'none',
    }}>
      {initials}
      {isLegend && (
        <span style={{ position: 'absolute', top: -6, right: -6 }}>
          <Crown size={14} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 4px #FFD700)' }} />
        </span>
      )}
    </div>
  );
}

const posColors: Record<string, string> = {
  GK: '#FFD700', DEF: '#60A5FA', MID: '#4ADE80', FWD: '#F87171',
};
const posBg: Record<string, string> = {
  GK: 'rgba(255,215,0,0.15)', DEF: 'rgba(96,165,250,0.15)', MID: 'rgba(74,222,128,0.15)', FWD: 'rgba(248,113,113,0.15)',
};

import type { Player } from '../types';

function PlayerGridCard({ player }: { player: Player & { isLegend?: boolean } }) {
  const navigate = useNavigate();
  const legendColors: Record<string, string> = {
    ronaldo: '#C8102E', messi: '#74ACDF', neymar: '#009C3B', yamal: '#AA151B',
    mbappe: '#002395', modric: '#FF0000', neuer: '#333', kane: '#CF0920',
    hakimi: '#C1272D', haaland: '#EF2B2D',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, borderColor: player.isLegend ? 'rgba(255,215,0,0.6)' : 'rgba(255,215,0,0.3)' }}
      onClick={() => navigate(`/players/${player.id}`)}
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${player.isLegend ? 'rgba(255,215,0,0.25)' : 'var(--border-subtle)'}`,
        borderRadius: 12, padding: '16px', cursor: 'pointer',
        transition: 'border-color 0.2s',
        boxShadow: player.isLegend ? '0 0 20px rgba(255,215,0,0.08)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <PlayerAvatar name={player.name} isLegend={player.isLegend} color={legendColors[player.id]} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {player.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CountryFlag countryCode={player.countryCode} size="sm" />
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
              background: posBg[player.position], color: posColors[player.position],
            }}>{player.position}</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {player.clubName}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'Goals', value: player.tournamentStats.goals },
          { label: 'Assists', value: player.tournamentStats.assists },
          { label: 'Rating', value: player.tournamentStats.avgRating.toFixed(1) },
          { label: 'Mins', value: player.tournamentStats.minutesPlayed },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: 'var(--surface-elevated)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 15, color: 'white' }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Players() {
  const { matches, players, teams } = useTournamentStore();

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState('goals');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = useMemo(() => {
    let list = [...players];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (position !== 'ALL') list = list.filter(p => p.position === position);
    list.sort((a, b) => {
      const aVal = (a.tournamentStats as any)[sortBy] ?? 0;
      const bVal = (b.tournamentStats as any)[sortBy] ?? 0;
      return bVal - aVal;
    });
    return list;
  }, [search, position, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 className="section-title" style={{ marginBottom: 6 }}>Player Database</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          {filtered.length} players • WC2026 Tournament
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}
        style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="input"
            placeholder="Search players..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: 38 }}
          />
        </div>

        {/* Position filter */}
        <div className="tab-bar" style={{ padding: 3, gap: 2 }}>
          {POSITIONS.map(pos => (
            <button key={pos} className={`tab-btn ${position === pos ? 'active' : ''}`}
              onClick={() => { setPosition(pos); setPage(1); }}
              style={{ padding: '6px 12px', fontSize: 12 }}>
              {pos}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ width: 'auto', minWidth: 130 }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
        </select>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setViewMode('grid')} className={`btn-ghost ${viewMode === 'grid' ? 'active' : ''}`}
            style={{ padding: '8px 12px' }}><Grid size={16} /></button>
          <button onClick={() => setViewMode('table')} className={`btn-ghost ${viewMode === 'table' ? 'active' : ''}`}
            style={{ padding: '8px 12px' }}><List size={16} /></button>
        </div>
      </motion.div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
          {paginated.map((player, i) => (
            <motion.div key={player.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.03 } }}>
              <PlayerGridCard player={player} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'var(--surface-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>Pos</th>
                  <th>Club</th>
                  <th>G</th>
                  <th>A</th>
                  <th>xG</th>
                  <th>Pass%</th>
                  <th>Rating</th>
                  <th>Mins</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p, i) => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/players/${p.id}`)}>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                      {(page - 1) * PER_PAGE + i + 1}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {p.isLegend && <Crown size={12} style={{ color: '#FFD700' }} />}
                        <CountryFlag countryCode={p.countryCode} size="sm" />
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: posBg[p.position], color: posColors[p.position] }}>{p.position}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{p.clubName}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#4ADE80' }}>{p.tournamentStats.goals}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#60A5FA' }}>{p.tournamentStats.assists}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{p.tournamentStats.xG.toFixed(1)}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{p.tournamentStats.passCompletionPct}%</td>
                    <td><RatingBadge rating={p.tournamentStats.avgRating} size="sm" /></td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>{p.tournamentStats.minutesPlayed}'</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <button className="btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--text-secondary)' }}>
            {page} / {totalPages}
          </span>
          <button className="btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}
