import { useCSVDownloader } from 'react-papaparse';
import { usePeople } from '@hooks/people';

const CsvDownloader = () => {
  const { people } = usePeople();
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
