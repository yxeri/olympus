import styled from 'styled-components';
import React from 'react';

export type ButtonProps = {
  isSelected?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const StyledButton = styled.button`
`;

const Button: React.FC<ButtonProps> = ({ isSelected, ...props }) => {
  console.log(isSelected);
  return <StyledButton {...props} />;
};

export default Button;
