import {
  CsvDownloader,
  CsvReader,
  IcalReader,
} from '@components';
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
