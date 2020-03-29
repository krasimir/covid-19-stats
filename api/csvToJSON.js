const parse = require('csv-parse');

module.exports = function(csv, done, fail) {
  parse(csv, { comment: '#' }, function(err, output) {
    if (err) {
      console.log(err);
      return fail(null);
    }
    const columns = output.shift();
    const [
      headerProvince,
      headerCountry,
      headerLat,
      headerLon,
      ...dates
    ] = columns;
    const result = {};
    output.forEach(row => {
      const [province, country, lat, lon, ...values] = row;
      if (!result[country]) {
        result[country] = dates.map((date, i) => ({
          date,
          value: Number(values[i]),
        }));
      } else {
        result[country] = result[country].map((d, i) => ({
          date: d.date,
          value: d.value + Number(values[i]),
        }));
      }
    });
    done(result);
  });
};
