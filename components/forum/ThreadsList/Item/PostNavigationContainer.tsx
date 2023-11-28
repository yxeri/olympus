import { ObjectId } from 'mongodb';
import React from 'react';
import styled from 'styled-components';
import useForums from '../../../../hooks/forums/useForums';
import useAuthPerson from '../../../../hooks/people/useAuthPerson';
import { colors } from '../../../../styles/global';
import CreatePost from '../../CreatePost/CreatePost';
import { hasAccessToForum } from '../../helpers';

const Container = styled.div`
  box-sizing: border-box;
  position: sticky;
  margin-top: .4rem;
  margin-bottom: -.4rem;
  margin-left: -.4rem;
  padding: .4rem;
  bottom: 1.6rem;
  background-color: ${colors.darkerComponentBackground};
  border-top: .5px solid;
  width: calc(100% + .8rem);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  box-shadow: 0px -.5px 5px 0px;
`;

const PostNavigationContainer = ({
  forumId,
  id,
}: {
  forumId: ObjectId | string,
  id: Object | string,
}) => {
  const { forums } = useForums();
  const { person } = useAuthPerson();

  if (forumId) {
    const foundForum = forums.find((forum) => forum._id?.toString() === forumId);

    if (!foundForum || !hasAccessToForum({ forum: foundForum, authPerson: person }).post) {
      return null;
    }
  }

  return (
    <Container>
      <CreatePost forumId={forumId.toString()} threadId={id.toString()} label="Write a comment..." />
    </Container>
  );
};

export default PostNavigationContainer;
