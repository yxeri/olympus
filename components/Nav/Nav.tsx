import Image from 'next/image';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: grid;
  height: 50px;
`;

const Nav = () => (
  <StyledDiv>
    <Image
      src="/olympus.jpg.webp"
      alt="Olympus"
      width={40}
      height={40}
      style={{
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        left: 0,
        right: 0,
      }}
    />
  </StyledDiv>
);

export default Nav;
