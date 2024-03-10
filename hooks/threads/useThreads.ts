import { Thread } from '@/types/data';
import { toast } from 'react-toastify';
import { SWRResponse } from 'swr';
import useSWRInfinite from 'swr/infinite';

type InsertThread = (thread: Partial<Thread>) => void;

type UpdateThread = (thread: Partial<Thread>) => void;

type LikeThread = ({
  threadId,
  like,
}: {
  threadId: NonNullable<Thread['_id']>,
  like: boolean,
}) => void;

type UseThreadsReturn = Omit<SWRResponse, 'data'> & {
  update: UpdateThread,
  updateLike: LikeThread,
  threads: Thread[],
  insert: InsertThread,
};

export const url = '/api/threads';

export default function useThreads({ forumId }: { forumId?: string } = {}): UseThreadsReturn {
  const {
    data,
    mutate,
    ...swr
  } = useSWRInfinite(
    (
      index,
      previousPageData,
    ) => {
      if (previousPageData && !previousPageData.length) {
        return null;
      }

      return `${url}?page=${index}${forumId
        ? `&forumId=${forumId}`
        : ''}`;
    },
    async (urlKey) => {
      const result = await fetch(
        urlKey,
        { method: 'GET' },
      );

      if (!result.ok) {
        return { threads: [] };
      }

      const jsonData = await result.json();

      if (jsonData.error) {
        return { threads: [] };
      }

      return jsonData;
    },
    {
      revalidateAll: true,
      parallel: true,
      keepPreviousData: true,
    },
  );

  const insert: InsertThread = async (thread) => {
    try {
      const result = await fetch(
        url,
        {
          method: 'POST',
          body: JSON.stringify({ thread }),
        },
      );

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      toast.success('Thread created!');

      mutate();
    } catch (error) {
      toast.error('Failed to create thread');

      throw error;
    }
  };

  const update: UpdateThread = async (thread) => {
    try {
      const result = await fetch(
        url,
        {
          method: 'POST',
          body: JSON.stringify({ thread }),
        },
      );

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      toast.success('Thread created!');

      mutate();
    } catch (error) {
      toast.error('Failed to create thread');

      throw error;
    }
  };

  const updateLike: LikeThread = async ({
    threadId,
    like,
  }) => {
    try {
      const result = await fetch(
        url,
        {
          method: 'PATCH',
          body: JSON.stringify({
            thread: { _id: threadId },
            like,
          }),
        },
      );

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
    updateLike,
    update,
    threads: data?.map((page) => page?.threads)
      .flat() ?? [],
    insert,
    mutate,
    ...swr,
  };
}
