import Button from '@/components/Button/Button';
import CloudinaryWrapper from '@/components/CloudinaryWrapper/CloudinaryWrapper';
import Form from '@/components/Form/Form';
import { hasAccessToForum } from '@/components/forum/helpers';
import Modal from '@/components/Modal/Modal';
import useForums from '@/hooks/forums/useForums';
import useAuthPerson from '@/hooks/people/useAuthPerson';
import usePosts from '@/hooks/posts/usePosts';
import { colors } from '@/styles/global';
import {
  Forum,
  Post,
} from '@/types/data';
import { Trigger as RadixTrigger } from '@radix-ui/react-dialog';
import { Color } from '@tiptap/extension-color';
import { Link } from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  EditorContent,
  useEditor,
} from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { CldUploadWidget } from 'next-cloudinary';
import process from 'process';
import React, {
  ReactNode,
  useState,
} from 'react';
import { SubmitHandler } from 'react-hook-form';
import styled from 'styled-components';

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
    height: fit-content;
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
  const [media, setMedia] = useState<Set<Post['media'][0]>>(new Set());
  const { insert } = usePosts({ threadId });
  const editor = useEditor({
    autofocus: false,
    editable: true,
    extensions: [
      StarterKit,
      Link,
      Color,
      TextStyle,
    ],
  });
  const onSubmit: SubmitHandler<FormValues> = async ({
    title,
  }) => {
    const content = editor?.getJSON();

    if (!content) {
      return;
    }

    try {
      await insert({
        title,
        content,
        threadId,
        postId,
        media: Array.from(media),
      });

      onSuccess();
    } catch (error) {
      console.error('Failed to create post');
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <EditorContent editor={editor} className="content"/>
      <CloudinaryWrapper>
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
            clientAllowedFormats: [
              'image',
              'video',
            ],
            singleUploadAutoClose: false,
            sources: [
              'local',
              'url',
              'camera',
            ],
          }}
          signatureEndpoint="/api/cloudinarySignature"
          uploadPreset={process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
            ? 'dev_media'
            : 'media'}
          onUpload={({ info }) => {
            if (info && typeof info === 'object') {
              const newMedia = {
                path: (info as { public_id: string }).public_id,
                type: (info as { resource_type: 'image' | 'video' }).resource_type,
              };

              setMedia(new Set([
                ...Array.from(media),
                newMedia,
              ]));
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
      </CloudinaryWrapper>
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

    if (!foundForum || !hasAccessToForum({
      forum: foundForum,
      authPerson: person,
    }).post) {
      return null;
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(newOpen) => setOpen(newOpen)}
      trigger={<Trigger label={label}/>}
      title={label ?? 'Create post'}
      content={<Content threadId={threadId} postId={postId} onSuccess={() => setOpen(false)}/>}
    />
  );
};

export default CreatePost;
