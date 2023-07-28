import useSwr, { SWRResponse } from 'swr';
import {
  Person,
} from '../../types/data';

type UseAuthPersonReturn = Omit<SWRResponse, 'data'> & {
  person: Person,
};

export default function useAuthPerson(): UseAuthPersonReturn {
  const {
    data,
    ...swr
  } = useSwr(
    '/api/people/auth',
    (urlKey) => fetch(urlKey).then((res) => res.json()),
    { keepPreviousData: true, }
  );

  return {
    ...swr,
    person: data?.person,
  };
}
