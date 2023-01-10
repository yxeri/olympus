import Filter from '../components/Filter/Filter';
import PersonList from '../components/PersonList/PersonList';

export default function People() {
  return (
    <div className="main-container">
      <Filter />
      <PersonList />
    </div>
  );
}
