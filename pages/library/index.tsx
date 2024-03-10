import { sizes } from '@/styles/global';
import CreateDocumentButton from '../../components/CreateDocumentButton/CreateDocumentButton';
import DocumentsList from '../../components/library/DocumentsList/DocumentsList';

export default function Index() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      <DocumentsList/>
      <CreateDocumentButton/>
    </div>
  );
}
