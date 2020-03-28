/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Text, Line, Link, Grid, Container, BigEmoji } from './ui';
import { Summary } from '../types';

type InfoProps = {
  summary: Summary;
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
      <Line />
      <Grid columns="1fr 1fr 1fr">
        <div>
          <BigEmoji ta="center">😷</BigEmoji>
          <Text>
            <small>confirmed cases</small>
          </Text>
          <Text ta="center">{summary.confirmed}</Text>
        </div>
        <div>
          <BigEmoji ta="center">💀</BigEmoji>
          <Text>
            <small>death cases</small>
          </Text>
          <Text ta="center">{summary.deaths}</Text>
        </div>
        <div>
          <BigEmoji ta="center">😅</BigEmoji>
          <Text>
            <small>recovered cases</small>
          </Text>
          <Text ta="center">{summary.recovered}</Text>
        </div>
      </Grid>
    </Container>
  );
}
