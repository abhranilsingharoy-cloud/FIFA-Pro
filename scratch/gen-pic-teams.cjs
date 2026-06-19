const fs = require('fs');
const path = require('path');

const picGroups = {
  A: [
    { name: 'Mexico', code: 'mx', conf: 'CONCACAF' },
    { name: 'South Korea', code: 'kr', conf: 'AFC' },
    { name: 'Czechia', code: 'cz', conf: 'UEFA' },
    { name: 'South Africa', code: 'za', conf: 'CAF' }
  ],
  B: [
    { name: 'Canada', code: 'ca', conf: 'CONCACAF' },
    { name: 'Switzerland', code: 'ch', conf: 'UEFA' },
    { name: 'Bosnia and Herzegovina', code: 'ba', conf: 'UEFA' },
    { name: 'Qatar', code: 'qa', conf: 'AFC' }
  ],
  C: [
    { name: 'Scotland', code: 'gb-sct', conf: 'UEFA' },
    { name: 'Morocco', code: 'ma', conf: 'CAF' },
    { name: 'Brazil', code: 'br', conf: 'CONMEBOL' },
    { name: 'Haiti', code: 'ht', conf: 'CONCACAF' }
  ],
  D: [
    { name: 'USA', code: 'us', conf: 'CONCACAF' },
    { name: 'Australia', code: 'au', conf: 'AFC' },
    { name: 'Turkiye', code: 'tr', conf: 'UEFA' },
    { name: 'Paraguay', code: 'py', conf: 'CONMEBOL' }
  ],
  E: [
    { name: 'Germany', code: 'de', conf: 'UEFA' },
    { name: 'Ivory Coast', code: 'ci', conf: 'CAF' },
    { name: 'Ecuador', code: 'ec', conf: 'CONMEBOL' },
    { name: 'Curaçao', code: 'cw', conf: 'CONCACAF' }
  ],
  F: [
    { name: 'Sweden', code: 'se', conf: 'UEFA' },
    { name: 'Japan', code: 'jp', conf: 'AFC' },
    { name: 'Netherlands', code: 'nl', conf: 'UEFA' },
    { name: 'Tunisia', code: 'tn', conf: 'CAF' }
  ],
  G: [
    { name: 'New Zealand', code: 'nz', conf: 'OFC' },
    { name: 'Iran', code: 'ir', conf: 'AFC' },
    { name: 'Belgium', code: 'be', conf: 'UEFA' },
    { name: 'Egypt', code: 'eg', conf: 'CAF' }
  ],
  H: [
    { name: 'Uruguay', code: 'uy', conf: 'CONMEBOL' },
    { name: 'Saudi Arabia', code: 'sa', conf: 'AFC' },
    { name: 'Spain', code: 'es', conf: 'UEFA' },
    { name: 'Cabo Verde', code: 'cv', conf: 'CAF' }
  ],
  I: [
    { name: 'Norway', code: 'no', conf: 'UEFA' },
    { name: 'France', code: 'fr', conf: 'UEFA' },
    { name: 'Senegal', code: 'sn', conf: 'CAF' },
    { name: 'Iraq', code: 'iq', conf: 'AFC' }
  ],
  J: [
    { name: 'Argentina', code: 'ar', conf: 'CONMEBOL' },
    { name: 'Austria', code: 'at', conf: 'UEFA' },
    { name: 'Jordan', code: 'jo', conf: 'AFC' },
    { name: 'Algeria', code: 'dz', conf: 'CAF' }
  ],
  K: [
    { name: 'Colombia', code: 'co', conf: 'CONMEBOL' },
    { name: 'DR Congo', code: 'cd', conf: 'CAF' },
    { name: 'Portugal', code: 'pt', conf: 'UEFA' },
    { name: 'Uzbekistan', code: 'uz', conf: 'AFC' }
  ],
  L: [
    { name: 'England', code: 'gb-eng', conf: 'UEFA' },
    { name: 'Ghana', code: 'gh', conf: 'CAF' },
    { name: 'Panama', code: 'pa', conf: 'CONCACAF' },
    { name: 'Croatia', code: 'hr', conf: 'UEFA' }
  ]
};

const finalTeams = [];

for (const [groupId, teams] of Object.entries(picGroups)) {
  for (const t of teams) {
    finalTeams.push({
      name: t.name,
      countryCode: t.code.toUpperCase(),
      flag: \`https://flagcdn.com/w320/\${t.code}.png\`,
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

const fileContent = \`import type { Team } from '../types';

export const TEAMS: Team[] = \${JSON.stringify(finalTeams, null, 2)};
\`;

fs.writeFileSync(path.join(__dirname, '../src/data/teams.ts'), fileContent);
console.log('Exact 48 teams from pics generated!');
