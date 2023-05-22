import { getPeople } from '@api/people/get';
import {
  Filter,
  PersonList
} from '@components';
import { Person } from '@data';
import { url } from '@hooks/people/usePeople';
import { GetStaticProps } from 'next';
import { SWRConfig } from 'swr';

type StaticProps = {
  fallback: {
    [url]: Person[],
  },
};

export default function People({ fallback }: StaticProps) {
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
    props: {
      fallback: {
        [url]: people.map((person) => ({ ...person, _id: person?._id?.toString() })),
      },
    },
  };
};
