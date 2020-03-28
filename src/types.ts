export type Covid = {
  [key: string]: string | number;
  date: string;
  confirmed: number;
  deaths: number;
  recovered: number;
};

export interface Country {
  country: string;
  total: Covid;
  dates: Covid[];
  pace: Record<string, Covid>;
}

export interface Summary {
  confirmed: number;
  deaths: number;
  recovered: number;
}
