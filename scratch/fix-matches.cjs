const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '../src/data/matches.ts');
let content = fs.readFileSync(filepath, 'utf8');

// Replace outdated properties to match the new Match interface
content = content.replace(/"status": "post"/g, '"status": "completed"');
content = content.replace(/"venue":/g, '"stadiumId":');
content = content.replace(/"date":/g, '"kickoffUtc":');
content = content.replace(/"abbreviation":/g, '"countryCode":');
content = content.replace(/"logo":[^,]+,/g, '');
content = content.replace(/"winner":[^,]+,/g, '');
content = content.replace(/"winner":[^}]+}/g, '}');

// Also remove the extra comma if it was left over
content = content.replace(/,\s+}/g, '\n        }');

// TeamRef doesn't have "id" or "score", but "score" was moved to the Match level.
// Wait, in the old matches.ts, "score" was inside homeTeam and awayTeam!
// Let's just fix it by regex:
// "homeTeam": { "id": ..., "name": ..., "countryCode": ..., "score": X },
// -> "score": { "home": X, "away": Y }

const MatchRegex = /{\s*"id":\s*"(\d+)",\s*"kickoffUtc":\s*"([^"]+)",\s*"status":\s*"completed",\s*"stadiumId":\s*"([^"]+)",\s*"homeTeam":\s*{\s*"id":\s*"[^"]*",\s*"name":\s*"([^"]+)",\s*"countryCode":\s*"([^"]+)",\s*"score":\s*(\d+)\s*},\s*"awayTeam":\s*{\s*"id":\s*"[^"]*",\s*"name":\s*"([^"]+)",\s*"countryCode":\s*"([^"]+)",\s*"score":\s*(\d+)\s*},\s*"events":\s*\[\]\s*}/g;

let match;
const matchesObj = [];
while ((match = MatchRegex.exec(content)) !== null) {
  matchesObj.push({
    id: match[1],
    stage: 'group',
    groupId: 'A', // We need to find the correct group id. We can deduce it from the team.
    matchNumber: parseInt(match[1], 10),
    homeTeam: {
      name: match[4],
      countryCode: match[5]
    },
    awayTeam: {
      name: match[7],
      countryCode: match[8]
    },
    stadiumId: match[3],
    kickoffUtc: match[2],
    status: 'completed',
    score: {
      home: parseInt(match[6], 10),
      away: parseInt(match[9], 10)
    },
    events: []
  });
}

// Map teams to groups
const TEAMS = require('../src/data/teams.ts'); // Wait, ts file can't be required. 
// We will just read teams.ts to build the map.
const teamsContent = fs.readFileSync(path.join(__dirname, '../src/data/teams.ts'), 'utf8');
const teamToGroup = {};
const groupRegex = /"name":\s*"([^"]+)",\s*"countryCode":\s*"[^"]+",\s*"flag":\s*"[^"]+",\s*"confederation":\s*"[^"]+",\s*"groupId":\s*"([^"]+)"/g;
let tMatch;
while ((tMatch = groupRegex.exec(teamsContent)) !== null) {
  teamToGroup[tMatch[1]] = tMatch[2];
}

for (const m of matchesObj) {
  m.groupId = teamToGroup[m.homeTeam.name] || 'A';
}

const finalFileContent = `import type { Match } from '../types';

export const MATCHES: Match[] = ${JSON.stringify(matchesObj, null, 2)};
`;

fs.writeFileSync(filepath, finalFileContent);
console.log('Fixed matches.ts');
