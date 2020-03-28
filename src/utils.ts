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
