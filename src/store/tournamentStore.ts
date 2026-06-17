import { create } from 'zustand';
import type { Match, Player, Team } from '../types';
import { fetchMatches, fetchTeams, fetchPlayers } from '../services/api';

interface TournamentState {
  matches: Match[];
  players: Player[];
  teams: Team[];
  liveMatches: Match[];
  selectedTimezone: string;
  performanceMode: boolean;
  sidebarOpen: boolean;
  isLoading: boolean;
  error: string | null;
  // Actions
  setMatches: (matches: Match[]) => void;
  updateMatchScore: (matchId: string, homeScore: number, awayScore: number) => void;
  updateMatchMinute: (matchId: string, minute: number) => void;
  setTimezone: (tz: string) => void;
  togglePerformanceMode: () => void;
  toggleSidebar: () => void;
  fetchData: (backgroundRefresh?: boolean) => Promise<void>;
  startAutoRefresh: () => void;
}

export const useTournamentStore = create<TournamentState>((set, get) => ({
  matches: [],
  players: [],
  teams: [],
  liveMatches: [],
  selectedTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  performanceMode: false,
  sidebarOpen: false,
  isLoading: true,
  error: null,

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

  fetchData: async (backgroundRefresh = false) => {
    if (!backgroundRefresh) set({ isLoading: true, error: null });
    try {
      const [matches, teams, players] = await Promise.all([
        fetchMatches(),
        fetchTeams(),
        fetchPlayers()
      ]);
      set({
        matches,
        teams,
        players,
        liveMatches: matches.filter(m => m.status === 'live'),
        isLoading: false
      });
    } catch (err: any) {
      if (!backgroundRefresh) set({ error: err.message || 'Failed to fetch data', isLoading: false });
    }
  },

  startAutoRefresh: () => {
    if ((window as any).refreshInterval) return;
    (window as any).refreshInterval = setInterval(() => {
      get().fetchData(true);
    }, 30000);
  }
}));
