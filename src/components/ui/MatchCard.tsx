import { motion } from 'framer-motion';
import type { Match } from '../../types';
import { useNavigate } from 'react-router-dom';
import CountryFlag from './CountryFlag';

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

const stageLabels: Record<string, string> = {
  group: 'Group Stage', r32: 'Round of 32', r16: 'Round of 16',
  qf: 'Quarter Final', sf: 'Semi Final', final: 'World Cup Final', third: '3rd Place',
};

function formatKickoff(utc: string, tz?: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    timeZone: tz || Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(new Date(utc));
}

export default function MatchCard({ match, compact = false }: MatchCardProps) {
  const navigate = useNavigate();
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  return (
    <motion.div
      whileHover={{ scale: 1.01, borderColor: 'rgba(255,215,0,0.4)' }}
      onClick={() => navigate(`/matches/${match.id}`)}
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${isLive ? 'rgba(255,59,59,0.4)' : 'var(--border-subtle)'}`,
        borderLeft: `3px solid ${isLive ? 'var(--live-red)' : isCompleted ? 'var(--success-green)' : 'var(--text-muted)'}`,
        borderRadius: 10,
        padding: compact ? '10px 14px' : '14px 18px',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        {/* Home team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <CountryFlag countryCode={match.homeTeam.countryCode} size="md" />
          <span style={{ fontWeight: 600, fontSize: compact ? 13 : 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score / Time */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          {isLive && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 2 }}>
              <span className="live-dot" />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--live-red)' }}>{match.liveMinute}'</span>
            </div>
          )}
          {(isCompleted || isLive) && match.score ? (
            <span style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: compact ? 22 : 28,
              letterSpacing: '0.05em',
              color: isLive ? 'var(--live-red)' : 'white',
            }}>
              {match.score.home} – {match.score.away}
            </span>
          ) : (
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--text-secondary)' }}>
                {formatKickoff(match.kickoffUtc)}
              </span>
            </div>
          )}
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            {stageLabels[match.stage] || match.stage}
            {match.groupId && ` • Grp ${match.groupId}`}
          </div>
        </div>

        {/* Away team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
          <span style={{ fontWeight: 600, fontSize: compact ? 13 : 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {match.awayTeam.name}
          </span>
          <CountryFlag countryCode={match.awayTeam.countryCode} size="md" />
        </div>
      </div>
    </motion.div>
  );
}
