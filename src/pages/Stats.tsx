import { motion } from 'framer-motion';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis } from 'recharts';
import { PLAYERS } from '../data/players';

const goalsByMinute = Array.from({ length: 90 }, (_, i) => ({
  minute: i + 1,
  goals: Math.floor(Math.random() * 5) + (i > 80 ? 8 : i % 15 === 0 ? 5 : 0) // spike late and at intervals
}));

const confedData = [
  { subject: 'UEFA', goals: 85, wins: 24, cleansheets: 12, fullMark: 100 },
  { subject: 'CONMEBOL', goals: 65, wins: 18, cleansheets: 8, fullMark: 100 },
  { subject: 'CONCACAF', goals: 45, wins: 12, cleansheets: 5, fullMark: 100 },
  { subject: 'CAF', goals: 30, wins: 8, cleansheets: 4, fullMark: 100 },
  { subject: 'AFC', goals: 25, wins: 6, cleansheets: 3, fullMark: 100 },
  { subject: 'OFC', goals: 5, wins: 1, cleansheets: 0, fullMark: 100 },
];

export default function Stats() {
  const topScorers = [...PLAYERS].sort((a, b) => b.tournamentStats.goals - a.tournamentStats.goals).slice(0, 10).map(p => ({
    name: p.name, goals: p.tournamentStats.goals,
  }));

  const topAssisters = [...PLAYERS].sort((a, b) => b.tournamentStats.assists - a.tournamentStats.assists).slice(0, 10).map(p => ({
    name: p.name, assists: p.tournamentStats.assists,
  }));

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
