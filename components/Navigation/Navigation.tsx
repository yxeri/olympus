import BookIcon from 'assets/book-nav.svg';
import CalendarIcon from 'assets/calendar-nav.svg';
import PhotoIcon from 'assets/camera-nav.svg';
import MessageIcon from 'assets/message-circle-nav.svg';
import LogoImage from 'assets/olympus.jpg.webp';
import PersonIcon from 'assets/person-nav.svg';
import SettingsIcon from 'assets/settings.svg';
import Link from 'components/Link/Link';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import {
  colors,
  sizes,
} from 'styles/global';

type NavigationProps = {
  slim?: boolean;
};

const StyledHeader = styled.header<{ slim?: boolean }>`
  position: sticky;
  top: 0;
  z-index: 2;
  margin-bottom: ${({ slim }) => (slim ? '.6rem' : '1.6rem')};
`;

const StyledNav = styled.nav`
  display: grid;
`;

const Line = styled.div`
  position: absolute;
  top: 0;
  height: 3.2rem;
  width: 100%;
  background-color: ${colors.primaryTransBackground};
  border-bottom-left-radius: 25%;
  border-bottom-right-radius: 25%;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const ContainerDiv = styled.div`
  display: grid;
  grid-column-gap: calc(60px + 2rem);
  grid-template-columns: 1fr 1fr;
  padding: 1rem;
  z-index: 2;
`;

const JustifiedDiv = styled.div<{ justify: 'flex-start' | 'flex-end' }>`
  top: 0;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  grid-gap: ${sizes.largeGap};
  color: ${colors.brightColor};
  justify-content: ${({ justify }) => justify};
  width: fit-content;
  ${({ justify }) => justify === 'flex-end' && 'margin-left: auto'};
`;

const Logo = styled(Link)`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  top: .5rem;
  display: grid;
  width: fit-content;
  height: fit-content;
  max-height: 100%;
  z-index: 2;

  img {
    box-sizing: border-box;
    padding: .4rem;
  }
`;

const StyledLink = styled(Link)`
  margin: 0 .2rem;
  position: relative;

  ::before {
    content: '';
    position: absolute;
    left: -.5rem;
    top: -.5rem;
    padding: .5rem;
    width: 100%;
    height: 100%;
  }
`;

const Navigation: React.FC<NavigationProps> = ({ slim }) => (
  <StyledHeader slim={slim}>
    <StyledNav>
      <ul style={{ display: 'contents' }}>
        <Line />
        <ContainerDiv>
          <JustifiedDiv justify="flex-end">
            <li style={{ display: 'contents' }}>
              <StyledLink href="/messages" aria-label="Messages">
                <MessageIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
              </StyledLink>
            </li>
            <li style={{ display: 'contents' }}>
              <StyledLink href="/people" aria-label="People">
                <PersonIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
              </StyledLink>
            </li>
            <li style={{ display: 'contents' }}>
              <StyledLink href="/calendar" aria-label="Calendar">
                <CalendarIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
              </StyledLink>
            </li>
          </JustifiedDiv>
          <li style={{ display: 'contents' }}>
            <Logo href="/">
              <Image
                style={{ objectFit: 'contain' }}
                src={LogoImage}
                alt="Olympus"
                width={60}
                height={60}
              />
            </Logo>
          </li>
          <JustifiedDiv justify="flex-start">
            <li style={{ display: 'contents' }}>
              <StyledLink href="/library" aria-label="Library">
                <BookIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
              </StyledLink>
            </li>
            <li style={{ display: 'contents' }}>
              <StyledLink href="/settings" aria-label="Settings">
                <SettingsIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
              </StyledLink>
            </li>
            <li style={{ display: 'contents' }}>
              <StyledLink href="/photos" aria-label="Photos">
                <PhotoIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
              </StyledLink>
            </li>
          </JustifiedDiv>
        </ContainerDiv>
      </ul>
    </StyledNav>
  </StyledHeader>
);

export default Navigation;
