const fs = require('fs');
const path = require('path');

const TEAMS = [
  // Group A
  { name: 'United States', code: 'US', group: 'A', flag: 'us', color1: '#002868', color2: '#bf0a30' },
  { name: 'Germany', code: 'DE', group: 'A', flag: 'de', color1: '#000000', color2: '#dd0000' },
  { name: 'Ivory Coast', code: 'CI', group: 'A', flag: 'ci', color1: '#f77f00', color2: '#009e60' },
  { name: 'United Arab Emirates', code: 'AE', group: 'A', flag: 'ae', color1: '#00732f', color2: '#ff0000' },

  // Group B
  { name: 'Mexico', code: 'MX', group: 'B', flag: 'mx', color1: '#006847', color2: '#ce1126' },
  { name: 'Switzerland', code: 'CH', group: 'B', flag: 'ch', color1: '#ff0000', color2: '#ffffff' },
  { name: 'Nigeria', code: 'NG', group: 'B', flag: 'ng', color1: '#008751', color2: '#ffffff' },
  { name: 'Qatar', code: 'QA', group: 'B', flag: 'qa', color1: '#8a1538', color2: '#ffffff' },

  // Group C
  { name: 'Canada', code: 'CA', group: 'C', flag: 'ca', color1: '#ff0000', color2: '#ffffff' },
  { name: 'Croatia', code: 'HR', group: 'C', flag: 'hr', color1: '#ff0000', color2: '#ffffff' },
  { name: 'Algeria', code: 'DZ', group: 'C', flag: 'dz', color1: '#006233', color2: '#d21034' },
  { name: 'Australia', code: 'AU', group: 'C', flag: 'au', color1: '#00008b', color2: '#ffcc00' },

  // Group D
  { name: 'Argentina', code: 'AR', group: 'D', flag: 'ar', color1: '#43a1d5', color2: '#ffffff' },
  { name: 'Denmark', code: 'DK', group: 'D', flag: 'dk', color1: '#c60c30', color2: '#ffffff' },
  { name: 'Mali', code: 'ML', group: 'D', flag: 'ml', color1: '#14b53a', color2: '#fcd116' },
  { name: 'Jamaica', code: 'JM', group: 'D', flag: 'jm', color1: '#009b3a', color2: '#fed100' },

  // Group E
  { name: 'France', code: 'FR', group: 'E', flag: 'fr', color1: '#002395', color2: '#ed2939' },
  { name: 'Ukraine', code: 'UA', group: 'E', flag: 'ua', color1: '#0057b7', color2: '#ffd700' },
  { name: 'Cameroon', code: 'CM', group: 'E', flag: 'cm', color1: '#007a5e', color2: '#ce1126' },
  { name: 'Iraq', code: 'IQ', group: 'E', flag: 'iq', color1: '#ce1126', color2: '#007a3d' },

  // Group F
  { name: 'Brazil', code: 'BR', group: 'F', flag: 'br', color1: '#009c3b', color2: '#ffdf00' },
  { name: 'Sweden', code: 'SE', group: 'F', flag: 'se', color1: '#004b87', color2: '#ffcd00' },
  { name: 'Egypt', code: 'EG', group: 'F', flag: 'eg', color1: '#ce1126', color2: '#000000' },
  { name: 'Costa Rica', code: 'CR', group: 'F', flag: 'cr', color1: '#ce1126', color2: '#002b7f' },

  // Group G
  { name: 'England', code: 'GB-ENG', group: 'G', flag: 'gb-eng', color1: '#ffffff', color2: '#ce1126' },
  { name: 'Wales', code: 'GB-WLS', group: 'G', flag: 'gb-wls', color1: '#d30731', color2: '#002b7f' },
  { name: 'Senegal', code: 'SN', group: 'G', flag: 'sn', color1: '#00853f', color2: '#fdef42' },
  { name: 'Saudi Arabia', code: 'SA', group: 'G', flag: 'sa', color1: '#006c35', color2: '#ffffff' },

  // Group H
  { name: 'Belgium', code: 'BE', group: 'H', flag: 'be', color1: '#ed2939', color2: '#000000' },
  { name: 'Poland', code: 'PL', group: 'H', flag: 'pl', color1: '#dc143c', color2: '#ffffff' },
  { name: 'Morocco', code: 'MA', group: 'H', flag: 'ma', color1: '#c1272d', color2: '#006233' },
  { name: 'Panama', code: 'PA', group: 'H', flag: 'pa', color1: '#005293', color2: '#d21034' },

  // Group I
  { name: 'Netherlands', code: 'NL', group: 'I', flag: 'nl', color1: '#ae1c28', color2: '#21468b' },
  { name: 'Serbia', code: 'RS', group: 'I', flag: 'rs', color1: '#c6363c', color2: '#0c4076' },
  { name: 'Tunisia', code: 'TN', group: 'I', flag: 'tn', color1: '#e70013', color2: '#ffffff' },
  { name: 'New Zealand', code: 'NZ', group: 'I', flag: 'nz', color1: '#00247d', color2: '#cc142b' },

  // Group J
  { name: 'Portugal', code: 'PT', group: 'J', flag: 'pt', color1: '#ff0000', color2: '#006600' },
  { name: 'Ecuador', code: 'EC', group: 'J', flag: 'ec', color1: '#ffdd00', color2: '#034ea2' },
  { name: 'Japan', code: 'JP', group: 'J', flag: 'jp', color1: '#bc002d', color2: '#000055' },
  { name: 'Ghana', code: 'GH', group: 'J', flag: 'gh', color1: '#ce1126', color2: '#fcd116' },

  // Group K
  { name: 'Spain', code: 'ES', group: 'K', flag: 'es', color1: '#aa151b', color2: '#f1bf00' },
  { name: 'Peru', code: 'PE', group: 'K', flag: 'pe', color1: '#d91023', color2: '#ffffff' },
  { name: 'South Korea', code: 'KR', group: 'K', flag: 'kr', color1: '#cd2e3a', color2: '#0047a0' },
  { name: 'Chile', code: 'CL', group: 'K', flag: 'cl', color1: '#d52b1e', color2: '#0039a6' },

  // Group L
  { name: 'Italy', code: 'IT', group: 'L', flag: 'it', color1: '#008c45', color2: '#f4f5f0' },
  { name: 'Uruguay', code: 'UY', group: 'L', flag: 'uy', color1: '#0038a8', color2: '#ffffff' },
  { name: 'Iran', code: 'IR', group: 'L', flag: 'ir', color1: '#239f40', color2: '#da0000' },
  { name: 'Colombia', code: 'CO', group: 'L', flag: 'co', color1: '#fcd116', color2: '#003893' },
];

const mappedTeams = TEAMS.map((t, index) => {
  return {
    name: t.name,
    countryCode: t.code,
    flag: `https://flagcdn.com/w320/${t.code.toLowerCase()}.png`,
    confederation: 'UEFA', // placeholder
    groupId: t.group,
    fifaRanking: Math.floor(Math.random() * 50) + 1,
    primaryColor: t.color1,
    secondaryColor: t.color2,
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
  };
});

// Fix fifa rankings to be semi-realistic (sort by random isn't good, let's just leave it random for now)

const fileContent = `import type { Team } from '../types';

export const TEAMS: Team[] = ${JSON.stringify(mappedTeams, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/teams.ts'), fileContent);
console.log('Successfully wrote src/data/teams.ts');
