import {
  Control,
  Field,
  Label
} from '@radix-ui/react-form';
import React from 'react';
import {
  RegisterOptions,
  useFormContext,
} from 'react-hook-form';
import styled from 'styled-components';
import {
  borders,
  colors,
  sizes
} from '../../styles/global';
import Container from '../Container/Container';

const StyledField = styled(Field)`
  display: grid;
  outline: none;
  [data-invalid="true"] {
    border-color: ${colors.errorBorder};
    background: ${colors.error};
  }
`;

const StyledInput = styled(Control)`
  padding: .5rem;
  border-radius: ${sizes.corner};
  border: ${borders.standard};
`;

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string,
  label?: string,
  options?: RegisterOptions,
};

const Input: React.FC<InputProps> = ({
  name,
  label,
  options,
  ...otherProps
}) => {
  const { register } = useFormContext();

  return (
    <Container>
      <StyledField name={name}>
        {label && <Label>{label}</Label>}
        <StyledInput
          {...otherProps}
          {...register(name, options)}
        />
      </StyledField>
    </Container>
  );
};

export default Input;
