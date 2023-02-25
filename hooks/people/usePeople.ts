import useSwr, { SWRResponse } from 'swr';
import {
  Person,
  PersonObject
} from 'data';

type UpdatePeople = (ids: string[], update: Partial<typeof PersonObject>) => void;
type InsertPeople = (people: Array<typeof PersonObject>) => void;
type UsePeopleReturn = Omit<SWRResponse, 'data'> & {
  people: Person[],
  update: UpdatePeople,
  insert: InsertPeople,
};

const url = '/api/people';

export default function usePeople(): UsePeopleReturn {
  const {
    data,
    ...swr
  } = useSwr(url, (urlKey) => fetch(urlKey).then((res) => res.json()));
  const updatePeople: UpdatePeople = (ids, update) => fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({ ids, update }),
  }).then(() => swr.mutate());
  const insertPeople: InsertPeople = (people) => fetch(url, {
    method: 'POST',
    body: JSON.stringify({ people }),
  }).then(() => swr.mutate());

  return {
    ...swr,
    update: updatePeople,
    insert: insertPeople,
    people: data?.people ?? [],
  };
}
