import NextLink from 'next/link';
import styled from 'styled-components';
import React, { PropsWithChildren } from 'react';

type LinkProps = {
  href: string,
} & PropsWithChildren;

const StyledLink = styled(NextLink)`
  all: unset;
  cursor: pointer;
  font-weight: bold;
  display: grid;
`;

const Link: React.FC<LinkProps> = ({ children, ...props }) => (
  <StyledLink
    {...props}
  >
    {children}
  </StyledLink>
);

export default Link;
