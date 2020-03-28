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

interface GraphHospitalizedProps {
  data: Country[];
}

const getGraphItemKey = (country: Country, type: string) =>
  `${country.country}(${type})`;

type GraphItem = {
  [key: string]: number | string;
};

export default function GraphHospitalized({ data }: GraphHospitalizedProps) {
  let graphData: GraphItem[] = [];
  const keys: string[] = [];
  data.forEach(c => {
    keys.push(getGraphItemKey(c, 'hospitalized'));
    c.dates.forEach(entry => {
      const foundDate = graphData.find(({ date }) => date === entry.date);
      if (foundDate) {
        foundDate[getGraphItemKey(c, 'hospitalized')] =
          entry.confirmed - entry.recovered;
      } else {
        const item: GraphItem = {};
        item.date = entry.date;
        item[getGraphItemKey(c, 'hospitalized')] =
          entry.confirmed - entry.recovered;
        graphData.push(item);
      }
    });
  });
  graphData = graphData.map(obj => {
    obj.date = formatDateStr(obj.date as string);
    return obj;
  });
  return (
    <Container margin="1em 0">
      <LineChart width={900} height={400} data={graphData}>
        <XAxis dataKey="date" interval="preserveStartEnd" />
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
