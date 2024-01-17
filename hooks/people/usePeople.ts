import { toast } from 'react-toastify';
import useSwr, { SWRResponse } from 'swr';
import {
  Person,
  PersonObject
} from '../../types/data';

type UpdatePeople = ({
  people,
  person,
}: {
  people?: Array<Partial<Person>>,
  person?: Partial<Person>,
}) => Promise<any>;
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
    mutate,
    ...swr
  } = useSwr(
    url,
    (urlKey) => fetch(urlKey).then((res) => res.json()),
    { keepPreviousData: true, }
  );
  const updatePeople: UpdatePeople = async ({ people, person }) => {
    try {
      const result = await fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({ people: people || [person] }),
      });

      if (!result.ok) {
        throw new Error(result.status.toString());
      }

      if (person) {
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
  const insertPeople: InsertPeople = (people) => fetch(url, {
    method: 'POST',
    body: JSON.stringify({ people }),
  }).then(() => {
    toast.success('Upload complete!');

    mutate();
  }).catch(() => toast.error('Something went wrong'));

  return {
    people: data?.people?.sort((a: Person, b: Person) => a.score < b.score)
      .map((person: Person, index: number) => ({ ...person, rank: index + 1 })) ?? [],
    update: updatePeople,
    insert: insertPeople,
    mutate,
    ...swr,
  };
}
