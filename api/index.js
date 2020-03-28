const fs = require('fs');
const { parse } = require('url');
const superagent = require('superagent');
const normalize = require('./normalizeData');
const locationsData = require('./locations.json');

const USE_MOCKS = true;
const MOCKS = {
  30: JSON.parse(fs.readFileSync(`${__dirname}/mock/30.json`).toString('utf8')), // bg
  49: JSON.parse(fs.readFileSync(`${__dirname}/mock/49.json`).toString('utf8')), // ch
  137: JSON.parse(
    fs.readFileSync(`${__dirname}/mock/137.json`).toString('utf8')
  ), // it
};

function JSONResponse(res, data, status = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

function endpoint(countryId) {
  return `https://coronavirus-tracker-api.herokuapp.com/v2/locations/${countryId}?timelines=1`;
}

module.exports = async function(req, res) {
  const { query } = parse(req.url, true);

  if (!query.country) {
    return JSONResponse(res, { error: 'Missing "country" parameter' }, 400);
  }
  const location = locationsData.locations.find(
    loc =>
      loc.country.toLowerCase() === query.country.toLowerCase() ||
      loc.country_code.toLowerCase() === query.country.toLowerCase()
  );

  if (!location) {
    return JSONResponse(
      res,
      { error: 'No location found behind the "country" parameter' },
      400
    );
  }

  if (USE_MOCKS && MOCKS[location.id]) {
    console.log(`Mocking: ${location.country}`);
    JSONResponse(res, normalize(location, MOCKS[location.id]));
  } else {
    try {
      const e = endpoint(location.id);
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
