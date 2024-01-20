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
import {
  colors,
  sizes,
} from 'styles/global';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const DialogOverlay = styled(Overlay)`
  background-color: rgba(0, 0, 0, 0.5);
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
  padding: 1rem;
  padding-top: 0;
  background-color: ${colors.componentBackground};
  box-shadow: hsl(206 22% 7% / 35%) 0 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  z-index: 10;
  display: grid;
  grid-gap: .5rem;
  overflow: auto;
`;

const DialogClose = styled(Close)`
  display: grid;
  align-items: center;
  position: sticky;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  margin-right: -.5rem;
  justify-self: flex-end;
  height: fit-content;
`;

const TopContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto; 
  position: sticky; 
  top: 0;
  background-color: ${colors.componentBackground};
  padding-top: .5rem;
  padding-bottom: .1rem;
`;

export const Trigger = styled(RadixTrigger)`
  font: inherit;
  cursor: pointer;
`;

const Title = styled(RadixTitle)`
  margin: 0 auto;
  text-transform: capitalize;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
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
  open,
}) => (
  <Root
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={(newOpen) => onOpenChange && onOpenChange(newOpen)}
  >
    {trigger}
    <Portal>
      <DialogOverlay />
      <DialogContent>
        <TopContainer>
          {title && <div style={{ overflow: 'hidden' }}><Title>{title}</Title></div>}
          <DialogClose aria-label="Close window" style={{ color: 'inherit' }}>
            <CloseIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
          </DialogClose>
        </TopContainer>
        {description && <Description>{description}</Description>}
        {content}
        {interaction && <div>{interaction}</div>}
      </DialogContent>
    </Portal>
  </Root>
);

export default Modal;

export {
  Close,
};
