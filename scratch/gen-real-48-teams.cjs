const fs = require('fs');
const path = require('path');

const groupsData = {
  A: [
    { name: 'United States', code: 'us', conf: 'CONCACAF' },
    { name: 'Germany', code: 'de', conf: 'UEFA' },
    { name: 'Ivory Coast', code: 'ci', conf: 'CAF' },
    { name: 'United Arab Emirates', code: 'ae', conf: 'AFC' }
  ],
  B: [
    { name: 'Mexico', code: 'mx', conf: 'CONCACAF' },
    { name: 'Switzerland', code: 'ch', conf: 'UEFA' },
    { name: 'Nigeria', code: 'ng', conf: 'CAF' },
    { name: 'Qatar', code: 'qa', conf: 'AFC' }
  ],
  C: [
    { name: 'Canada', code: 'ca', conf: 'CONCACAF' },
    { name: 'Croatia', code: 'hr', conf: 'UEFA' },
    { name: 'Algeria', code: 'dz', conf: 'CAF' },
    { name: 'Australia', code: 'au', conf: 'AFC' }
  ],
  D: [
    { name: 'Argentina', code: 'ar', conf: 'CONMEBOL' },
    { name: 'Denmark', code: 'dk', conf: 'UEFA' },
    { name: 'Mali', code: 'ml', conf: 'CAF' },
    { name: 'Jamaica', code: 'jm', conf: 'CONCACAF' }
  ],
  E: [
    { name: 'France', code: 'fr', conf: 'UEFA' },
    { name: 'Ukraine', code: 'ua', conf: 'UEFA' },
    { name: 'Cameroon', code: 'cm', conf: 'CAF' },
    { name: 'Iraq', code: 'iq', conf: 'AFC' }
  ],
  F: [
    { name: 'Brazil', code: 'br', conf: 'CONMEBOL' },
    { name: 'Sweden', code: 'se', conf: 'UEFA' },
    { name: 'Egypt', code: 'eg', conf: 'CAF' },
    { name: 'Costa Rica', code: 'cr', conf: 'CONCACAF' }
  ],
  G: [
    { name: 'England', code: 'gb-eng', conf: 'UEFA' },
    { name: 'Wales', code: 'gb-wls', conf: 'UEFA' },
    { name: 'Senegal', code: 'sn', conf: 'CAF' },
    { name: 'Saudi Arabia', code: 'sa', conf: 'AFC' }
  ],
  H: [
    { name: 'Belgium', code: 'be', conf: 'UEFA' },
    { name: 'Poland', code: 'pl', conf: 'UEFA' },
    { name: 'Morocco', code: 'ma', conf: 'CAF' },
    { name: 'Panama', code: 'pa', conf: 'CONCACAF' }
  ],
  I: [
    { name: 'Netherlands', code: 'nl', conf: 'UEFA' },
    { name: 'Serbia', code: 'rs', conf: 'UEFA' },
    { name: 'Tunisia', code: 'tn', conf: 'CAF' },
    { name: 'New Zealand', code: 'nz', conf: 'OFC' }
  ],
  J: [
    { name: 'Portugal', code: 'pt', conf: 'UEFA' },
    { name: 'Colombia', code: 'co', conf: 'CONMEBOL' },
    { name: 'South Korea', code: 'kr', conf: 'AFC' },
    { name: 'Oman', code: 'om', conf: 'AFC' }
  ],
  K: [
    { name: 'Spain', code: 'es', conf: 'UEFA' },
    { name: 'Uruguay', code: 'uy', conf: 'CONMEBOL' },
    { name: 'Japan', code: 'jp', conf: 'AFC' },
    { name: 'Honduras', code: 'hn', conf: 'CONCACAF' }
  ],
  L: [
    { name: 'Italy', code: 'it', conf: 'UEFA' },
    { name: 'Ecuador', code: 'ec', conf: 'CONMEBOL' },
    { name: 'Iran', code: 'ir', conf: 'AFC' },
    { name: 'South Africa', code: 'za', conf: 'CAF' }
  ]
};

const finalTeams = [];

for (const [groupId, teams] of Object.entries(groupsData)) {
  for (const t of teams) {
    finalTeams.push({
      name: t.name,
      countryCode: t.code.toUpperCase(),
      flag: `https://flagcdn.com/w320/${t.code}.png`,
      confederation: t.conf,
      groupId: groupId,
      fifaRanking: Math.floor(Math.random() * 50) + 1,
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      manager: 'Manager',
      managerNationality: 'N/A',
      squadSize: 26,
      avgAge: 26.5,
      keyPlayerId: 'p_1',
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      matchesPlayed: 0
    });
  }
}

const fileContent = `import type { Team } from '../types';

export const TEAMS: Team[] = ${JSON.stringify(finalTeams, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/teams.ts'), fileContent);
console.log('Real 48 teams generated!');
