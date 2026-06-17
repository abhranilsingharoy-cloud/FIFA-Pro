import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTournamentStore } from '../store/tournamentStore';
import CountryFlag from '../components/ui/CountryFlag';

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

function GroupTable({ groupLetter }: { groupLetter: string }) {
  const teams = useTournamentStore(s => s.teams).filter(t => t.groupId === groupLetter).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div style={{ background: 'var(--surface-card)', borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden', marginBottom: 24 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-elevated)' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'var(--brand-gold)' }}>GROUP {groupLetter}</span>
        </h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}>Pos</th>
              <th style={{ minWidth: 200 }}>Team</th>
              <th>P</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th>GF</th>
              <th>GA</th>
              <th>GD</th>
              <th style={{ color: 'white' }}>Pts</th>
              <th>Form</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => {
              const qualify = index < 2;
              const gd = team.goalsFor - team.goalsAgainst;
              return (
                <tr key={team.countryCode}>
                  <td style={{ 
                    borderLeft: qualify ? '3px solid var(--success-green)' : index === 2 ? '3px solid var(--warning-amber)' : '3px solid transparent',
                    color: 'var(--text-muted)' 
                  }}>
                    {index + 1}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CountryFlag countryCode={team.countryCode} size="sm" />
                      <span style={{ fontWeight: 600 }}>{team.name}</span>
                    </div>
                  </td>
                  <td>{team.matchesPlayed}</td>
                  <td>{team.wins}</td>
                  <td>{team.draws}</td>
                  <td>{team.losses}</td>
                  <td>{team.goalsFor}</td>
                  <td>{team.goalsAgainst}</td>
                  <td style={{ color: gd > 0 ? 'var(--success-green)' : gd < 0 ? 'var(--live-red)' : 'var(--text-muted)' }}>
                    {gd > 0 ? `+${gd}` : gd}
                  </td>
                  <td style={{ fontWeight: 800, color: 'white', fontSize: 16 }}>{team.points}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {['W', 'D', 'W'].map((f, i) => (
                        <span key={i} style={{
                          width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, color: 'white',
                          background: f === 'W' ? 'var(--success-green)' : f === 'D' ? 'var(--warning-amber)' : 'var(--live-red)'
                        }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Standings() {
  const [tab, setTab] = useState<'groups' | 'knockout'>('groups');
  const [activeGroup, setActiveGroup] = useState('A');

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 className="section-title">Tournament Standings</h1>
        <div className="tab-bar" style={{ display: 'inline-flex', marginTop: 16 }}>
          <button className={`tab-btn ${tab === 'groups' ? 'active' : ''}`} onClick={() => setTab('groups')}>Group Stage</button>
          <button className={`tab-btn ${tab === 'knockout' ? 'active' : ''}`} onClick={() => setTab('knockout')}>Knockout Bracket</button>
        </div>
      </motion.div>

      {tab === 'groups' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16, marginBottom: 16 }}>
            {GROUPS.map(g => (
              <button key={g} onClick={() => setActiveGroup(g)}
                style={{
                  padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', border: 'none',
                  background: activeGroup === g ? 'var(--brand-red)' : 'var(--surface-elevated)',
                  color: activeGroup === g ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}>
                Group {g}
              </button>
            ))}
          </div>
          <motion.div key={activeGroup} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <GroupTable groupLetter={activeGroup} />
          </motion.div>
        </motion.div>
      )}

      {tab === 'knockout' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: 40, textAlign: 'center', background: 'var(--surface-card)', borderRadius: 16, border: '1px solid var(--border-subtle)' }}>
          <h2 style={{ color: 'var(--text-muted)' }}>Knockout Bracket Generation...</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Bracket will be fully populated once group stages are complete.</p>
        </motion.div>
      )}
    </div>
  );
}
