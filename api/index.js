const fs = require('fs');
const { parse } = require('url');
const superagent = require('superagent');
const normalize = require('./normalizeData');
const locationsData = require('./locations.json');

const USE_MOCKS = false;
const MOCKS = {
  BG: JSON.parse(fs.readFileSync(`${__dirname}/mock/BG.json`).toString('utf8')),
  CN: JSON.parse(fs.readFileSync(`${__dirname}/mock/CN.json`).toString('utf8')),
  IT: JSON.parse(fs.readFileSync(`${__dirname}/mock/IT.json`).toString('utf8')),
};

function JSONResponse(res, data, status = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

function endpoint(countryCode) {
  return `https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=1&country_code=${countryCode}`;
}

module.exports = async function(req, res) {
  const { query } = parse(req.url, true);

  if (!query.country) {
    return JSONResponse(res, { error: 'Missing "country" parameter' });
  }
  const location = locationsData.locations.find(
    loc =>
      loc.country.toLowerCase() === query.country.toLowerCase() ||
      loc.country_code.toLowerCase() === query.country.toLowerCase()
  );

  if (!location) {
    return JSONResponse(res, {
      error: `No location found "${query.country}"`,
    });
  }

  if (USE_MOCKS && MOCKS[location.country_code]) {
    console.log(`Mocking: ${location.country}`);
    JSONResponse(res, normalize(location, MOCKS[location.country_code]));
  } else {
    try {
      const e = endpoint(location.country_code);
      console.log(`Requesting: ${e}`);
      superagent
        .get(e)
        .set('accept', 'json')
        .end((err, data) => {
          JSONResponse(res, normalize(location, data.body));
        });
    } catch (err) {
      JSONResponse(res, { error: err }, err.status || 404);
    }
  }
};
