/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Text, Line, Link, Grid, Container, TableCell } from './ui';
import { Country } from '../types';
import { calculateMortalityRate } from '../utils';

interface TableSummaryProps {
  data: Country[];
}

export default function TableSummary({ data }: TableSummaryProps) {
  const gridColumns = ['1fr'].concat(data.map(() => '1fr')).join(' ');
  return (
    <Container>
      <Grid columns={gridColumns}>
        <TableCell></TableCell>
        {data.map(({ country }) => (
          <TableCell key={country}>
            <strong>{country}</strong>
          </TableCell>
        ))}
        {/* confirmed */}
        <TableCell ta="right" padding="0 4em 0 0">
          <small>😷 Confirmed</small>
        </TableCell>
        {data.map(({ country, total }) => (
          <TableCell key={`${country}confirmed`}>
            <small>{total.confirmed}</small>
          </TableCell>
        ))}
        {/* recovered */}
        <TableCell ta="right" padding="0 4em 0 0">
          <small>🙂 Recovered</small>
        </TableCell>
        {data.map(({ country, total }) => (
          <TableCell key={`${country}recovered`}>
            <small>{total.recovered}</small>
          </TableCell>
        ))}
        {/* deaths */}
        <TableCell ta="right" padding="0 4em 0 0">
          <small>💀 Deaths</small>
        </TableCell>
        {data.map(({ country, total }) => (
          <TableCell key={`${country}deaths`}>
            <small>{total.deaths}</small>
          </TableCell>
        ))}
        {/* mortality rate */}
        <TableCell ta="right" padding="0 4em 0 0">
          <small>📈 Mortality rate</small>
        </TableCell>
        {data.map(item => (
          <TableCell key={`${item.country}rate`}>
            <small>{calculateMortalityRate(item.total)}</small>
          </TableCell>
        ))}
      </Grid>
    </Container>
  );
}
