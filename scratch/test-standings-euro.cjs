const axios = require('axios');

async function testStandings() {
  try {
    const response = await axios.get('https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.euro/standings');
    console.log(JSON.stringify(response.data, null, 2).slice(0, 2000));
  } catch (err) {
    console.error(err);
  }
}

testStandings();
