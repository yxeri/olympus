import DocumentsList from '../../components/library/DocumentsList/DocumentsList';
import Link from '../../components/Link/Link';
import {
  borders,
  colors,
  sizes,
} from '../../styles/global';

export default function Index() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      <Link
        href="/library/create"
        style={{
          backgroundColor: colors.componentBackground,
          textDecoration: 'none',
          width: 'fit-content',
          marginBottom: '.6rem',
          padding: '.5rem',
          borderRadius: sizes.corner,
          border: borders.standard,
        }}
      >
        Skapa nytt dokument
      </Link>
      <DocumentsList />
    </div>
  );
}
