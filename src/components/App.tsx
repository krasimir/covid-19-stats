/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { Container, Heading, Text, Link, Line, Title } from './ui';
import { getData } from '../data';
import { Country } from '../types';
import GraphSummary from './GraphSummary';
import GraphPace from './GraphPace';
import Info from './Info';

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
    getData(countries).then(results => {
      setData(results);
      isLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Container padding="2em" margin="0 auto" width="900px">
        <Heading>
          Covid-19 Statistics
          <br />
          {formatCountries(countries)}
        </Heading>
        <Info />
        <Container padding="2em 0" margin="2em 0 0 0">
          <Text>Loading data ...</Text>
        </Container>
      </Container>
    );
  }
  return (
    <Container padding="2em 0">
      <Container margin="0 auto" width="900px">
        <Heading>
          Covid-19 Statistics
          <br />
          {formatCountries(countries)}
        </Heading>
        <Info />
      </Container>
      <Container padding="2em 0" margin="2em 0 0 0" bg="#f6f7e4">
        <Container margin="0 auto" width="900px">
          <Title>Confirmed cases</Title>
          <GraphSummary data={data} types={['confirmed']} />
          <GraphPace data={data} types={['confirmed']} />
        </Container>
      </Container>
      <Container padding="2em 0" bg="#ffd8d1">
        <Container margin="0 auto" width="900px">
          <Title>Death cases</Title>
          <GraphSummary data={data} types={['deaths']} />
          <GraphPace data={data} types={['deaths']} />
        </Container>
      </Container>
      <Container padding="2em 0" bg="#e6fcd4">
        <Container margin="0 auto" width="900px">
          <Title>Recovered cases</Title>
          <GraphSummary data={data} types={['recovered']} />
          <GraphPace data={data} types={['recovered']} />
        </Container>
      </Container>
    </Container>
  );
}
