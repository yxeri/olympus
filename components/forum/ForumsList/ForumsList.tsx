import { sizes } from '@/styles/global';
import { Forum } from '@/types/data';
import styled from 'styled-components';
import useForums from '../../../hooks/forums/useForums';
import List from '../../List/List';
import ForumsListItem from './Item/ForumsListItem';

const StyledList = styled(List)`
  grid-column-gap: ${sizes.largeGap};
  grid-gap: .5rem;
  grid-auto-flow: row;
`;

const ForumsList = ({ type }: { type?: Forum['type'] }) => {
  const { forums } = useForums({ type });

  const ListItems = forums
    .filter((forum) => forum?._id)
    .map((forum) => <ForumsListItem forum={forum} key={forum._id?.toString()}/>);

  return (
    <StyledList>
      {ListItems}
    </StyledList>
  );
};

export default ForumsList;
