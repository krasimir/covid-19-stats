export type Covid = {
  [key: string]: string | number;
  date: string;
  confirmed: number;
  deaths: number;
  recovered: number;
};

export interface Country {
  error?: string;
  country: string;
  latest: Covid;
  dates: Covid[];
  pace: Record<string, Covid>;
}

export interface Summary {
  confirmed: number;
  deaths: number;
  recovered: number;
}
