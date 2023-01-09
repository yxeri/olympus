import styled, { css } from 'styled-components';

export type ListVariants = 'list' | 'grid';

const variants = (variant?: ListVariants) => {
  if (variant === 'grid') {
    return css`
      grid-template-columns: repeat(auto-fill, 170px);
      width: fit-content;
      max-width: 800px;
    `;
  }

  return css`
    max-width: 500px;
    @media (max-width: 500px) {
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
