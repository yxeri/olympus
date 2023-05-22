import { FormSubmitProps } from '@radix-ui/react-form';
import React, { PropsWithChildren } from 'react';

type SubmitProps = PropsWithChildren & FormSubmitProps;

const Submit: React.FC<SubmitProps> = ({
  children,
  ...otherProps
}) => (
  <Submit {...otherProps}>
    {children}
  </Submit>
);

export default Submit;
