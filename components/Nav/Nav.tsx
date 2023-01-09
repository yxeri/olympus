import Image from 'next/image';
import styled from 'styled-components';
import {
  borders,
  colors,
} from '../../styles/global';

const StyledDiv = styled.div`
  display: grid;
  height: 60px;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: ${colors.primaryBackground};
  z-index: 2;
`;

const Line = styled.div`
  height: 1px;
  border-bottom: ${borders.standard} whitesmoke;
`;

const Nav = () => (
  <StyledDiv>
    <Line />
    <Image
      src="/olympus.jpg.webp"
      alt="Olympus"
      width={40}
      height={40}
      style={{
        backgroundColor: colors.primaryBackground,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0 .2rem',
        left: 0,
        right: 0,
      }}
    />
  </StyledDiv>
);

export default Nav;
