import {
  EditorContent,
  useEditor
} from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import styled from 'styled-components';
import { colors } from '../../styles/global';

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

const Editor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Text</p>',
  });

  return (
    <StyledDiv>
      <EditorContent editor={editor} className="content" />
    </StyledDiv>
  );
};

export default Editor;
