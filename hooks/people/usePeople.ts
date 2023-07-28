import { toast } from 'react-toastify';
import useSwr, { SWRResponse } from 'swr';
import {
  Person,
  PersonObject
} from '../../types/data';

type UpdatePeople = (ids: string[], update: Partial<typeof PersonObject>) => void;
type InsertPeople = (people: Array<typeof PersonObject>) => void;
type UsePeopleReturn = Omit<SWRResponse, 'data'> & {
  people: Person[],
  update: UpdatePeople,
  insert: InsertPeople,
};

export const url = '/api/people';

export default function usePeople(): UsePeopleReturn {
  const {
    data,
    ...swr
  } = useSwr(
    url,
    (urlKey) => fetch(urlKey).then((res) => res.json()),
    { keepPreviousData: true, }
  );
  const updatePeople: UpdatePeople = (ids, update) => fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({ ids, update }),
  }).then(() => {
    toast.success('Update complete!');

    return swr.mutate();
  }).catch(() => toast.error('Something went wrong'));
  const insertPeople: InsertPeople = (people) => fetch(url, {
    method: 'POST',
    body: JSON.stringify({ people }),
  }).then(() => {
    toast.success('Upload complete!');

    return swr.mutate();
  }).catch(() => toast.error('Something went wrong'));

  return {
    ...swr,
    people: data?.people?.sort((a: Person, b: Person) => a.score < b.score)
      .map((person: Person, index: number) => ({ ...person, rank: index + 1 })) ?? [],
    update: updatePeople,
    insert: insertPeople,
  };
}
