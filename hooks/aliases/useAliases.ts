import { toast } from 'react-toastify';
import useSwr, { SWRResponse } from 'swr';
import {
  Alias,
} from '../../types/data';

type UpdateAliases = ({
  aliases,
  alias,
}: {
  aliases?: Array<Partial<Alias>>,
  alias?: Partial<Alias>,
}) => Promise<any>;
type InsertAlias = (aliases: Alias[]) => void;
type UseAliasesReturn = Omit<SWRResponse, 'data'> & {
  aliases: Alias[],
  update: UpdateAliases,
  insert: InsertAlias,
};

export const url = '/api/aliases';

export default function useAliases(): UseAliasesReturn {
  const {
    data,
    mutate,
    ...swr
  } = useSwr(
    url,
    (urlKey) => fetch(urlKey).then((res) => res.json()),
    { keepPreviousData: true, }
  );
  const updateAliases: UpdateAliases = async ({ aliases, alias }) => {
    try {
      const result = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({ people: aliases || [alias] }),
      });

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      if (alias) {
        toast.success('Din profil har uppdaterats!');
      } else {
        toast.success('Profiler har uppdaterats!');
      }

      mutate();
    } catch (error) {
      toast.error('Något gick fel');

      throw error;
    }
  };
  const insertAliases: InsertAlias = (aliases) => fetch(url, {
    method: 'POST',
    body: JSON.stringify({ aliases }),
  }).then(() => {
    toast.success('Upload complete!');

    mutate();
  }).catch(() => toast.error('Something went wrong'));

  return {
    aliases: data?.aliases ?? [],
    update: updateAliases,
    insert: insertAliases,
    mutate,
    ...swr,
  };
}
