import React from 'react';
import styled from 'styled-components';
import {
  borders,
  colors,
  sizes,
} from 'styles/global';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isSelected?: boolean;
};

const StyledButton = styled.button<{ isSelected?: boolean }>`
  all: unset;
  display: grid;
  background-color: ${({ isSelected }) => (isSelected ? colors.selectedBackground : colors.clickableBackground)};
  padding: .5rem;
  border-radius: ${sizes.corner};
  border: ${borders.standard};
  align-content: center;
`;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { isSelected, ...props },
  ref
) => (
  <StyledButton
    {...props}
    ref={ref}
    isSelected={isSelected}
  />
));

export default Button;
