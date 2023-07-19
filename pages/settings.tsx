import AdminSettings from '../components/AdminSettings/AdminSettings';
import ImageUploader from '../components/ImageUploader/ImageUploader';
import { useDictionary } from '../hooks/useDictionary';
import { colors } from '../styles/global';

export default function Settings() {
  const { getDictionaryValue } = useDictionary();

  return (
    <div className="main-container" style={{ color: colors.brightColor }}>
      <h2>Settings</h2>
      <ImageUploader title={getDictionaryValue('settings', 'uploadPortrait')} maxFiles={1} />
      <AdminSettings />
    </div>
  );
}
