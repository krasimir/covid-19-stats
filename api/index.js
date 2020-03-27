const fs = require('fs');
const { parse } = require('url');
const superagent = require('superagent');

const USE_MOCKS = true;
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
    return JSONResponse(res, { error: 'Missing "country" parameter' }, 400);
  }

  if (USE_MOCKS && MOCKS[query.country]) {
    console.log(`Mocking: ${query.country}`);
    JSONResponse(res, MOCKS[query.country]);
  } else {
    try {
      const e = endpoint(query.country);
      console.log(`Requesting: ${e}`);
      superagent
        .get(e)
        .set('accept', 'json')
        .end((err, data) => {
          JSONResponse(res, data.body);
        });
    } catch (err) {
      JSONResponse(res, { error: err }, err.status || 404);
    }
  }
};
