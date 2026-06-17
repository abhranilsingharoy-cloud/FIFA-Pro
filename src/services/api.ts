import axios from 'axios';
import { MATCHES } from '../data/matches';
import { TEAMS } from '../data/teams';
import { PLAYERS } from '../data/players';
import type { Match, Team, Player, MatchEvent } from '../types';

const ESPN_API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

// Helper to determine stage from ESPN slug
function parseStage(slug: string): Match['stage'] {
  if (slug?.includes('group')) return 'group';
  if (slug?.includes('round-of-32')) return 'r32';
  if (slug?.includes('round-of-16')) return 'r16';
  if (slug?.includes('quarterfinals')) return 'qf';
  if (slug?.includes('semifinals')) return 'sf';
  if (slug?.includes('3rd-place')) return 'third';
  if (slug?.includes('final')) return 'final';
  return 'group';
}

export const fetchMatches = async (): Promise<Match[]> => {
  try {
    const response = await axios.get(`${ESPN_API_BASE}/scoreboard?dates=2026&limit=200`);
    if (response.data?.events?.length > 0) {
      return response.data.events.map((ev: any, index: number) => {
        const homeComp = ev.competitions[0].competitors.find((c: any) => c.homeAway === 'home');
        const awayComp = ev.competitions[0].competitors.find((c: any) => c.homeAway === 'away');
        
        let status: Match['status'] = 'scheduled';
        const state = ev.status.type.state; // 'pre', 'in', 'post'
        if (state === 'in') status = 'live';
        if (state === 'post') status = 'completed';

        // Parse events (goals, cards) from details array if available
        const events: MatchEvent[] = [];
        if (ev.competitions[0].details) {
          ev.competitions[0].details.forEach((d: any) => {
            const teamSide = d.team?.id === homeComp?.team?.id ? 'home' : 'away';
            let type: MatchEvent['type'] = 'goal';
            if (d.type.text.includes('Yellow Card')) type = 'yellow_card';
            if (d.type.text.includes('Red Card')) type = 'red_card';
            if (d.type.text.includes('Own Goal')) type = 'own_goal';
            if (d.type.text.includes('Penalty')) type = 'penalty';

            const playerInvolved = d.athletesInvolved?.[0]?.shortName || 'Unknown Player';

            events.push({
              id: `ev_${d.clock.value}`,
              type,
              minute: Math.floor(d.clock.value / 60) || 0,
              team: teamSide,
              playerName: playerInvolved,
              description: d.type.text,
            });
          });
        }

        return {
          id: String(ev.id),
          stage: parseStage(ev.season?.slug),
          groupId: ev.season?.slug?.includes('group') ? 'A' : undefined, // Simplify group ID
          matchNumber: index + 1,
          homeTeam: {
            countryCode: homeComp?.team?.abbreviation || 'TBA',
            name: homeComp?.team?.name || 'TBA',
          },
          awayTeam: {
            countryCode: awayComp?.team?.abbreviation || 'TBA',
            name: awayComp?.team?.name || 'TBA',
          },
          stadiumId: ev.competitions[0].venue?.displayName || 'Unknown Stadium',
          kickoffUtc: ev.date,
          status,
          score: state !== 'pre' ? {
            home: parseInt(homeComp?.score || '0', 10),
            away: parseInt(awayComp?.score || '0', 10)
          } : undefined,
          liveMinute: state === 'in' ? Math.floor(ev.status.clock / 60) : undefined,
          events: events,
        };
      });
    }
  } catch (error) {
    console.error('Error fetching matches from ESPN:', error);
  }
  return MATCHES;
};

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const response = await axios.get(`${ESPN_API_BASE}/teams?limit=100`);
    if (response.data?.sports?.[0]?.leagues?.[0]?.teams?.length > 0) {
      const espnTeams = response.data.sports[0].leagues[0].teams;
      return TEAMS.map(mockTeam => {
        // Try to match by countryCode (abbreviation) first, then fallback to name
        const liveTeam = espnTeams.find((et: any) => 
          et.team.abbreviation?.toLowerCase() === mockTeam.countryCode.toLowerCase() ||
          et.team.displayName?.toLowerCase() === mockTeam.name.toLowerCase()
        );
        
        if (liveTeam) {
          const td = liveTeam.team;
          return {
            ...mockTeam,
            name: td.displayName || td.name,
            espnId: td.id,
            flag: td.logos?.[0]?.href || mockTeam.flag,
            primaryColor: td.color ? `#${td.color}` : mockTeam.primaryColor,
            secondaryColor: td.alternateColor ? `#${td.alternateColor}` : mockTeam.secondaryColor,
          };
        }
        return mockTeam;
      });
    }
  } catch (error) {
    console.error('Error fetching teams from ESPN:', error);
  }
  return TEAMS;
};

export const fetchPlayers = async (): Promise<Player[]> => {
  // ESPN doesn't provide a flat list of all tournament players easily.
  // We'll fall back to our highly realistic mock data for players.
  return Promise.resolve(PLAYERS);
};

export const fetchTopScorers = async (): Promise<Player[]> => {
  try {
    const response = await axios.get(`${ESPN_API_BASE}/statistics`);
    const goalsLeaders = response.data?.stats?.find((s: any) => s.name === 'goalsLeaders');
    if (goalsLeaders?.leaders?.length > 0) {
      return goalsLeaders.leaders.map((leader: any, index: number) => {
        const ath = leader.athlete;
        return {
          id: ath.id || `dyn_${index}`,
          name: ath.displayName || ath.shortName,
          countryCode: ath.team?.abbreviation || 'XX',
          clubName: 'National Team', 
          dateOfBirth: '2000-01-01',
          position: 'Forward' as any,
          jerseyNumber: parseInt(ath.jersey || '9', 10) || 9,
          isLegend: false,
          tournamentStats: {
            goals: parseInt(leader.value || '0', 10),
            assists: 0,
            avgRating: 0
          } as any
        };
      });
    }
  } catch (error) {
    console.error('Error fetching top scorers from ESPN:', error);
  }
  return [];
};

