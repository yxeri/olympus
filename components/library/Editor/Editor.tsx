import {
  EditorContent,
  useEditor,
} from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import {
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import useDocument from '../../../hooks/documents/useDocument';
import useDocuments from '../../../hooks/documents/useDocuments';
import useAuthPerson from '../../../hooks/people/useAuthPerson';
import { colors } from '../../../styles/global';
import Button from '../../Button/Button';
import Container from '../../Container/Container';

const StyledDiv = styled.div`
  background-color: ${colors.secondaryBackground};
  box-shadow: 0 0 5px hsla(0, 0%, 0%, .3);
  height: calc(100svh - 4.6rem);
  display: grid;
  overflow: auto;
  
  .content {
    justify-self: center;
    background-color: ${colors.brightColor};
    max-width: 180mm;
    padding: 0 2mm;
    width: 100%;
    box-sizing: border-box;
  }
  
  @media print {    
    .content {
      max-width: 100%;
      padding: 0;
    }
  }
`;

const ControlContainer = styled.div`
  display: flex;
  grid-gap: .2rem;
  width: 100%;
  flex-wrap: wrap;
`;

const Editor = ({ documentId }: { documentId?: string }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [id, setId] = useState<string | undefined>(documentId);
  const { insert } = useDocuments();
  const { update, document } = useDocument({ documentId: id });
  const { person } = useAuthPerson();
  const editor = useEditor({
    autofocus: false,
    editable: !documentId
      || document?.postAccess?.includes(person?._id.toString())
      || document?.owner.toString() === person?._id.toString(),
    extensions: [StarterKit],
    content: document?.json ?? '<p>Text</p>',
  });

  if (documentId && !document) {
    return null;
  }

  return (
    <Container>
      {
        editor?.isEditable
          ? <input ref={inputRef} placeholder="Title" defaultValue={document?.title} style={{ fontSize: '1.5rem', color: colors.brightColor, background: 'inherit' }} />
          : <h1 style={{ color: colors.brightColor, fontSize: '1.5rem', margin: 0 }}>{document?.title}</h1>
      }
      {editor?.isEditable && (
        <ControlContainer>
          <Button
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            bold
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            italic
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            strike
          </Button>
          <Button
            onClick={() => editor?.chain().focus().setParagraph().run()}
          >
            paragraph
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            h1
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            h2
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            h3
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
          >
            h4
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}
          >
            h5
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}
          >
            h6
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            bullet list
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            ordered list
          </Button>
          <Button
            onClick={() => editor?.chain().focus().setHardBreak().run()}
          >
            hard break
          </Button>
          <Button
            onClick={() => editor?.chain().focus().setHorizontalRule().run()}
          >
            horisontal line
          </Button>
          <Button
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          >
            blockquote
          </Button>
          <Button
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().chain().focus().undo()
              .run()}
          >
            undo
          </Button>
          <Button
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().chain().focus().redo()
              .run()}
          >
            redo
          </Button>
          <Button
            onClick={async () => {
              const json = editor?.getJSON();

              try {
                if (id) {
                  await update({
                    json,
                    title: inputRef.current?.value,
                    _id: id,
                  });

                  return;
                }

                const { insertedId } = await insert({
                  json,
                  title: inputRef.current?.value,
                });

                setId(insertedId);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Save
          </Button>
        </ControlContainer>
      )}
      <StyledDiv>
        <EditorContent editor={editor} className="content" />
      </StyledDiv>
    </Container>
  );
};

export default Editor;
