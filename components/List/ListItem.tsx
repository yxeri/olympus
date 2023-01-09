import styled from 'styled-components';
import { ListVariants } from './List';

export default styled.li<{ variant?: ListVariants }>`
  box-sizing: border-box;
`;
