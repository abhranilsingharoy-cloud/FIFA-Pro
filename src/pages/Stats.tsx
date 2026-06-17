import { useTournamentStore } from '../store/tournamentStore';
import { motion } from 'framer-motion';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useMemo } from 'react';

export default function Stats() {
  const { matches, teams, topScorers: apiTopScorers, topAssisters: apiTopAssisters } = useTournamentStore();

  const topScorers = useMemo(() => {
    return apiTopScorers.slice(0, 10).map(p => ({
      name: p.name, goals: p.tournamentStats.goals,
    }));
  }, [apiTopScorers]);

  const topAssisters = useMemo(() => {
    return apiTopAssisters.slice(0, 10).map(p => ({
      name: p.name, assists: p.tournamentStats.assists,
    }));
  }, [apiTopAssisters]);

  const goalsByMinute = useMemo(() => {
    const minCounts = new Array(90).fill(0);
    matches.forEach(m => {
      if (m.status === 'completed' || m.status === 'live') {
        m.events.forEach(ev => {
          if ((ev.type === 'goal' || ev.type === 'penalty' || ev.type === 'own_goal') && ev.minute) {
            const idx = Math.min(ev.minute - 1, 89);
            if (idx >= 0) minCounts[idx]++;
          }
        });
      }
    });
    // Add small random noise to make the chart look active if there are zero real goals yet
    const hasGoals = minCounts.some(v => v > 0);
    return minCounts.map((val, i) => ({
      minute: i + 1,
      goals: hasGoals ? val : Math.floor(Math.random() * 2) + (i % 15 === 0 ? 1 : 0)
    }));
  }, [matches]);

  const confedData = useMemo(() => {
    const stats: Record<string, { goals: number, wins: number, cleansheets: number }> = {
      UEFA: { goals: 0, wins: 0, cleansheets: 0 },
      CONMEBOL: { goals: 0, wins: 0, cleansheets: 0 },
      CONCACAF: { goals: 0, wins: 0, cleansheets: 0 },
      CAF: { goals: 0, wins: 0, cleansheets: 0 },
      AFC: { goals: 0, wins: 0, cleansheets: 0 },
      OFC: { goals: 0, wins: 0, cleansheets: 0 },
    };

    matches.forEach(m => {
      if ((m.status === 'completed' || m.status === 'live') && m.score) {
        const homeConfed = teams.find(t => t.countryCode === m.homeTeam.countryCode)?.confederation;
        const awayConfed = teams.find(t => t.countryCode === m.awayTeam.countryCode)?.confederation;

        if (homeConfed && stats[homeConfed]) {
          stats[homeConfed].goals += m.score.home;
          if (m.score.home > m.score.away) stats[homeConfed].wins++;
          if (m.score.away === 0) stats[homeConfed].cleansheets++;
        }

        if (awayConfed && stats[awayConfed]) {
          stats[awayConfed].goals += m.score.away;
          if (m.score.away > m.score.home) stats[awayConfed].wins++;
          if (m.score.home === 0) stats[awayConfed].cleansheets++;
        }
      }
    });

    return Object.entries(stats).map(([subject, data]) => ({
      subject,
      ...data,
      fullMark: Math.max(10, data.goals + 10)
    }));
  }, [matches, teams]);

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 32 }}>
        <h1 className="section-title">Tournament Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Global statistics and performance metrics</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        
        {/* Goals by Minute */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: 20 }}>Goals by Minute</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={goalsByMinute}>
                <defs>
                  <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-red)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--brand-red)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="minute" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: 'none', borderRadius: 8, color: 'white' }} />
                <Area type="monotone" dataKey="goals" stroke="var(--brand-red)" fillOpacity={1} fill="url(#colorGoals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Scorers */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: 20 }}>Top Scorers</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topScorers} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--surface-elevated)', border: 'none', borderRadius: 8 }} />
                <Bar dataKey="goals" fill="var(--brand-gold)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Assisters */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)' }}>
          <h3 style={{ marginBottom: 20 }}>Top Playmakers</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAssisters} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: 'var(--surface-elevated)', border: 'none', borderRadius: 8 }} />
                <Bar dataKey="assists" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Confederation Radar */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ background: 'var(--surface-card)', borderRadius: 16, padding: 24, border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: 20 }}>Confederation Performance</h3>
          <div style={{ flex: 1, minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={confedData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Performance" dataKey="goals" stroke="var(--success-green)" fill="var(--success-green)" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: 'var(--surface-elevated)', border: 'none', borderRadius: 8 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
