import Image from 'next/image';
import styled from 'styled-components';
import {
  colors,
  sizes,
} from '../../styles/global';
import Link from '../Link/Link';

const StyledDiv = styled.div`
  display: grid;
  height: 60px;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 2;
`;

const Line = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: calc(55% + (${sizes.hugeIcon}px / 2));
  background-color: ${colors.primaryBackground};
`;

const ContainerDiv = styled.div`
  display: grid;
  align-items: center;
  grid-column-gap: 60px;
  grid-template-columns: 1fr 1fr;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const JustifiedDiv = styled.div<{ justify: 'flex-start' | 'flex-end' }>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-gap: ${sizes.largeGap};
  color: ${colors.navColor};
  justify-content: ${({ justify }) => justify};
  width: fit-content;
  margin-top: -.9rem;
  ${({ justify }) => justify === 'flex-end' && 'margin-left: auto'};
  ${({ justify }) => (justify === 'flex-end' ? 'margin-right: 1rem' : 'margin-left: 1rem')}
`;

const LinkDiv = styled.div`
  background-color: ${colors.primaryBackground};
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
            <Image src="/person-nav.svg" alt="People" width={sizes.hugeIcon} height={sizes.hugeIcon} />
          </Link>
        </LinkDiv>
        <LinkDiv>
          <Link href="/people">
            <Image src="/calendar-nav.svg" alt="Calendar" width={sizes.hugeIcon} height={sizes.hugeIcon} />
          </Link>
        </LinkDiv>
      </JustifiedDiv>
      <JustifiedDiv justify="flex-start">
        <LinkDiv>
          <Link href="/people">
            <Image src="/calendar-nav.svg" alt="Education" width={sizes.hugeIcon} height={sizes.hugeIcon} />
          </Link>
        </LinkDiv>
      </JustifiedDiv>
    </ContainerDiv>
    <Logo href="/">
      <Image
        src="/olympus.jpg.webp"
        alt="Olympus"
        width={60}
        height={60}
      />
    </Logo>
  </StyledDiv>
);

export default Navigation;
