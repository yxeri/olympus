import { PrimitiveDivProps } from '@radix-ui/react-toast';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

type ContainerProps = PropsWithChildren & PrimitiveDivProps;

const StyledContainer = styled.div``;

const Container: React.FC<ContainerProps> = (props) => <StyledContainer {...props} />;

export default Container;
