import React, { useState, useEffect } from 'react';

import { Container, Heading, Text, Link, Line } from './ui';
import { getData } from '../data';
import { Country } from '../types';
import GraphSummary from './GraphSummary';

interface AppProps {
  name: string;
}

const countries: string[] = ['China', 'Italy', 'Bulgaria'];

function formatCountries(cs: string[]): string {
  return cs.join(', ');
}

export default function App({ name }: AppProps) {
  const [loading, isLoading] = useState<boolean>(true);
  const [data, setData] = useState<Country[]>([]);
  useEffect(() => {
    Promise.all(countries.map(getData)).then(results => {
      setData(results);
      isLoading(false);
    });
  }, [setData]);

  if (loading) {
    return (
      <Container padding="2em" margin="0 auto" width="900px">
        <Heading>Covid-19 Stats / {formatCountries(countries)}</Heading>
        <Text>Loading data ...</Text>
      </Container>
    );
  }
  return (
    <Container padding="2em" margin="0 auto" width="900px">
      <Heading>Covid-19 Stats / {formatCountries(countries)}</Heading>
      <Text>
        The data is coming from{' '}
        <Link href="https://github.com/CSSEGISandData/COVID-19">
          Johns Hopkins CSSE
        </Link>
        .
      </Text>
      <Line />
      <GraphSummary
        data={data}
        types={['confirmed']} // recovered removed because of https://github.com/ExpDev07/coronavirus-tracker-api/issues/200
        label="Summary / confirmed cases / all days"
      />
    </Container>
  );
}
