import Image from 'next/image';
import styled from 'styled-components';
import {
  colors,
  sizes,
} from '../../styles/global';
import Link from '../Link/Link';
import LogoImage from '../../assets/olympus.jpg.webp';
import CalendarIcon from '../../assets/calendar-nav.svg';
import SettingsIcon from '../../assets/settings.svg';
import PersonIcon from '../../assets/person-nav.svg';

const StyledDiv = styled.div`
  display: grid;
  position: sticky;
  top: 0;
  z-index: 2;
  margin-bottom: 1.6rem;
`;

const Line = styled.div`
  position: absolute;
  top: 0;
  height: 2.6rem;
  width: 100%;
  background-color: ${colors.primaryTransBackground};
  border-bottom-left-radius: 50%;
  border-bottom-right-radius: 50%;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const ContainerDiv = styled.div`
  display: grid;
  grid-column-gap: calc(60px + .8rem);
  grid-template-columns: 1fr 1fr;
  padding: .6rem;
  z-index: 2;
`;

const JustifiedDiv = styled.div<{ justify: 'flex-start' | 'flex-end' }>`
  top: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-gap: ${sizes.largeGap};
  color: ${colors.navColor};
  justify-content: ${({ justify }) => justify};
  width: fit-content;
  ${({ justify }) => justify === 'flex-end' && 'margin-left: auto'};
`;

const LinkDiv = styled.div`
  padding: 0 .2rem;
`;

const Logo = styled(Link)`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top: 0;
  display: grid;
  width: fit-content;
  height: fit-content;
  z-index: 2;
  
  img {
    box-sizing: border-box;
    padding: .4rem;
  }
`;

const Navigation = () => (
  <StyledDiv>
    <Line />
    <ContainerDiv>
      <JustifiedDiv justify="flex-end">
        <LinkDiv>
          <Link href="/people">
            <PersonIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
          </Link>
        </LinkDiv>
        <LinkDiv>
          <Link href="/people">
            <CalendarIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
          </Link>
        </LinkDiv>
      </JustifiedDiv>
      <JustifiedDiv justify="flex-start">
        <LinkDiv>
          <Link href="/people">
            <CalendarIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
          </Link>
        </LinkDiv>
        <LinkDiv>
          <Link href="/settings">
            <SettingsIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
          </Link>
        </LinkDiv>
      </JustifiedDiv>
    </ContainerDiv>
    <Logo href="/">
      <Image
        src={LogoImage}
        alt="Olympus"
        width={60}
        height={60}
      />
    </Logo>
  </StyledDiv>
);

export default Navigation;
