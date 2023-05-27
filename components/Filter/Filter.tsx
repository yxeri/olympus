import * as Popover from '@radix-ui/react-popover';
import FilterIcon from 'assets/filter.svg';
import XIcon from 'assets/x.svg';
import Search from 'components/Search/Search';
import styled from 'styled-components';
import { sizes } from 'styles/global';
import SortBy from './SortBy/SortBy';
import VariantPicker from './VariantPicker/VariantPicker';

const StyledDiv = styled.div`
  display: grid;
  grid-auto-flow: column;
  width: fit-content;
  padding-bottom: .5rem;
  grid-gap: ${sizes.largeGap};
  align-items: center;
`;

const Filter = () => (
  <StyledDiv aria-label="filters" role="toolbar">
    <Popover.Root>
      <Popover.Trigger style={{ display: 'none' }}>
        <FilterIcon alt="Filter" width={sizes.largeIcon} height={sizes.largeIcon} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <Popover.Close>
            <XIcon
              alt="Close"
              width={sizes.largeIcon}
              height={sizes.largeIcon}
            />
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
    <VariantPicker />
    <Search />
    <SortBy />
  </StyledDiv>
);

export default Filter;
