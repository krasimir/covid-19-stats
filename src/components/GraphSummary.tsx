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
import { getColor, formatDateStr } from '../utils';
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

export default function GraphSummary({ data, types }: GraphSummaryProps) {
  let graphData: GraphItem[] = [];
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
  graphData = graphData.map(obj => {
    obj.x = formatDateStr(obj.x as string);
    return obj;
  });
  return (
    <Container margin="1em 0">
      <Text ta="center">By date</Text>
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
