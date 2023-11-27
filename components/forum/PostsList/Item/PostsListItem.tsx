import ListItem from 'components/List/ListItem';
import React from 'react';
import styled from 'styled-components';
import {
  colors,
} from 'styles/global';
import ReplyIcon from 'assets/reply.svg';
import {
  Post,
} from '../../../../types/data';
import CreatePost from '../../CreatePost/CreatePost';
import { getTimeSince } from '../../helpers';

export type PostsListItemProps = {
  post: Post,
  forumId: string,
};

const StyledDiv = styled.div`
  background-color: ${colors.darkerComponentBackground};
  border-radius: 4px;
  padding: .4rem;
  border: .5px solid;
  max-width: 100%;
  width: fit-content;
`;

const StyledListItem = styled(ListItem)`
  display: grid;
`;

const Container = styled.div`

`;

const NavigationContainer = styled.div`
  display: flex;
  grid-gap: .5rem;
  font-size: .9rem;
  margin-left: .4rem;
`;

const SubPostContainer = styled.div`
  margin-left: .8rem;
  margin-top: .4rem;
`;

const PostsListItem: React.FC<PostsListItemProps> = ({ post, forumId }) => {
  const {
    title,
    content,
    subPosts,
    threadId,
    _id: id,
    createdAt,
  } = post;

  const subPostItems = subPosts
    .map((subPost) => (
      <SubPostContainer>
        <StyledDiv>
          {subPost.content}
        </StyledDiv>
        <NavigationContainer>
          {getTimeSince({ date: new Date(createdAt) })}
        </NavigationContainer>
      </SubPostContainer>
    ));

  return (
    <StyledListItem>
      <StyledDiv>
        {title && title}
        {`${content}`}
      </StyledDiv>
      <Container>
        <NavigationContainer>
          {getTimeSince({ date: new Date(createdAt) })}
          <CreatePost
            forumId={forumId}
            threadId={threadId.toString()}
            postId={id?.toString()}
            label={<ReplyIcon width={14} height={14} />}
          />
        </NavigationContainer>
        {subPostItems}
      </Container>
    </StyledListItem>
  );
};

export default PostsListItem;
