export type Covid = {
  [key: string]: number;
  confirmed: number;
  deaths: number;
  recovered: number;
};

export interface Country {
  error?: string;
  country: string;
  latest: Covid;
  dates: Record<string, Covid>;
}
