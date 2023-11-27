import { toast } from 'react-toastify';
import { SWRResponse } from 'swr';
import useSWRInfinite from 'swr/infinite';
import {
  Post,
} from '../../types/data';

type InsertPost = (post: Partial<Post> & { postId?: string }) => void;
type UsePostsReturn = Omit<SWRResponse, 'data'> & {
  posts: Post[],
  insert: InsertPost,
};

export const url = '/api/posts';

export default function usePosts({ threadId }: { threadId?: string } = {}): UsePostsReturn {
  const {
    data,
    ...swr
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.length) {
        return null;
      }

      return `${url}?page=${index}${threadId ? `&threadId=${threadId}` : ''}`;
    },
    async (urlKey) => {
      const result = await fetch(urlKey, { method: 'GET' });

      if (!result.ok) {
        return { posts: [] };
      }

      const jsonData = await result.json();

      if (jsonData.error) {
        return { posts: [] };
      }

      return jsonData;
    },
    {
      keepPreviousData: true,
    }
  );
  const insertPost: InsertPost = async (post) => {
    try {
      const result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ post }),
      });

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      toast.success('Post created!');

      return await swr.mutate();
    } catch (error) {
      toast.error('Failed to create post');

      throw error;
    }
  };

  return {
    ...swr,
    posts: data?.map((page) => page?.posts).flat() ?? [],
    insert: insertPost,
  };
}
