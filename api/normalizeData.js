/* eslint-disable no-sequences */
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

module.exports = function(location, data) {
  const dates = {};
  data.locations.forEach(province => {
    normalizeProvince(province, dates);
  });
  return {
    country: location.country,
    latest: data.latest,
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
