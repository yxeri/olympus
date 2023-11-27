import styled from 'styled-components';
import useThreads from '../../../hooks/threads/useThreads';
import { sizes } from '../../../styles/global';
import List from '../../List/List';
import ThreadsListItem from './Item/ThreadsListItem';

const StyledList = styled(List)`
  grid-column-gap: ${sizes.largeGap};
  grid-gap: .5rem;
  grid-auto-flow: row;
`;

const ThreadsList = ({ forumId }: { forumId?: string }) => {
  const { threads } = useThreads({ forumId });

  const ListItems = threads
    .filter((thread) => thread?._id)
    .map((thread) => <ThreadsListItem thread={thread} key={thread._id?.toString()} />);

  return (
    <StyledList>
      {ListItems}
    </StyledList>
  );
};

export default ThreadsList;
