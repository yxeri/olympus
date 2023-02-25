import {
  Filter,
  PersonList
} from '@components';

export default function People() {
  return (
    <div className="main-container">
      <Filter />
      <PersonList />
    </div>
  );
}
