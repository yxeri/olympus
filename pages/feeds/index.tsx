import { sizes } from '@/styles/global';
import CreateThread from '../../components/forum/CreateThread/CreateThread';
import ThreadsList from '../../components/forum/ThreadsList/ThreadsList';

export default function FeedsPage() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      {/* <ForumsList type="forum" /> */}
      {/* <CreateForum /> */}
      <ThreadsList key="threadsList"/>
      <CreateThread/>
    </div>
  );
}
