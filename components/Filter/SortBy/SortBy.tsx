import { useRecoilState } from 'recoil';
import {
  PersonSortable,
  sortByAtom,
} from '../../../atoms/filter';
import Select from '../../Select/Select';

const sortBy: Array<{ label: string, value: PersonSortable }> = [
  { label: 'Namn', value: 'alphabetical' },
  { label: 'Familj', value: 'family' },
  { label: 'Status', value: 'status' },
  { label: 'Rank', value: 'rank' },
  { label: 'Elevhem', value: 'society' },
];

const SortBy = () => {
  const [selectedSortBy, setSortBy] = useRecoilState(sortByAtom);

  return (
    <Select
      defaultValue={selectedSortBy}
      placeholder="Sortera"
      items={sortBy}
      onValueChange={setSortBy}
    />
  );
};

export default SortBy;
