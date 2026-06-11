import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
  ReferenceDot,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import { DollarSign, TrendingUp, Users, Award, Info, CheckCircle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRIZE_BREAKDOWN, HISTORICAL_PRIZE_POOLS, PRIZE_POOL_TOTAL } from '../data/prizes';
import { TEAMS } from '../data/teams';

// ─── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2200, startDelay = 400) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [target, duration, startDelay]);

  return value;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) => {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
};

const fmtFull = (n: number) =>
  '$' + n.toLocaleString('en-US');

const teamFlagUrl = (code: string) =>
  `https://flagcdn.com/32x24/${code.toLowerCase()}.png`;

// ─── Prize earned per team based on group results ──────────────────────────────
const ELIMINATED_IN_GROUP = ['CA', 'TN', 'AU', 'MN', 'QA', 'ZM', 'KR', 'IR'];

const getTeamPrize = (countryCode: string): { amount: number; stage: string; confirmed: boolean } => {
  if (ELIMINATED_IN_GROUP.includes(countryCode)) {
    return { amount: 13_000_000, stage: 'Group Stage', confirmed: true };
  }
  return { amount: 37_000_000, stage: 'Active – Min Guaranteed', confirmed: false };
};

// ─── Confederation data ────────────────────────────────────────────────────────
const CONFEDERATION_COLORS: Record<string, string> = {
  UEFA: '#3B82F6',
  CONMEBOL: '#22C55E',
  CONCACAF: '#F59E0B',
  CAF: '#EF4444',
  AFC: '#8B5CF6',
  OFC: '#EC4899',
};

// ─── Custom tooltip ────────────────────────────────────────────────────────────
const PrizeTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'var(--surface-elevated)',
      border: '1px solid var(--border-gold)',
      borderRadius: 10,
      padding: '12px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: 'var(--brand-gold)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: 'var(--text-primary)' }}>
        {fmtFull(payload[0]?.value ?? 0)}
      </p>
    </div>
  );
};

const HistoryTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: 'var(--surface-elevated)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 10,
      padding: '12px 16px',
    }}>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>FIFA World Cup {label}</p>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: '#FFD700', fontWeight: 700 }}>
        {fmt(payload[0]?.value ?? 0)}
      </p>
    </div>
  );
};

// ─── Hero Section ──────────────────────────────────────────────────────────────
const HeroSection: React.FC = () => {
  const count = useCountUp(PRIZE_POOL_TOTAL, 2500, 600);

  const displayStr = useMemo(() => {
    const billions = Math.floor(count / 1_000_000_000);
    const millions = Math.floor((count % 1_000_000_000) / 1_000_000);
    const thousands = Math.floor((count % 1_000_000) / 1_000);
    const units = count % 1_000;

    if (count < 1_000_000_000) {
      return '$' + count.toLocaleString('en-US');
    }
    return `$${billions},${String(millions).padStart(3, '0')},${String(thousands).padStart(3, '0')},${String(units).padStart(3, '0')}`;
  }, [count]);

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0A0F1E 0%, #0D1424 50%, #0A1208 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '72px 24px 60px',
        textAlign: 'center',
      }}
    >
      {/* Glow orbs */}
      <div style={{
        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 300,
        background: 'radial-gradient(ellipse, rgba(255,215,0,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, right: '20%',
        width: 400, height: 300,
        background: 'radial-gradient(circle, rgba(200,16,46,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--brand-gold)',
          marginBottom: 16,
        }}>
          🏆 FIFA World Cup 2026
        </p>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(42px, 10vw, 108px)',
          lineHeight: 0.9,
          color: 'var(--brand-gold)',
          textShadow: '0 0 40px rgba(255,215,0,0.4), 0 0 80px rgba(255,215,0,0.2)',
          letterSpacing: '0.02em',
          marginBottom: 16,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {displayStr}
        </div>

        <p style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(20px, 4vw, 36px)',
          color: 'var(--text-secondary)',
          letterSpacing: '0.08em',
          marginBottom: 24,
        }}>
          Total FIFA WC2026 Prize Pool
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-gold" style={{ fontSize: 12, padding: '6px 16px' }}>
            🥇 FIRST EVER $1 BILLION PRIZE POOL
          </span>
          <span className="badge badge-green" style={{ fontSize: 12, padding: '6px 16px' }}>
            📈 127% More Than 2022
          </span>
          <span className="badge badge-info" style={{ fontSize: 12, padding: '6px 16px' }}>
            🌍 48 Teams · 104 Matches
          </span>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Prize Breakdown Bar Chart ──────────────────────────────────────────────────
const PrizeBreakdownSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const chartData = PRIZE_BREAKDOWN.map(p => ({
    stage: p.stageLabel,
    amount: p.prizeUSD,
    teams: 48 - PRIZE_BREAKDOWN.filter(pp => pp.prizeUSD > p.prizeUSD).length * 4,
  }));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="card"
      style={{ padding: '24px', marginBottom: 24 }}
    >
      <h2 className="section-title" style={{ fontSize: 24, marginBottom: 24 }}>
        <TrendingUp size={22} color="var(--brand-gold)" />
        Prize Money by Stage
      </h2>

      {/* Bar chart */}
      <div style={{ height: 280, marginBottom: 32 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="stage"
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <Tooltip content={<PrizeTooltip />} />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {chartData.map((_, idx) => {
                const colors = [
                  '#5A6478', '#6B7280', '#7C8596', '#4ADE80',
                  '#60A5FA', '#F59E0B', '#FF6B6B', '#FFD700',
                ];
                return <Cell key={idx} fill={colors[idx] || '#FFD700'} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th>Stage</th>
              <th>Prize Per Team</th>
              <th style={{ textAlign: 'center' }}>Teams</th>
              <th style={{ textAlign: 'right' }}>Total Payout</th>
              <th style={{ textAlign: 'right' }}>% of Pool</th>
            </tr>
          </thead>
          <tbody>
            {PRIZE_BREAKDOWN.map((row, idx) => {
              const teamCounts: Record<string, number> = {
                group: 12,
                r32: 16,
                r16: 16,
                qf: 8,
                sf: 4,
                third: 1,
                runner_up: 1,
                champion: 1,
              };
              const teams = teamCounts[row.stage] ?? 1;
              const total = row.prizeUSD * teams;
              const pct = ((total / PRIZE_POOL_TOTAL) * 100).toFixed(1);

              return (
                <tr key={idx}>
                  <td>
                    <span style={{
                      fontWeight: 600,
                      color: row.stage === 'champion' ? 'var(--brand-gold)'
                        : row.stage === 'runner_up' ? '#C0C0C0' : 'var(--text-primary)',
                    }}>
                      {row.stage === 'champion' && '🏆 '}
                      {row.stage === 'runner_up' && '🥈 '}
                      {row.stage === 'third' && '🥉 '}
                      {row.stageLabel}
                    </span>
                  </td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--brand-gold)', fontWeight: 700 }}>
                    {fmt(row.prizeUSD)}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>{teams}</td>
                  <td style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace', fontWeight: 600" }}>
                    {fmt(total)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <div style={{
                        width: 60, height: 6, background: 'var(--surface-elevated)', borderRadius: 3, overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, var(--brand-gold), var(--brand-red))',
                          borderRadius: 3,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 36, textAlign: 'right' }}>
                        {pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// ─── Live Prize Tracker ─────────────────────────────────────────────────────────
const LivePrizeTracker: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const uniqueTeams = useMemo(() => {
    const seen = new Set<string>();
    return TEAMS.filter(t => {
      if (seen.has(t.countryCode)) return false;
      seen.add(t.countryCode);
      return true;
    });
  }, []);

  const teamsWithPrize = useMemo(() =>
    uniqueTeams
      .map(t => ({ ...t, ...getTeamPrize(t.countryCode) }))
      .sort((a, b) => {
        if (b.confirmed !== a.confirmed) return Number(b.confirmed) - Number(a.confirmed);
        return b.amount - a.amount;
      }),
    [uniqueTeams],
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card"
      style={{ padding: '24px', marginBottom: 24 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="section-title" style={{ fontSize: 24 }}>
          <DollarSign size={22} color="var(--brand-gold)" />
          Live Prize Tracker
        </h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--success-green)' }}>
            <CheckCircle size={14} /> Confirmed
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--warning-amber)' }}>
            <Clock size={14} /> Pending
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" style={{ minWidth: 500 }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Nation</th>
              <th>Group</th>
              <th>Stage</th>
              <th style={{ textAlign: 'right' }}>Prize Earned</th>
              <th style={{ textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {teamsWithPrize.map((team, idx) => (
              <motion.tr
                key={`${team.countryCode}-${team.groupId}`}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: idx * 0.025 }}
                style={{ cursor: 'default' }}
              >
                <td style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
                  {idx + 1}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img
                      src={teamFlagUrl(team.flag)}
                      alt={team.name}
                      style={{ width: 28, height: 21, borderRadius: 2, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{team.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{team.confederation}</p>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Group {team.groupId}</td>
                <td>
                  <span style={{
                    fontSize: 12,
                    color: team.confirmed ? 'var(--text-secondary)' : 'var(--warning-amber)',
                  }}>
                    {team.stage}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 15,
                    fontWeight: 700,
                    color: team.confirmed ? 'var(--brand-gold)' : 'var(--warning-amber)',
                  }}>
                    {team.confirmed ? fmt(team.amount) : `≥ ${fmt(team.amount)}`}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {team.confirmed ? (
                    <span className="badge badge-green">
                      <CheckCircle size={10} style={{ marginRight: 4 }} />
                      Confirmed
                    </span>
                  ) : (
                    <span className="badge badge-amber">
                      <Clock size={10} style={{ marginRight: 4 }} />
                      Active
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// ─── Confederation Donut ────────────────────────────────────────────────────────
const ConfederationDonut: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const confData = useMemo(() => {
    const totals: Record<string, number> = {};
    const uniqueTeams = (() => {
      const seen = new Set<string>();
      return TEAMS.filter(t => {
        if (seen.has(t.countryCode)) return false;
        seen.add(t.countryCode);
        return true;
      });
    })();

    uniqueTeams.forEach(t => {
      const prize = getTeamPrize(t.countryCode);
      totals[t.confederation] = (totals[t.confederation] ?? 0) + prize.amount;
    });

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value, fill: CONFEDERATION_COLORS[name] ?? '#888' }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const CustomPieLabel: React.FC<any> = ({ cx, cy, midAngle, outerRadius, name, value }) => {
    const RADIAN = Math.PI / 180;
    const r = outerRadius + 24;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="var(--text-secondary)" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {name} ({fmt(value)})
      </text>
    );
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="card"
      style={{ padding: '24px' }}
    >
      <h2 className="section-title" style={{ fontSize: 24, marginBottom: 20 }}>
        <Users size={22} color="var(--brand-gold)" />
        Earnings by Confederation
      </h2>
      <div style={{ height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={confData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={55}
              dataKey="value"
              labelLine={false}
              label={CustomPieLabel}
            >
              {confData.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} stroke="var(--surface-card)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: number) => [fmtFull(val), 'Total Earnings']}
              contentStyle={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--brand-gold)' }}
            />
            <Legend
              iconType="circle"
              formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Confederation bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
        {confData.map((c) => {
          const pct = (c.value / confData.reduce((s, x) => s + x.value, 0)) * 100;
          return (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 80, fontSize: 12, fontWeight: 700, color: c.fill }}>{c.name}</span>
              <div style={{ flex: 1, height: 8, background: 'var(--surface-elevated)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${pct}%` } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  style={{ height: '100%', background: c.fill, borderRadius: 4 }}
                />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-secondary)', minWidth: 56, textAlign: 'right' }}>
                {fmt(c.value)}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ─── Historical Line Chart ──────────────────────────────────────────────────────
const HistoricalChart: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  const data = HISTORICAL_PRIZE_POOLS.map(p => ({
    year: String(p.year),
    amount: p.amount,
    isRecord: p.year === 2026,
  }));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card"
      style={{ padding: '24px' }}
    >
      <h2 className="section-title" style={{ fontSize: 24, marginBottom: 20 }}>
        <TrendingUp size={22} color="var(--brand-gold)" />
        Prize Pool History (2006–2026)
      </h2>
      <div style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 30, right: 60, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => `$${(v / 1_000_000_000).toFixed(2)}B`}
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              domain={[0, 1_100_000_000]}
            />
            <Tooltip content={<HistoryTooltip />} />
            <ReferenceLine
              y={1_000_000_000}
              stroke="rgba(255,215,0,0.25)"
              strokeDasharray="6 3"
              label={{ value: '$1B', fill: 'var(--brand-gold)', fontSize: 11, position: 'right' }}
            />
            <ReferenceDot
              x="2026"
              y={1_000_000_000}
              r={8}
              fill="var(--brand-gold)"
              stroke="var(--brand-navy)"
              strokeWidth={2}
              label={{
                value: 'FIRST $1B! 🎉',
                fill: 'var(--brand-gold)',
                fontSize: 11,
                fontWeight: 700,
                position: 'top',
                dy: -12,
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="var(--brand-gold)"
              strokeWidth={3}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <circle
                    key={payload.year}
                    cx={cx}
                    cy={cy}
                    r={payload.isRecord ? 7 : 5}
                    fill={payload.isRecord ? 'var(--brand-gold)' : 'var(--brand-red)'}
                    stroke="var(--surface-card)"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 8, fill: 'var(--brand-gold)', stroke: 'var(--surface-card)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Growth callouts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
        {[
          { label: '2022 → 2026 Growth', value: '+127%', sub: 'Biggest single-edition jump', color: 'var(--brand-gold)' },
          { label: '20-Year Growth', value: '+276%', sub: 'Since 2006 ($266M)', color: 'var(--success-green)' },
          { label: '2022 Prize Pool', value: '$440M', sub: 'Lower than 2018 due to COVID', color: 'var(--warning-amber)' },
        ].map(stat => (
          <div
            key={stat.label}
            className="card-elevated"
            style={{ padding: '12px 16px', textAlign: 'center' }}
          >
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{stat.label}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.sub}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Player Bonus Section ───────────────────────────────────────────────────────
const PlayerBonusSection: React.FC = () => {
  const bonuses = [
    {
      icon: '🏦',
      title: 'Club Compensation',
      color: '#3B82F6',
      desc: 'Clubs whose players are selected for the World Cup receive compensation from FIFA for releasing players. Top clubs can receive up to $10,000 per player per day.',
    },
    {
      icon: '🌍',
      title: 'Federation Bonuses',
      color: '#22C55E',
      desc: 'National federations typically pass a percentage of prize money to players. England, for example, had a $19M player bonus pool for reaching the 2022 semi-finals.',
    },
    {
      icon: '👟',
      title: 'Sponsorship Premiums',
      color: '#F59E0B',
      desc: 'Top players earn performance-linked bonuses from Nike, Adidas, and Puma for winning goals and on-screen exposure during matches.',
    },
    {
      icon: '📺',
      title: 'Broadcast Royalties',
      color: '#8B5CF6',
      desc: 'Star players negotiate personal broadcast clauses. Messi, Ronaldo, and Mbappé have individualized contracts that pay out millions for ad airtime during WC coverage.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="section-title" style={{ fontSize: 24, marginBottom: 20 }}>
        <Award size={22} color="var(--brand-gold)" />
        Player & Sponsorship Bonuses
      </h2>
      <div className="page-grid-2">
        {bonuses.map((bonus) => (
          <div
            key={bonus.title}
            className="card"
            style={{
              padding: '20px',
              borderLeft: `3px solid ${bonus.color}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>{bonus.icon}</span>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: bonus.color }}>
                {bonus.title}
              </h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {bonus.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: 20,
        padding: '14px 18px',
        background: 'rgba(59,130,246,0.06)',
        border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 10,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <Info size={16} color="var(--info-blue)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--info-blue)' }}>Note:</strong> The $1B prize pool is distributed to participating national football associations (federations), not directly to players.
          Individual player pay-outs depend on each federation's internal distribution policy.
        </p>
      </div>
    </motion.div>
  );
};

// ─── Main Prizes Page ───────────────────────────────────────────────────────────
export default function Prizes() {
  useEffect(() => {
    // Fire confetti on mount
    const timer = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 70,
        colors: ['#FFD700', '#C8102E', '#FFFFFF'],
        origin: { y: 0.3 },
      });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      <div className="page-container" style={{ marginTop: 32 }}>
        {/* Prize Breakdown */}
        <PrizeBreakdownSection />

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <ConfederationDonut />
          <HistoricalChart />
        </div>

        {/* Live prize tracker */}
        <LivePrizeTracker />

        {/* Player bonuses */}
        <PlayerBonusSection />
      </div>
    </div>
  );
}
