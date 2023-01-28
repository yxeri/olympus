import styled, { css } from 'styled-components';
import { sizes } from '../../styles/global';

export type ListVariants = 'list' | 'grid';

const variants = (variant?: ListVariants) => {
  if (variant === 'grid') {
    return css`
      grid-template-columns: repeat(auto-fill, minmax(${sizes.gridWidth[0]}, 1fr));
      width: 100%;
    `;
  }

  return css`
    @media (max-width: ${sizes.mediumMax}) {
      width: 100%;
      max-width: 100%;
    }
  `;
};

export default styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: grid;
  ${({ variant }: { variant?: ListVariants }) => variants(variant)}
`;
