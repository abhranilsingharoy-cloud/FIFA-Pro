import axios from 'axios';
import { MATCHES } from '../data/matches';
import { TEAMS } from '../data/teams';
import { PLAYERS } from '../data/players';
import type { Match, Team, Player } from '../types';

const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-apisports-key': API_KEY,
  },
});

export const fetchMatches = async (): Promise<Match[]> => {
  if (!API_KEY) {
    console.warn('API key not found, using fallback matches data.');
    return Promise.resolve(MATCHES);
  }

  try {
    // In a real scenario, you would map the API-Sports response 
    // to your internal Match interface. Since the World Cup 2026 
    // hasn't started and we want compatibility, if the API call 
    // fails or returns empty data for the specific league, we fall back.
    const response = await apiClient.get('/fixtures', {
      params: { league: 1, season: 2026 } // World Cup league ID is typically 1
    });

    if (response.data.results > 0) {
      // Map API response to our Match interface
      // Note: This is simplified. You would need proper mapping.
      const mappedMatches = response.data.response.map((f: any) => ({
        id: String(f.fixture.id),
        stage: 'group', // simplified
        matchNumber: f.fixture.id,
        homeTeam: { name: f.teams.home.name, countryCode: f.teams.home.name.substring(0, 2).toUpperCase() },
        awayTeam: { name: f.teams.away.name, countryCode: f.teams.away.name.substring(0, 2).toUpperCase() },
        stadiumId: 'sofi',
        kickoffUtc: f.fixture.date,
        status: f.fixture.status.short === 'FT' ? 'completed' : 'scheduled',
        score: { home: f.goals.home || 0, away: f.goals.away || 0 },
        events: [], // map events if needed
      }));
      return mappedMatches;
    } else {
      console.log('No matches found in API, falling back to mock data.');
      return MATCHES;
    }
  } catch (error) {
    console.error('Error fetching matches:', error);
    console.warn('Falling back to local match data.');
    return MATCHES;
  }
};

export const fetchTeams = async (): Promise<Team[]> => {
  if (!API_KEY) {
    return Promise.resolve(TEAMS);
  }

  try {
    const response = await apiClient.get('/teams', {
      params: { league: 1, season: 2026 }
    });

    if (response.data.results > 0) {
      // Basic mapping strategy
      return response.data.response.map((t: any) => {
        const fallbackTeam = TEAMS.find(ft => ft.name === t.team.name);
        return {
          countryCode: fallbackTeam?.countryCode || t.team.name.substring(0, 2).toUpperCase(),
          name: t.team.name,
          flag: t.team.logo,
          confederation: fallbackTeam?.confederation || 'UEFA',
          fifaRanking: fallbackTeam?.fifaRanking || 0,
          groupId: fallbackTeam?.groupId || 'A',
          manager: fallbackTeam?.manager || 'Unknown',
          managerNationality: fallbackTeam?.managerNationality || 'Unknown',
          squadSize: fallbackTeam?.squadSize || 26,
          avgAge: fallbackTeam?.avgAge || 26.5,
          keyPlayerId: fallbackTeam?.keyPlayerId || '',
          wins: fallbackTeam?.wins || 0,
          draws: fallbackTeam?.draws || 0,
          losses: fallbackTeam?.losses || 0,
          goalsFor: fallbackTeam?.goalsFor || 0,
          goalsAgainst: fallbackTeam?.goalsAgainst || 0,
          points: fallbackTeam?.points || 0,
          matchesPlayed: fallbackTeam?.matchesPlayed || 0,
          primaryColor: fallbackTeam?.primaryColor || '#000000',
          secondaryColor: fallbackTeam?.secondaryColor || '#ffffff',
        };
      });
    }
    return TEAMS;
  } catch (error) {
    console.error('Error fetching teams:', error);
    return TEAMS;
  }
};

export const fetchPlayers = async (): Promise<Player[]> => {
  if (!API_KEY) {
    return Promise.resolve(PLAYERS);
  }

  try {
    const response = await apiClient.get('/players', {
      params: { league: 1, season: 2026 }
    });

    if (response.data.results > 0) {
      return response.data.response.map((p: any) => {
        const fallbackPlayer = PLAYERS.find(fp => fp.name === p.player.name);
        return {
          id: String(p.player.id),
          name: p.player.name,
          countryCode: fallbackPlayer?.countryCode || 'XX',
          dateOfBirth: p.player.birth.date || '1990-01-01',
          position: p.statistics[0]?.games?.position || 'MID',
          clubName: p.statistics[0]?.team?.name || 'Unknown',
          jerseyNumber: p.statistics[0]?.games?.number || 10,
          photoUrl: p.player.photo,
          height: p.player.height ? parseInt(p.player.height) : 180,
          weight: p.player.weight ? parseInt(p.player.weight) : 75,
          tournamentStats: fallbackPlayer?.tournamentStats || {
            matchesPlayed: 0, minutesPlayed: 0, goals: 0, goalsHeader: 0,
            goalsFreekick: 0, goalsPenalty: 0, assists: 0, keyPasses: 0,
            shotsTotal: 0, shotsOnTarget: 0, xG: 0, xA: 0, passCompletionPct: 0,
            tacklesWon: 0, interceptions: 0, clearances: 0, aerialDuelsWonPct: 0,
            yellowCards: 0, redCards: 0, avgRating: 0, manOfTheMatchAwards: 0, distanceCoveredAvg: 0
          }
        };
      });
    }
    return PLAYERS;
  } catch (error) {
    console.error('Error fetching players:', error);
    return PLAYERS;
  }
};
