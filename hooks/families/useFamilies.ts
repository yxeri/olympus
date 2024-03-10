import {
  Family,
  FamilyObject,
} from '@/types/data';
import { toast } from 'react-toastify';
import useSwr, { SWRResponse } from 'swr';

type UpdateFamilies = ({ family }: { family: Partial<Family> }) => Promise<any>;
type InsertFamilies = (families: Array<typeof FamilyObject>) => void;
type UseFamiliesReturn = Omit<SWRResponse, 'data'> & {
  families: Family[],
  update: UpdateFamilies,
  insert: InsertFamilies,
};

export const url = '/api/families';

export default function useFamilies(): UseFamiliesReturn {
  const {
    data,
    mutate,
    ...swr
  } = useSwr(
    url,
    (urlKey) => fetch(urlKey)
      .then((res) => res.json()),
    { keepPreviousData: true },
  );
  const updateFamilies: UpdateFamilies = async ({ family }) => {
    try {
      const result = await fetch(
        url,
        {
          method: 'PATCH',
          body: JSON.stringify({ families: [family] }),
        },
      );

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      toast.success('Familjens profil har uppdaterats!');

      mutate();
    } catch (error) {
      toast.error('Något gick fel');

      throw error;
    }
  };
  const insertFamilies: InsertFamilies = (family) => fetch(
    url,
    {
      method: 'POST',
      body: JSON.stringify({ families: family }),
    },
  )
    .then(() => {
      toast.success('Upload complete!');

      mutate();
    })
    .catch(() => toast.error('Something went wrong'));

  return {
    families: data?.families ?? [],
    update: updateFamilies,
    insert: insertFamilies,
    mutate,
    ...swr,
  };
}
