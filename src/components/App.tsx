/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { Container, Heading, Text, Link, Line, Title } from './ui';
import { getData, getCountries } from '../data';
import { Country, Summary } from '../types';
import GraphSummary from './GraphSummary';
import GraphHospitalize from './GraphHospitalize';
import GraphPace from './GraphPace';
import Info from './Info';
import TableSummary from './TableSummary';
import Builder from './Builder';

import allCountries from '../countries.json';
import { formatCountries, findGetParameter } from '../utils';

interface AppProps {
  name: string;
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
      <Container padding="2em 0" margin="2em 0 0 0" bg="#f2f2f2">
        <Container margin="0 auto" width="900px">
          <Title>{formatCountries(countries)}</Title>
          <TableSummary data={data} />
          <Builder countries={allCountries} data={data} />
        </Container>
      </Container>
      <Container padding="2em 0" bg="#fff">
        <Container margin="0 auto" width="900px">
          <Title>Active cases in {formatCountries(countries)}</Title>
          <Text ta="center">
            <small>confirmed - recovered = active</small>
          </Text>
          <GraphHospitalize data={data} />
        </Container>
      </Container>
      <Container padding="2em 0" bg="#d5f4f7">
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
      <Container margin="3em auto" width="550px">
        <Text ta="center">
          <small>
            Data is fetched from{' '}
            <Link href="https://github.com/CSSEGISandData/COVID-19">
              Johns Hopkins University
            </Link>
            .<br />
            This project is living in GitHub at{' '}
            <Link href="https://github.com/krasimir/covid-19-stats">
              github.com/krasimir
            </Link>
            .
            <br />
            The data in JSON format{' '}
            <Link href="https://pomber.github.io/covid19/timeseries.json">
              here
            </Link>
            .
          </small>
        </Text>
      </Container>
    </Container>
  );
}
