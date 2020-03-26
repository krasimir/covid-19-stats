import { Country, Covid } from './types';

export async function getData(country: string): Promise<Country> {
  try {
    const result = await fetch(`/api?country=${country}`);
    const data = await result.json();
    const dates = data.locations.reduce(
      (res: Record<string, Covid>, location: any) => {
        ['confirmed', 'deaths', 'recovered'].forEach(type => {
          Object.keys(location.timelines[type].timeline).forEach(dateStr => {
            if (!res[dateStr]) {
              res[dateStr] = {
                confirmed: 0,
                deaths: 0,
                recovered: 0,
              };
            }
            res[dateStr][type] += location.timelines[type].timeline[dateStr];
          });
        });
        return res;
      },
      {}
    );
    return {
      country,
      latest: data.latest as Covid,
      dates,
    };
  } catch (err) {
    console.log(err);
    return {
      country,
      latest: {
        confirmed: 0,
        deaths: 0,
        recovered: 0,
      },
      dates: {},
    };
  }
}
