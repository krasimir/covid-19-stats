const fs = require('fs');
const { parse } = require('url');
const normalize = require('./normalizeData');

const USE_MOCKS = false;
const timeseries = require('./mock/timeseries.json');
const getData = require('./getData');

function JSONResponse(res, data, status = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

function generateData(countries, data) {
  return countries.map(c => {
    const foundEntry = Object.keys(data).reduce((r, country) => {
      if (r) return r;
      if (country.toLowerCase() === c.toLowerCase()) {
        return { country, data: data[country] };
      }
      return false;
    }, false);

    if (foundEntry) {
      return normalize(foundEntry.country, foundEntry.data);
    }
    return null;
  });
}

function getSummary(data) {
  const total = { confirmed: 0, deaths: 0, recovered: 0 };
  Object.keys(data).forEach(country => {
    const last = data[country][data[country].length - 1];
    total.confirmed += last.confirmed;
    total.deaths += last.deaths;
    total.recovered += last.recovered;
  });
  return total;
}

module.exports = async function(req, res) {
  const { query } = parse(req.url, true);

  if (!query.countries) {
    return JSONResponse(res, { error: 'Missing "countries" parameter' });
  }

  const countries = query.countries.split(',');

  if (USE_MOCKS) {
    console.log(`Mocking ...`);
    JSONResponse(res, {
      data: generateData(countries, timeseries),
      summary: getSummary(timeseries),
    });
  } else {
    try {
      getData().then(data => {
        if (data === null) {
          JSONResponse(
            res,
            { error: 'Something went wrong while fetching data from JHU' },
            500
          );
        } else {
          JSONResponse(res, {
            data: generateData(countries, data),
            summary: getSummary(data),
          });
        }
      });
    } catch (err) {
      JSONResponse(res, { error: err }, err.status || 404);
    }
  }
};
