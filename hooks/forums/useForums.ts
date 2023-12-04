import { toast } from 'react-toastify';
import useSwr, { SWRResponse } from 'swr';
import {
  Forum
} from '../../types/data';

type InsertForum = (forum: Partial<Forum>) => void;
type UseForumsReturn = Omit<SWRResponse, 'data'> & {
  forums: Forum[],
  insert: InsertForum,
};

export const url = '/api/forums';

export default function useForums({ type }: { type?: Forum['type'] } = {}): UseForumsReturn {
  const {
    data,
    mutate,
    ...swr
  } = useSwr(
    `${url}${type ? `?type=${type}` : ''}`,
    (urlKey: string) => fetch(urlKey).then((res) => {
      if (res.ok) {
        return res.json();
      }

      throw new Error(res.status.toString());
    }),
    {
      keepPreviousData: true,
    }
  );
  const insertForum: InsertForum = async (forum) => {
    try {
      const result = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ forum }),
      });

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      toast.success('Forum created!');

      mutate();
    } catch (error) {
      toast.error('Something went wrong');

      throw error;
    }
  };

  return {
    forums: data?.forums ?? [],
    insert: insertForum,
    mutate,
    ...swr,
  };
}
