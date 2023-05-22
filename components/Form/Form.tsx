import {
  FormProps as RadixFormProps,
  Root
} from '@radix-ui/react-form';
import React from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import styled from 'styled-components';

const StyledForm = styled(Root)`
  display: grid;
  grid-gap: .5rem;
`;

type FormProps<T,> = Omit<RadixFormProps, 'onSubmit'> & {
  onSubmit: SubmitHandler<T & FieldValues>;
};

const Form = <T,>({ onSubmit, children }: FormProps<T>) => {
  const formMethods = useForm<T & FieldValues>();

  return (
    <FormProvider {...formMethods}>
      <StyledForm
        onSubmit={formMethods.handleSubmit(onSubmit)}
      >
        {children}
      </StyledForm>
    </FormProvider>
  );
};

export default Form;
