import { useCSVDownloader } from 'react-papaparse';
import { useRecoilValue } from 'recoil';
import { peopleAtom } from '../../atoms/person';

const CsvDownloader = () => {
  const people = useRecoilValue(peopleAtom);
  const { CSVDownloader, Type } = useCSVDownloader();

  return (
    <CSVDownloader
      bom
      type={Type.Button}
      filename="olympen-people"
      data={people}
    >
      Ladda ner lista (alla personer)
    </CSVDownloader>
  );
};

export default CsvDownloader;
