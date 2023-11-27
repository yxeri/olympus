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
import useThreads from '../../../hooks/threads/useThreads';
import { useDictionary } from '../../../hooks/useDictionary';
import { colors } from '../../../styles/global';
import {
  Thread,
  Forum,
} from '../../../types/data';
import Button from '../../Button/Button';
import Input from '../../Input/Input';
import Modal from '../../Modal/Modal';
import Form from '../../Form/Form';
import { hasAccessToForum } from '../helpers';

const StyledTrigger = styled(RadixTrigger)`
  display: grid;
  place-items: center;
  width: fit-content;
  color: ${colors.brightColor};
  background: inherit;
  border: none;
  cursor: pointer;
  padding: .1rem;
`;

type FormValues = Thread;

const Trigger = ({ label }: { label?: ReactNode }) => (<StyledTrigger>{label ?? 'Create thread'}</StyledTrigger>);

const Content = ({ forumId, onSuccess }: { forumId?: string, onSuccess: () => void }) => {
  const [images, setImages] = useState<string[]>([]);
  const { insert } = useThreads();
  const { getDictionaryValue } = useDictionary();
  const { person } = useAuthPerson();
  const onSubmit: SubmitHandler<FormValues> = async ({
    title,
    content,
  }) => {
    try {
      await insert({
        title,
        content,
        forumId: forumId ?? person._id,
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to create forum');
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
        Create thread
      </Button>
    </Form>
  );
};

const CreateThread = ({ type, forumId, label }: { type?: Forum['type'], forumId?: string, label?: ReactNode } = {}) => {
  const [open, setOpen] = useState<boolean>();
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
      title="Create thread"
      content={<Content forumId={forumId} onSuccess={() => setOpen(false)} />}
    />
  );
};

export default CreateThread;
