import styled from 'styled-components';

type StylesProps = {
  padding?: string | 0;
  margin?: string | 0;
  width?: string | 0;
  height?: string | 0;
  ta?: string;
  bg?: string;
  columns?: string;
};

export const Container = styled.div<StylesProps>`
  padding: ${props => ('padding' in props ? props.padding : '0 1em')};
  margin: ${props => ('margin' in props ? props.margin : 0)};
  max-width: ${props => ('width' in props ? props.width : 'auto')};
  height: ${props => ('height' in props ? props.height : 'auto')};
  background: ${props => ('bg' in props ? props.bg : '')};
`;

export const Heading = styled.h1`
  font-family: 'Fredoka One', cursive;
  font-size: 2em;
  line-height: 1.4em;
  margin: 0;
  padding: 0 0 1em 0;
  text-align: center;
`;

export const Title = styled.h2`
  font-family: 'Fredoka One', cursive;
  font-size: 1.4em;
  line-height: 1.6em;
  margin: 0;
  padding: 0 0 1em 0;
  text-align: center;
`;

export const Text = styled.p<StylesProps>`
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  line-height: 1.3em;
  margin: 0;
  padding: ${props => ('padding' in props ? props.padding : '0 0 1em 0')};
  text-align: ${props => ('ta' in props ? props.ta : 'left')};
`;

export const TableCell = styled(Text)`
  border-top: dotted 1px #cfcfcf;
  padding: 1em;
`;

export const Link = styled.a`
  color: #0f4eb2;
  font-weight: bold;
  text-decoration: none;
  &:hover {
    color: #e012d6;
  }
`;

export const NavLink = styled.a`
  font-size: 0.9em;
  color: #0f4eb2;
  display: inline-block;
  font-weight: bold;
  text-decoration: none;
  & + & {
    margin-left: 1em;
  }
  &:hover {
    color: #e012d6;
  }
`;

export const Line = styled.hr`
  border-top: none;
  border-bottom: dotted 1px #999;
  margin: 1em 0;
`;

export const Grid = styled.div<StylesProps>`
  display: grid;
  grid-template-columns: ${props => props.columns};
`;

export const BigEmoji = styled.div<StylesProps>`
  font-size: 3em;
  text-align: ${props => ('ta' in props ? props.ta : 'left')};
`;

export const Code = styled.div<StylesProps>`
  padding: 0.4em;
  font-size: 0.9em;
  background: #f2f2f2;
  margin: 0.2em 0;
`;
