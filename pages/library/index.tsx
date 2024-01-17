import CreateDocumentButton from '../../components/CreateDocumentButton/CreateDocumentButton';
import DocumentsList from '../../components/library/DocumentsList/DocumentsList';
import {
  sizes,
} from '../../styles/global';

export default function Index() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      <DocumentsList />
      <CreateDocumentButton />
    </div>
  );
}
