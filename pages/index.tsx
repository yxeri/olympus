import Filter from '../components/Filter/Filter';
import PersonList from '../components/PersonList/PersonList';

export default function Home() {
  return (
    <div className="main-container">
      <Filter />
      <PersonList />
    </div>
  );
}
