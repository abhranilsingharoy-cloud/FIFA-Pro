const axios = require('axios');

async function testScoreboard() {
  try {
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard');
    console.log(JSON.stringify(response.data.events, null, 2));
  } catch (err) {
    console.error(err);
  }
}

testScoreboard();
