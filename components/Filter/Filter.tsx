import * as Popover from '@radix-ui/react-popover';
import Image from 'next/image';
import Select from '../Select/Select';
import { PersonSortables } from './atoms';
import styled from 'styled-components';
import ListStyleButton from './ListStyleButton/ListStyleButton';

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
`;

const Filter = () => {
  return (
    <StyledDiv>
      <Popover.Root>
        <Popover.Trigger style={{ display: 'none' }}>
          <Image src="/filter.svg" alt="Filter" width={20} height={20} />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content>
            <Popover.Close><Image src="/x.svg" alt="Close" width={20} height={20} /></Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <Select placeholder="Sortera efter..." items={sortBy} defaultValue="rank" />
      <ListStyleButton listStyle="list"><Image src="/list.svg" alt="List" width={20} height={20} /></ListStyleButton>
      <ListStyleButton listStyle="grid"><Image src="/grid.svg" alt="Grid" width={20} height={20} /></ListStyleButton>
    </StyledDiv>
  );
};

export default Filter;
