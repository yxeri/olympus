import EditScoreButton from '../../components/EditScoreButton/EditScoreButton';
import Filter from '../../components/Filter/Filter';
import ListTypePicker from '../../components/ListTypePicker/ListTypePicker';
import PersonList from '../../components/PersonList/PersonList';
import { sizes } from '../../styles/global';

export default function PeoplePage() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      <ListTypePicker type="people" />
      <Filter />
      <PersonList />
      <EditScoreButton />
    </div>
  );
}
