import { colors } from '@/styles/global';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import React, {
  CSSProperties,
  PropsWithChildren,
} from 'react';
import styled from 'styled-components';

type LinkProps = NextLinkProps & PropsWithChildren & { style?: CSSProperties };

const StyledLink = styled(NextLink)<{ isactive: 'true' | 'false' }>`
  font-family: inherit;
  color: inherit;
  cursor: pointer;
  font-weight: bold;
  display: grid;

  ${({ isactive }) => (isactive === 'true'
  ? `
    > * {
      stroke: ${colors.active};
    }
  `
  : `
    :focus {
      > * {
        stroke: ${colors.selected};
      }
    }
  `)}
`;

const Link: React.FC<LinkProps> = ({
  children,
  ...props
}) => {
  const pathname = usePathname();

  return (
    <StyledLink
      {...props}
      isactive={props.href === pathname
        ? 'true'
        : 'false'}
    >
      {children}
    </StyledLink>
  );
};

export default Link;
