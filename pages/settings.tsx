import CsvDownloader from '../components/CsvDownloader/CsvDownloader';
import CsvReader from '../components/CsvReader/CsvReader';
import IcalReader from '../components/IcalReader/IcalReader';
import ImageUploader from '../components/ImageUploader/ImageUploader';

export default function Settings() {
  return (
    <div className="main-container">
      <CsvReader />
      <CsvDownloader />
      <IcalReader />
      <ImageUploader />
    </div>
  );
}
