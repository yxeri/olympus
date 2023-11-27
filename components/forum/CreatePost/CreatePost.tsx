import { CldUploadWidget } from 'next-cloudinary';
import process from 'process';
import React, {
  ReactNode,
  useState,
} from 'react';
import { SubmitHandler } from 'react-hook-form';
import styled from 'styled-components';
import { Trigger as RadixTrigger } from '@radix-ui/react-dialog';
import useForums from '../../../hooks/forums/useForums';
import useAuthPerson from '../../../hooks/people/useAuthPerson';
import usePosts from '../../../hooks/posts/usePosts';
import { useDictionary } from '../../../hooks/useDictionary';
import { colors } from '../../../styles/global';
import {
  Forum,
  Person,
  Post
} from '../../../types/data';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Modal from '../../Modal/Modal';
import Form from '../../Form/Form';

const hasAccessToForum = ({
  forum,
  authPerson,
}: { forum: Forum, authPerson: Person }) => {
  const isPublic = (forum?.postAccess?.length === 0
    && forum.groupAccess?.length === 0
    && forum.readAccess?.length === 0);
  const hasGroupAccess = forum?.groupAccess
    ?.some(([fieldName, value]) => authPerson[fieldName] === value);
  const hasReadAccess = [
    forum?.owner.toString(),
    ...((forum?.readAccess) ?? [])
  ].includes(authPerson._id?.toString() ?? '');
  const hasPostAccess = [
    forum?.owner.toString(),
    ...((forum?.postAccess) ?? [])
  ].includes(authPerson._id?.toString() ?? '');

  return {
    post: isPublic || hasGroupAccess || hasPostAccess,
    read: isPublic || hasGroupAccess || hasReadAccess,
  };
};

const StyledTrigger = styled(RadixTrigger)`
  background: none;
  border: none;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
  cursor: pointer;
  display: grid;
  place-items: center;
`;

type FormValues = Post;

const Trigger = ({ label }: { label?: ReactNode }) => (<StyledTrigger>{label ?? 'Create post'}</StyledTrigger>);

const Content = ({
  threadId,
  postId,
  onSuccess,
}: {
  threadId: string,
  postId?: string,
  onSuccess: () => void,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const { insert } = usePosts({ threadId });
  const { getDictionaryValue } = useDictionary();
  const onSubmit: SubmitHandler<FormValues> = async ({
    title,
    content,
  }) => {
    try {
      await insert({
        title,
        content,
        threadId,
        postId,
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to create post');
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Input
        required
        name="content"
        placeholder={getDictionaryValue('common', 'content')}
        aria-label={getDictionaryValue('common', 'content')}
      />
      <CldUploadWidget
        options={{
          maxFiles: 4,
          multiple: true,
          styles: {
            palette: {
              inactiveTabIcon: colors.selectedBrightColor,
              tabIcon: colors.brightColor,
              menuIcons: colors.brightColor,
              textLight: colors.brightColor,
              window: colors.primaryBackground,
              sourceBg: colors.componentBackground,
              textDark: colors.primaryColor,
              link: colors.brightColor,
              action: colors.primaryColor,
              windowBorder: colors.primaryColor,
              error: colors.error,
              inProgress: colors.progress,
              complete: colors.success,
            },
            frame: {
              background: colors.primaryTransBackground,
            },
          },
          clientAllowedFormats: ['image', 'video'],
          singleUploadAutoClose: false,
          sources: ['local', 'url', 'camera'],
        }}
        signatureEndpoint="/api/cloudinarySignature"
        uploadPreset={process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? 'dev_media' : 'media'}
        onUpload={({ info }) => {
          if (info && typeof info === 'object') {
            setImages([...images, (info as { public_id: string }).public_id]);
          }
        }}
      >
        {({ open }) => {
          const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            open();
          };

          return (
            <button type="button" onClick={handleOnClick}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
      <Button type="submit">
        Create post
      </Button>
    </Form>
  );
};

const CreatePost = ({
  type,
  forumId,
  threadId,
  postId,
  label,
}: {
  type?: Forum['type'],
  forumId: string,
  threadId: string,
  postId?: string,
  label?: ReactNode,
}) => {
  const [open, setOpen] = useState(false);
  const { forums } = useForums({ type });
  const { person } = useAuthPerson();

  if (forumId) {
    const foundForum = forums.find((forum) => forum._id?.toString() === forumId);

    if (!foundForum || !hasAccessToForum({ forum: foundForum, authPerson: person }).post) {
      return null;
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
      trigger={<Trigger label={label} />}
      title={label ?? 'Create post'}
      content={<Content threadId={threadId} postId={postId} onSuccess={() => setOpen(false)} />}
    />
  );
};

export default CreatePost;
