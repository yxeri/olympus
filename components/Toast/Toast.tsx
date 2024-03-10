import {
  Action,
  Description,
  Root,
  Title,
} from '@radix-ui/react-toast';
import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';

type ToastBase = {
  title?: ReactNode | string;
  description: ReactNode | string;
  type?: 'success' | 'error' | 'info';
};

type ToastWithAction = ToastBase & {
  action: ReactNode;
  actionAltText: string;
};

type ToastWithoutAction = ToastBase & {
  action?: never;
  actionAltText?: never;
};

type ToastProps = ToastWithAction | ToastWithoutAction;

const toastVariants: (type: ToastBase['type']) => any = (type) => {
  switch (type) {
    case 'success': {
      return css``;
    }
    case 'error': {
      return css``;
    }
    default: {
      return css``;
    }
  }
};

const StyledRoot = styled(Root)<{ toastType: ToastBase['type'] }>`
  ${(props) => toastVariants(props.toastType)}
`;

const Toast: React.FC<ToastProps> = ({
  title,
  description,
  action,
  actionAltText,
  type = 'info',
}) => (
  <StyledRoot toastType={type}>
    {title && <Title>{title}</Title>}
    {description && <Description>{description}</Description>}
    {action && <Action altText={actionAltText ?? action}>{action}</Action>}
  </StyledRoot>
);

export default Toast;
