import { Covid } from './types';

const colors = [
  'fc3903',
  '11a823',
  '1152a8',
  '5d11a8',
  'a81194',
  'a81137',
  'a86e11',
  '96c445',
  '94a17d',
];

export function getColor(idx: number): string {
  if (colors[idx]) {
    return `#${colors[idx]}`;
  }
  return colors[0];
}

export function formatDateStr(str: string): string {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const d = new Date(str);
  return `${d.getDate()} ${monthNames[d.getMonth()]}`;
}

export function calculateMortalityRate(c: Covid): string {
  return `${((c.deaths / c.confirmed) * 100).toFixed(2)}%`;
}

export function formatCountries(cs: string[]): string {
  if (cs.length === 2) {
    return cs.join(' and ');
  }
  let str = '';
  for (let i = 0; i < cs.length; i++) {
    if (i === 0) {
      str += cs[i];
    } else if (i < cs.length - 1) {
      str += `, ${cs[i]}`;
    } else {
      str += ` and ${cs[i]}`;
    }
  }
  return str;
}
export function findGetParameter(parameterName: string): null | string {
  let result = null;
  let tmp = [];
  location.search
    .substr(1)
    .split('&')
    .forEach(function(item) {
      tmp = item.split('=');
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}
