/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { Container, Heading, Text, Link, Line, Title } from './ui';
import { getData, getCountries } from '../data';
import { Country, Summary } from '../types';
import GraphSummary from './GraphSummary';
import GraphPace from './GraphPace';
import Info from './Info';
import allCountries from '../countries.json';

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
  const [summary, setSummary] = useState<Summary>({
    confirmed: 0,
    deaths: 0,
    recovered: 0,
  });
  let [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    const countriesGET = findGetParameter('countries');
    if (countriesGET) {
      const recognized = countriesGET
        .split(',')
        .map(country =>
          allCountries.find(c => c.toLowerCase() === country.toLowerCase())
        )
        .filter(c => c);
      setCountries((countries = recognized as string[]));
    } else {
      setCountries((countries = ['China', 'Italy', 'US']));
    }
    getData(countries).then(results => {
      console.log(results);
      setData(results.data.filter(entry => entry));
      setSummary(results.summary);
      isLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Container padding="2em" margin="0 auto" width="900px">
        <Heading>Covid-19 Statistics</Heading>
        <Container padding="2em 0">
          <Text ta="center">Loading data ...</Text>
        </Container>
      </Container>
    );
  }
  return (
    <Container padding="2em 0 0 0">
      <Container margin="0 auto" width="900px">
        <Heading>Covid-19 Statistics</Heading>
        <Info summary={summary} />
      </Container>
      <Container padding="2em 0" margin="2em 0 0 0" bg="#f6f7e4">
        <Container margin="0 auto" width="900px">
          <Title>Confirmed cases in {formatCountries(countries)}</Title>
          <GraphSummary data={data} types={['confirmed']} />
          <GraphPace data={data} types={['confirmed']} />
        </Container>
      </Container>
      <Container padding="2em 0" bg="#ffd8d1">
        <Container margin="0 auto" width="900px">
          <Title>Death cases in {formatCountries(countries)}</Title>
          <GraphSummary data={data} types={['deaths']} />
          <GraphPace data={data} types={['deaths']} />
        </Container>
      </Container>
      <Container padding="2em 0" bg="#e6fcd4">
        <Container margin="0 auto" width="900px">
          <Title>Recovered cases in {formatCountries(countries)}</Title>
          <GraphSummary data={data} types={['recovered']} />
          <GraphPace data={data} types={['recovered']} />
        </Container>
      </Container>
    </Container>
  );
}
