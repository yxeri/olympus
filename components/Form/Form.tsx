import {
  FormProps as RadixFormProps,
  Root
} from '@radix-ui/react-form';
import React, { useEffect } from 'react';
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

type FormProps<T, > = Omit<RadixFormProps, 'onSubmit'> & {
  onSubmit: SubmitHandler<T & FieldValues>;
  keepData?: boolean;
};

const Form = <T, >({ onSubmit, children, keepData = false }: FormProps<T>) => {
  const formMethods = useForm<T & FieldValues>();

  useEffect(() => {
    if (formMethods.formState.isSubmitSuccessful && !keepData) {
      formMethods.reset();
    }
  }, [formMethods.formState.isSubmitSuccessful, keepData]);

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
