/* eslint-disable no-sequences, no-multi-assign */
const types = ['confirmed', 'deaths', 'recovered'];

function normalizeProvince(province, dates) {
  types.forEach(type => {
    Object.keys(province.timelines[type].timeline).forEach(date => {
      if (!dates[date]) {
        dates[date] = types.reduce((r, t) => ((r[t] = 0), r), {});
      }
      dates[date][type] += province.timelines[type].timeline[date];
    });
  });
}
function generatePace(dates) {
  const pace = {};
  const lastOne = {};
  let isCounting = false;
  let days = 0;
  types.forEach(type => {
    lastOne[type] = 0;
  });
  Object.keys(dates).forEach(date => {
    if (types.some(type => dates[date][type] > 0)) {
      isCounting = true;
    }
    if (isCounting) {
      days += 1;
      const key = `day${days}`;
      types.forEach(type => {
        if (!pace[key]) {
          pace[key] = { date };
          types.forEach(t => {
            pace[key][t] = 0;
          });
        }
        pace[key][type] = dates[date][type] - lastOne[type];
        lastOne[type] = dates[date][type];
      });
    }
  });
  return pace;
}

module.exports = function(location, data) {
  const dates = {};
  data.locations.forEach(province => {
    normalizeProvince(province, dates);
  });
  return {
    country: location.country,
    latest: data.latest,
    pace: generatePace(dates),
    dates,
  };
};

/*

Format:

export interface Country {
  country: string;
  latest: Covid;
  dates: Record<string, Covid>;
}

export type Covid = {
  [key: string]: number;
  confirmed: number;
  deaths: number;
  recovered: number;
};

*/
