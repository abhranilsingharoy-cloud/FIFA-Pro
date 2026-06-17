import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldAlert } from 'lucide-react';
import { useTournamentStore } from '../store/tournamentStore';

function flagUrl(code: string) {
  return `https://flagcdn.com/32x24/${code.toLowerCase()}.png`;
}

function MatchNode({ match, title }: { match?: any; title: string }) {
  if (!match) {
    return (
      <div className="card" style={{ width: 220, padding: 12, opacity: 0.6, borderStyle: 'dashed' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-muted)' }}>TBD</span>
          <span style={{ color: 'var(--text-muted)' }}>-</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
          <span style={{ color: 'var(--text-muted)' }}>TBD</span>
          <span style={{ color: 'var(--text-muted)' }}>-</span>
        </div>
      </div>
    );
  }

  const isLive = match.status === 'live';
  const isDone = match.status === 'completed';

  return (
    <div className="card" style={{ 
      width: 220, padding: 12, 
      border: isLive ? '1px solid var(--brand-red)' : '1px solid var(--border-subtle)',
      boxShadow: isLive ? '0 0 15px rgba(200,16,46,0.2)' : 'none'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{title}</div>
        {isLive && <span className="badge badge-live" style={{ fontSize: 9, padding: '2px 4px' }}><span className="live-dot"/>LIVE</span>}
        {isDone && <span className="badge badge-green" style={{ fontSize: 9, padding: '2px 4px' }}>FT</span>}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={flagUrl(match.homeTeam.countryCode)} alt="" style={{ width: 20, height: 15, borderRadius: 2 }} onError={e => e.currentTarget.style.display = 'none'} />
          <span style={{ fontWeight: match.score?.home > match.score?.away ? 700 : 500, color: 'white' }}>{match.homeTeam.name}</span>
        </div>
        <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: match.score?.home > match.score?.away ? 'var(--brand-gold)' : 'white' }}>
          {match.score?.home ?? '-'}
        </span>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={flagUrl(match.awayTeam.countryCode)} alt="" style={{ width: 20, height: 15, borderRadius: 2 }} onError={e => e.currentTarget.style.display = 'none'} />
          <span style={{ fontWeight: match.score?.away > match.score?.home ? 700 : 500, color: 'white' }}>{match.awayTeam.name}</span>
        </div>
        <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: match.score?.away > match.score?.home ? 'var(--brand-gold)' : 'white' }}>
          {match.score?.away ?? '-'}
        </span>
      </div>
    </div>
  );
}

export default function Bracket() {
  const { matches } = useTournamentStore();

  // Find matches by stage
  const r16 = matches.filter(m => m.stage === 'r16');
  const qf = matches.filter(m => m.stage === 'qf');
  const sf = matches.filter(m => m.stage === 'sf');
  const finalMatch = matches.find(m => m.stage === 'final');

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
            <span className="badge badge-gold">Tournament</span>
          </div>
          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 48, lineHeight: 1, marginBottom: 8, color: 'white' }}>
            Knockout <span className="gradient-text">Bracket</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500 }}>
            Track the journey to the final. Witness the thrilling single-elimination phase of the FIFA World Cup 2026.
          </p>
        </div>
        <Trophy size={120} style={{ color: 'rgba(255,215,0,0.1)', position: 'absolute', right: 40 }} />
      </motion.div>

      {/* ─── WARNING IF NO KNOCKOUTS YET ───────────────────────────────── */}
      {r16.length === 0 && qf.length === 0 && (
        <div style={{ padding: '20px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <ShieldAlert size={24} color="#F59E0B" />
          <div style={{ color: 'white' }}>
            <strong>Group Stage is currently active.</strong> The official knockout bracket will be fully populated once teams qualify for the Round of 32. Below is a placeholder visualization.
          </div>
        </div>
      )}

      {/* ─── BRACKET UI ────────────────────────────────────────────────── */}
      <div style={{ overflowX: 'auto', paddingBottom: 40 }}>
        <div style={{ display: 'flex', minWidth: 1000, gap: 40, alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Quarter Finals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            <MatchNode match={qf[0]} title="Quarter-Final 1" />
            <MatchNode match={qf[1]} title="Quarter-Final 2" />
            <MatchNode match={qf[2]} title="Quarter-Final 3" />
            <MatchNode match={qf[3]} title="Quarter-Final 4" />
          </div>

          {/* Connectors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
            <svg width="40" height="120" style={{ stroke: 'var(--border-subtle)', strokeWidth: 2, fill: 'none' }}>
              <path d="M 0 0 L 20 0 L 20 120 L 0 120 M 20 60 L 40 60" />
            </svg>
            <svg width="40" height="120" style={{ stroke: 'var(--border-subtle)', strokeWidth: 2, fill: 'none' }}>
              <path d="M 0 0 L 20 0 L 20 120 L 0 120 M 20 60 L 40 60" />
            </svg>
          </div>

          {/* Semi Finals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 120 }}>
            <MatchNode match={sf[0]} title="Semi-Final 1" />
            <MatchNode match={sf[1]} title="Semi-Final 2" />
          </div>

          {/* Connectors */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <svg width="40" height="240" style={{ stroke: 'var(--border-subtle)', strokeWidth: 2, fill: 'none' }}>
              <path d="M 0 0 L 20 0 L 20 240 L 0 240 M 20 120 L 40 120" />
            </svg>
          </div>

          {/* Final */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)' }}>
                <Trophy size={32} color="#FFD700" />
              </div>
              <MatchNode match={finalMatch} title="World Cup Final" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
