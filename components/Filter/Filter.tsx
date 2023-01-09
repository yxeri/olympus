import * as Popover from '@radix-ui/react-popover';
import Image from 'next/image';
import styled from 'styled-components';
import Select from '../Select/Select';
import { PersonSortables } from './atoms';
import ListStyleButton from './ListStyleButton/ListStyleButton';
import { sizes } from '../../styles/global';
import Search from '../Search/Search';

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
        <Image src="/filter.svg" alt="Filter" width={sizes.largeIcon} height={sizes.largeIcon} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <Popover.Close>
            <Image
              src="/x.svg"
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
      <ListStyleButton
        listVariant="list"
        style={{ borderRight: 0, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
      >
        <Image src="/list.svg" alt="List" width={sizes.largeIcon} height={sizes.largeIcon} />
      </ListStyleButton>
      <ListStyleButton
        listVariant="grid"
        style={{ borderLeft: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        <Image src="/grid.svg" alt="Grid" width={sizes.largeIcon} height={sizes.largeIcon} />
      </ListStyleButton>
    </div>
    <Search />
  </StyledDiv>
);

export default Filter;
