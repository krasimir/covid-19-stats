import styled from 'styled-components';

type StylesProps = {
  padding?: string | 0;
  margin?: string | 0;
  width?: string | 0;
  height?: string | 0;
  ta?: string;
};

export const Container = styled.div<StylesProps>`
  padding: ${props => ('padding' in props ? props.padding : '0')};
  margin: ${props => ('margin' in props ? props.margin : 0)};
  width: ${props => ('width' in props ? props.width : 'auto')};
  height: ${props => ('height' in props ? props.height : 'auto')};
`;

export const Heading = styled.h2`
  font-family: 'Fredoka One', cursive;
  font-size: 2em;
  line-height: 1.4em;
  margin: 0;
  padding: 0 0 1em 0;
`;

export const Title = styled.h2`
  font-family: 'Fredoka One', cursive;
  font-size: 1.4em;
  line-height: 1.6em;
  margin: 0;
  padding: 0 0 1em 0;
`;

export const Text = styled.p<StylesProps>`
  font-family: 'Roboto', sans-serif;
  font-size: 1em;
  line-height: 1.6em;
  margin: 0;
  padding: 0 0 1em 0;
  text-align: ${props => ('ta' in props ? props.ta : 'left')};
`;

export const Link = styled.a`
  color: #229160;
  font-weight: bold;
  text-decoration: none;
`;

export const Line = styled.hr`
  border-top: none;
  border-bottom: dotted 1px #999;
  margin: 1em 0;
`;
