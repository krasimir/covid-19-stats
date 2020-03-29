const superagent = require('superagent');

const credentials = require('./credentials.json');

const URLs = [
  'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
  'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
  'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
];

module.exports = function(fail) {
  return Promise.all(
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
                return fail(null);
              }
              requestDone(data.body.toString('utf8'));
            });
        })
    )
  );
};
