/* eslint-disable no-sequences, no-multi-assign */
const types = ['confirmed', 'deaths', 'recovered'];

function generatePace(dates) {
  const pace = {};
  const lastOne = {};
  let isCounting = false;
  let days = 0;
  types.forEach(type => {
    lastOne[type] = 0;
  });
  dates.forEach((entry, i) => {
    if (types.some(type => dates[i][type] > 0)) {
      isCounting = true;
    }
    if (isCounting) {
      days += 1;
      const key = `day${days}`;
      types.forEach(type => {
        if (!pace[key]) {
          pace[key] = { date: entry.date };
          types.forEach(t => {
            pace[key][t] = 0;
          });
        }
        pace[key][type] = dates[i][type] - lastOne[type];
        lastOne[type] = dates[i][type];
      });
    }
  });
  return pace;
}
function generateTotal(dates) {
  if (dates.length === 0) {
    return { confirmed: 0, deaths: 0, recovered: 0 };
  }
  const last = dates[dates.length - 1];
  return {
    confirmed: last.confirmed,
    deaths: last.deaths,
    recovered: last.recovered,
  };
}

module.exports = function(country, data) {
  return {
    country,
    total: generateTotal(data),
    dates: data,
    pace: generatePace(data),
  };
};
