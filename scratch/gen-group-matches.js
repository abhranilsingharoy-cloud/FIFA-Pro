import fs from 'fs';
import path from 'path';

const TEAMS_FILE = path.join(process.cwd(), 'src/data/teams.ts');
const MATCHES_FILE = path.join(process.cwd(), 'src/data/matches.ts');

const teamsModule = fs.readFileSync(TEAMS_FILE, 'utf-8');
// Extract TEAMS array
const match = teamsModule.match(/export const TEAMS: Team\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not parse teams");
  process.exit(1);
}

const teamsStr = match[1]
  .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
  .replace(/'/g, '"')
  .replace(/,(\s*[\}\]])/g, '$1');

// Basic manual parsing
const teams = eval(`(${match[1]})`);

// Group teams by groupId
const groups = {};
for (const team of teams) {
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
        date: matchDate.toISOString(),
        status: 'post', // all completed for now
        venue: 'Mock Stadium',
        homeTeam: {
          id: home.espnId || home.id,
          name: home.name,
          abbreviation: home.countryCode,
          score: homeScore,
          logo: home.flag,
          winner: homeScore > awayScore
        },
        awayTeam: {
          id: away.espnId || away.id,
          name: away.name,
          abbreviation: away.countryCode,
          score: awayScore,
          logo: away.flag,
          winner: awayScore > homeScore
        },
        events: []
      });
      matchId++;
    }
  }
}

// Generate some future matches for knockout
for (let i = 0; i < 4; i++) {
  matches.push({
        id: matchId.toString(),
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pre',
        venue: 'Knockout Stadium',
        homeTeam: {
          id: teams[i].id,
          name: teams[i].name,
          abbreviation: teams[i].countryCode,
          score: 0,
          logo: teams[i].flag,
          winner: false
        },
        awayTeam: {
          id: teams[i+4].id,
          name: teams[i+4].name,
          abbreviation: teams[i+4].countryCode,
          score: 0,
          logo: teams[i+4].flag,
          winner: false
        },
        events: []
  });
  matchId++;
}

const fileContent = `import { Match } from '../types';

export const MATCHES: Match[] = ${JSON.stringify(matches, null, 2)};
`;

fs.writeFileSync(MATCHES_FILE, fileContent);
console.log("Mock matches generated successfully.");
