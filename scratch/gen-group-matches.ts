import fs from 'fs';
import path from 'path';
import { TEAMS } from '../src/data/teams.js';

const MATCHES_FILE = path.join(process.cwd(), 'src/data/matches.ts');

const groups = {};
for (const team of TEAMS) {
  if (!groups[team.groupId]) groups[team.groupId] = [];
  groups[team.groupId].push(team);
}

const matches = [];
let matchId = 1;
const now = new Date();

// Generate round robin for each group
for (const [groupId, groupTeams] of Object.entries(groups)) {
  for (let i = 0; i < groupTeams.length; i++) {
    for (let j = i + 1; j < groupTeams.length; j++) {
      const home = groupTeams[i];
      const away = groupTeams[j];
      
      const homeScore = Math.floor(Math.random() * 4);
      const awayScore = Math.floor(Math.random() * 4);
      
      // Match 1-3 days in the past
      const matchDate = new Date(now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000);
      
      matches.push({
        id: matchId.toString(),
        stage: 'group',
        groupId: groupId,
        matchNumber: matchId,
        homeTeam: {
          countryCode: home.countryCode,
          name: home.name
        },
        awayTeam: {
          countryCode: away.countryCode,
          name: away.name
        },
        stadiumId: 'Mock Stadium',
        kickoffUtc: matchDate.toISOString(),
        status: 'completed',
        score: {
          home: homeScore,
          away: awayScore
        },
        events: []
      });
      matchId++;
    }
  }
}

const fileContent = `import type { Match } from '../types';

export const MATCHES: Match[] = ${JSON.stringify(matches, null, 2)};
`;

fs.writeFileSync(MATCHES_FILE, fileContent);
console.log("Mock matches generated successfully.");
