import React, { useState, useEffect } from 'react';

import { Container } from './ui';
import { getData } from '../data';
import { Country } from '../types';

interface AppProps {
  name: string;
}

const countries: string[] = ['CN', 'IT', 'BG'];

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
      <Container padding="1em">
        Loading data for {countries.join(', ')} ...
      </Container>
    );
  }
  return <Container padding="1em">Show me the data</Container>;
}
