import FamilyList from '../components/FamilyList/FamilyList';
import ListTypePicker from '../components/ListTypePicker/ListTypePicker';
import { sizes } from '../styles/global';

export default function FamiliesPage() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      <ListTypePicker type="families" />
      <FamilyList />
    </div>
  );
}
