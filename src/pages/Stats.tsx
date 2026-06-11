import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, Cell, Legend,
} from 'recharts';
import {
  BarChart3, Activity, Target, Users, Shield, Zap, Award, GitBranch
} from 'lucide-react';
import { PLAYERS } from '../data/players';
import { MATCHES } from '../data/matches';
import { TEAMS } from '../data/teams';

// ─── Design Tokens ──────────────────────────────────────────────────────────
const CHART_RED = '#C8102E';
const CHART_GOLD = '#FFD700';
const CHART_BLUE = '#3B82F6';
const CHART_GREEN = '#22C55E';
const CHART_PURPLE = '#A855F7';
const CHART_ORANGE = '#F97316';
const GRID_COLOR = 'rgba(255,255,255,0.05)';
const TICK_COLOR = '#A0AABF';
const TOOLTIP_BG = '#1C2338';

// ─── Shared Chart Styles ─────────────────────────────────────────────────────
const chartTooltipStyle: React.CSSProperties = {
  background: TOOLTIP_BG,
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#fff',
  fontSize: 13,
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const goalsPerMatchday = [
  { day: 'MD1', goals: 14, avg: 2.8 },
  { day: 'MD2', goals: 18, avg: 3.6 },
  { day: 'MD3', goals: 21, avg: 4.2 },
  { day: 'MD4', goals: 16, avg: 3.2 },
  { day: 'MD5', goals: 23, avg: 4.6 },
  { day: 'MD6', goals: 19, avg: 3.8 },
  { day: 'MD7', goals: 12, avg: 2.4 },
  { day: 'MD8', goals: 17, avg: 3.4 },
  { day: 'MD9', goals: 20, avg: 4.0 },
  { day: 'MD10', goals: 15, avg: 3.0 },
  { day: 'MD11', goals: 22, avg: 4.4 },
  { day: 'MD12', goals: 25, avg: 5.0 },
];

const goalsByMinute = [
  { minute: '1-5', goals: 8 }, { minute: '6-10', goals: 11 }, { minute: '11-15', goals: 13 },
  { minute: '16-20', goals: 10 }, { minute: '21-25', goals: 12 }, { minute: '26-30', goals: 9 },
  { minute: '31-35', goals: 14 }, { minute: '36-40', goals: 16 }, { minute: '41-45+', goals: 21 },
  { minute: '46-50', goals: 7 }, { minute: '51-55', goals: 10 }, { minute: '56-60', goals: 12 },
  { minute: '61-65', goals: 13 }, { minute: '66-70', goals: 14 }, { minute: '71-75', goals: 11 },
  { minute: '76-80', goals: 15 }, { minute: '81-85', goals: 18 }, { minute: '86-90+', goals: 24 },
];

const topScorers = [...PLAYERS]
  .sort((a, b) => b.tournamentStats.goals - a.tournamentStats.goals)
  .slice(0, 10)
  .map(p => ({ name: p.name.split(' ').slice(-1)[0], goals: p.tournamentStats.goals, country: p.countryCode }));

const topAssisters = [...PLAYERS]
  .sort((a, b) => b.tournamentStats.assists - a.tournamentStats.assists)
  .slice(0, 10)
  .map(p => ({ name: p.name.split(' ').slice(-1)[0], assists: p.tournamentStats.assists, country: p.countryCode }));

const passAccuracyLeaders = [...PLAYERS]
  .filter(p => p.tournamentStats.minutesPlayed >= 200)
  .sort((a, b) => b.tournamentStats.passCompletionPct - a.tournamentStats.passCompletionPct)
  .slice(0, 8)
  .map(p => ({ name: p.name.split(' ').slice(-1)[0], pct: p.tournamentStats.passCompletionPct }));

const confederationRadar = [
  { subject: 'Goals', UEFA: 85, CONMEBOL: 72, CONCACAF: 48, CAF: 35, AFC: 28, OFC: 12, fullMark: 100 },
  { subject: 'Wins', UEFA: 78, CONMEBOL: 70, CONCACAF: 42, CAF: 32, AFC: 30, OFC: 10, fullMark: 100 },
  { subject: 'Clean Sheets', UEFA: 65, CONMEBOL: 60, CONCACAF: 35, CAF: 28, AFC: 25, OFC: 8, fullMark: 100 },
  { subject: 'Avg Rating', UEFA: 72, CONMEBOL: 80, CONCACAF: 55, CAF: 50, AFC: 48, OFC: 30, fullMark: 100 },
  { subject: 'xG', UEFA: 88, CONMEBOL: 75, CONCACAF: 45, CAF: 38, AFC: 32, OFC: 15, fullMark: 100 },
];

const countryPerformanceScatter = TEAMS.slice(0, 16).map(t => ({
  name: t.name.split(' ').slice(-1)[0],
  xG: +(Math.random() * 3 + 0.5).toFixed(1),
  xGA: +(Math.random() * 2.5 + 0.3).toFixed(1),
  points: t.points,
  code: t.countryCode,
}));

const cardsByTeam = [
  { team: 'Tunisia', yellow: 8, red: 1 },
  { team: 'Montenegro', yellow: 7, red: 1 },
  { team: 'Ecuador', yellow: 6, red: 0 },
  { team: 'Mexico', yellow: 6, red: 0 },
  { team: 'Australia', yellow: 5, red: 1 },
  { team: 'Colombia', yellow: 5, red: 0 },
  { team: 'Nigeria', yellow: 4, red: 0 },
  { team: 'Brazil', yellow: 4, red: 0 },
];

const cleanSheetKeepers = [
  { name: 'Neuer', country: 'DE', flag: 'de', matches: 4, cleanSheets: 2, savesPct: 84, saves: 16 },
  { name: 'Pickford', country: 'GB', flag: 'gb-eng', matches: 5, cleanSheets: 2, savesPct: 81, saves: 13 },
  { name: 'Yassine', country: 'MA', flag: 'ma', matches: 5, cleanSheets: 1, savesPct: 79, saves: 18 },
  { name: 'Alisson', country: 'BR', flag: 'br', matches: 4, cleanSheets: 1, savesPct: 77, saves: 14 },
  { name: 'Courtois', country: 'BE', flag: 'be', matches: 5, cleanSheets: 2, savesPct: 88, saves: 21 },
  { name: 'Ter Stegen', country: 'DE', flag: 'de', matches: 3, cleanSheets: 1, savesPct: 75, saves: 9 },
];

const distanceCovered = [
  { team: 'Germany', km: 118.4 },
  { team: 'Croatia', km: 115.2 },
  { team: 'Japan', km: 113.9 },
  { team: 'Belgium', km: 112.1 },
  { team: 'Norway', km: 111.8 },
  { team: 'France', km: 110.5 },
  { team: 'USA', km: 109.3 },
  { team: 'Spain', km: 108.7 },
];

// ─── Chart Card Wrapper ──────────────────────────────────────────────────────
function ChartCard({
  title, icon: Icon, color, children, delay = 0, height = 300, fullWidth = false
}: {
  title: string; icon: React.ElementType; color: string; children: React.ReactNode;
  delay?: number; height?: number; fullWidth?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay }}
      className="card"
      style={{ padding: '20px', gridColumn: fullWidth ? '1 / -1' : undefined }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={16} style={{ color }} />
        </div>
        <h3 className="section-title" style={{ fontSize: 20 }}>{title}</h3>
      </div>
      <div style={{ height }}>
        {children}
      </div>
    </motion.div>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={chartTooltipStyle}>
      {label && <div style={{ color: TICK_COLOR, fontSize: 12, marginBottom: 6 }}>{label}</div>}
      {payload.map((entry: any, i: number) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
          <span style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            {typeof entry.value === 'number' && entry.value % 1 !== 0 ? entry.value.toFixed(2) : entry.value}
          </span>
          <span style={{ color: TICK_COLOR, fontSize: 11 }}>{entry.name}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Section Divider ─────────────────────────────────────────────────────────
function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 16 }}
    >
      <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 32, letterSpacing: '0.06em', color: 'white', marginBottom: 4 }}>
        {title}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{sub}</p>
    </motion.div>
  );
}

// ─── Main Stats Component ────────────────────────────────────────────────────
export default function Stats() {
  const [radarVisibility, setRadarVisibility] = useState({
    UEFA: true, CONMEBOL: true, CONCACAF: true, CAF: false, AFC: false, OFC: false
  });

  const confColors: Record<string, string> = {
    UEFA: CHART_BLUE, CONMEBOL: CHART_GOLD, CONCACAF: CHART_GREEN,
    CAF: CHART_RED, AFC: CHART_PURPLE, OFC: CHART_ORANGE,
  };

  return (
    <div className="page-container">
      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--brand-red), #8B0000)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(200,16,46,0.4)'
          }}>
            <BarChart3 size={22} style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 44, letterSpacing: '0.05em', lineHeight: 1, color: 'white' }}>
              Tournament Statistics
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 2 }}>
              Deep analytics · 47 matches · 156 goals · WC2026
            </p>
          </div>
        </div>

        {/* Quick stat pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          {[
            { label: 'Total Goals', val: '156', color: CHART_RED },
            { label: 'Total xG', val: '142.3', color: CHART_GOLD },
            { label: 'Avg xG/Match', val: '3.03', color: CHART_BLUE },
            { label: 'Pass Accuracy', val: '84.2%', color: CHART_GREEN },
            { label: 'Yellow Cards', val: '89', color: CHART_ORANGE },
            { label: 'Red Cards', val: '4', color: CHART_RED },
            { label: 'Total Distance', val: '4,812 km', color: CHART_PURPLE },
            { label: 'Clean Sheets', val: '18', color: CHART_GREEN },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
              borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: item.color, fontSize: 15 }}>{item.val}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── SECTION 1: GOALS ANALYSIS ────────────────────────────────── */}
      <SectionHeader title="Goals Analysis" sub="Distribution of goals across matchdays and game time" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>

        {/* Goals per Matchday */}
        <ChartCard title="Goals per Match Day" icon={Target} color={CHART_RED} delay={0} height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={goalsPerMatchday} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="goals" name="Goals" radius={[4, 4, 0, 0]}>
                {goalsPerMatchday.map((_, i) => (
                  <Cell key={i} fill={i === goalsPerMatchday.length - 1 ? CHART_GOLD : CHART_RED} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Goals by Minute */}
        <ChartCard title="Goals by Minute" icon={Activity} color={CHART_BLUE} delay={0.07} height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={goalsByMinute}>
              <defs>
                <linearGradient id="goalMinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_BLUE} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={CHART_BLUE} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
              <XAxis dataKey="minute" tick={{ fill: TICK_COLOR, fontSize: 9 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" height={36} />
              <YAxis tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: CHART_BLUE, strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone" dataKey="goals" name="Goals"
                stroke={CHART_BLUE} strokeWidth={2.5}
                fill="url(#goalMinGrad)" dot={{ fill: CHART_BLUE, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: CHART_BLUE, stroke: 'white', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ─── SECTION 2: TOP PERFORMERS ────────────────────────────────── */}
      <SectionHeader title="Top Performers" sub="Individual brilliance driving teams forward" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 32 }}>

        {/* Top Scorers */}
        <ChartCard title="Top Scorers" icon={Target} color={CHART_RED} delay={0} height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topScorers} layout="vertical" margin={{ left: 0, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis type="number" tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 10]} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#fff', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="goals" name="Goals" radius={[0, 4, 4, 0]}>
                {topScorers.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? CHART_GOLD : i < 3 ? CHART_RED : '#C8102E88'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Assisters */}
        <ChartCard title="Top Assisters" icon={GitBranch} color={CHART_GREEN} delay={0.07} height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topAssisters} layout="vertical" margin={{ left: 0, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis type="number" tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 9]} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#fff', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="assists" name="Assists" radius={[0, 4, 4, 0]}>
                {topAssisters.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? CHART_GOLD : i < 3 ? CHART_GREEN : '#22C55E88'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pass Accuracy */}
        <ChartCard title="Pass Accuracy Leaders" icon={Zap} color={CHART_BLUE} delay={0.14} height={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={passAccuracyLeaders} layout="vertical" margin={{ left: 0, right: 36 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis type="number" tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} domain={[70, 96]} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#fff', fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} formatter={(v: number) => [`${v}%`, 'Pass Acc.']} />
              <Bar dataKey="pct" name="Pass %" radius={[0, 4, 4, 0]}>
                {passAccuracyLeaders.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? CHART_GOLD : CHART_BLUE} opacity={1 - i * 0.07} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ─── SECTION 3: CONFEDERATION & SCATTER ──────────────────────── */}
      <SectionHeader title="Confederation & Team Performance" sub="Comparing power blocs and team efficiency metrics" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>

        {/* Confederation Radar */}
        <ChartCard title="Confederation Breakdown" icon={Shield} color={CHART_PURPLE} delay={0} height={360}>
          <div style={{ position: 'relative', height: '100%' }}>
            <ResponsiveContainer width="100%" height="85%">
              <RadarChart data={confederationRadar} cx="50%" cy="50%" outerRadius="80%">
                <PolarGrid stroke={GRID_COLOR} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: TICK_COLOR, fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: TICK_COLOR, fontSize: 9 }} />
                {(Object.keys(radarVisibility) as (keyof typeof radarVisibility)[]).filter(k => radarVisibility[k]).map(conf => (
                  <Radar
                    key={conf}
                    name={conf}
                    dataKey={conf}
                    stroke={confColors[conf]}
                    fill={confColors[conf]}
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                ))}
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend
                  formatter={(value) => <span style={{ color: TICK_COLOR, fontSize: 12 }}>{value}</span>}
                />
              </RadarChart>
            </ResponsiveContainer>
            {/* Toggle buttons */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
              {(Object.keys(radarVisibility) as (keyof typeof radarVisibility)[]).map(conf => (
                <button
                  key={conf}
                  onClick={() => setRadarVisibility(prev => ({ ...prev, [conf]: !prev[conf] }))}
                  style={{
                    padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', border: `1px solid ${radarVisibility[conf] ? confColors[conf] : 'var(--border-subtle)'}`,
                    background: radarVisibility[conf] ? `${confColors[conf]}22` : 'transparent',
                    color: radarVisibility[conf] ? confColors[conf] : 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {conf}
                </button>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* xG vs xGA Scatter */}
        <ChartCard title="xG vs xGA Quadrant" icon={Activity} color={CHART_GOLD} delay={0.1} height={360}>
          <div style={{ position: 'relative', height: '100%' }}>
            {/* Quadrant labels */}
            <div style={{ position: 'absolute', top: 8, left: '20%', fontSize: 10, color: 'rgba(34,197,94,0.6)', fontWeight: 700, letterSpacing: '0.05em', zIndex: 1, pointerEvents: 'none' }}>
              ELITE ↖
            </div>
            <div style={{ position: 'absolute', top: 8, right: '10%', fontSize: 10, color: 'rgba(245,158,11,0.6)', fontWeight: 700, letterSpacing: '0.05em', zIndex: 1, pointerEvents: 'none' }}>
              ATTACK ↗
            </div>
            <div style={{ position: 'absolute', bottom: 24, left: '20%', fontSize: 10, color: 'rgba(59,130,246,0.6)', fontWeight: 700, letterSpacing: '0.05em', zIndex: 1, pointerEvents: 'none' }}>
              DEFEND ↙
            </div>
            <div style={{ position: 'absolute', bottom: 24, right: '10%', fontSize: 10, color: 'rgba(239,68,68,0.6)', fontWeight: 700, letterSpacing: '0.05em', zIndex: 1, pointerEvents: 'none' }}>
              POOR ↘
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <ScatterChart margin={{ top: 20, right: 24, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                <XAxis
                  dataKey="xG" name="xG" type="number"
                  tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false}
                  label={{ value: 'xG (Attack)', fill: TICK_COLOR, fontSize: 11, position: 'insideBottom', offset: -4 }}
                  domain={[0, 4]}
                />
                <YAxis
                  dataKey="xGA" name="xGA" type="number"
                  tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false}
                  label={{ value: 'xGA', fill: TICK_COLOR, fontSize: 11, angle: -90, position: 'insideLeft' }}
                  domain={[0, 3]}
                />
                <ZAxis dataKey="points" range={[40, 200]} />
                <Tooltip
                  cursor={{ strokeDasharray: '4 4', stroke: 'rgba(255,255,255,0.2)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div style={chartTooltipStyle}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
                        <div style={{ color: CHART_GREEN }}>xG: {d.xG}</div>
                        <div style={{ color: CHART_RED }}>xGA: {d.xGA}</div>
                        <div style={{ color: CHART_GOLD }}>Pts: {d.points}</div>
                      </div>
                    );
                  }}
                />
                <Scatter name="Teams" data={countryPerformanceScatter}>
                  {countryPerformanceScatter.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.points >= 7 ? CHART_GREEN : entry.points >= 4 ? CHART_GOLD : CHART_RED}
                      opacity={0.85}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 14, marginTop: 2, justifyContent: 'center' }}>
              {[{ color: CHART_GREEN, label: '7+ pts' }, { color: CHART_GOLD, label: '4-6 pts' }, { color: CHART_RED, label: '0-3 pts' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  <span style={{ fontSize: 11, color: TICK_COLOR }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ─── SECTION 4: DISCIPLINE & PHYSICAL ─────────────────────────── */}
      <SectionHeader title="Discipline & Physical Data" sub="Cards, discipline trends, and fitness metrics" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>

        {/* Cards by Team */}
        <ChartCard title="Most Carded Teams" icon={Award} color={CHART_ORANGE} delay={0} height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cardsByTeam} layout="vertical" margin={{ left: 0, right: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis type="number" tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="team" tick={{ fill: '#fff', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="yellow" name="Yellow" stackId="a" radius={[0, 0, 0, 0]} fill="#F59E0B" opacity={0.9} />
              <Bar dataKey="red" name="Red" stackId="a" radius={[0, 4, 4, 0]} fill={CHART_RED} opacity={0.9} />
              <Legend
                iconType="square"
                formatter={(v) => <span style={{ color: TICK_COLOR, fontSize: 12 }}>{v}</span>}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Distance Covered */}
        <ChartCard title="Distance Covered (Total km)" icon={Zap} color={CHART_PURPLE} delay={0.07} height={280}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distanceCovered} layout="vertical" margin={{ left: 0, right: 36 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
              <XAxis type="number" tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} domain={[100, 122]} tickFormatter={v => `${v}`} />
              <YAxis type="category" dataKey="team" tick={{ fill: '#fff', fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} formatter={(v: number) => [`${v} km`, 'Distance']} />
              <Bar dataKey="km" name="km" radius={[0, 4, 4, 0]}>
                {distanceCovered.map((_, i) => (
                  <Cell key={i} fill={CHART_PURPLE} opacity={1 - i * 0.08} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ─── SECTION 5: CLEAN SHEET KINGS TABLE ───────────────────────── */}
      <SectionHeader title="Goalkeeping Excellence" sub="Best shot-stoppers of the tournament so far" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{ padding: '20px', marginBottom: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${CHART_GREEN}18`, border: `1px solid ${CHART_GREEN}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={16} style={{ color: CHART_GREEN }} />
          </div>
          <h3 className="section-title" style={{ fontSize: 20 }}>Clean Sheet Kings</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Goalkeeper</th>
                <th>Country</th>
                <th>Matches</th>
                <th>Clean Sheets</th>
                <th>Saves</th>
                <th>Save %</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {cleanSheetKeepers.sort((a, b) => b.cleanSheets - a.cleanSheets || b.savesPct - a.savesPct).map((gk, i) => (
                <motion.tr
                  key={gk.name + gk.country}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className={i === 0 ? 'qualify-green' : i === 1 ? 'qualify-amber' : ''}
                >
                  <td>
                    <span style={{
                      fontFamily: 'Bebas Neue, sans-serif', fontSize: 20,
                      color: i === 0 ? CHART_GOLD : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--text-muted)'
                    }}>{i + 1}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'white' }}>{gk.name}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img
                        src={`https://flagcdn.com/32x24/${gk.flag.toLowerCase()}.png`}
                        alt={gk.country}
                        style={{ width: 24, height: 18, objectFit: 'cover', borderRadius: 2 }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{gk.country}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)' }}>{gk.matches}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: CHART_GREEN, fontSize: 16 }}>{gk.cleanSheets}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>CS</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{gk.saves}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: gk.savesPct >= 85 ? CHART_GREEN : gk.savesPct >= 78 ? CHART_GOLD : CHART_RED }}>
                        {gk.savesPct}%
                      </span>
                      <div style={{ width: 60, height: 4, borderRadius: 2, background: 'var(--surface-elevated)' }}>
                        <div style={{
                          width: `${gk.savesPct - 70}%`, height: '100%', borderRadius: 2,
                          background: gk.savesPct >= 85 ? CHART_GREEN : gk.savesPct >= 78 ? CHART_GOLD : CHART_RED,
                          maxWidth: '100%'
                        }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-gold" style={{ fontSize: 11 }}>
                      {(6.5 + gk.savesPct / 50).toFixed(1)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ─── SECTION 6: COMBINED PERFORMANCE TREND ────────────────────── */}
      <SectionHeader title="Tournament Trend" sub="Goal production and xG efficiency across the tournament" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{ padding: '20px', marginBottom: 32 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `${CHART_GOLD}18`, border: `1px solid ${CHART_GOLD}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendIcon size={16} color={CHART_GOLD} />
          </div>
          <h3 className="section-title" style={{ fontSize: 20 }}>Goals vs xG Efficiency</h3>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
            {[{ color: CHART_RED, label: 'Actual Goals' }, { color: CHART_BLUE, label: 'xG (Expected)' }, { color: CHART_GOLD, label: 'Avg Goals/MD' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 20, height: 3, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 12, color: TICK_COLOR }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={goalsPerMatchday.map((d, i) => ({
              ...d,
              xG: +(d.goals * 0.88 + (Math.random() - 0.5) * 2).toFixed(1),
              avgGoals: 3.32,
            }))}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_RED} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_RED} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="xgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_BLUE} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_BLUE} stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
              <XAxis dataKey="day" tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 28]} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="goals" name="Goals" stroke={CHART_RED} strokeWidth={2.5} fill="url(#actualGrad)" dot={false} />
              <Area type="monotone" dataKey="xG" name="xG" stroke={CHART_BLUE} strokeWidth={2} fill="url(#xgGrad)" dot={false} strokeDasharray="5 3" />
              <Area type="monotone" dataKey="avgGoals" name="Avg/MD" stroke={CHART_GOLD} strokeWidth={1.5} fill="none" dot={false} strokeDasharray="8 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ─── SECTION 7: SCORING PATTERNS ─────────────────────────────── */}
      <SectionHeader title="Scoring Patterns" sub="How goals are being scored across the tournament" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>

        {/* Goal types */}
        {[
          {
            title: 'Goals by Type', icon: Target, color: CHART_RED,
            data: [
              { type: 'Open Play', count: 98 },
              { type: 'Penalty', count: 18 },
              { type: 'Free Kick', count: 22 },
              { type: 'Header', count: 12 },
              { type: 'Own Goal', count: 6 },
            ]
          },
          {
            title: 'Goals by Half', icon: Activity, color: CHART_BLUE,
            data: [
              { type: '1st Half', count: 68 },
              { type: '2nd Half', count: 72 },
              { type: 'ET', count: 10 },
              { type: 'Stoppage', count: 6 },
            ]
          },
          {
            title: 'Score at FT', icon: Award, color: CHART_GREEN,
            data: [
              { type: '1-0', count: 8 },
              { type: '2-1', count: 7 },
              { type: '3-0', count: 6 },
              { type: '2-0', count: 6 },
              { type: '4-0', count: 5 },
              { type: 'Other', count: 15 },
            ]
          }
        ].map((item, si) => (
          <ChartCard key={item.title} title={item.title} icon={item.icon} color={item.color} delay={si * 0.08} height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={item.data} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                <XAxis dataKey="type" tick={{ fill: TICK_COLOR, fontSize: 10 }} axisLine={false} tickLine={false} angle={-25} textAnchor="end" height={40} />
                <YAxis tick={{ fill: TICK_COLOR, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
                  {item.data.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? item.color : `${item.color}88`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        ))}
      </div>

      {/* ─── Footer note ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}
      >
        <span>⚽ WC2026 Hub — Data updated live · Stats reflect {MATCHES.length} tracked matches</span>
        <span style={{ display: 'block', marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
          xG model: Expected Goals v2.4 · All figures in metric units
        </span>
      </motion.div>
    </div>
  );
}

// ─── Tiny inline icon replacement for Activity trend ──────────────────────
function TrendIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
