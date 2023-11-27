import styled from 'styled-components';
import usePosts from '../../../hooks/posts/usePosts';
import List from '../../List/List';
import PostsListItem from './Item/PostsListItem';

const StyledList = styled(List)`
  grid-gap: .8rem;
  grid-auto-flow: row;
`;

const PostsList = ({ threadId, forumId }: { threadId: string, forumId: string }) => {
  const { posts } = usePosts({ threadId });

  const ListItems = posts
    .filter((post) => post?._id)
    .map((post) => <PostsListItem post={post} forumId={forumId} key={post._id?.toString()} />);

  return (
    <StyledList>
      {ListItems}
    </StyledList>
  );
};

export default PostsList;
