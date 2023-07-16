import { useCSVDownloader } from 'react-papaparse';
import { usePeople } from '../../hooks/people';
import { colors } from '../../styles/global';
import Container from '../Container/Container';

const CsvDownloader = () => {
  const { people } = usePeople();
  const { CSVDownloader, Type } = useCSVDownloader();

  return (
    <Container style={{
      color: colors.brightColor,
      borderBottom: `1px solid ${colors.selectedBrightColor}`,
      paddingBottom: '1rem'
    }}
    >
      <p style={{ fontWeight: 'bold ' }}>Download list of people</p>
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
