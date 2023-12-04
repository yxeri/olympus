import { toast } from 'react-toastify';
import {
  SWRResponse,
} from 'swr';
import useSWRInfinite from 'swr/infinite';
import {
  Post,
} from '../../types/data';

type InsertPost = (post: Partial<Post> & { postId?: string }) => void;

type UsePostsReturn = Omit<SWRResponse, 'data'> & {
  likePost: LikePost,
  posts: Post[],
  insert: InsertPost,
};

type LikePost = ({
  postId,
  like,
}: {
  postId: NonNullable<Post['_id']>,
  like: boolean,
}) => void;

export const url = '/api/posts';

export default function usePosts({ threadId }: { threadId?: string } = {}): UsePostsReturn {
  const {
    data,
    mutate,
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
      revalidateAll: true,
      parallel: true,
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

      mutate();
    } catch (error) {
      toast.error('Failed to create post');

      throw error;
    }
  };

  const likePost: LikePost = async ({ postId, like }) => {
    try {
      const result = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({ thread: { _id: postId }, like }),
      });

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      mutate();
    } catch (error) {
      toast.error('Failed to create thread');

      throw error;
    }
  };

  return {
    likePost,
    posts: data?.map((page) => page?.posts).flat() ?? [],
    insert: insertPost,
    mutate,
    ...swr,
  };
}
