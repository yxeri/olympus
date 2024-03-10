import { Document } from '@/types/data';
import { toast } from 'react-toastify';
import useSwr, { SWRResponse } from 'swr';
import { url } from './useDocuments';

type UpdateDocument = (document: Partial<Document>) => Promise<any>;

type UseDocumentReturn = Omit<SWRResponse, 'data'> & {
  document: Document,
  update: UpdateDocument,
};

export default function useDocument({ documentId }: { documentId?: string }): UseDocumentReturn {
  const {
    data,
    mutate,
    ...swr
  } = useSwr(
    documentId
      ? `/api/documents?documentId=${documentId}`
      : null,
    (urlKey) => fetch(urlKey)
      .then((res) => res.json()),
    { keepPreviousData: true },
  );

  const update: UpdateDocument = async (document) => {
    try {
      const result = await fetch(
        url,
        {
          method: 'PATCH',
          body: JSON.stringify({ document }),
        },
      );

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      mutate();

      toast.success('Document updated!');

      return true;
    } catch (error) {
      toast.error('Failed to update document');

      throw error;
    }
  };

  return {
    ...swr,
    update,
    mutate,
    document: data?.document,
  };
}
