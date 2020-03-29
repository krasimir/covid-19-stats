const csvToJSON = require('./csvToJSON');
const getCSV = require('./getCSV');

const memCache = {
  lastUpdate: null,
  data: null,
};

const CACHE_TTL = 20;

module.exports = function getData(noCache) {
  if (memCache.data && memCache.lastUpdate && typeof noCache === 'undefined') {
    const now = new Date();
    const diff = (now.getTime() - memCache.lastUpdate) / 1000 / 60;
    if (diff < CACHE_TTL) {
      console.log(`Returning a cached data. Left=${CACHE_TTL - diff}`);
      return Promise.resolve(memCache.data);
    }
  }
  return new Promise(done => {
    getCSV(done).then(data => {
      Promise.all(
        data.map(
          csv => new Promise(toJSONDone => csvToJSON(csv, toJSONDone, done))
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
