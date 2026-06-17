import { useTournamentStore } from '../store/tournamentStore';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PRIZE_POOL_TOTAL, PRIZE_BREAKDOWN, HISTORICAL_PRIZE_POOLS } from '../data/prizes';

import CountryFlag from '../components/ui/CountryFlag';
import { Trophy, Target, Calendar } from 'lucide-react';

export default function Prizes() {
  const { matches, players, teams } = useTournamentStore();

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#C8102E', '#FFFFFF']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#C8102E', '#FFFFFF']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const formatMoney = (val: number) => `$${(val / 1000000).toFixed(0)}M`;

  return (
    <div className="page-container">
      {/* Hero Section */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'linear-gradient(135deg, rgba(200,16,46,0.1), rgba(255,215,0,0.1))',
          borderRadius: 20, padding: '60px 24px', textAlign: 'center', marginBottom: 40,
          border: '1px solid rgba(255,215,0,0.3)', position: 'relative', overflow: 'hidden'
        }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 0%, rgba(255,215,0,0.15), transparent 70%)', pointerEvents: 'none' }} />
        <Trophy size={48} color="#FFD700" style={{ margin: '0 auto 16px', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))' }} />
        <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(60px, 10vw, 120px)', color: '#FFD700', margin: 0, lineHeight: 1, letterSpacing: '0.02em', textShadow: '0 4px 20px rgba(255,215,0,0.3)' }}>
          $<CountUp end={PRIZE_POOL_TOTAL} duration={2.5} separator="," />
        </h1>
        <p style={{ color: 'white', fontSize: 20, marginTop: 16, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Total FIFA WC2026 Prize Pool
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 40 }}>
        {/* Prize Breakdown Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={20} color="var(--brand-gold)" /> Prize Per Stage
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRIZE_BREAKDOWN} layout="vertical" margin={{ left: 50, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--text-muted)" tickFormatter={formatMoney} />
                <YAxis dataKey="stage" type="category" stroke="var(--text-muted)" />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--surface-elevated)', border: 'none', borderRadius: 8 }} formatter={(v: any) => `$${(Number(v)/1000000).toFixed(1)}M`} />
                <Bar dataKey="perTeam" fill="var(--brand-gold)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Historical Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={20} color="var(--info-blue)" /> Historical Prize Pools
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_PRIZE_POOLS} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" tickFormatter={formatMoney} />
                <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: 'none', borderRadius: 8 }} formatter={(v: any) => `$${(Number(v)/1000000).toFixed(0)}M`} />
                <Line type="monotone" dataKey="pool" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: 'var(--surface-card)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Prize Breakdown Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ background: 'var(--surface-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden', marginBottom: 40 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h3 style={{ margin: 0 }}>Payout Structure</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Tournament Stage</th>
                <th>Teams</th>
                <th>Prize Per Team</th>
                <th>Total Payout</th>
              </tr>
            </thead>
            <tbody>
              {PRIZE_BREAKDOWN.map((row, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{row.stage}</td>
                  <td>{row.teamsEliminated.length}</td>
                  <td style={{ color: 'var(--success-green)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                    ${(row.prizeUSD / 1000000).toFixed(1)}M
                  </td>
                  <td style={{ color: 'var(--brand-gold)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
                    ${((row.prizeUSD * row.teamsEliminated.length) / 1000000).toFixed(1)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Live Prize Tracker placeholder */}
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ marginBottom: 20 }}>Live Team Earnings</h3>
        <p style={{ color: 'var(--text-muted)' }}>All 48 teams are guaranteed a minimum of $37M for participating in the group stage.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginTop: 24 }}>
          {teams.slice(0, 12).map(team => (
            <div key={team.countryCode} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--surface-elevated)', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CountryFlag countryCode={team.countryCode} size="sm" />
                <span style={{ fontWeight: 600 }}>{team.name}</span>
              </div>
              <span style={{ color: 'var(--success-green)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>$37M</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px', background: 'transparent', border: '1px dashed var(--border-subtle)', borderRadius: 8, color: 'var(--text-muted)' }}>
            +36 more teams
          </div>
        </div>
      </motion.div>
    </div>
  );
}
