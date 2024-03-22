const { Link } = await import('@tiptap/extension-link');
const { Image } = await import('@tiptap/extension-image');
const { Color } = await import('@tiptap/extension-color');
const { Table } = await import('@tiptap/extension-table');
const { TableCell } = await import('@tiptap/extension-table-cell');
const { TableHeader } = await import('@tiptap/extension-table-header');
const { TableRow } = await import('@tiptap/extension-table-row');
const { TextStyle } = await import('@tiptap/extension-text-style');
const {
  EditorContent,
  useEditor,
} = await import('@tiptap/react');
import {
  borders,
  colors,
  sizes,
} from '@/styles/global';
import {
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import useDocument from '../../../hooks/documents/useDocument';
import useDocuments from '../../../hooks/documents/useDocuments';
import useAuthPerson from '../../../hooks/people/useAuthPerson';
import Button from '../../Button/Button';
import Container from '../../Container/Container';

const { StarterKit } = await import('@tiptap/starter-kit');

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

        table {
            background-color: ${colors.primaryColor};

            td, col {
                background-color: ${colors.brightColor};
            }
        }
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
  const {
    update,
    document,
  } = useDocument({ documentId: id });
  const { person } = useAuthPerson();
  const editor = useEditor({
    autofocus: false,
    editable: !documentId
      || document?.postAccess?.includes(person?._id.toString())
      || document?.owner.toString() === person?._id.toString(),
    extensions: [
      StarterKit,
      Link,
      Image,
      Color,
      TextStyle,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: document?.json ?? '<p>Text</p>',
  });

  if (documentId && !document) {
    return null;
  }

  return (
    <Container>
      {
        editor?.isEditable
          ? <input ref={inputRef} placeholder="Title" defaultValue={document?.title} style={{
            fontSize: '1.5rem',
            color: colors.brightColor,
            background: 'inherit',
          }}/>
          : <h1 style={{
            color: colors.brightColor,
            fontSize: '1.5rem',
            margin: 0,
          }}>{document?.title}</h1>
      }
      {editor?.isEditable && (
        <ControlContainer>
          <input
            style={{
              height: '2.2rem',
              padding: '.1rem',
              borderRadius: sizes.corner,
              border: borders.standard,
              backgroundColor: colors.clickableBackground,
            }}
            type="color"
            onInput={(event) => editor.chain()
              .focus()
              .setColor(event.currentTarget.value)
              .run()}
            value={editor.getAttributes('textStyle').color ?? colors.primaryColor}
          />
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleBold()
              .run()}
          >
            bold
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleItalic()
              .run()}
          >
            italic
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleStrike()
              .run()}
          >
            strike
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .setParagraph()
              .run()}
          >
            paragraph
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()}
          >
            h1
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()}
          >
            h2
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()}
          >
            h3
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleHeading({ level: 4 })
              .run()}
          >
            h4
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleHeading({ level: 5 })
              .run()}
          >
            h5
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleHeading({ level: 6 })
              .run()}
          >
            h6
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleBulletList()
              .run()}
          >
            bullet list
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleOrderedList()
              .run()}
          >
            ordered list
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .setHardBreak()
              .run()}
          >
            hard break
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .setHorizontalRule()
              .run()}
          >
            horisontal line
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleBlockquote()
              .run()}
          >
            blockquote
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .toggleLink({ href: 'google.com' })
              .run()}
          >
            link
          </Button>
          <Button
            onClick={() => editor.chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run()}
          >
            table
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .undo()
              .run()}
            disabled={!editor?.can()
              .chain()
              .focus()
              .undo()
              .run()}
          >
            undo
          </Button>
          <Button
            onClick={() => editor?.chain()
              .focus()
              .redo()
              .run()}
            disabled={!editor?.can()
              .chain()
              .focus()
              .redo()
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
        <EditorContent editor={editor} className="content"/>
      </StyledDiv>
    </Container>
  );
};

export default Editor;
