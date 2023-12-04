import { useRouter } from 'next/router';
import Editor from '../../components/library/Editor/Editor';

export default function Index() {
  const router = useRouter();

  if (!router?.query.docId) {
    return null;
  }

  return (
    <div className="editor-container">
      <Editor documentId={router?.query.docId as string} />
    </div>
  );
}
