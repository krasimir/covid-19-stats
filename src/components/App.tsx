import React, { useState, useEffect } from 'react';

import { Container, Heading, Text, Link, Line } from './ui';
import { getData } from '../data';
import { Country } from '../types';
import GraphSummary from './GraphSummary';

interface AppProps {
  name: string;
}

const countries: string[] = ['CN', 'IT', 'BG'];

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
        <Heading>Covid-19 Stats</Heading>
        <Text>Loading data for {formatCountries(countries)} ...</Text>
      </Container>
    );
  }
  return (
    <Container padding="2em" margin="0 auto" width="900px">
      <Heading>Covid-19 Stats</Heading>
      <Text>
        The graphs below are for the following countries:{' '}
        {formatCountries(countries)}. The data is coming from{' '}
        <Link href="https://github.com/CSSEGISandData/COVID-19">
          Johns Hopkins CSSE
        </Link>
        .
      </Text>
      <Line />
      <GraphSummary
        data={data}
        countries={countries}
        label="Summary / confirmed cases / all days"
      />
    </Container>
  );
}
