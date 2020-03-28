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
import { getColor } from '../utils';
import { Container, Text } from './ui';

interface GraphSummaryProps {
  data: Country[];
  types: string[];
}

const getGraphItemKey = (country: Country, type: string) =>
  `${country.country}(${type})`;

type GraphItem = {
  [key: string]: number | string;
};

export default function GraphPace({ data, types }: GraphSummaryProps) {
  const graphData: GraphItem[] = [];
  const keys: string[] = [];
  data.forEach(c => {
    types.forEach(type => {
      keys.push(getGraphItemKey(c, type));
    });
    Object.keys(c.pace).forEach(day => {
      const foundDate = graphData.find(({ x }) => x === day);
      if (foundDate) {
        types.forEach(type => {
          foundDate[getGraphItemKey(c, type)] = c.pace[day][type];
        });
      } else {
        const item: GraphItem = {};
        item.x = day;
        types.forEach(type => {
          item[getGraphItemKey(c, type)] = c.pace[day][type];
        });
        graphData.push(item);
      }
    });
  });
  return (
    <Container margin="1em 0">
      <Text ta="center">Pace</Text>
      <LineChart width={900} height={400} data={graphData}>
        <XAxis dataKey="x" interval="preserveStartEnd" />
        <YAxis />
        <CartesianGrid />
        <Tooltip />
        <Legend formatter={(item, entry, idx) => data[idx as number].country} />
        {...keys.reduce<JSX.Element[]>((lines, key, idx) => {
          const color = getColor(idx);
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
