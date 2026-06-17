export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';
export type MatchStatus = 'scheduled' | 'live' | 'ht' | 'completed' | 'postponed';
export type MatchStage = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'third';
export type Surface = 'natural' | 'hybrid' | 'artificial';
export type RoofType = 'open' | 'retractable' | 'covered';
export type Confederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'CAF' | 'AFC' | 'OFC';

export interface PlayerStats {
  matchesPlayed: number;
  minutesPlayed: number;
  goals: number;
  goalsHeader: number;
  goalsFreekick: number;
  goalsPenalty: number;
  assists: number;
  keyPasses: number;
  shotsTotal: number;
  shotsOnTarget: number;
  xG: number;
  xA: number;
  passCompletionPct: number;
  tacklesWon: number;
  interceptions: number;
  clearances: number;
  aerialDuelsWonPct: number;
  yellowCards: number;
  redCards: number;
  avgRating: number;
  manOfTheMatchAwards: number;
  distanceCoveredAvg: number;
  saves?: number;
  savesPct?: number;
  cleanSheets?: number;
  progressivePasses?: number;
  crosses?: number;
  throughBalls?: number;
  blockedShots?: number;
  pressuresApplied?: number;
  sprintDistance?: number;
  maxSpeed?: number;
}

export interface Player {
  id: string;
  name: string;
  countryCode: string;
  dateOfBirth: string;
  position: Position;
  clubName: string;
  jerseyNumber: number;
  photoUrl?: string;
  height?: number;
  weight?: number;
  tournamentStats: PlayerStats;
  isLegend?: boolean;
}

export interface TeamRef {
  countryCode: string;
  name: string;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'var' | 'own_goal';
  minute: number;
  stoppageTime?: number;
  team: 'home' | 'away';
  playerId?: string;
  playerName?: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  subOnPlayerId?: string;
  subOnPlayerName?: string;
  description?: string;
}

export interface MatchStats {
  possession: [number, number];
  shotsTotal: [number, number];
  shotsOnTarget: [number, number];
  xG: [number, number];
  corners: [number, number];
  fouls: [number, number];
  offsides: [number, number];
  passes: [number, number];
  passAccuracy: [number, number];
  tackles: [number, number];
  yellowCards: [number, number];
  redCards: [number, number];
}

export interface Match {
  id: string;
  stage: MatchStage;
  groupId?: string;
  matchNumber: number;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  stadiumId: string;
  kickoffUtc: string;
  status: MatchStatus;
  score?: { home: number; away: number };
  liveMinute?: number;
  events: MatchEvent[];
  stats?: MatchStats;
  attendance?: number;
  referee?: string;
  manOfTheMatch?: string;
}

export interface Stadium {
  id: string;
  name: string;
  nickname?: string;
  city: string;
  country: 'USA' | 'Canada' | 'Mexico';
  capacity: number;
  wcCapacity: number;
  lat: number;
  lng: number;
  surface: Surface;
  roofType: RoofType;
  builtYear: number;
  renovatedYear?: number;
  photoUrl?: string;
  altitude?: number;
  matches: string[];
  nearestAirport?: string;
}

export interface Team {
  espnId?: string;
  countryCode: string;
  name: string;
  flag: string;
  confederation: Confederation;
  fifaRanking: number;
  groupId: string;
  manager: string;
  managerNationality: string;
  squadSize: number;
  avgAge: number;
  keyPlayerId: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  matchesPlayed: number;
  primaryColor: string;
  secondaryColor: string;
}

export interface PrizeBreakdown {
  stage: string;
  stageLabel: string;
  prizeUSD: number;
  teamsEliminated: string[];
}

export interface LegendCharacter {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  position: Position;
  jersey: number;
  signatureColor: string;
  particleColor: string;
  signatureMove: string;
  idleAnimation: string;
  entranceCinematic: string;
  celebrationStyle: string;
  glowAura: string;
  stat: string;
  statLabel: string;
}

export interface StandingRow {
  team: TeamRef;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface TournamentGroup {
  id: string;
  name: string;
  standings: StandingRow[];
}
