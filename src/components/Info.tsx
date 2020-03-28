import React from 'react';
import { Text, Line, Link } from './ui';

export default function Info() {
  return (
    <>
      <Text ta="center">
        <Link href="https://www.who.int/health-topics/coronavirus">
          Coronavirus disease (COVID-19)
        </Link>{' '}
        is an infectious disease caused by a newly discovered coronavirus.
      </Text>
      <Text>
        <small>
          Most people infected with the COVID-19 virus will experience mild to
          moderate respiratory illness and recover without requiring special
          treatment. Older people, and those with underlying medical problems
          like cardiovascular disease, diabetes, chronic respiratory disease,
          and cancer are more likely to develop serious illness.
        </small>
      </Text>
      <Line />
    </>
  );
}
