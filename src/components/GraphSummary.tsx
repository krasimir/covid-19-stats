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
  countries: string[];
  label: string;
}

const types = ['confirmed', 'deaths', 'recovered'];

type GraphItem = {
  [key: string]: number | string;
};

export default function GraphSummary({
  data,
  countries,
  label,
}: GraphSummaryProps) {
  let graphData: GraphItem[] = [];
  data.forEach(c => {
    Object.keys(c.dates).forEach(date => {
      const foundDate = graphData.find(({ x }) => x === date);
      if (foundDate) {
        types.forEach(type => {
          foundDate[c.country + type] = c.dates[date][type];
        });
      } else {
        types.forEach(type => {
          graphData.push({
            x: date,
            [c.country + type]: c.dates[date][type],
          });
        });
      }
    });
  });
  graphData = graphData.map(obj => {
    obj.x = formatDateStr(obj.x as string);
    return obj;
  });
  console.log(graphData);
  return (
    <Container margin="1em 0">
      <Title>{label}</Title>
      <LineChart width={900} height={300} data={graphData}>
        <XAxis dataKey="x" interval="preserveStartEnd" />
        <YAxis />
        <CartesianGrid />
        <Tooltip />
        <Legend />
        {...countries.reduce<JSX.Element[]>((lines, countryStr) => {
          const color = getRandomColor();
          types.forEach(type =>
            lines.push(
              <Line
                key={countryStr + type}
                dot={false}
                type="monotone"
                dataKey={countryStr + type}
                strokeWidth={3}
                stroke={color}
                activeDot={{ r: 5 }}
                legendType="circle"
              />
            )
          );
          return lines;
        }, [])}
      </LineChart>
    </Container>
  );
}
