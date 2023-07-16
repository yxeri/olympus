import { GetStaticProps } from 'next';
import { SWRConfig } from 'swr';
import { getPeople } from '../api/people/get';
import Filter from '../components/Filter/Filter';
import PersonList from '../components/PersonList/PersonList';
import { url } from '../hooks/people/usePeople';
import { Person } from '../types/data';

type StaticProps = {
  fallback: {
    [url]: { people?: Person[] },
  },
};

export default function PeoplePage({ fallback }: StaticProps) {
  return (
    <div className="main-container">
      <SWRConfig value={{ fallback }}>
        <Filter />
        <PersonList />
      </SWRConfig>
    </div>
  );
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const people = await getPeople();

  return {
    revalidate: 300,
    props: {
      fallback: {
        [url]: { people: people.map((person) => ({ ...person, _id: person?._id?.toString() })) },
      },
    },
  };
};
