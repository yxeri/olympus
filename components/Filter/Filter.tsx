import * as Popover from '@radix-ui/react-popover';
import styled from 'styled-components';
import ListVariantButton from './ListVariantButton/ListVariantButton';
import { sizes } from '../../styles/global';
import Search from '../Search/Search';
import FilterIcon from '../../assets/filter.svg';
import XIcon from '../../assets/x.svg';
import ListIcon from '../../assets/list.svg';
import GridIcon from '../../assets/grid.svg';
import SortBy from './SortBy/SortBy';

const StyledDiv = styled.div`
  display: grid;
  grid-auto-flow: column;
  width: fit-content;
  padding-bottom: .5rem;
  grid-gap: ${sizes.largeGap};
  align-items: center;
`;

const Filter = () => (
  <StyledDiv>
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
    <div style={{ display: 'flex' }}>
      <ListVariantButton
        listVariant="list"
        style={{ borderRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        <ListIcon alt="List" width={sizes.largeIcon} height={sizes.largeIcon} />
      </ListVariantButton>
      <ListVariantButton
        listVariant="grid"
        style={{ borderLeft: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        <GridIcon alt="Grid" width={sizes.largeIcon} height={sizes.largeIcon} />
      </ListVariantButton>
    </div>
    <Search />
    <SortBy />
  </StyledDiv>
);

export default Filter;
