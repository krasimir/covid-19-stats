/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import { Container, Heading, Text, Link, Line, Title, Code } from './ui';
import { getData, getCountries } from '../data';
import { Country, Summary } from '../types';
import GraphSummary from './GraphSummary';
import GraphHospitalize from './GraphHospitalize';
import GraphPace from './GraphPace';
import Info from './Info';
import TableSummary from './TableSummary';
import Builder from './Builder';

import staticCountriesData from '../countries.json';
import { formatCountries, findGetParameter, formatDateStr } from '../utils';

interface AppProps {
  name: string;
}

const allCountries = Object.keys(staticCountriesData);

export default function App({ name }: AppProps) {
  const [loading, isLoading] = useState<boolean>(true);
  const [data, setData] = useState<Country[]>([]);
  const [summary, setSummary] = useState<Summary>({
    confirmed: 0,
    deaths: 0,
    recovered: 0,
  });
  let [countries, setCountries] = useState<string[]>([]);
  let [areAllCountries, setAllCountries] = useState<boolean>(false);

  useEffect(() => {
    const countriesGET = findGetParameter('countries');
    if (countriesGET) {
      setAllCountries((areAllCountries = countriesGET === 'all'));
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
    getData(countries, areAllCountries).then(results => {
      setData(results.data.filter(entry => entry));
      setSummary(results.summary);
      isLoading(false);
      window.scrollTo(0, 0);
    });
  }, []);

  if (loading) {
    return (
      <Container padding="2em" margin="0 auto" width="900px">
        <Heading>
          Covid-19 Statistics & API
          <br />
          <small>⌛ Loading data ...</small>
        </Heading>
        <Info summary={null} />
      </Container>
    );
  }

  const lastUpdate = data[0]
    ? formatDateStr(data[0].dates[data[0].dates.length - 1].date, true)
    : '';

  return (
    <Container padding="2em 0 0 0">
      <Container margin="0 auto" width="900px">
        <Heading>
          Covid-19 Statistics & API
          <br />
          <small>{lastUpdate}</small>
        </Heading>
        <Info summary={summary} />
      </Container>
      <Container padding="2em 0" margin="2em 0 0 0" bg="#f2f2f2">
        <Container margin="0 auto" width="900px">
          <Title>
            <a id="summary">{formatCountries(countries)}</a>
          </Title>
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
          <Title>
            <a id="confirmed">
              Confirmed cases in {formatCountries(countries)}
            </a>
          </Title>
          <GraphSummary data={data} types={['confirmed']} />
          <GraphPace data={data} types={['confirmed']} />
        </Container>
      </Container>
      <Container padding="2em 0" bg="#ffd8d1">
        <Container margin="0 auto" width="900px">
          <Title>
            <a id="deaths">Death cases in {formatCountries(countries)}</a>
          </Title>
          <GraphSummary data={data} types={['deaths']} />
          <GraphPace data={data} types={['deaths']} />
        </Container>
      </Container>
      <Container padding="2em 0" bg="#e6fcd4">
        <Container margin="0 auto" width="900px">
          <Title>
            <a id="recovered">
              Recovered cases in {formatCountries(countries)}
            </a>
          </Title>
          <GraphSummary data={data} types={['recovered']} />
          <GraphPace data={data} types={['recovered']} />
        </Container>
      </Container>
      <Container padding="2em 0" bg="#00GG00">
        <Container margin="0 auto" width="550px">
          <Title>
            <a id="api">API</a>
          </Title>
          <Text>
            Data is fetched from{' '}
            <Link href="https://github.com/CSSEGISandData/COVID-19">
              Johns Hopkins University
            </Link>
            . A new request to their repository is made every 20 minutes. On the
            question how often they update the repo they{' '}
            <Link href="https://coronavirus.jhu.edu/map-faq.html">
              answered
            </Link>{' '}
            -{' '}
            <i>
              <small>
                "The GitHub database updates daily at around 11:59 p.m. UTC.
                Occasional maintenance can result in slower updates"
              </small>
            </i>
            .
          </Text>
          <Line />
          <Text padding="0">➡️ Get data for specific countries</Text>
          <Code>/api?countries=&lt;countries></Code>
          <Text>
            <small>
              Example:{' '}
              <Link href="/api?countries=US,Italy,Norway" target="_blank">
                /api?countries=US,Italy,Norway
              </Link>
            </small>
          </Text>
          <Text padding="1em 0 0 0">➡️ Get data for all countries</Text>
          <Code>/api?countries=all</Code>
          <Text>
            <small>
              Example:{' '}
              <Link href="/api?countries=all" target="_blank">
                /api?countries=all
              </Link>
            </small>
          </Text>
          <Text padding="1em 0 0 0">➡️ Get list of all countries</Text>
          <Code>/api/countries</Code>
          <Text>
            <small>
              Example:{' '}
              <Link href="/api/countries" target="_blank">
                /api/countries
              </Link>
            </small>
          </Text>
        </Container>
      </Container>
      <Container margin="3em auto" width="550px">
        <Line />
        <Text ta="center">
          <small>
            This project is open source. For contribution go here{' '}
            <Link href="https://github.com/krasimir/covid-19-stats">
              github.com/krasimir/covid-19-stats
            </Link>
          </small>
        </Text>
      </Container>
    </Container>
  );
}
