import { sizes } from '@/styles/global';
import FamilyList from '../components/FamilyList/FamilyList';
import ListTypePicker from '../components/ListTypePicker/ListTypePicker';

export default function FamiliesPage() {
  return (
    <div className="main-container" style={{ maxWidth: sizes.mediumMax }}>
      <ListTypePicker type="families"/>
      <FamilyList/>
    </div>
  );
}
