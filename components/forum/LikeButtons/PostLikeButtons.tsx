import React from 'react';
import styled from 'styled-components';
import ThumbsDownIcon from '../../../assets/thumbs-down.svg';
import ThumbsUpIcon from '../../../assets/thumbs-up.svg';
import useAuthPerson from '../../../hooks/people/useAuthPerson';
import usePosts from '../../../hooks/posts/usePosts';
import Button from '../../Button/Button';

const CleanButton = styled(Button)`
  background: none;
  border: none;
  padding: 0;
  height: fit-content;
`;

const PostLikeButtons = ({ postId }: { postId: string }) => {
  const { likePost, posts } = usePosts();
  const { person } = useAuthPerson();

  if (!person) {
    return null;
  }

  const foundPost = posts
    .find((post) => post._id?.toString() === postId.toString());
  const onSubmit = async ({ like }: { like: boolean }) => {
    try {
      await likePost({ postId, like });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CleanButton onClick={() => onSubmit({ like: true })}>
        <ThumbsUpIcon
          width={14}
          height={14}
          color={foundPost?.likes?.find((id) => id.toString() === person._id?.toString()) ? 'green' : undefined}
        />
      </CleanButton>
      <CleanButton onClick={() => onSubmit({ like: false })}>
        <ThumbsDownIcon
          width={14}
          height={14}
          color={foundPost?.dislikes?.find((id) => id.toString() === person._id?.toString()) ? 'red' : undefined}
        />
      </CleanButton>
    </>
  );
};

export default PostLikeButtons;
