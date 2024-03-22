const Editor = await import('../../components/library/Editor/Editor').then((mod) => mod.default);

export default function Index() {
  return (
    <div className="editor-container">
      <Editor/>
    </div>
  );
}
