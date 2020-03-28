import { Country, Covid } from './types';

export async function getData(country: string): Promise<Country> {
  try {
    const result = await fetch(`/api?country=${country}`);
    return (await result.json()) as Country;
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
