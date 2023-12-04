import React from 'react';
import styled from 'styled-components';
import ThumbsDownIcon from '../../../assets/thumbs-down.svg';
import ThumbsUpIcon from '../../../assets/thumbs-up.svg';
import useAuthPerson from '../../../hooks/people/useAuthPerson';
import useThreads from '../../../hooks/threads/useThreads';
import Button from '../../Button/Button';

const CleanButton = styled(Button)`
  background: none;
  border: none;
`;

const ThreadLikeButtons = ({ threadId }: { threadId: string }) => {
  const { likeThread, threads } = useThreads();
  const { person } = useAuthPerson();

  if (!person) {
    return null;
  }

  const foundThread = threads
    .find((thread) => thread._id?.toString() === threadId.toString());
  const onSubmit = async ({ like }: { like: boolean }) => {
    try {
      await likeThread({ threadId, like });
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
          color={foundThread?.likes?.find((id) => id.toString() === person._id?.toString()) ? 'green' : undefined}
        />
      </CleanButton>
      <CleanButton onClick={() => onSubmit({ like: false })}>
        <ThumbsDownIcon
          width={14}
          height={14}
          color={foundThread?.dislikes?.find((id) => id.toString() === person._id?.toString()) ? 'red' : undefined}
        />
      </CleanButton>
    </>
  );
};

export default ThreadLikeButtons;
