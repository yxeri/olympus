import { toast } from 'react-toastify';
import { SWRResponse } from 'swr';
import useSWRInfinite from 'swr/infinite';
import {
  Thread
} from '../../types/data';

type InsertThread = (thread: Partial<Thread>) => void;
type UseThreadsReturn = Omit<SWRResponse, 'data'> & {
  threads: Thread[],
  insert: InsertThread,
};

export const url = '/api/threads';

export default function useThreads({ forumId }: { forumId?: string } = {}): UseThreadsReturn {
  const {
    data,
    ...swr
  } = useSWRInfinite(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.length) {
        return null;
      }

      return `${url}?page=${index}${forumId ? `&forumId=${forumId}` : ''}`;
    },
    async (urlKey) => {
      const result = await fetch(urlKey, { method: 'GET' });

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
      keepPreviousData: true,
    }
  );
  const insertThread: InsertThread = async (thread) => {
    try {
      const result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ thread }),
      });

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      toast.success('Thread created!');

      return await swr.mutate();
    } catch (error) {
      toast.error('Failed to create thread');

      throw error;
    }
  };

  console.log(data);

  return {
    ...swr,
    threads: data?.map((page) => page?.threads).flat() ?? [],
    insert: insertThread,
  };
}
