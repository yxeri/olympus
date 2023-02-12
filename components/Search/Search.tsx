import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { useState } from 'react';
import { debounce } from 'throttle-debounce';
import { searchStringAtom } from '../../atoms/filter';
import {
  borders,
  colors,
  sizes,
} from '../../styles/global';
import SearchIcon from '../../assets/search.svg';
import XIcon from '../../assets/x.svg';

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

const SearchImage = styled(SearchIcon)<{ isHidden: boolean }>`
  position: absolute;
  left: .3rem;
  ${({ isHidden }) => isHidden && 'display: none;'}
`;

const ClearImage = styled(XIcon)<{ isHidden: boolean }>`
  position: absolute;
  right: .3rem;
  ${({ isHidden }) => isHidden && 'display: none;'}
`;

const Search = () => {
  const [searchString, setSearchString] = useRecoilState(searchStringAtom);
  const [hasContent, setHasContent] = useState(!!searchString);

  const updateSearchString = debounce(
    300,
    (newString: string) => setSearchString(newString),
    { atBegin: false }
  );

  return (
    <StyledDiv>
      <SearchImage
        isHidden={hasContent}
        alt="Search"
        width={sizes.largeIcon}
        height={sizes.largeIcon}
      />
      <StyledInput
        aria-label="Search"
        defaultValue={searchString}
        onChange={({ currentTarget }) => updateSearchString(currentTarget.value)}
        onFocus={() => setHasContent(true)}
        onBlur={() => setHasContent(!!searchString)}
      />
      <ClearImage
        onClick={() => setSearchString('')}
        isHidden={!searchString}
        src="/x.svg"
        alt="Clear"
        width={sizes.largeIcon}
        height={sizes.largeIcon}
      />
    </StyledDiv>
  );
};

export default Search;
