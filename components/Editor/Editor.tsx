import { DecoupledEditor } from '@ckeditor/ckeditor5-editor-decoupled';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/global';

const StyledDiv = styled.div`
  background-color: ${colors.secondaryBackground};
  box-shadow: 0 0 5px hsla(0, 0%, 0%, .3);
  height: calc(100svh - 4.6rem);
  overflow: auto;
  
  .ck-toolbar {
    position: sticky !important;
    top: 0;
  }
  
  .ck-editor__editable {
    /* Set the dimensions of the "page". */
    max-width: 18.6cm;
    min-height: 25cm;

    border: 1px hsl( 0,0%,82.7% ) solid;
    background: white;

    /* The "page" should cast a slight shadow (3D illusion). */
    box-shadow: 0 0 5px hsla(0, 0%, 0%, .1);

    /* Center the "page". */
    margin: 0 auto;
    margin-bottom: 1rem;
  }
`;

const Editor = () => {
  const [[CkEditor, DocumentEditor], setEditors] = useState<[
    typeof CKEditor | null,
    typeof DecoupledEditor | null,
  ]>([null, null]);

  useEffect(() => {
    (async () => {
      setEditors([
        (await import('@ckeditor/ckeditor5-react')).CKEditor,
        (await import('@ckeditor/ckeditor5-build-decoupled-document')).default
      ]);
    })();
  }, []);

  return (
    <StyledDiv className="inner-editor-container">
      {DocumentEditor && CkEditor && (
        <CkEditor
          editor={DocumentEditor}
          data="Document"
          onReady={(readyEditor) => {
            const editable = readyEditor?.ui?.getEditableElement();
            const toolbarElement = readyEditor?.ui?.view?.toolbar?.element;

            if (editable && toolbarElement) {
              editable.parentElement?.insertBefore(
                toolbarElement,
                editable
              );
            }
          }}
        />
      )}
    </StyledDiv>
  );
};

export default Editor;
