const superagent = require('superagent');
const countries = require('./countries.json');

const memCache = {
  lastUpdate: null,
  data: null,
};

const CACHE_TTL = 20;
const ENDPOINT = 'https://thevirustracker.com/timeline/map-data.json';

const codeToName = Object.keys(countries).reduce((res, name) => {
  res[countries[name].code] = name;
  return res;
}, {});

module.exports = function getData(noCache) {
  if (memCache.data && memCache.lastUpdate && typeof noCache === 'undefined') {
    const now = new Date();
    const diff = (now.getTime() - memCache.lastUpdate) / 1000 / 60;
    if (diff < CACHE_TTL) {
      console.log(`Returning a cached data. Left=${CACHE_TTL - diff}`);
      return Promise.resolve(memCache.data);
    }
  }
  return new Promise((processDone, ops) => {
    console.log(`requesting ${ENDPOINT}`);
    superagent
      .get(ENDPOINT)
      .set('Content-type', `application/json`)
      .end((err, data) => {
        if (err) {
          console.log(err);
          return processDone(null);
        }
        memCache.lastUpdate = new Date().getTime();
        const rawData = data.body.data.reduce((res, entry) => {
          if (!res[entry.countrycode]) {
            res[entry.countrycode] = [];
          }
          res[entry.countrycode].push({
            date: entry.date,
            confirmed: Number(entry.cases),
            deaths: Number(entry.deaths),
            recovered: Number(entry.recovered),
          });
          return res;
        }, {});
        processDone(
          (memCache.data = Object.keys(rawData).reduce((res, countryCode) => {
            if (codeToName[countryCode]) {
              rawData[countryCode] = rawData[countryCode].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              );
              res[codeToName[countryCode]] = rawData[countryCode];
            }
            return res;
          }, {}))
        );
      });
  });
};
