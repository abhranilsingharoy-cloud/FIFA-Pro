import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Swords, Info } from 'lucide-react';
import { useTournamentStore } from '../store/tournamentStore';

function flagUrl(code: string, size: '48x36' | '84x64' = '48x36') {
  return `https://flagcdn.com/${size}/${code.toLowerCase()}.png`;
}

export default function Compare() {
  const { teams } = useTournamentStore();
  
  // Default to first two teams if available
  const [teamAId, setTeamAId] = useState<string>(teams[0]?.countryCode || '');
  const [teamBId, setTeamBId] = useState<string>(teams[1]?.countryCode || '');

  const teamA = teams.find(t => t.countryCode === teamAId);
  const teamB = teams.find(t => t.countryCode === teamBId);

  // Generate normalized radar data based on team stats + fifa ranking
  const radarData = useMemo(() => {
    if (!teamA || !teamB) return [];

    const normalize = (val: number, max: number) => Math.min(100, Math.max(0, (val / max) * 100));

    // Synthetic metric generation based on real data for a beautiful radar chart
    // If tournament hasn't started (matchesPlayed = 0), we use FIFA ranking as a proxy for stats
    const getMetrics = (team: typeof teamA) => {
      const basePower = 100 - (team.fifaRanking || 50); // Rank 1 = 99 power, Rank 100 = 0 power
      
      let attack = team.matchesPlayed ? normalize(team.goalsFor / team.matchesPlayed, 3) : normalize(basePower + 10, 100);
      let defense = team.matchesPlayed ? normalize(3 - (team.goalsAgainst / team.matchesPlayed), 3) : normalize(basePower + 5, 100);
      let form = team.matchesPlayed ? normalize((team.wins * 3 + team.draws) / (team.matchesPlayed * 3), 1) : normalize(basePower, 100);
      let discipline = normalize(100 - ((team.fifaRanking % 5) * 10), 100); // Mock discipline
      let experience = normalize(team.avgAge, 32); // Max age 32

      return { attack, defense, form, discipline, experience };
    };

    const metricsA = getMetrics(teamA);
    const metricsB = getMetrics(teamB);

    return [
      { subject: 'Attack', A: Math.round(metricsA.attack), B: Math.round(metricsB.attack), fullMark: 100 },
      { subject: 'Defense', A: Math.round(metricsA.defense), B: Math.round(metricsB.defense), fullMark: 100 },
      { subject: 'Form', A: Math.round(metricsA.form), B: Math.round(metricsB.form), fullMark: 100 },
      { subject: 'Discipline', A: Math.round(metricsA.discipline), B: Math.round(metricsB.discipline), fullMark: 100 },
      { subject: 'Experience', A: Math.round(metricsA.experience), B: Math.round(metricsB.experience), fullMark: 100 },
    ];
  }, [teamA, teamB]);

  return (
    <div className="page-container">
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-gradient"
        style={{
          borderRadius: 20, padding: '40px 40px', marginBottom: 28,
          position: 'relative', overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span className="badge badge-gold">Analytics</span>
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, lineHeight: 1, marginBottom: 8, color: 'white' }}>
            Head-to-Head <span className="gradient-text">Comparison</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500 }}>
            Select two teams to compare their tactical profiles, recent form, and historical World Cup statistics using advanced radar analytics.
          </p>
        </div>
        <Swords size={120} style={{ color: 'rgba(255,215,0,0.1)', position: 'absolute', right: 40 }} />
      </motion.div>

      {/* ─── SELECTORS ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center', marginBottom: 32 }}>
        {/* Team A Selector */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, background: 'linear-gradient(135deg, rgba(200,16,46,0.05), transparent)' }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Team A</label>
          <select 
            value={teamAId} 
            onChange={(e) => setTeamAId(e.target.value)}
            style={{ 
              width: '100%', padding: '12px 16px', borderRadius: 8, 
              background: 'var(--surface-dark)', color: 'white', border: '1px solid var(--border-subtle)',
              fontSize: 16, outline: 'none'
            }}
          >
            {teams.map(t => <option key={`a-${t.countryCode}`} value={t.countryCode}>{t.name}</option>)}
          </select>
          {teamA && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
              <img src={flagUrl(teamA.countryCode, '84x64')} alt={teamA.name} style={{ width: 64, height: 48, borderRadius: 6, objectFit: 'cover', border: '2px solid var(--border-subtle)' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>{teamA.name}</div>
                <div style={{ fontSize: 13, color: 'var(--brand-red)' }}>FIFA Rank: #{teamA.fifaRanking || 'N/A'}</div>
              </div>
            </div>
          )}
        </div>

        {/* VS Badge */}
        <div style={{ 
          width: 60, height: 60, borderRadius: '50%', background: 'var(--surface-elevated)', 
          border: '2px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: 24, color: 'var(--brand-gold)', boxShadow: '0 0 20px rgba(255,215,0,0.2)'
        }}>
          VS
        </div>

        {/* Team B Selector */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16, background: 'linear-gradient(135deg, transparent, rgba(59,130,246,0.05))' }}>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Select Team B</label>
          <select 
            value={teamBId} 
            onChange={(e) => setTeamBId(e.target.value)}
            style={{ 
              width: '100%', padding: '12px 16px', borderRadius: 8, 
              background: 'var(--surface-dark)', color: 'white', border: '1px solid var(--border-subtle)',
              fontSize: 16, outline: 'none', textAlign: 'right'
            }}
          >
            {teams.map(t => <option key={`b-${t.countryCode}`} value={t.countryCode}>{t.name}</option>)}
          </select>
          {teamB && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, marginTop: 8 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>{teamB.name}</div>
                <div style={{ fontSize: 13, color: 'var(--info-blue)' }}>FIFA Rank: #{teamB.fifaRanking || 'N/A'}</div>
              </div>
              <img src={flagUrl(teamB.countryCode, '84x64')} alt={teamB.name} style={{ width: 64, height: 48, borderRadius: 6, objectFit: 'cover', border: '2px solid var(--border-subtle)' }} />
            </div>
          )}
        </div>
      </div>

      {/* ─── RADAR CHART ───────────────────────────────────────────────── */}
      <div className="card" style={{ padding: '40px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12 }}>
          <Info size={14} /> Data normalized to 100-point scale
        </div>
        
        <div style={{ height: 500, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="var(--border-subtle)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 14, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <Radar
                name={teamA?.name}
                dataKey="A"
                stroke="var(--brand-red)"
                fill="var(--brand-red)"
                fillOpacity={0.5}
              />
              <Radar
                name={teamB?.name}
                dataKey="B"
                stroke="var(--info-blue)"
                fill="var(--info-blue)"
                fillOpacity={0.5}
              />
              <Tooltip 
                contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'white' }}
                itemStyle={{ fontWeight: 700 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--brand-red)' }} />
            <span style={{ fontWeight: 600, color: 'white' }}>{teamA?.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--info-blue)' }} />
            <span style={{ fontWeight: 600, color: 'white' }}>{teamB?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
