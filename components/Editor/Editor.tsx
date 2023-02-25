import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import styled from 'styled-components';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import {
  HeadingNode,
  QuoteNode
} from '@lexical/rich-text';
import {
  TableCellNode,
  TableNode,
  TableRowNode
} from '@lexical/table';
import {
  ListItemNode,
  ListNode
} from '@lexical/list';
import {
  CodeHighlightNode,
  CodeNode
} from '@lexical/code';
import {
  AutoLinkNode,
  LinkNode
} from '@lexical/link';
import { EditorThemeClasses } from 'lexical';

const theme: EditorThemeClasses = {
  // Theme styling goes here
  // ...
};

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
const onError = (error: Error) => {
  console.error(error);
};

const StyledDiv = styled.div`
  color: white;
`;

const Editor = () => {
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ],
  };

  return (
    <StyledDiv>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </LexicalComposer>
    </StyledDiv>
  );
};

export default Editor;
