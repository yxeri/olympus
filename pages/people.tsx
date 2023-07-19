import {
  GetServerSideProps,
} from 'next';
import { SWRConfig } from 'swr';
import { getPeople } from '../api/people/get';
import Filter from '../components/Filter/Filter';
import PersonList from '../components/PersonList/PersonList';
import { url } from '../hooks/people/usePeople';
import { Person } from '../types/data';

type ServerSideProps = {
  fallback: {
    [url]: { people?: Person[] },
  },
};

export default function PeoplePage({ fallback }: ServerSideProps) {
  return (
    <div className="main-container">
      <SWRConfig value={{ fallback }}>
        <Filter />
        <PersonList />
      </SWRConfig>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const people = await getPeople();

  return {
    props: {
      fallback: {
        [url]: { people: people.map((person) => ({ ...person, _id: person?._id?.toString() })) },
      },
    },
  };
};
