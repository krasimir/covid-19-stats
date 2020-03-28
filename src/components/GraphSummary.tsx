import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Country } from '../types';
import { getRandomColor, formatDateStr } from '../utils';
import { Container, Title } from './ui';

interface GraphSummaryProps {
  data: Country[];
  label: string;
  types: string[];
}

const getGraphItemKey = (country: Country, type: string) =>
  `${country.country}(${type})`;

type GraphItem = {
  [key: string]: number | string;
};

export default function GraphSummary({
  data,
  label,
  types,
}: GraphSummaryProps) {
  const graphData: GraphItem[] = [];
  const keys: string[] = [];
  data.forEach(c => {
    types.forEach(type => {
      keys.push(getGraphItemKey(c, type));
    });
    Object.keys(c.dates).forEach(date => {
      const foundDate = graphData.find(({ x }) => x === date);
      if (foundDate) {
        types.forEach(type => {
          foundDate[getGraphItemKey(c, type)] = c.dates[date][type];
        });
      } else {
        const item: GraphItem = {};
        item.x = date;
        types.forEach(type => {
          item[getGraphItemKey(c, type)] = c.dates[date][type];
        });
        graphData.push(item);
      }
    });
  });
  console.log(keys);
  return (
    <Container margin="1em 0">
      <Title>{label}</Title>
      <LineChart width={900} height={300} data={graphData}>
        <XAxis dataKey="x" interval="preserveStartEnd" />
        <YAxis />
        <CartesianGrid />
        <Tooltip />
        <Legend />
        {...keys.reduce<JSX.Element[]>((lines, key) => {
          const color = getRandomColor();
          lines.push(
            <Line
              key={key}
              dot={false}
              type="monotone"
              dataKey={key}
              strokeWidth={3}
              stroke={color}
              activeDot={{ r: 5 }}
              legendType="circle"
            />
          );
          return lines;
        }, [])}
      </LineChart>
    </Container>
  );
}
