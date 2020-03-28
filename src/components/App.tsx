/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { Container, Heading, Text, Link, Line, Title } from './ui';
import { getData } from '../data';
import { Country } from '../types';
import GraphSummary from './GraphSummary';
import GraphPace from './GraphPace';

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
  let [countries, setCountries] = useState<string[]>([]);
  useEffect(() => {
    const countriesGET = findGetParameter('countries');
    if (countriesGET) {
      setCountries((countries = countriesGET.split(',')));
    } else {
      setCountries((countries = ['China', 'Italy', 'US']));
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
        ,{' '}
        <Link href="https://github.com/ExpDev07/coronavirus-tracker-api">
          (api).
        </Link>
        .
      </Text>
      <Line />
      <Title>Confirmed cases</Title>
      <GraphSummary data={data} types={['confirmed']} />
      <GraphPace data={data} types={['confirmed']} />
      <Title>Death cases</Title>
      <GraphSummary data={data} types={['deaths']} />
      <GraphPace data={data} types={['deaths']} />
    </Container>
  );
}
