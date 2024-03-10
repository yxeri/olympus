import { useCSVDownloader } from 'react-papaparse';
import { usePeople } from '../../hooks/people';
import Container from '../Container/Container';

const CsvDownloader = () => {
  const { people } = usePeople();
  const {
    CSVDownloader,
    Type,
  } = useCSVDownloader();

  return (
    <Container style={{
      overflow: 'hidden',
    }}
    >
      <h3>Download list of people</h3>
      <CSVDownloader
        bom
        type={Type.Button}
        filename="olympen-people"
        data={people}
      >
        Ladda ner lista (alla personer)
      </CSVDownloader>
    </Container>
  );
};

export default CsvDownloader;
