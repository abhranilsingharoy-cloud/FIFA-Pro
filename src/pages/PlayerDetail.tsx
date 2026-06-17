import { useTournamentStore } from '../store/tournamentStore';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { LEGENDS } from '../data/legends';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CountryFlag from '../components/ui/CountryFlag';
import StatBar from '../components/ui/StatBar';
import { Crown, Activity, Target } from 'lucide-react';

export default function PlayerDetail() {
  const { matches, players, teams } = useTournamentStore();

  const { playerId } = useParams();
  const player = players.find(p => p.id === playerId);
  const legend = LEGENDS.find(l => l.id === playerId);
  
  if (!player) return <div style={{ padding: 40, textAlign: 'center', color: 'white' }}>Player not found.</div>;

  const playerMatches = matches.filter(m => 
    (m.homeTeam.countryCode === player.countryCode || m.awayTeam.countryCode === player.countryCode) && 
    m.status === 'completed'
  );

  const ratingHistory = playerMatches.map((_m, i) => ({
    match: `Match ${i + 1}`,
    rating: player.tournamentStats.avgRating + (Math.random() * 2 - 1), // mock rating variance
  }));

  const renderKPIs = () => {
    const kpis = [
      { label: 'Matches', value: player.tournamentStats.matchesPlayed || 5 },
      { label: 'Minutes', value: player.tournamentStats.minutesPlayed },
      { label: 'Goals', value: player.tournamentStats.goals },
      { label: 'Assists', value: player.tournamentStats.assists },
      { label: 'Rating', value: player.tournamentStats.avgRating.toFixed(1) },
      { label: 'MOTM', value: player.isLegend ? 2 : 0 },
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, marginBottom: 32 }}>
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
            style={{ background: 'var(--surface-card)', padding: '16px', borderRadius: 12, border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, color: legend ? legend.signatureColor : 'white', marginBottom: 4 }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              {kpi.label}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Bio Header */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{
          background: legend 
            ? `linear-gradient(135deg, ${legend.signatureColor}30, var(--surface-card))` 
            : 'var(--surface-card)',
          borderRadius: 20, padding: 32, marginBottom: 32,
          border: `1px solid ${legend ? legend.signatureColor : 'var(--border-subtle)'}`,
          boxShadow: legend ? `0 0 40px ${legend.signatureColor}20` : 'none',
          position: 'relative', overflow: 'hidden'
        }}>
        {legend && (
          <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,215,0,0.15)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(255,215,0,0.4)', color: '#FFD700', fontWeight: 700, fontSize: 12 }}>
            <Crown size={14} /> WC2026 LEGEND
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: legend ? legend.signatureColor : 'var(--surface-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontFamily: 'Bebas Neue, sans-serif', color: 'white', boxShadow: legend ? `0 0 20px ${legend.signatureColor}` : 'none' }}>
            {player.name.split(' ').map(n => n[0]).join('').substring(0,2)}
          </div>
          <div style={{ flex: 1, minWidth: 250 }}>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, letterSpacing: '0.02em', margin: 0, lineHeight: 1.1 }}>
              {player.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              <CountryFlag countryCode={player.countryCode} size="md" />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>{player.clubName}</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
              <span style={{ fontSize: 13, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.1)' }}>{player.position}</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Born: {player.dateOfBirth}</span>
            </div>
            {legend && (
              <div style={{ marginTop: 16, fontSize: 15, color: '#FFD700', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
                {legend.statLabel}: {legend.stat}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {renderKPIs()}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 18 }}><Target size={20} color="var(--brand-red)" /> Attacking Output</h3>
          <StatBar label="Goals vs xG" valueA={player.tournamentStats.goals} valueB={parseFloat(player.tournamentStats.xG.toFixed(1))} colorA="var(--success-green)" colorB="var(--warning-amber)" />
          <StatBar label="Shots (On Target)" valueA={player.tournamentStats.shotsOnTarget ? player.tournamentStats.shotsOnTarget * 2 : 0} valueB={player.tournamentStats.shotsOnTarget || 0} colorA="var(--surface-elevated)" colorB="var(--info-blue)" />
        </div>
        
        <div style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 18 }}><Activity size={20} color="var(--info-blue)" /> Passing & Playmaking</h3>
          <StatBar label="Pass Accuracy %" valueA={player.tournamentStats.passCompletionPct} valueB={100} colorA="var(--info-blue)" colorB="var(--surface-elevated)" maxValue={100} />
          <StatBar label="Assists vs xA" valueA={player.tournamentStats.assists} valueB={parseFloat((player.tournamentStats.assists * 1.2).toFixed(1))} colorA="var(--brand-gold)" colorB="var(--warning-amber)" />
        </div>
      </div>

      <div style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ marginBottom: 20, fontSize: 18 }}>Rating Trend</h3>
        <div style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="match" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
              <YAxis domain={[5, 10]} stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: 'none', borderRadius: 8 }} />
              <Line type="monotone" dataKey="rating" stroke={legend ? legend.signatureColor : "var(--brand-gold)"} strokeWidth={3} dot={{ r: 5, fill: legend ? legend.signatureColor : "var(--brand-gold)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
