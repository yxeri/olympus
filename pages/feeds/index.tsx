import PlusIcon from 'assets/plus-square.svg';
import CreateThread from '../../components/forum/CreateThread/CreateThread';
import ThreadsList from '../../components/forum/ThreadsList/ThreadsList';
import { sizes } from '../../styles/global';

export default function FeedsPage() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      {/* <ForumsList type="forum" /> */}
      {/* <CreateForum /> */}
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <CreateThread label={<PlusIcon width={sizes.hugeIcon} height={sizes.hugeIcon} />} />
      </div>
      <ThreadsList />
    </div>
  );
}
