import { create } from 'zustand';
import { MATCHES } from '../data/matches';
import { PLAYERS } from '../data/players';
import { TEAMS } from '../data/teams';
import type { Match, Player, Team } from '../types';

interface TournamentState {
  matches: Match[];
  players: Player[];
  teams: Team[];
  liveMatches: Match[];
  selectedTimezone: string;
  performanceMode: boolean;
  sidebarOpen: boolean;
  // Actions
  setMatches: (matches: Match[]) => void;
  updateMatchScore: (matchId: string, homeScore: number, awayScore: number) => void;
  updateMatchMinute: (matchId: string, minute: number) => void;
  setTimezone: (tz: string) => void;
  togglePerformanceMode: () => void;
  toggleSidebar: () => void;
  simulateLiveUpdate: () => void;
}

export const useTournamentStore = create<TournamentState>((set, get) => ({
  matches: MATCHES,
  players: PLAYERS,
  teams: TEAMS,
  liveMatches: MATCHES.filter(m => m.status === 'live'),
  selectedTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  performanceMode: false,
  sidebarOpen: false,

  setMatches: (matches) => set({ matches, liveMatches: matches.filter(m => m.status === 'live') }),

  updateMatchScore: (matchId, homeScore, awayScore) =>
    set(state => ({
      matches: state.matches.map(m =>
        m.id === matchId ? { ...m, score: { home: homeScore, away: awayScore } } : m
      )
    })),

  updateMatchMinute: (matchId, minute) =>
    set(state => ({
      matches: state.matches.map(m =>
        m.id === matchId ? { ...m, liveMinute: minute } : m
      )
    })),

  setTimezone: (tz) => set({ selectedTimezone: tz }),
  togglePerformanceMode: () => set(state => ({ performanceMode: !state.performanceMode })),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  simulateLiveUpdate: () => {
    const { matches } = get();
    const liveMatch = matches.find(m => m.status === 'live');
    if (!liveMatch) return;

    set(state => ({
      matches: state.matches.map(m => {
        if (m.status === 'live' && m.liveMinute !== undefined) {
          const newMinute = Math.min((m.liveMinute || 0) + 1, 90);
          return { ...m, liveMinute: newMinute };
        }
        return m;
      })
    }));
  },
}));

// Auto-simulate live updates every 60 seconds
let liveInterval: ReturnType<typeof setInterval> | null = null;
export function startLiveSimulation(store: typeof useTournamentStore) {
  if (liveInterval) return;
  liveInterval = setInterval(() => {
    store.getState().simulateLiveUpdate();
  }, 60000);
}
