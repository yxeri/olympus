import styled from 'styled-components';
import React from 'react';
import {
  borders,
  colors,
  sizes,
} from '../../styles/global';

export type ButtonProps = {
  isSelected?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const StyledButton = styled.button<{ isSelected?: boolean }>`
  all: unset;
  display: grid;
  background-color: ${({ isSelected }) => (isSelected ? colors.selectedBackground : colors.clickableBackground)};
  padding: .3rem;
  border-radius: ${sizes.corner};
  border: ${borders.standard};
`;

const Button: React.FC<ButtonProps> = ({ isSelected, ...props }) => (
  <StyledButton
    {...props}
    isSelected={isSelected}
  />
);

export default Button;
