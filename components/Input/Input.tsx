import {
  Control,
  Field,
  Label
} from '@radix-ui/react-form';
import React, { useState } from 'react';
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
  position: relative;
  display: grid;
  outline: none;
  background-color: ${colors.clickableBackground};

  [data-invalid="true"] {
    border-color: ${colors.errorBorder};
    background-color: ${colors.error};
  }

  &[data-invalid="true"] {
    border-color: ${colors.errorBorder};
    background-color: ${colors.error};
  }
`;

const StyledInput = styled(Control)`
  padding: .4rem;
  border-radius: ${sizes.corner};
  border: ${borders.standard};
  font-size: inherit;
  background-color: ${colors.inputBackground};
`;

const FocusPlaceholder = styled(Label)<{ hasFocus?: boolean }>`
  display: ${({ hasFocus }) => (hasFocus ? 'inherit' : 'none')};
  position: absolute;
  top: -1.1rem;
  left: .3rem;
  background-color: inherit;
  border-top-left-radius: .2rem;
  border-top-right-radius: .2rem;
  font-size: .9rem;
  padding: .1rem .2rem;
  border-top: ${borders.standard};
  border-left: ${borders.standard};
  border-right: ${borders.standard};
  //text-shadow: 0px 0px 1px rgba(0,0,0,0.5);
`;

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string,
  label?: string,
  options?: RegisterOptions,
  hideFocusPlaceholder?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  name,
  label,
  options,
  hideFocusPlaceholder = false,
  ...otherProps
}, ref) => {
  const [focused, setFocused] = useState(false);
  const { register } = useFormContext();
  const { ref: formRef, ...registerProps } = register(name, {
    ...options,
  });

  return (
    <Container>
      <StyledField name={name}>
        {label && <Label>{label}</Label>}
        {otherProps.placeholder && hideFocusPlaceholder
          && <FocusPlaceholder hasFocus={focused}>{otherProps.placeholder}</FocusPlaceholder>}
        <StyledInput
          {...otherProps}
          {...registerProps}
          ref={(e: any) => {
            formRef(e);

            if (typeof ref === 'function') {
              ref(e);
            } else if (ref) {
              // eslint-disable-next-line no-param-reassign
              ref.current = e;
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </StyledField>
    </Container>
  );
});

export default Input;
