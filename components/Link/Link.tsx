import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/global';

type LinkProps = {
  href: string,
} & PropsWithChildren;

const StyledLink = styled(NextLink)<{ isActive: boolean }>`
  all: unset;
  cursor: pointer;
  font-weight: bold;
  display: grid; 
  
  :focus {
    > * {
      stroke: ${colors.selected};
    }
  }
  
  ${({ isActive }) => isActive && `
    > * {
      stroke: ${colors.selected};
    }
  `}
`;

const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  const pathname = usePathname();

  return (
    <StyledLink
      {...props}
      isActive={props.href === pathname}
    >
      {children}
    </StyledLink>
  );
};

export default Link;
