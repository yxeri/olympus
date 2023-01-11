import { useCSVDownloader } from 'react-papaparse';
import { discipli } from '../../data';

const CsvDownloader = () => {
  const { CSVDownloader, Type } = useCSVDownloader();

  return (
    <CSVDownloader
      bom
      type={Type.Button}
      filename="discipli"
      data={discipli}
    >
      Ladda ner lista (csv, alla personer)
    </CSVDownloader>
  );
};

export default CsvDownloader;
