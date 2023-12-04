import { useRouter } from 'next/router';
import CreateForum from '../../components/forum/CreateForum/CreateForum';
import CreateThread from '../../components/forum/CreateThread/CreateThread';
import ForumsList from '../../components/forum/ForumsList/ForumsList';
import ThreadsList from '../../components/forum/ThreadsList/ThreadsList';

export default function ForumPage() {
  const router = useRouter();

  if (!router?.query.forumId) {
    return null;
  }

  return (
    <div className="main-container">
      <CreateForum />
      <ForumsList type="forum" />
      <ThreadsList forumId={router.query.forumId as string} />
      <CreateThread type="forum" forumId={router.query.forumId as string} />
    </div>
  );
}
