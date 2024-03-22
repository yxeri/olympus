import { useRouter } from 'next/router';

const Editor = await import('../../components/library/Editor/Editor').then((mod) => mod.default);

export default function Index() {
  const router = useRouter();

  if (!router?.query.docId) {
    return null;
  }

  return (
    <div className="editor-container">
      <Editor documentId={router?.query.docId as string}/>
    </div>
  );
}
