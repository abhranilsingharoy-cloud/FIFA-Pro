const axios = require('axios');

async function testLive() {
  const res = await axios.get('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard');
  console.log("Events:", res.data.events?.length);
  if (res.data.events?.length > 0) {
    const e = res.data.events[0];
    console.log(e.name, e.status.type.state);
  }
}
testLive();
