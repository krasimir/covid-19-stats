/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { Container, Heading, Text, Link, Line } from './ui';
import { getData } from '../data';
import { Country } from '../types';
import GraphSummary from './GraphSummary';

interface AppProps {
  name: string;
}

function formatCountries(cs: string[]): string {
  return cs.join(', ');
}
function findGetParameter(parameterName: string): null | string {
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

export default function App({ name }: AppProps) {
  const [loading, isLoading] = useState<boolean>(true);
  const [data, setData] = useState<Country[]>([]);
  let [countries, setCountries] = useState<string[]>([
    'China',
    'Italy',
    'United Kingdom',
  ]);
  useEffect(() => {
    const countriesGET = findGetParameter('countries');
    if (countriesGET) {
      setCountries((countries = countriesGET.split(',')));
    }
    Promise.all(countries.map(getData)).then(results => {
      setData(
        results.filter(r => {
          console.error(r.error);
          return !r.error;
        }) as Country[]
      );
      isLoading(false);
    });
  }, []);

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
        types={['confirmed']}
        label="Summary / confirmed cases"
      />
      <GraphSummary
        data={data}
        types={['deaths']}
        label="Summary / death cases"
      />
      {/* removed because of https://github.com/ExpDev07/coronavirus-tracker-api/issues/200
        <GraphSummary
        data={data}
        types={['recovered']}
        label="Summary / death cases"
      /> */}
    </Container>
  );
}
