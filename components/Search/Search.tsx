import {
  useRecoilState,
} from 'recoil';
import styled from 'styled-components';
import Image from 'next/image';
import { useState } from 'react';
import { searchStringAtom } from '../Filter/atoms';
import {
  borders,
  colors,
  sizes,
} from '../../styles/global';

const StyledInput = styled.input`
  background-color: ${colors.clickableBackground};
  border-radius: ${sizes.corner};
  padding: .3rem;
  border: ${borders.standard};
  min-height: ${sizes.largeIcon}px;
`;

const StyledDiv = styled.div`
  position: relative;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
`;

const SearchImage = styled(Image)<{ isHidden: boolean }>`
  position: absolute;
  left: .3rem;
  ${({ isHidden }) => isHidden && 'display: none;'}
`;

const ClearImage = styled(Image)<{ isHidden: boolean }>`
  position: absolute;
  right: .3rem;
  ${({ isHidden }) => isHidden && 'display: none;'}
`;

const Search = () => {
  const [searchString, setSearchString] = useRecoilState(searchStringAtom);
  const [hasContent, setHasContent] = useState(false);

  return (
    <StyledDiv>
      <SearchImage
        isHidden={hasContent}
        src="/search.svg"
        alt="Search"
        width={sizes.largeIcon}
        height={sizes.largeIcon}
      />
      <StyledInput
        value={searchString}
        onChange={({ currentTarget }) => setSearchString(currentTarget.value)}
        onFocus={() => setHasContent(true)}
        onBlur={() => setHasContent(searchString !== '')}
      />
      <ClearImage
        onClick={() => setSearchString('')}
        isHidden={searchString === ''}
        src="/x.svg"
        alt="Clear"
        width={sizes.largeIcon}
        height={sizes.largeIcon}
      />
    </StyledDiv>
  );
};

export default Search;
