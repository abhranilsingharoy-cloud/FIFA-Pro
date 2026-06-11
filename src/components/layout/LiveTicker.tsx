import { Match } from '../../types';
import { useNavigate } from 'react-router-dom';

function getCountryFlag(code: string) {
  return `https://flagcdn.com/24x18/${code.toLowerCase().replace('gb-eng', 'gb')}.png`;
}

function formatScore(match: Match) {
  if (match.score) return `${match.score.home} - ${match.score.away}`;
  return 'vs';
}

export default function LiveTicker({ matches }: { matches: Match[] }) {
  const navigate = useNavigate();
  const items = [...matches, ...matches]; // duplicate for seamless loop

  return (
    <div style={{
      background: 'linear-gradient(90deg, var(--brand-red), #8B0000)',
      padding: '6px 0',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {items.map((match, i) => (
            <button
              key={`${match.id}-${i}`}
              onClick={() => navigate(`/matches/${match.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 6, padding: '3px 12px',
                cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              <img src={getCountryFlag(match.homeTeam.countryCode)} alt="" style={{ height: 14, borderRadius: 2 }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: 'white' }}>
                {formatScore(match)}
              </span>
              <img src={getCountryFlag(match.awayTeam.countryCode)} alt="" style={{ height: 14, borderRadius: 2 }} />
              {match.liveMinute && (
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{match.liveMinute}'</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
