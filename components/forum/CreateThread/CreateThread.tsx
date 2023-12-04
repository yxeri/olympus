import { CldUploadWidget } from 'next-cloudinary';
import process from 'process';
import React, {
  useState,
} from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Trigger as RadixTrigger } from '@radix-ui/react-dialog';
import PlusIcon from '../../../assets/plus-circle.svg';
import useForums from '../../../hooks/forums/useForums';
import useAuthPerson from '../../../hooks/people/useAuthPerson';
import useThreads from '../../../hooks/threads/useThreads';
import { useDictionary } from '../../../hooks/useDictionary';
import {
  colors,
  sizes,
} from '../../../styles/global';
import {
  Thread,
  Forum,
} from '../../../types/data';
import Button from '../../Button/Button';
import Container from '../../Container/Container';
import Input from '../../Input/Input';
import Modal from '../../Modal/Modal';
import Form from '../../Form/Form';
import { hasAccessToForum } from '../helpers';

const StyledTrigger = () => (
  <Container style={{
    boxSizing: 'border-box',
    display: 'grid',
    justifyItems: 'flex-end',
    paddingRight: sizes.largeGap,
    position: 'sticky',
    bottom: '2rem',
    marginTop: '.5rem',
    marginRight: 'auto',
    marginLeft: 'auto',
    width: sizes.mediumMax,
    maxWidth: '100%',
    color: colors.brightColor,
    zIndex: 2,
    right: 0,
  }}
  >
    <RadixTrigger style={{
      boxSizing: 'border-box',
      color: colors.brightColor,
      border: `1px solid ${colors.brightColor}`,
      borderRadius: '50%',
      backgroundColor: colors.primaryBackground,
      padding: '.25rem',
      margin: 0,
      display: 'grid',
    }}
    >
      <PlusIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />
    </RadixTrigger>
  </Container>
);

type FormValues = Thread;

const Content = ({ forumId, onSuccess }: { forumId?: string, onSuccess: () => void }) => {
  const [media, setMedia] = useState<Set<Thread['media'][0]>>(new Set());
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
        media: Array.from(media),
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
            const newMedia = {
              path: (info as { public_id: string }).public_id,
              type: (info as { resource_type: 'image' | 'video' }).resource_type,
            };

            setMedia(new Set([...Array.from(media), newMedia]));
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

const CreateThread = ({ type, forumId }: { type?: Forum['type'], forumId?: string } = {}) => {
  const [open, setOpen] = useState<boolean>();
  const { forums } = useForums({ type });
  const { person } = useAuthPerson();
  let foundForum;

  if (!person) {
    return undefined;
  }

  if (forumId) {
    foundForum = forums.find((forum) => forum._id?.toString() === forumId);

    if (!foundForum || !hasAccessToForum({ forum: foundForum, authPerson: person }).post) {
      return null;
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
      trigger={<StyledTrigger />}
      title={foundForum?.name ?? `${person.name} ${person.family}`}
      content={<Content forumId={forumId} onSuccess={() => setOpen(false)} />}
    />
  );
};

export default CreateThread;
