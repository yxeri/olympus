import {
  Root as CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent
} from '@radix-ui/react-collapsible';
import { Color } from '@tiptap/extension-color';
import { Link } from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import {
  EditorContent,
  useEditor,
} from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import ListItem from 'components/List/ListItem';
import {
  CldImage,
} from 'next-cloudinary';
import React from 'react';
import styled from 'styled-components';
import {
  colors,
} from 'styles/global';
import MessageIcon from 'assets/message-square.svg';
import MoreIcon from 'assets/more-vertical.svg';
import useForums from '../../../../hooks/forums/useForums';
import { usePeople } from '../../../../hooks/people';
import {
  Thread,
} from '../../../../types/data';
import Button from '../../../Button/Button';
import { Trigger } from '../../../Modal/Modal';
import PersonModal from '../../../PersonModal/PersonModal';
import { getTimeSince } from '../../helpers';
import ThreadLikeButtons from '../../LikeButtons/ThreadLikeButtons';
import MediaContent from '../../MediaContent/MediaContent';
import PostsList from '../../PostsList/PostsList';
import PostNavigationContainer from './PostNavigationContainer';

export type ThreadsListItemProps = {
  thread: Thread,
};

export const StyledDiv = styled.div`
  display: grid;
  border-bottom: .5px solid;
  padding-bottom: .8rem;
  padding-top: .8rem;
`;

const StyledListItem = styled(ListItem)`
  display: grid;
  border: 2px solid;
  box-shadow: 0 0 2px 2px;
  background-color: ${colors.componentBackground};
  grid-column-gap: .7rem;
  padding: .4rem;
  border-radius: 4px;
  position: relative;
`;

const StyledCollapsibleContent = styled(CollapsibleContent)`
  border-top: .5px solid;
  padding-top: .8rem;
  max-height: fit-content;

  @keyframes slideDown {
    from {
      height: 0;
    }
    to {
      height: var(--radix-collapsible-content-height);
    }
  }

  @keyframes slideUp {
    from {
      overflow: hidden;
      height: var(--radix-collapsible-content-height);
    }
    to {
      height: 0;
      overflow: hidden;
    }
  }
  
  &[data-state='open'] {
    animation: slideDown 300ms ease-out;
  }

  &[data-state='closed'] {
    animation: slideUp 300ms ease-out;
  }
`;

const StyledCollapsibleTrigger = styled(CollapsibleTrigger)`
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
  padding: .5rem;
  display: grid;
  align-content: center;
`;

const StyledCollapsibleRoot = styled(CollapsibleRoot)`
`;

const NavigationContainer = styled.div`
  display: flex;
  grid-gap: .5rem;
`;

const TextContainer = styled.div`
  display: flex;
  text-transform: capitalize;
  grid-gap: .5rem;
`;

const CleanButton = styled(Button)`
  background: none;
  border: none;
`;

const StyledTrigger = styled(Trigger)`
  font-size: inherit;
  color: inherit;
  background: inherit;
  border: none;
  padding: 0;
`;

const ThreadsListItem: React.FC<ThreadsListItemProps> = ({ thread }) => {
  const { people } = usePeople();
  const { forums } = useForums({ type: 'forum' });
  const {
    content,
    _id: id,
    forumId,
    owner,
    createdAt,
    media = [],
  } = thread;
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

  const poster = people.find((person) => person._id?.toString() === owner.toString());
  const foundForum = forums.find((forum) => forum._id?.toString() === forumId.toString());

  if (!poster) {
    return undefined;
  }

  return (
    <StyledListItem key={id?.toString() ?? ''}>
      <div style={{ maxWidth: 'calc(100% - 1.4rem)' }}>
        <CldImage
          style={{
            float: 'left',
            marginRight: '.4rem',
            borderRadius: '4px',
          }}
          version={poster.imgVersion}
          loading="lazy"
          alt={`${poster.name} ${poster.family}`}
          format="webp"
          src={`olympus/${process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? 'dev/' : ''}people/${poster.name.replaceAll(/[^\w\d]/g, '_')}-${poster.family.replaceAll(/[^\w\d]/g, '_')}`}
          height={34}
          width={34}
          transformations={['thumb-person']}
        />
        {foundForum?.name ? (
          <>
            <TextContainer>
              {foundForum?.name}
            </TextContainer>
            <TextContainer style={{ fontSize: '.8rem' }}>
              <PersonModal
                personId={poster._id ?? ''}
                trigger={(
                  <StyledTrigger>
                    <TextContainer>{`${poster?.name} ${poster?.family}`}</TextContainer>
                  </StyledTrigger>
                  )}
              />
              <span>{getTimeSince({ date: new Date(createdAt) })}</span>
            </TextContainer>
          </>
        ) : (
          <>
            <PersonModal
              personId={poster._id ?? ''}
              trigger={(
                <StyledTrigger>
                  <TextContainer>
                    {`${poster?.name} ${poster?.family}`}
                  </TextContainer>
                </StyledTrigger>
              )}
            />
            <TextContainer style={{ fontSize: '.8rem' }}>
              {getTimeSince({ date: new Date(createdAt) })}
            </TextContainer>
          </>
        )}
        <TextContainer />
      </div>
      <CleanButton
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '.4rem .3rem'
        }}
      >
        <MoreIcon width={14} height={14} />
      </CleanButton>
      <StyledDiv>
        <EditorContent editor={editor} className="content" />
        <MediaContent media={media} />
      </StyledDiv>
      <StyledCollapsibleRoot defaultOpen={false}>
        <NavigationContainer>
          <ThreadLikeButtons threadId={id?.toString() ?? ''} />
          <StyledCollapsibleTrigger>
            <MessageIcon width={14} height={14} />
          </StyledCollapsibleTrigger>
        </NavigationContainer>
        <StyledCollapsibleContent>
          {id && forumId && (
            <>
              <PostsList threadId={id.toString()} forumId={forumId.toString()} />
              <PostNavigationContainer forumId={forumId} id={id} />
            </>
          )}
        </StyledCollapsibleContent>
      </StyledCollapsibleRoot>
    </StyledListItem>
  );
};

export default ThreadsListItem;
