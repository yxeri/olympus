import * as Popover from '@radix-ui/react-popover';
import styled from 'styled-components';
import Select from '../Select/Select';
import { PersonSortables } from './atoms';
import ListVariantButton from './ListVariantButton/ListVariantButton';
import { sizes } from '../../styles/global';
import Search from '../Search/Search';
import FilterIcon from '../../assets/filter.svg';
import XIcon from '../../assets/x.svg';
import ListIcon from '../../assets/list.svg';
import GridIcon from '../../assets/grid.svg';

const sortBy: Array<{ label: string, value: PersonSortables }> = [
  { label: 'Namn', value: 'alphabetical' },
  { label: 'Familj', value: 'family' },
  { label: 'Status', value: 'status' },
  { label: 'Rank', value: 'rank' },
  { label: 'Elevhem', value: 'society' },
];

const StyledDiv = styled.div`
  display: grid;
  grid-auto-flow: column;
  width: fit-content;
  padding-bottom: .5rem;
  grid-gap: ${sizes.largeGap};
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
    <Select placeholder="Sortera efter..." items={sortBy} defaultValue="rank" />
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
  </StyledDiv>
);

export default Filter;
