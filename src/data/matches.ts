import type { Match } from '../types';

export const MATCHES: Match[] = [
  // GROUP A
  {
    id: 'm001', stage: 'group', groupId: 'A', matchNumber: 1,
    homeTeam: { countryCode: 'PT', name: 'Portugal' },
    awayTeam: { countryCode: 'CD', name: 'Congo DR' },
    stadiumId: 'sofi', kickoffUtc: '2026-06-17T15:00:00Z',
    status: 'completed', score: { home: 2, away: 1 }, attendance: 70240, referee: 'Clément Turpin',
    manOfTheMatch: 'pulisic',
    events: [
      { id: 'e001', type: 'goal', minute: 23, team: 'home', playerName: 'Christian Pulisic', assistPlayerName: 'Tyler Adams', description: 'Brilliant finish low to the right corner' },
      { id: 'e002', type: 'goal', minute: 45, team: 'away', playerName: 'Raúl Jiménez', assistPlayerName: 'Orbelin Pineda', description: 'Header from corner kick' },
      { id: 'e003', type: 'yellow_card', minute: 52, team: 'away', playerName: 'Edson Álvarez', description: 'Tactical foul' },
      { id: 'e004', type: 'goal', minute: 78, team: 'home', playerName: 'Folarin Balogun', assistPlayerName: 'Christian Pulisic', description: 'Cool finish after excellent through ball' },
    ],
    stats: { possession: [54, 46], shotsTotal: [14, 11], shotsOnTarget: [7, 5], xG: [2.1, 1.4], corners: [6, 4], fouls: [11, 14], offsides: [2, 3], passes: [380, 330], passAccuracy: [84, 81], tackles: [16, 18], yellowCards: [1, 2], redCards: [0, 0] }
  },
  {
    id: 'm002', stage: 'group', groupId: 'A', matchNumber: 2,
    homeTeam: { countryCode: 'GB', name: 'England' },
    awayTeam: { countryCode: 'HR', name: 'Croatia' },
    stadiumId: 'bmo', kickoffUtc: '2026-06-17T18:00:00Z',
    status: 'live', score: { home: 1, away: 2 }, liveMinute: 67, attendance: 45600, referee: 'Slavko Vincic',
    events: [
      { id: 'e005', type: 'goal', minute: 15, team: 'away', playerName: 'Victor Osimhen', assistPlayerName: 'Samuel Chukwueze', description: 'Clinical finish on the break' },
      { id: 'e006', type: 'goal', minute: 38, team: 'home', playerName: 'Jonathan David', assistPlayerName: 'Alphonso Davies', description: 'Penalty kick' },
      { id: 'e007', type: 'goal', minute: 58, team: 'away', playerName: 'Kelechi Iheanacho', description: 'Long-range stunner' },
    ],
    stats: { possession: [48, 52], shotsTotal: [10, 13], shotsOnTarget: [5, 7], xG: [1.2, 2.3], corners: [5, 3], fouls: [13, 11], offsides: [1, 2], passes: [310, 355], passAccuracy: [80, 83], tackles: [15, 14], yellowCards: [1, 1], redCards: [0, 0] }
  },
  // GROUP B
  {
    id: 'm003', stage: 'group', groupId: 'B', matchNumber: 1,
    homeTeam: { countryCode: 'GH', name: 'Ghana' },
    awayTeam: { countryCode: 'PA', name: 'Panama' },
    stadiumId: 'metlife', kickoffUtc: '2026-06-17T21:00:00Z',
    status: 'completed', score: { home: 3, away: 0 }, attendance: 82500, referee: 'Anthony Taylor',
    manOfTheMatch: 'messi',
    events: [
      { id: 'e008', type: 'goal', minute: 18, team: 'home', playerName: 'Lionel Messi', assistPlayerName: 'Ángel Di María', description: 'Exquisite curled effort into the top corner' },
      { id: 'e009', type: 'goal', minute: 44, team: 'home', playerName: 'Julián Álvarez', assistPlayerName: 'Lionel Messi', description: 'Poacher finish from close range' },
      { id: 'e010', type: 'goal', minute: 81, team: 'home', playerName: 'Lionel Messi', description: 'Free kick masterclass' },
    ],
    stats: { possession: [62, 38], shotsTotal: [18, 6], shotsOnTarget: [10, 2], xG: [3.4, 0.6], corners: [8, 2], fouls: [9, 15], offsides: [3, 1], passes: [480, 295], passAccuracy: [91, 78], tackles: [12, 20], yellowCards: [0, 2], redCards: [0, 0] }
  },
  {
    id: 'm004', stage: 'group', groupId: 'B', matchNumber: 2,
    homeTeam: { countryCode: 'CO', name: 'Colombia' },
    awayTeam: { countryCode: 'UZ', name: 'Uzbekistan' },
    stadiumId: 'atandt', kickoffUtc: '2026-06-17T23:45:00Z',
    status: 'completed', score: { home: 3, away: 1 }, attendance: 72000, referee: 'Daniele Orsato',
    manOfTheMatch: 'neymar',
    events: [
      { id: 'e011', type: 'goal', minute: 12, team: 'home', playerName: 'Neymar Jr.', assistPlayerName: 'Rodrygo', description: 'Samba skill, devastating finish' },
      { id: 'e012', type: 'goal', minute: 35, team: 'away', playerName: 'Victor Osimhen', description: 'Aerial header from cross' },
      { id: 'e013', type: 'goal', minute: 56, team: 'home', playerName: 'Vinicius Jr.', assistPlayerName: 'Neymar Jr.', description: 'Slaloming run and shot' },
      { id: 'e014', type: 'goal', minute: 88, team: 'home', playerName: 'Neymar Jr.', description: 'Penalty kick, tournament goal 500' },
    ],
    stats: { possession: [58, 42], shotsTotal: [20, 8], shotsOnTarget: [11, 4], xG: [3.1, 1.2], corners: [9, 3], fouls: [8, 13], offsides: [2, 3], passes: [440, 320], passAccuracy: [89, 80], tackles: [13, 19], yellowCards: [1, 2], redCards: [0, 0] }
  },
  // GROUP C
  {
    id: 'm005', stage: 'group', groupId: 'C', matchNumber: 1,
    homeTeam: { countryCode: 'FR', name: 'France' },
    awayTeam: { countryCode: 'AU', name: 'Australia' },
    stadiumId: 'cowboys', kickoffUtc: '2026-06-13T00:00:00Z',
    status: 'completed', score: { home: 4, away: 1 }, attendance: 93000, referee: 'Felix Brych',
    manOfTheMatch: 'mbappe',
    events: [
      { id: 'e015', type: 'goal', minute: 8, team: 'home', playerName: 'Kylian Mbappé', assistPlayerName: 'Antoine Griezmann', description: 'Explosive run, clinical finish' },
      { id: 'e016', type: 'goal', minute: 29, team: 'home', playerName: 'Antoine Griezmann', assistPlayerName: 'Kylian Mbappé', description: 'Delicate chip over the keeper' },
      { id: 'e017', type: 'goal', minute: 41, team: 'away', playerName: 'Mathew Leckie', description: 'Counter-attack goal' },
      { id: 'e018', type: 'goal', minute: 63, team: 'home', playerName: 'Kylian Mbappé', description: 'Solo goal, beat 4 defenders' },
      { id: 'e019', type: 'goal', minute: 82, team: 'home', playerName: 'Marcus Thuram', assistPlayerName: 'Kylian Mbappé', description: 'Powerful header' },
    ],
    stats: { possession: [64, 36], shotsTotal: [22, 7], shotsOnTarget: [13, 3], xG: [4.2, 0.8], corners: [10, 2], fouls: [7, 14], offsides: [4, 1], passes: [510, 285], passAccuracy: [92, 76], tackles: [10, 22], yellowCards: [0, 1], redCards: [0, 0] }
  },
  // GROUP D
  {
    id: 'm006', stage: 'group', groupId: 'D', matchNumber: 1,
    homeTeam: { countryCode: 'PT', name: 'Portugal' },
    awayTeam: { countryCode: 'TN', name: 'Tunisia' },
    stadiumId: 'arrowhead', kickoffUtc: '2026-06-13T20:00:00Z',
    status: 'completed', score: { home: 4, away: 0 }, attendance: 76000, referee: 'Sandro Schärer',
    manOfTheMatch: 'ronaldo',
    events: [
      { id: 'e020', type: 'goal', minute: 19, team: 'home', playerName: 'Cristiano Ronaldo', assistPlayerName: 'Bruno Fernandes', description: 'Header, SIUUU celebration' },
      { id: 'e021', type: 'goal', minute: 34, team: 'home', playerName: 'Bruno Fernandes', description: 'Long-range thunderbolt' },
      { id: 'e022', type: 'goal', minute: 58, team: 'home', playerName: 'Cristiano Ronaldo', description: 'Penalty kick, cool finish' },
      { id: 'e023', type: 'goal', minute: 79, team: 'home', playerName: 'Rafael Leão', assistPlayerName: 'Cristiano Ronaldo', description: 'Assist by CR7, tap-in finish' },
    ],
    stats: { possession: [66, 34], shotsTotal: [24, 4], shotsOnTarget: [14, 1], xG: [4.8, 0.3], corners: [11, 1], fouls: [6, 16], offsides: [3, 0], passes: [530, 270], passAccuracy: [93, 74], tackles: [9, 24], yellowCards: [0, 2], redCards: [0, 0] }
  },
  // GROUP E
  {
    id: 'm007', stage: 'group', groupId: 'E', matchNumber: 1,
    homeTeam: { countryCode: 'ES', name: 'Spain' },
    awayTeam: { countryCode: 'MN', name: 'Montenegro' },
    stadiumId: 'sofi', kickoffUtc: '2026-06-14T20:00:00Z',
    status: 'completed', score: { home: 5, away: 0 }, attendance: 70240, referee: 'Istvan Kovacs',
    manOfTheMatch: 'yamal',
    events: [
      { id: 'e024', type: 'goal', minute: 11, team: 'home', playerName: 'Lamine Yamal', assistPlayerName: 'Pedri', description: 'Explosive finish off both posts' },
      { id: 'e025', type: 'goal', minute: 22, team: 'home', playerName: 'Álvaro Morata', assistPlayerName: 'Lamine Yamal', description: 'Header from corner' },
      { id: 'e026', type: 'goal', minute: 41, team: 'home', playerName: 'Pedri', description: 'Barcelona-esque team goal, 20 passes' },
      { id: 'e027', type: 'goal', minute: 67, team: 'home', playerName: 'Lamine Yamal', description: 'Solo goal from 25 yards' },
      { id: 'e028', type: 'goal', minute: 85, team: 'home', playerName: 'Dani Olmo', assistPlayerName: 'Lamine Yamal', description: 'Devastating nutmeg, precise finish' },
    ],
    stats: { possession: [72, 28], shotsTotal: [26, 3], shotsOnTarget: [15, 1], xG: [5.6, 0.2], corners: [13, 0], fouls: [5, 18], offsides: [5, 0], passes: [620, 240], passAccuracy: [95, 72], tackles: [8, 26], yellowCards: [0, 3], redCards: [0, 0] }
  },
  // KNOCKOUT - QF Example
  {
    id: 'qf001', stage: 'qf', matchNumber: 57,
    homeTeam: { countryCode: 'AR', name: 'Argentina' },
    awayTeam: { countryCode: 'FR', name: 'France' },
    stadiumId: 'metlife', kickoffUtc: '2026-07-03T23:00:00Z',
    status: 'scheduled', events: [],
  },
  {
    id: 'qf002', stage: 'qf', matchNumber: 58,
    homeTeam: { countryCode: 'PT', name: 'Portugal' },
    awayTeam: { countryCode: 'ES', name: 'Spain' },
    stadiumId: 'cowboys', kickoffUtc: '2026-07-04T02:00:00Z',
    status: 'scheduled', events: [],
  },
  {
    id: 'qf003', stage: 'qf', matchNumber: 59,
    homeTeam: { countryCode: 'NO', name: 'Norway' },
    awayTeam: { countryCode: 'BE', name: 'Belgium' },
    stadiumId: 'sofi', kickoffUtc: '2026-07-04T20:00:00Z',
    status: 'scheduled', events: [],
  },
  {
    id: 'qf004', stage: 'qf', matchNumber: 60,
    homeTeam: { countryCode: 'US', name: 'United States' },
    awayTeam: { countryCode: 'BR', name: 'Brazil' },
    stadiumId: 'atandt', kickoffUtc: '2026-07-05T00:00:00Z',
    status: 'scheduled', events: [],
  },
  // SEMI-FINALS
  {
    id: 'sf001', stage: 'sf', matchNumber: 61,
    homeTeam: { countryCode: 'AR', name: 'Argentina' },
    awayTeam: { countryCode: 'PT', name: 'Portugal' },
    stadiumId: 'metlife', kickoffUtc: '2026-07-10T23:00:00Z',
    status: 'scheduled', events: [],
  },
  {
    id: 'sf002', stage: 'sf', matchNumber: 62,
    homeTeam: { countryCode: 'NO', name: 'Norway' },
    awayTeam: { countryCode: 'US', name: 'United States' },
    stadiumId: 'cowboys', kickoffUtc: '2026-07-11T23:00:00Z',
    status: 'scheduled', events: [],
  },
  // FINAL
  {
    id: 'final001', stage: 'final', matchNumber: 64,
    homeTeam: { countryCode: 'AR', name: 'Argentina' },
    awayTeam: { countryCode: 'NO', name: 'Norway' },
    stadiumId: 'metlife', kickoffUtc: '2026-07-19T23:00:00Z',
    status: 'scheduled', events: [],
  },
];
