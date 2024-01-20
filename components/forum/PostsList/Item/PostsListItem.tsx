import { Color } from '@tiptap/extension-color';
import { Link } from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  EditorContent,
  useEditor,
} from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
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
import PostLikeButtons from '../../LikeButtons/PostLikeButtons';
import MediaContent from '../../MediaContent/MediaContent';

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
  min-width: 7rem;
`;

const StyledListItem = styled(ListItem)`
  display: grid;
`;

const Container = styled.div`

`;

const NavigationContainer = styled.div`
  display: flex;
  grid-gap: 1rem;
  font-size: .9rem;
  margin-left: .4rem;
  margin-top: .2rem;
  height: fit-content;
`;

const SubPostContainer = styled.div`
  margin-left: .8rem;
  margin-top: .4rem;
`;

const PostsListItem: React.FC<PostsListItemProps> = ({ post, forumId }) => {
  const {
    content,
    subPosts,
    threadId,
    _id: id,
    createdAt,
    media,
  } = post;
  const editor = useEditor({
    autofocus: false,
    editable: false,
    extensions: [
      StarterKit,
      Link,
      Color,
      TextStyle,
    ],
    content,
  });

  const subPostItems = subPosts
    .map((subPost) => (
      <SubPostContainer>
        <StyledDiv>
          <EditorContent editor={editor} className="content" />
          <MediaContent media={subPost.media} />
        </StyledDiv>
        <NavigationContainer>
          {getTimeSince({ date: new Date(createdAt) })}
          <PostLikeButtons postId={id?.toString() ?? ''} />
        </NavigationContainer>
      </SubPostContainer>
    ));

  return (
    <StyledListItem>
      <StyledDiv>
        {`${content}`}
        <MediaContent media={media} />
      </StyledDiv>
      <Container>
        <NavigationContainer>
          {getTimeSince({ date: new Date(createdAt) })}
          <PostLikeButtons postId={id?.toString() ?? ''} />
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
