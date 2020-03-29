const parse = require('csv-parse');
const countries = require('./countries.json');

const getCSV = require('./getCSV');

function JSONResponse(res, data, status = 200) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.statusCode = status;
  res.end(JSON.stringify(data));
}

/*
Getting countries from the CSV files
module.exports = async function(req, res) {
  getCSV(() => {
    JSONResponse(res, { error: 'Problem getting countries' });
  }).then(data =>
    Promise.all(
      data.map(
        csv =>
          new Promise(csvToJSONDone => {
            parse(csv, { comment: '#' }, function(err, output) {
              if (err) {
                console.log(err);
                return csvToJSONDone(null);
              }
              output.shift();
              const result = {};
              output.forEach(row => {
                const [province, country, lat, lon] = row;
                if (!result[country]) {
                  result[country] = { lat, lon };
                }
              });
              csvToJSONDone(result);
            });
          })
      )
    ).then(d => {
      JSONResponse(res, d[0]);
    })
  );
};
*/

module.exports = async function(req, res) {
  JSONResponse(res, countries);
};
