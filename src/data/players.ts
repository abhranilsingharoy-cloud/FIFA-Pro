import type { Player } from '../types';

export const PLAYERS: Player[] = [
  // LEGENDS
  {
    id: 'ronaldo', name: 'Cristiano Ronaldo', countryCode: 'PT', dateOfBirth: '1985-02-05',
    position: 'FWD', clubName: 'Al Nassr', jerseyNumber: 7, height: 187, weight: 83, isLegend: true,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 450, goals: 6, goalsHeader: 1, goalsFreekick: 1, goalsPenalty: 2, assists: 2, keyPasses: 14, shotsTotal: 28, shotsOnTarget: 14, xG: 4.8, xA: 1.9, passCompletionPct: 84, tacklesWon: 3, interceptions: 1, clearances: 1, aerialDuelsWonPct: 61, yellowCards: 0, redCards: 0, avgRating: 8.1, manOfTheMatchAwards: 2, distanceCoveredAvg: 9.8, progressivePasses: 12, crosses: 8, throughBalls: 3, blockedShots: 0, pressuresApplied: 22, sprintDistance: 2.1, maxSpeed: 34.1 }
  },
  {
    id: 'messi', name: 'Lionel Messi', countryCode: 'AR', dateOfBirth: '1987-06-24',
    position: 'FWD', clubName: 'Inter Miami', jerseyNumber: 10, height: 170, weight: 72, isLegend: true,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 450, goals: 5, goalsHeader: 0, goalsFreekick: 1, goalsPenalty: 1, assists: 7, keyPasses: 31, shotsTotal: 22, shotsOnTarget: 11, xG: 4.1, xA: 5.8, passCompletionPct: 89, tacklesWon: 6, interceptions: 2, clearances: 0, aerialDuelsWonPct: 28, yellowCards: 1, redCards: 0, avgRating: 9.0, manOfTheMatchAwards: 4, distanceCoveredAvg: 9.2, progressivePasses: 28, crosses: 15, throughBalls: 9, blockedShots: 0, pressuresApplied: 18, sprintDistance: 1.6, maxSpeed: 31.2 }
  },
  {
    id: 'neymar', name: 'Neymar Jr.', countryCode: 'BR', dateOfBirth: '1992-02-05',
    position: 'FWD', clubName: 'Al Hilal', jerseyNumber: 10, height: 175, weight: 68, isLegend: true,
    tournamentStats: { matchesPlayed: 4, minutesPlayed: 360, goals: 4, goalsHeader: 0, goalsFreekick: 1, goalsPenalty: 1, assists: 5, keyPasses: 22, shotsTotal: 18, shotsOnTarget: 10, xG: 3.2, xA: 4.1, passCompletionPct: 87, tacklesWon: 4, interceptions: 1, clearances: 0, aerialDuelsWonPct: 22, yellowCards: 2, redCards: 0, avgRating: 8.3, manOfTheMatchAwards: 2, distanceCoveredAvg: 9.5, progressivePasses: 18, crosses: 24, throughBalls: 7, blockedShots: 0, pressuresApplied: 15, sprintDistance: 1.9, maxSpeed: 33.4 }
  },
  {
    id: 'yamal', name: 'Lamine Yamal', countryCode: 'ES', dateOfBirth: '2007-07-13',
    position: 'FWD', clubName: 'FC Barcelona', jerseyNumber: 19, height: 180, weight: 68, isLegend: true,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 450, goals: 5, goalsHeader: 0, goalsFreekick: 1, goalsPenalty: 0, assists: 6, keyPasses: 27, shotsTotal: 21, shotsOnTarget: 12, xG: 4.0, xA: 5.2, passCompletionPct: 86, tacklesWon: 7, interceptions: 3, clearances: 0, aerialDuelsWonPct: 32, yellowCards: 0, redCards: 0, avgRating: 8.7, manOfTheMatchAwards: 3, distanceCoveredAvg: 10.2, progressivePasses: 22, crosses: 30, throughBalls: 5, blockedShots: 0, pressuresApplied: 28, sprintDistance: 2.3, maxSpeed: 35.5 }
  },
  {
    id: 'mbappe', name: 'Kylian Mbappé', countryCode: 'FR', dateOfBirth: '1998-12-20',
    position: 'FWD', clubName: 'Real Madrid', jerseyNumber: 10, height: 178, weight: 73, isLegend: true,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 450, goals: 7, goalsHeader: 0, goalsFreekick: 0, goalsPenalty: 2, assists: 3, keyPasses: 19, shotsTotal: 32, shotsOnTarget: 17, xG: 5.9, xA: 2.8, passCompletionPct: 82, tacklesWon: 5, interceptions: 2, clearances: 0, aerialDuelsWonPct: 35, yellowCards: 1, redCards: 0, avgRating: 8.5, manOfTheMatchAwards: 3, distanceCoveredAvg: 10.8, progressivePasses: 14, crosses: 10, throughBalls: 6, blockedShots: 0, pressuresApplied: 30, sprintDistance: 3.1, maxSpeed: 38.6 }
  },
  {
    id: 'modric', name: 'Luka Modrić', countryCode: 'HR', dateOfBirth: '1985-09-09',
    position: 'MID', clubName: 'Real Madrid', jerseyNumber: 10, height: 172, weight: 66, isLegend: true,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 430, goals: 2, goalsHeader: 0, goalsFreekick: 1, goalsPenalty: 0, assists: 4, keyPasses: 29, shotsTotal: 11, shotsOnTarget: 6, xG: 1.4, xA: 3.6, passCompletionPct: 91, tacklesWon: 14, interceptions: 9, clearances: 3, aerialDuelsWonPct: 44, yellowCards: 1, redCards: 0, avgRating: 8.2, manOfTheMatchAwards: 2, distanceCoveredAvg: 11.3, progressivePasses: 35, crosses: 12, throughBalls: 8, blockedShots: 2, pressuresApplied: 40, sprintDistance: 1.8, maxSpeed: 30.2 }
  },
  {
    id: 'neuer', name: 'Manuel Neuer', countryCode: 'DE', dateOfBirth: '1986-03-27',
    position: 'GK', clubName: 'Bayern Munich', jerseyNumber: 1, height: 193, weight: 93, isLegend: true,
    tournamentStats: { matchesPlayed: 4, minutesPlayed: 360, goals: 0, goalsHeader: 0, goalsFreekick: 0, goalsPenalty: 0, assists: 0, keyPasses: 2, shotsTotal: 0, shotsOnTarget: 0, xG: 0, xA: 0, passCompletionPct: 78, tacklesWon: 0, interceptions: 5, clearances: 12, aerialDuelsWonPct: 78, yellowCards: 0, redCards: 0, avgRating: 7.8, manOfTheMatchAwards: 1, distanceCoveredAvg: 5.9, saves: 16, savesPct: 84, cleanSheets: 2, progressivePasses: 4, sprintDistance: 0.8, maxSpeed: 26.1 }
  },
  {
    id: 'kane', name: 'Harry Kane', countryCode: 'GB', dateOfBirth: '1993-07-28',
    position: 'FWD', clubName: 'Bayern Munich', jerseyNumber: 9, height: 188, weight: 86, isLegend: true,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 450, goals: 5, goalsHeader: 2, goalsFreekick: 0, goalsPenalty: 1, assists: 3, keyPasses: 18, shotsTotal: 24, shotsOnTarget: 13, xG: 4.6, xA: 2.9, passCompletionPct: 80, tacklesWon: 4, interceptions: 1, clearances: 2, aerialDuelsWonPct: 68, yellowCards: 1, redCards: 0, avgRating: 8.0, manOfTheMatchAwards: 2, distanceCoveredAvg: 10.1, progressivePasses: 10, crosses: 5, throughBalls: 4, blockedShots: 1, pressuresApplied: 25, sprintDistance: 1.7, maxSpeed: 32.8 }
  },
  {
    id: 'hakimi', name: 'Achraf Hakimi', countryCode: 'MA', dateOfBirth: '1998-11-04',
    position: 'DEF', clubName: 'PSG', jerseyNumber: 2, height: 181, weight: 73, isLegend: true,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 450, goals: 2, goalsHeader: 0, goalsFreekick: 0, goalsPenalty: 0, assists: 4, keyPasses: 16, shotsTotal: 9, shotsOnTarget: 5, xG: 1.2, xA: 2.8, passCompletionPct: 85, tacklesWon: 18, interceptions: 12, clearances: 14, aerialDuelsWonPct: 55, yellowCards: 1, redCards: 0, avgRating: 8.2, manOfTheMatchAwards: 2, distanceCoveredAvg: 12.1, progressivePasses: 20, crosses: 35, throughBalls: 3, blockedShots: 5, pressuresApplied: 38, sprintDistance: 2.8, maxSpeed: 36.5 }
  },
  {
    id: 'haaland', name: 'Erling Haaland', countryCode: 'NO', dateOfBirth: '2000-07-21',
    position: 'FWD', clubName: 'Manchester City', jerseyNumber: 9, height: 194, weight: 88, isLegend: true,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 450, goals: 8, goalsHeader: 3, goalsFreekick: 0, goalsPenalty: 1, assists: 2, keyPasses: 8, shotsTotal: 30, shotsOnTarget: 18, xG: 7.2, xA: 1.6, passCompletionPct: 72, tacklesWon: 2, interceptions: 1, clearances: 2, aerialDuelsWonPct: 75, yellowCards: 1, redCards: 0, avgRating: 8.8, manOfTheMatchAwards: 3, distanceCoveredAvg: 9.6, progressivePasses: 5, crosses: 2, throughBalls: 1, blockedShots: 0, pressuresApplied: 15, sprintDistance: 2.0, maxSpeed: 36.0 }
  },
  // Additional non-legend players
  {
    id: 'pulisic', name: 'Christian Pulisic', countryCode: 'US', dateOfBirth: '1998-09-18',
    position: 'MID', clubName: 'AC Milan', jerseyNumber: 10, height: 177, weight: 70,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 430, goals: 4, goalsHeader: 0, goalsFreekick: 1, goalsPenalty: 0, assists: 3, keyPasses: 18, shotsTotal: 16, shotsOnTarget: 9, xG: 3.1, xA: 2.7, passCompletionPct: 85, tacklesWon: 8, interceptions: 4, clearances: 1, aerialDuelsWonPct: 34, yellowCards: 1, redCards: 0, avgRating: 7.9, manOfTheMatchAwards: 1, distanceCoveredAvg: 10.5, progressivePasses: 16, crosses: 18, throughBalls: 4, blockedShots: 1, pressuresApplied: 32, sprintDistance: 2.2, maxSpeed: 34.2 }
  },
  {
    id: 'osimhen', name: 'Victor Osimhen', countryCode: 'NG', dateOfBirth: '1998-12-29',
    position: 'FWD', clubName: 'Galatasaray', jerseyNumber: 9, height: 185, weight: 78,
    tournamentStats: { matchesPlayed: 3, minutesPlayed: 270, goals: 3, goalsHeader: 1, goalsFreekick: 0, goalsPenalty: 0, assists: 1, keyPasses: 8, shotsTotal: 14, shotsOnTarget: 7, xG: 2.8, xA: 0.9, passCompletionPct: 74, tacklesWon: 2, interceptions: 1, clearances: 1, aerialDuelsWonPct: 62, yellowCards: 1, redCards: 0, avgRating: 7.6, manOfTheMatchAwards: 1, distanceCoveredAvg: 9.8, progressivePasses: 5, crosses: 3, throughBalls: 2, blockedShots: 0, pressuresApplied: 18, sprintDistance: 1.9, maxSpeed: 35.1 }
  },
  {
    id: 'de_bruyne', name: 'Kevin De Bruyne', countryCode: 'BE', dateOfBirth: '1991-06-28',
    position: 'MID', clubName: 'Manchester City', jerseyNumber: 7, height: 181, weight: 70,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 440, goals: 3, goalsHeader: 0, goalsFreekick: 2, goalsPenalty: 0, assists: 6, keyPasses: 32, shotsTotal: 14, shotsOnTarget: 8, xG: 2.4, xA: 5.2, passCompletionPct: 90, tacklesWon: 9, interceptions: 5, clearances: 1, aerialDuelsWonPct: 40, yellowCards: 1, redCards: 0, avgRating: 8.4, manOfTheMatchAwards: 2, distanceCoveredAvg: 11.0, progressivePasses: 38, crosses: 22, throughBalls: 11, blockedShots: 1, pressuresApplied: 29, sprintDistance: 1.7, maxSpeed: 31.5 }
  },
  {
    id: 'son', name: 'Son Heung-min', countryCode: 'KR', dateOfBirth: '1992-07-08',
    position: 'FWD', clubName: 'Tottenham', jerseyNumber: 7, height: 183, weight: 77,
    tournamentStats: { matchesPlayed: 3, minutesPlayed: 270, goals: 2, goalsHeader: 0, goalsFreekick: 0, goalsPenalty: 0, assists: 1, keyPasses: 10, shotsTotal: 11, shotsOnTarget: 6, xG: 1.8, xA: 1.2, passCompletionPct: 83, tacklesWon: 5, interceptions: 3, clearances: 0, aerialDuelsWonPct: 38, yellowCards: 0, redCards: 0, avgRating: 7.3, manOfTheMatchAwards: 0, distanceCoveredAvg: 10.4, progressivePasses: 8, crosses: 12, throughBalls: 2, blockedShots: 0, pressuresApplied: 22, sprintDistance: 2.0, maxSpeed: 33.9 }
  },
  {
    id: 'nunez_darwin', name: 'Darwin Núñez', countryCode: 'UY', dateOfBirth: '1999-06-24',
    position: 'FWD', clubName: 'Liverpool', jerseyNumber: 9, height: 187, weight: 81,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 440, goals: 6, goalsHeader: 2, goalsFreekick: 0, goalsPenalty: 0, assists: 2, keyPasses: 12, shotsTotal: 25, shotsOnTarget: 14, xG: 5.1, xA: 1.8, passCompletionPct: 76, tacklesWon: 3, interceptions: 2, clearances: 2, aerialDuelsWonPct: 65, yellowCards: 2, redCards: 0, avgRating: 7.9, manOfTheMatchAwards: 2, distanceCoveredAvg: 10.2, progressivePasses: 7, crosses: 4, throughBalls: 2, blockedShots: 0, pressuresApplied: 28, sprintDistance: 2.2, maxSpeed: 34.7 }
  },
  {
    id: 'gakpo', name: 'Cody Gakpo', countryCode: 'NL', dateOfBirth: '1999-05-07',
    position: 'FWD', clubName: 'Liverpool', jerseyNumber: 11, height: 191, weight: 78,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 430, goals: 4, goalsHeader: 1, goalsFreekick: 0, goalsPenalty: 0, assists: 3, keyPasses: 15, shotsTotal: 18, shotsOnTarget: 10, xG: 3.3, xA: 2.6, passCompletionPct: 82, tacklesWon: 6, interceptions: 3, clearances: 1, aerialDuelsWonPct: 52, yellowCards: 1, redCards: 0, avgRating: 7.8, manOfTheMatchAwards: 1, distanceCoveredAvg: 10.0, progressivePasses: 13, crosses: 16, throughBalls: 3, blockedShots: 1, pressuresApplied: 25, sprintDistance: 2.0, maxSpeed: 33.5 }
  },
  {
    id: 'mane', name: 'Sadio Mané', countryCode: 'SN', dateOfBirth: '1992-04-10',
    position: 'FWD', clubName: 'Al Nassr', jerseyNumber: 10, height: 175, weight: 69,
    tournamentStats: { matchesPlayed: 4, minutesPlayed: 350, goals: 3, goalsHeader: 1, goalsFreekick: 0, goalsPenalty: 0, assists: 2, keyPasses: 13, shotsTotal: 14, shotsOnTarget: 7, xG: 2.5, xA: 1.8, passCompletionPct: 82, tacklesWon: 7, interceptions: 4, clearances: 1, aerialDuelsWonPct: 46, yellowCards: 0, redCards: 0, avgRating: 7.5, manOfTheMatchAwards: 1, distanceCoveredAvg: 10.6, progressivePasses: 12, crosses: 14, throughBalls: 3, blockedShots: 0, pressuresApplied: 28, sprintDistance: 2.1, maxSpeed: 33.2 }
  },
  {
    id: 'chiesa', name: 'Federico Chiesa', countryCode: 'IT', dateOfBirth: '1997-10-25',
    position: 'FWD', clubName: 'Liverpool', jerseyNumber: 14, height: 175, weight: 69,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 420, goals: 3, goalsHeader: 0, goalsFreekick: 0, goalsPenalty: 0, assists: 4, keyPasses: 16, shotsTotal: 14, shotsOnTarget: 8, xG: 2.4, xA: 3.1, passCompletionPct: 84, tacklesWon: 8, interceptions: 4, clearances: 0, aerialDuelsWonPct: 38, yellowCards: 1, redCards: 0, avgRating: 7.7, manOfTheMatchAwards: 1, distanceCoveredAvg: 10.8, progressivePasses: 14, crosses: 20, throughBalls: 4, blockedShots: 1, pressuresApplied: 30, sprintDistance: 2.2, maxSpeed: 34.0 }
  },
  {
    id: 'mitoma', name: 'Kaoru Mitoma', countryCode: 'JP', dateOfBirth: '1997-05-20',
    position: 'FWD', clubName: 'Brighton', jerseyNumber: 10, height: 178, weight: 71,
    tournamentStats: { matchesPlayed: 5, minutesPlayed: 440, goals: 3, goalsHeader: 0, goalsFreekick: 0, goalsPenalty: 0, assists: 3, keyPasses: 17, shotsTotal: 14, shotsOnTarget: 8, xG: 2.2, xA: 2.9, passCompletionPct: 86, tacklesWon: 7, interceptions: 3, clearances: 0, aerialDuelsWonPct: 30, yellowCards: 0, redCards: 0, avgRating: 7.8, manOfTheMatchAwards: 1, distanceCoveredAvg: 10.5, progressivePasses: 16, crosses: 22, throughBalls: 4, blockedShots: 0, pressuresApplied: 26, sprintDistance: 2.0, maxSpeed: 33.7 }
  },
  {
    id: 'taremi', name: 'Mehdi Taremi', countryCode: 'IR', dateOfBirth: '1992-07-18',
    position: 'FWD', clubName: 'Inter Milan', jerseyNumber: 9, height: 187, weight: 83,
    tournamentStats: { matchesPlayed: 4, minutesPlayed: 360, goals: 3, goalsHeader: 1, goalsFreekick: 0, goalsPenalty: 1, assists: 1, keyPasses: 9, shotsTotal: 13, shotsOnTarget: 7, xG: 2.6, xA: 0.9, passCompletionPct: 78, tacklesWon: 3, interceptions: 1, clearances: 2, aerialDuelsWonPct: 60, yellowCards: 1, redCards: 0, avgRating: 7.4, manOfTheMatchAwards: 1, distanceCoveredAvg: 9.5, progressivePasses: 6, crosses: 4, throughBalls: 1, blockedShots: 0, pressuresApplied: 20, sprintDistance: 1.5, maxSpeed: 31.8 }
  },
];
