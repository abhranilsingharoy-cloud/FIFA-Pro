import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Zap } from 'lucide-react';
import { TEAMS } from '../data/teams';
import { MATCHES } from '../data/matches';
import type { Team, Match } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const GROUP_IDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function getTeamsByGroup(groupId: string): Team[] {
  return TEAMS.filter(t => t.groupId === groupId)
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const gdA = a.goalsFor - a.goalsAgainst;
      const gdB = b.goalsFor - b.goalsAgainst;
      if (gdB !== gdA) return gdB - gdA;
      return b.goalsFor - a.goalsFor;
    });
}

function isGroupLive(groupId: string): boolean {
  return MATCHES.some(m => m.groupId === groupId && (m.status === 'live' || m.status === 'ht'));
}

// Derive form from match data
function getTeamForm(countryCode: string): ('W' | 'D' | 'L')[] {
  const results: ('W' | 'D' | 'L')[] = [];
  const relevant = MATCHES.filter(m =>
    m.status === 'completed' &&
    (m.homeTeam.countryCode === countryCode || m.awayTeam.countryCode === countryCode)
  ).sort((a, b) => new Date(b.kickoffUtc).getTime() - new Date(a.kickoffUtc).getTime());

  for (const m of relevant) {
    if (!m.score) continue;
    const isHome = m.homeTeam.countryCode === countryCode;
    const teamScore = isHome ? m.score.home : m.score.away;
    const oppScore = isHome ? m.score.away : m.score.home;
    if (teamScore > oppScore) results.push('W');
    else if (teamScore === oppScore) results.push('D');
    else results.push('L');
    if (results.length === 3) break;
  }
  return results.reverse();
}

// ─── Form Pill ────────────────────────────────────────────────────────────────
function FormPill({ result }: { result: 'W' | 'D' | 'L' }) {
  const colors: Record<string, { bg: string; color: string }> = {
    W: { bg: 'rgba(34,197,94,0.2)', color: '#22C55E' },
    D: { bg: 'rgba(245,158,11,0.2)', color: '#F59E0B' },
    L: { bg: 'rgba(255,59,59,0.2)', color: '#FF3B3B' },
  };
  const c = colors[result];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '20px', height: '20px', borderRadius: '4px',
      background: c.bg, color: c.color,
      fontSize: '11px', fontWeight: 700,
    }}>
      {result}
    </span>
  );
}

// ─── Group Table ──────────────────────────────────────────────────────────────
function GroupTable({ groupId }: { groupId: string }) {
  const teams = getTeamsByGroup(groupId);
  const live = isGroupLive(groupId);

  const rowClass = (rank: number) => {
    if (rank <= 2) return 'qualify-green';
    if (rank === 3) return 'qualify-amber';
    return 'qualify-red';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      {/* Group header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '14px 16px',
        background: 'linear-gradient(135deg, rgba(200,16,46,0.08), rgba(255,215,0,0.04))',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px',
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, var(--brand-gold), var(--brand-red))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Group {groupId}
        </div>
        {live && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div className="live-dot" />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#FF3B3B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live</span>
          </div>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ minWidth: '560px' }}>
          <thead>
            <tr>
              <th style={{ width: '28px', textAlign: 'center' }}>#</th>
              <th>Team</th>
              <th style={{ textAlign: 'center' }}>P</th>
              <th style={{ textAlign: 'center' }}>W</th>
              <th style={{ textAlign: 'center' }}>D</th>
              <th style={{ textAlign: 'center' }}>L</th>
              <th style={{ textAlign: 'center' }}>GF</th>
              <th style={{ textAlign: 'center' }}>GA</th>
              <th style={{ textAlign: 'center' }}>GD</th>
              <th style={{ textAlign: 'center', fontWeight: 700 }}>Pts</th>
              <th style={{ textAlign: 'center' }}>Form</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, i) => {
              const rank = i + 1;
              const gd = team.goalsFor - team.goalsAgainst;
              const form = getTeamForm(team.countryCode);

              return (
                <motion.tr
                  key={team.countryCode}
                  className={rowClass(rank)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: i * 0.05 } }}
                  style={{ cursor: 'default' }}
                >
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>{rank}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={`https://flagcdn.com/32x24/${team.flag}.png`}
                        alt={team.name}
                        style={{ width: 24, height: 18, objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }}
                      />
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{team.name}</span>
                      {rank <= 2 && (
                        <span style={{ fontSize: '10px', padding: '1px 5px', borderRadius: '3px', background: 'rgba(34,197,94,0.15)', color: '#22C55E', fontWeight: 700 }}>Q</span>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>{team.matchesPlayed}</td>
                  <td style={{ textAlign: 'center', color: '#22C55E', fontSize: '13px', fontWeight: 600 }}>{team.wins}</td>
                  <td style={{ textAlign: 'center', color: 'var(--warning-amber)', fontSize: '13px', fontWeight: 600 }}>{team.draws}</td>
                  <td style={{ textAlign: 'center', color: '#FF3B3B', fontSize: '13px', fontWeight: 600 }}>{team.losses}</td>
                  <td style={{ textAlign: 'center', fontSize: '13px' }}>{team.goalsFor}</td>
                  <td style={{ textAlign: 'center', fontSize: '13px' }}>{team.goalsAgainst}</td>
                  <td style={{ textAlign: 'center', fontSize: '13px', color: gd > 0 ? '#22C55E' : gd < 0 ? '#FF3B3B' : 'var(--text-secondary)' }}>
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: 'var(--brand-gold)' }}>{team.points}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '3px', justifyContent: 'center' }}>
                      {form.length > 0 ? form.map((r, j) => <FormPill key={j} result={r} />) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: '14px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#22C55E' }} />
          <span>Advance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#F59E0B' }} />
          <span>Playoff</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#FF3B3B' }} />
          <span>Eliminated</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Bracket Match Box ────────────────────────────────────────────────────────
function BracketMatch({ match, onNavigate }: { match: Match; onNavigate: (id: string) => void }) {
  const isCompleted = match.status === 'completed';

  const teamRow = (team: Match['homeTeam'], score: number | undefined, isWinner: boolean) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '6px 8px', borderRadius: '4px',
      background: isWinner ? 'rgba(34,197,94,0.08)' : 'transparent',
      borderLeft: isWinner ? '2px solid #22C55E' : '2px solid transparent',
    }}>
      <img
        src={`https://flagcdn.com/32x24/${team.countryCode.toLowerCase()}.png`}
        alt={team.name}
        style={{ width: 20, height: 15, objectFit: 'cover', borderRadius: '2px', flexShrink: 0 }}
      />
      <span style={{ flex: 1, fontSize: '12px', fontWeight: isWinner ? 700 : 500, color: isWinner ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {team.name}
      </span>
      {score !== undefined && (
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '16px', color: isWinner ? '#22C55E' : 'var(--text-muted)', fontWeight: 700 }}>
          {score}
        </span>
      )}
      {isWinner && (
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
      )}
    </div>
  );

  const homeWins = match.score ? match.score.home > match.score.away : false;
  const awayWins = match.score ? match.score.away > match.score.home : false;

  return (
    <motion.div
      className="bracket-match"
      whileHover={{ scale: 1.03, boxShadow: '0 0 16px rgba(255,215,0,0.2)' }}
      onClick={() => onNavigate(match.id)}
      style={{ cursor: 'pointer' }}
    >
      {/* Match number */}
      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Match #{match.matchNumber}
      </div>
      {teamRow(match.homeTeam, match.score?.home, homeWins)}
      <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '2px 0' }} />
      {teamRow(match.awayTeam, match.score?.away, awayWins)}
      {!match.score && (
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
          {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(match.kickoffUtc))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Knockout Bracket ─────────────────────────────────────────────────────────
function KnockoutBracket({ onNavigate }: { onNavigate: (id: string) => void }) {
  const qfMatches = MATCHES.filter(m => m.stage === 'qf').sort((a, b) => a.matchNumber - b.matchNumber);
  const sfMatches = MATCHES.filter(m => m.stage === 'sf').sort((a, b) => a.matchNumber - b.matchNumber);
  const finalMatch = MATCHES.find(m => m.stage === 'final');
  const thirdMatch = MATCHES.find(m => m.stage === 'third');

  const roundStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  };

  const roundHeader = (label: string, color: string = 'var(--brand-gold)') => (
    <div style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: '14px',
      letterSpacing: '0.1em',
      color,
      textAlign: 'center',
      padding: '6px 12px',
      background: 'rgba(255,215,0,0.05)',
      border: '1px solid rgba(255,215,0,0.15)',
      borderRadius: '6px',
      marginBottom: '8px',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ overflowX: 'auto', paddingBottom: '16px' }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0',
        minWidth: '900px',
        padding: '24px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
      }}>
        {/* QF column */}
        <div style={{ ...roundStyle, flex: 1 }}>
          {roundHeader('Quarter-Finals', '#60A5FA')}
          {qfMatches.slice(0, 2).map(m => (
            <BracketMatch key={m.id} match={m} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Connector QF→SF left */}
        <svg width="48" height="280" style={{ flexShrink: 0 }}>
          <line x1="0" y1="70" x2="24" y2="70" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="0" y1="210" x2="24" y2="210" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="24" y1="70" x2="24" y2="210" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="24" y1="140" x2="48" y2="140" stroke="var(--border-subtle)" strokeWidth="1.5" />
        </svg>

        {/* SF left column */}
        <div style={{ ...roundStyle, flex: 1 }}>
          {roundHeader('Semi-Finals', '#A78BFA')}
          {sfMatches.slice(0, 1).map(m => (
            <BracketMatch key={m.id} match={m} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Connector SF→Final */}
        <svg width="48" height="180" style={{ flexShrink: 0 }}>
          <line x1="0" y1="50" x2="24" y2="50" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="0" y1="130" x2="24" y2="130" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="24" y1="50" x2="24" y2="130" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="24" y1="90" x2="48" y2="90" stroke="var(--border-subtle)" strokeWidth="1.5" />
        </svg>

        {/* Final */}
        <div style={{ ...roundStyle, flex: 0, minWidth: '200px' }}>
          {roundHeader('🏆 FINAL', 'var(--brand-gold)')}
          {finalMatch && <BracketMatch match={finalMatch} onNavigate={onNavigate} />}
          {thirdMatch && (
            <div style={{ marginTop: '16px' }}>
              {roundHeader('3rd Place', 'var(--text-muted)')}
              <BracketMatch match={thirdMatch} onNavigate={onNavigate} />
            </div>
          )}
        </div>

        {/* Connector Final←SF right */}
        <svg width="48" height="180" style={{ flexShrink: 0, transform: 'scaleX(-1)' }}>
          <line x1="0" y1="50" x2="24" y2="50" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="0" y1="130" x2="24" y2="130" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="24" y1="50" x2="24" y2="130" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="24" y1="90" x2="48" y2="90" stroke="var(--border-subtle)" strokeWidth="1.5" />
        </svg>

        {/* SF right column */}
        <div style={{ ...roundStyle, flex: 1 }}>
          {roundHeader('Semi-Finals', '#A78BFA')}
          {sfMatches.slice(1, 2).map(m => (
            <BracketMatch key={m.id} match={m} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Connector SF←QF right */}
        <svg width="48" height="280" style={{ flexShrink: 0, transform: 'scaleX(-1)' }}>
          <line x1="0" y1="70" x2="24" y2="70" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="0" y1="210" x2="24" y2="210" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="24" y1="70" x2="24" y2="210" stroke="var(--border-subtle)" strokeWidth="1.5" />
          <line x1="24" y1="140" x2="48" y2="140" stroke="var(--border-subtle)" strokeWidth="1.5" />
        </svg>

        {/* QF right column */}
        <div style={{ ...roundStyle, flex: 1 }}>
          {roundHeader('Quarter-Finals', '#60A5FA')}
          {qfMatches.slice(2, 4).map(m => (
            <BracketMatch key={m.id} match={m} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap', paddingLeft: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E' }} />
          <span>Winner / Advances</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div style={{ width: '10px', height: '3px', background: 'var(--border-subtle)' }} />
          <span>Connector lines</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>Click any match box → view details</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Standings Page ──────────────────────────────────────────────────────
export default function Standings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'group' | 'knockout'>('group');
  const [selectedGroup, setSelectedGroup] = useState<string>('A');

  const liveGroups = GROUP_IDS.filter(isGroupLive);
  const currentTeams = getTeamsByGroup(selectedGroup);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--brand-navy)', paddingBottom: '64px' }}>
      {/* ── Hero Header ── */}
      <div className="hero-gradient" style={{ padding: '32px 0 0' }}>
        <div className="page-container" style={{ paddingBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <Trophy size={24} style={{ color: 'var(--brand-gold)' }} />
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '44px', letterSpacing: '0.05em', lineHeight: 1 }}>
                  Standings
                </h1>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                FIFA World Cup 2026™ · 8 Groups · 48 Teams
              </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '8px', padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: 'var(--brand-gold)', lineHeight: 1 }}>{GROUP_IDS.length}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Groups</div>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#22C55E', lineHeight: 1 }}>16</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Advance</div>
              </div>
              {liveGroups.length > 0 && (
                <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.3)', borderRadius: '8px', padding: '10px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div className="live-dot" />
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', color: '#FF3B3B', lineHeight: 1 }}>{liveGroups.length}</div>
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#FF3B3B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Groups</div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border-subtle)' }}>
            {[
              { key: 'group' as const, label: 'Group Stage', icon: <TrendingUp size={14} /> },
              { key: 'knockout' as const, label: 'Knockout Bracket', icon: <Zap size={14} /> },
            ].map(tab => {
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
                    borderBottom: `2px solid ${isActive ? 'var(--brand-gold)' : 'transparent'}`,
                    color: isActive ? 'var(--brand-gold)' : 'var(--text-muted)',
                    fontSize: '14px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: '-1px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="page-container">
        <AnimatePresence mode="wait">
          {activeTab === 'group' ? (
            <motion.div key="group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Group selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '4px' }}>Group</span>
                {GROUP_IDS.map(gid => {
                  const isLive = liveGroups.includes(gid);
                  const isSelected = selectedGroup === gid;
                  return (
                    <button
                      key={gid}
                      onClick={() => setSelectedGroup(gid)}
                      style={{
                        position: 'relative',
                        width: '40px', height: '40px',
                        borderRadius: '8px',
                        border: `1px solid ${isSelected ? 'var(--brand-gold)' : isLive ? 'rgba(255,59,59,0.4)' : 'var(--border-subtle)'}`,
                        background: isSelected ? 'rgba(255,215,0,0.12)' : isLive ? 'rgba(255,59,59,0.08)' : 'var(--surface-elevated)',
                        color: isSelected ? 'var(--brand-gold)' : isLive ? '#FF3B3B' : 'var(--text-secondary)',
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {gid}
                      {isLive && (
                        <div className="live-dot" style={{ position: 'absolute', top: '-3px', right: '-3px', width: '7px', height: '7px' }} />
                      )}
                    </button>
                  );
                })}

                {/* Show All button */}
                <button
                  onClick={() => setSelectedGroup('ALL')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedGroup === 'ALL' ? 'var(--brand-red)' : 'var(--border-subtle)'}`,
                    background: selectedGroup === 'ALL' ? 'rgba(200,16,46,0.12)' : 'var(--surface-elevated)',
                    color: selectedGroup === 'ALL' ? 'var(--brand-red)' : 'var(--text-muted)',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  All Groups
                </button>
              </div>

              {/* Group Table(s) */}
              {selectedGroup === 'ALL' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(560px, 1fr))', gap: '20px' }}>
                  {GROUP_IDS.map(gid => <GroupTable key={gid} groupId={gid} />)}
                </div>
              ) : (
                <GroupTable groupId={selectedGroup} />
              )}

              {/* Points info */}
              <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.1)', borderRadius: '8px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Win', pts: 3, color: '#22C55E' },
                  { label: 'Draw', pts: 1, color: '#F59E0B' },
                  { label: 'Loss', pts: 0, color: '#FF3B3B' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                    <span style={{ color: r.color, fontWeight: 700 }}>{r.pts} pts</span>
                    <span style={{ color: 'var(--text-muted)' }}>per {r.label}</span>
                  </div>
                ))}
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>· Tiebreakers: GD → GF → Head-to-Head</span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="knockout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '0.04em', marginBottom: '4px' }}>
                  Knockout Bracket
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>QF → SF → Final · Click any match to view details</p>
              </div>
              <KnockoutBracket onNavigate={(id) => navigate(`/matches/${id}`)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
