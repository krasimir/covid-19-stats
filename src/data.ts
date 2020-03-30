import { Country, Summary } from './types';

export async function getData(
  countries: string[],
  allCountries: boolean
): Promise<{ data: Country[]; summary: Summary }> {
  try {
    if (allCountries) {
      const allCountriesResult = await fetch(`/api?countries=all`);
      const allCountriesData = await allCountriesResult.json();
      const merged = allCountriesData.data.reduce(
        (res: Country, country: Country) => {
          res.total.confirmed += country.total.confirmed;
          res.total.deaths += country.total.deaths;
          res.total.recovered += country.total.recovered;
          country.dates.forEach(d => {
            const found = res.dates.find(i => i.date === d.date);
            if (found) {
              found.confirmed += d.confirmed;
              found.deaths += d.deaths;
              found.recovered += d.recovered;
            } else {
              res.dates.push({ ...d });
            }
          });
          Object.keys(country.pace).forEach(day => {
            if (!res.pace[day]) {
              res.pace[day] = {
                date: '',
                confirmed: country.pace[day].confirmed,
                deaths: country.pace[day].deaths,
                recovered: country.pace[day].recovered,
              };
            } else {
              res.pace[day].confirmed += country.pace[day].confirmed;
              res.pace[day].deaths += country.pace[day].deaths;
              res.pace[day].recovered += country.pace[day].recovered;
            }
          });
          return res;
        },
        {
          country: 'World',
          geo: {},
          total: { confirmed: 0, deaths: 0, recovered: 0 },
          dates: [],
          pace: {},
        }
      );
      console.log(merged);
      return { data: [merged], summary: allCountriesData.summary };
    }
    const result = await fetch(`/api?countries=${countries.join(',')}`);
    return await result.json();
  } catch (err) {
    console.error(err);
    return { data: [], summary: { confirmed: 0, deaths: 0, recovered: 0 } };
  }
}

export async function getCountries(): Promise<string[]> {
  try {
    const result = await fetch(`/api/countries`);
    return await result.json();
  } catch (err) {
    return [];
  }
}
