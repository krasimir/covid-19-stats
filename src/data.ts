import { Country } from './types';

export async function getData(countries: string[]): Promise<Country[]> {
  try {
    const result = await fetch(`/api?countries=${countries.join(',')}`);
    return (await result.json()).filter(
      (c: Country | null) => c !== null
    ) as Country[];
  } catch (err) {
    return [];
  }
}
