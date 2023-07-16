import {
  Person,
  PersonObject
} from '@data';
import usePeople from './usePeople';

type UpdatePerson = (update: Partial<typeof PersonObject>) => void;

export default function usePerson(id: string, family?: string): [Person | undefined, UpdatePerson] {
  const { people, mutate } = usePeople();
  const person = people
    .find(({
      name,
      _id: personId,
      family: personFamily
    }) => (
      !family
        ? personId === id
        : (name === id && family === personFamily)));
  const updatePerson: UpdatePerson = (update) => fetch('/api/people', {
    method: 'PATCH',
    body: JSON.stringify({ update, ids: [id] }),
  }).then(() => mutate());

  return [person, updatePerson];
}
