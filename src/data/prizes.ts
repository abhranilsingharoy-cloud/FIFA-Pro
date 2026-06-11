import type { PrizeBreakdown } from '../types';

export const PRIZE_POOL_TOTAL = 1_000_000_000;

export const PRIZE_BREAKDOWN: PrizeBreakdown[] = [
  { stage: 'group', stageLabel: 'Group Stage Exit', prizeUSD: 13_000_000, teamsEliminated: ['CA', 'TN', 'AU', 'MN', 'QA', 'ZM', 'KR', 'IR', 'SN', 'CO'] },
  { stage: 'r32', stageLabel: 'Round of 32 Exit', prizeUSD: 18_000_000, teamsEliminated: [] },
  { stage: 'r16', stageLabel: 'Round of 16 Exit', prizeUSD: 25_000_000, teamsEliminated: [] },
  { stage: 'qf', stageLabel: 'Quarter-final Exit', prizeUSD: 37_000_000, teamsEliminated: [] },
  { stage: 'sf', stageLabel: 'Semi-final Exit', prizeUSD: 50_000_000, teamsEliminated: [] },
  { stage: 'third', stageLabel: '3rd Place', prizeUSD: 65_000_000, teamsEliminated: [] },
  { stage: 'runner_up', stageLabel: 'Runner-Up', prizeUSD: 100_000_000, teamsEliminated: [] },
  { stage: 'champion', stageLabel: 'World Champions', prizeUSD: 150_000_000, teamsEliminated: [] },
];

export const HISTORICAL_PRIZE_POOLS = [
  { year: 2006, amount: 266_000_000 },
  { year: 2010, amount: 420_000_000 },
  { year: 2014, amount: 576_000_000 },
  { year: 2018, amount: 791_000_000 },
  { year: 2022, amount: 440_000_000 },
  { year: 2026, amount: 1_000_000_000 },
];
