import styled from 'styled-components';
import Image from 'next/image';
import {
  colors,
} from '../../styles/global';

const StyledDiv = styled.div`
  position: sticky;
  bottom: 0;
  color: ${colors.navColor};
  padding: .2rem;
  margin-top: 1rem;
  text-align: center;
  display: grid;
  justify-content: center;
  grid-auto-flow: column;
  align-items: flex-end;
`;

const LineDiv = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  height: 50%;
  width: 100%;
  background-color: ${colors.primaryBackground};
`;

const TextDiv = styled.div`
  z-index: 2;
  padding: 0 .4rem;
  text-shadow: 0px -1px 4px ${colors.primaryBackground};
`;

const Footer = () => (
  <StyledDiv>
    <LineDiv />
    <TextDiv>Förtjäna er stolthet</TextDiv>
    <Image
      src="/olympus.jpg.webp"
      alt="Olympus"
      width={20}
      height={20}
      style={{ zIndex: 2, textShadow: `0px -1px 2px ${colors.primaryBackground}` }}
    />
    <TextDiv>Vinn ära och framgång</TextDiv>
  </StyledDiv>
);

export default Footer;
