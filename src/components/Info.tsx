/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Text, Line, Link, Grid, Container, BigEmoji, NavLink } from './ui';
import { Summary, Covid } from '../types';
import { calculateMortalityRate } from '../utils';

type InfoProps = {
  summary: Summary | null;
};

export default function Info({ summary }: InfoProps) {
  return (
    <Container margin="0 auto" width="550px">
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
      {summary !== null && (
        <>
          <Line />
          <Container padding="2em 0">
            <Text ta="center" padding="0">
              <NavLink href="#summary">Summary</NavLink>
              <NavLink href="#confirmed">Confirmed</NavLink>
              <NavLink href="#deaths">Deaths</NavLink>
              <NavLink href="#recovered">Recovered</NavLink>
              <NavLink href="?countries=all">All countries</NavLink>
              <NavLink href="#api">API</NavLink>
            </Text>
          </Container>
          <Line />
          <Text ta="center">
            <small style={{ opacity: 0.3 }}>Data across the globe:</small>
          </Text>
          <Grid columns="1fr 1fr 1fr 1fr">
            <div>
              <BigEmoji ta="center">😷</BigEmoji>
              <Text ta="center" padding="0">
                {summary !== null ? summary.confirmed : '...'}
              </Text>
              <Text ta="center">
                <small>confirmed</small>
              </Text>
            </div>
            <div>
              <BigEmoji ta="center">🙂</BigEmoji>
              <Text ta="center" padding="0">
                {summary !== null ? summary.recovered : '...'}
              </Text>
              <Text ta="center">
                <small>recovered</small>
              </Text>
            </div>
            <div>
              <BigEmoji ta="center">💀</BigEmoji>
              <Text ta="center" padding="0">
                {summary !== null ? summary.deaths : '...'}
              </Text>
              <Text ta="center">
                <small>deaths</small>
              </Text>
            </div>
            <div>
              <BigEmoji ta="center">📈</BigEmoji>
              <Text ta="center" padding="0">
                {summary !== null
                  ? calculateMortalityRate(summary as Covid)
                  : '...'}
              </Text>
              <Text ta="center">
                <small>mortality rate</small>
              </Text>
            </div>
          </Grid>
        </>
      )}
    </Container>
  );
}
