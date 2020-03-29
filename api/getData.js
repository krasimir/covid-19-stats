const superagent = require('superagent');
const parse = require('csv-parse');
const credentials = require('./credentials.json');

const URLs = [
  'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
  'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
];

const memCache = {
  lastUpdate: null,
  data: null,
};

module.exports = function getData() {
  if (memCache.data) {
    const now = new Date();
    console.log(now, memCache.lastUpdate);
    console.log(`diff=${(now.getTime() - memCache.lastUpdate) / 1000 / 60}`);
  }
  return new Promise(done => {
    Promise.all(
      URLs.map(
        url =>
          new Promise(requestDone => {
            console.log(`requesting ${url}`);
            superagent
              .get(url)
              .set(
                'User-Agent',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36'
              )
              .set('Accept', 'application/vnd.github.VERSION.raw')
              .set('Authorization', `token ${credentials.token}`)
              .set('Content-type', `application/json`)
              .end((err, data) => {
                if (err) {
                  console.log(err);
                  return done(null);
                }
                requestDone(data.body.toString('utf8'));
              });
          })
      )
    ).then(data => {
      // converting CSV to JSON data
      Promise.all(
        data.map(
          csv =>
            new Promise(toJSONDone => {
              parse(csv, { comment: '#' }, function(err, output) {
                if (err) {
                  console.log(err);
                  return done(null);
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
                toJSONDone(result);
              });
            })
        )
      ).then(normalizedCSVData => {
        memCache.lastUpdate = new Date().getTime();
        done(
          (memCache.data = normalizedCSVData.reduce(
            (res, normalizedData, i) => {
              let type;
              if (i === 0) type = 'confirmed';
              if (i === 1) type = 'deaths';
              if (i === 2) type = 'recovered';
              Object.keys(normalizedData).forEach(country => {
                const countryData = normalizedData[country];
                if (!res[country]) {
                  res[country] = countryData.map(d => ({
                    date: d.date,
                    [type]: d.value,
                  }));
                } else {
                  res[country] = res[country].map((d, idx) => ({
                    ...d,
                    [type]: countryData[idx].value,
                  }));
                }
              });
              return res;
            },
            {}
          ))
        );
      });
    });
  });
};
