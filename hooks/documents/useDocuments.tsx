import { Document } from '@/types/data';
import { toast } from 'react-toastify';
import { SWRResponse } from 'swr';
import useSWRInfinite from 'swr/infinite';

type InsertDocument = (document: Partial<Document>) => Promise<{ insertedId: string }>;

type UseDocumentsReturn = Omit<SWRResponse, 'data'> & {
  documents: Partial<Document>[],
  insert: InsertDocument,

};

export const url = '/api/documents';

export default function useDocuments(): UseDocumentsReturn {
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

      return `${url}?page=${index}`;
    },
    async (urlKey) => {
      const result = await fetch(
        urlKey,
        { method: 'GET' },
      );

      if (!result.ok) {
        return { documents: [] };
      }

      const jsonData = await result.json();

      if (jsonData.error) {
        return { documents: [] };
      }

      return jsonData;
    },
    {
      revalidateAll: true,
      parallel: true,
      keepPreviousData: true,
    },
  );

  const insert: InsertDocument = async (document) => {
    try {
      const result = await fetch(
        url,
        {
          method: 'POST',
          body: JSON.stringify({ document }),
        },
      );

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      toast.success('Document created!');

      mutate();

      return await result.json();
    } catch (error) {
      toast.error('Failed to create document');

      throw error;
    }
  };

  return {
    documents: data?.map((page) => page?.documents)
      .flat() ?? [],
    insert,
    mutate,
    ...swr,
  };
}
