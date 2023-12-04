import DocumentsList from '../../components/library/DocumentsList/DocumentsList';
import Link from '../../components/Link/Link';
import {
  colors,
  sizes,
} from '../../styles/global';

export default function Index() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      <Link href="/library/create" style={{ backgroundColor: colors.componentBackground }}>
        Create document
      </Link>
      <DocumentsList />
    </div>
  );
}
