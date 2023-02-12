import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import React, { ReactNode } from 'react';
import { sizes } from '../../styles/global';

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
`;

const DialogContent = styled(Content)`
  box-sizing: border-box;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95vw;
  max-width: ${sizes.mediumMax};
  padding: .8rem;
  background-color: white;
  box-shadow: hsl(206 22% 7% / 35%) 0 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
`;

const DialogClose = styled(Close)`
  display: grid;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
`;

type ModalProps = {
  trigger: ReactNode,
  interaction?: ReactNode[],
  title: string | ReactNode,
  description?: string | ReactNode,
  content: ReactNode,
};

const Modal: React.FC<ModalProps> = ({
  trigger, interaction, title, description, content,
}) => (
  <Root>
    <Trigger asChild>{trigger}</Trigger>
    <Portal>
      <DialogOverlay />
      <DialogContent>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {content}
        {interaction && <div>{interaction}</div>}
        <DialogClose>
          <Image src="/x.svg" alt="Close" width={24} height={24} />
        </DialogClose>
      </DialogContent>
    </Portal>
  </Root>
);

export default Modal;

export {
  Close,
};
