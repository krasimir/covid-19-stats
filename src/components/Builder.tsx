import React, { useState } from 'react';
import ReactTags, { Tag } from 'react-tag-autocomplete';
import { Country } from '../types';
import { Link, Text, Container, Title } from './ui';

const builder = {
  tags: [
    { id: 1, name: 'Apples' },
    { id: 2, name: 'Pears' },
  ],
  suggestions: [
    { id: 3, name: 'Bananas' },
    { id: 4, name: 'Mangos' },
    { id: 5, name: 'Lemons' },
    { id: 6, name: 'Apricots' },
  ],
};

type BuilderProps = {
  countries: string[];
  data: Country[];
};

function getSuggestions(countries: string[]): Tag[] {
  return countries.map((countryName, i) => ({ id: i + 1, name: countryName }));
}
function getTags(countries: string[], data: Country[]): Tag[] {
  const currentCountries = data.map(c => c.country);
  return getSuggestions(countries).filter(tag =>
    currentCountries.includes(tag.name)
  );
}

export default function Builder({ countries, data }: BuilderProps) {
  const [tags, setTags] = useState<Tag[]>(getTags(countries, data));
  const [suggestions, setSuggestions] = useState(getSuggestions(countries));

  function handleDelete(i: number) {
    const t = tags.slice(0);
    t.splice(i, 1);
    setTags(t);
  }

  function handleAddition(tag: Tag) {
    setTags([...tags, tag]);
  }

  const link = `https://c19stats.now.sh?countries=${tags
    .map(t => t.name)
    .join(',')}`;

  return (
    <Container margin="2em 0 0 0">
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        placeholder="Add new country"
      />
      {tags.length > 0 ? (
        <Text ta="center" padding="1em 0 0 0">
          📌{'  '}
          <Link href={link} target="_blank">
            {link}
          </Link>
        </Text>
      ) : (
        ''
      )}
    </Container>
  );
}
