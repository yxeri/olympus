import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title as RadixTitle,
  Trigger as RadixTrigger,
} from '@radix-ui/react-dialog';
import CloseIcon from 'assets/x.svg';
import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';
import { sizes } from 'styles/global';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const DialogOverlay = styled(Overlay)`
  background-color: rgba(0, 0, 0, 0.3);
  position: fixed;
  inset: 0;
  animation: ${fadeIn} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 10;
`;

const DialogContent = styled(Content)`
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100vw - 2rem);
  max-width: ${sizes.mediumMax};
  max-height: calc(100vh - 2rem);
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  background-color: #ccc7b5;
  box-shadow: hsl(206 22% 7% / 35%) 0 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  z-index: 10;
  display: grid;
  grid-gap: 1rem;
`;

const DialogClose = styled(Close)`
  display: grid;
  align-items: center;
  position: absolute;
  top: .2rem;
  right: .2rem;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
`;

export const Trigger = styled(RadixTrigger)`
  font: inherit;
  cursor: pointer;
`;

const Title = styled(RadixTitle)`
  margin: 0 auto;

`;

type ModalProps = {
  trigger: ReactNode,
  interaction?: ReactNode[],
  title: string | ReactNode,
  description?: string | ReactNode,
  content: ReactNode,
  onOpenChange?: (open: boolean) => void,
  defaultOpen?: boolean,
  open?: boolean,
};

const Modal: React.FC<ModalProps> = ({
  trigger,
  interaction,
  title,
  description,
  content,
  onOpenChange,
  defaultOpen,
}) => (
  <Root defaultOpen={defaultOpen} onOpenChange={(newOpen) => onOpenChange && onOpenChange(newOpen)}>
    {trigger}
    <Portal>
      <DialogOverlay />
      <DialogContent>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {content}
        {interaction && <div>{interaction}</div>}
        <DialogClose aria-label="Close window">
          <CloseIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
        </DialogClose>
      </DialogContent>
    </Portal>
  </Root>
);

export default Modal;

export {
  Close,
};
