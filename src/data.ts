import { Country, Summary } from './types';

export async function getData(
  countries: string[]
): Promise<{ data: Country[]; summary: Summary }> {
  try {
    const result = await fetch(`/api?countries=${countries.join(',')}`);
    return await result.json();
  } catch (err) {
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
