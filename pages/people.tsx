import Filter from '../components/Filter/Filter';
import PersonList from '../components/PersonList/PersonList';
import { sizes } from '../styles/global';

export default function PeoplePage() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      <Filter />
      <PersonList />
    </div>
  );
}
