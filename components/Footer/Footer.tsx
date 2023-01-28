import styled from 'styled-components';
import Image from 'next/image';
import { colors } from '../../styles/global';
import LogoImage from '../../assets/olympus.jpg.webp';
import SoteiraLogo from '../../assets/soteira-small-logo.png';

const StyledDiv = styled.div`
  position: sticky;
  bottom: 0;
  color: ${colors.brightColor};
  padding: .4rem;
  margin-top: 1rem;
  text-align: center;
  display: grid;
  justify-content: center;
  grid-auto-flow: column;
  align-items: flex-end;
  z-index: 2;
`;

const LineDiv = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  padding-bottom: .1rem;
  height: 50%;
  width: 100%;
  background-color: ${colors.primaryTransBackground};
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
`;

const TextDiv = styled.div`
  z-index: 2;
  padding: 0 .4rem;
  text-shadow: 0px -1px 4px ${colors.primaryBackground};
`;

const BottomMessage = styled.div`
  box-sizing: border-box;
  color: ${colors.brightColor};
  padding-top: .4rem;
  padding-bottom: 1rem;
  text-align: center;
  font-size: .9rem;
  text-shadow: none;
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  grid-gap: .1rem;
  
  div {
    margin-top: .3rem;
  }
`;

const Footer = () => (
  <>
    <StyledDiv>
      <LineDiv />
      <TextDiv>Förtjäna er stolthet</TextDiv>
      <Image
        quality={25}
        src={LogoImage}
        alt="Olympus"
        width={20}
        height={20}
        style={{ zIndex: 2, textShadow: `0px -1px 2px ${colors.primaryBackground}` }}
      />
      <TextDiv>Vinn ära och framgång</TextDiv>
    </StyledDiv>
    <BottomMessage>
      <div>Drivs av</div>
      <Image
        src={SoteiraLogo}
        alt="Soteira"
        style={{ height: '25px', width: '50px', objectFit: 'contain' }}
      />
    </BottomMessage>
  </>
);

export default Footer;
