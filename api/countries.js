const parse = require('csv-parse');
const countries = require('./countries.json');

const getCSV = require('./getCSV');

function JSONResponse(res, data, status = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

module.exports = async function(req, res) {
  JSONResponse(res, countries);
};
