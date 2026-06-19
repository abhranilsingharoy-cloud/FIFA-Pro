const axios = require('axios');

async function test2022Match() {
  const res = await axios.get('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=2022&limit=200');
  const match = res.data.events.find(e => e.season?.slug === 'group-stage');
  console.log(JSON.stringify(match, null, 2));
}
test2022Match();
