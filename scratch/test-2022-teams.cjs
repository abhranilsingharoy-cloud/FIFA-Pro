const axios = require('axios');

async function test2022() {
  const res = await axios.get('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=2022&limit=200');
  console.log("Matches:", res.data.events.length);
  const groups = new Set();
  res.data.events.forEach(e => {
    if (e.season?.slug?.includes('group')) {
      groups.add(e.season.slug);
    }
  });
  console.log("Groups found in 2022 matches:", Array.from(groups));
}
test2022();
