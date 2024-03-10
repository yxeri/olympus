import SearchIcon from '@/assets/search.svg';
import XIcon from '@/assets/x.svg';
import { searchStringAtom } from '@/atoms/filter';
import {
  ChangeEvent,
  useCallback,
  useState,
} from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  borders,
  colors,
  sizes,
} from 'styles/global';
import { debounce } from 'throttle-debounce';

const StyledInput = styled.input`
    background-color: ${colors.clickableBackground};
    border-radius: ${sizes.corner};
    padding: .3rem;
    border: ${borders.standard};
    min-height: ${sizes.largeIcon}px;
    height: 100%;
    box-sizing: border-box;
`;

const StyledDiv = styled.div`
    position: relative;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    height: 100%;
`;

const SearchImage = styled(SearchIcon)<{ $isHidden: boolean }>`
    position: absolute;
    left: .3rem;
    ${({ $isHidden }) => $isHidden && 'display: none;'}
`;

const ClearImage = styled(XIcon)<{ $isHidden: boolean }>`
    position: absolute;
    right: .3rem;
    ${({ $isHidden }) => $isHidden && 'display: none;'}
`;

const Search = () => {
  const [searchString, setSearchString] = useRecoilState(searchStringAtom);
  const [value, setValue] = useState(searchString);
  const [hasContent, setHasContent] = useState(!!searchString);

  const updateSearchString = useCallback(
    debounce(
      250,
      (newString: string) => setSearchString(newString),
      { atBegin: false },
    ),
    [],
  );

  return (
    <StyledDiv>
      <SearchImage
        $isHidden={hasContent}
        alt="Search"
        width={sizes.largeIcon}
        height={sizes.largeIcon}
      />
      <StyledInput
        value={value}
        aria-label="Search"
        onChange={({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
          updateSearchString(currentTarget.value);
          setValue(currentTarget.value);
        }}
        onFocus={() => setHasContent(true)}
        onBlur={() => setHasContent(!!searchString)}
      />
      <ClearImage
        onClick={() => {
          setSearchString('');
          setValue('');
        }}
        $isHidden={!searchString}
        src="/x.svg"
        alt="Clear"
        width={sizes.largeIcon}
        height={sizes.largeIcon}
      />
    </StyledDiv>
  );
};

export default Search;
