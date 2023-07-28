import useAuthPerson from '../../hooks/people/useAuthPerson';
import { useDictionary } from '../../hooks/useDictionary';
import { colors } from '../../styles/global';
import Container from '../Container/Container';
import CsvDownloader from '../CsvDownloader/CsvDownloader';
import CsvReader from '../CsvReader/CsvReader';
import IcalReader from '../IcalReader/IcalReader';
import ImageUploader from '../ImageUploader/ImageUploader';

const AdminSettings = () => {
  const { getDictionaryValue } = useDictionary();
  const { person: authPerson } = useAuthPerson();

  if (!Object.keys(authPerson?.auth ?? {}).some((key) => authPerson?.auth?.[key]?.admin)) {
    return null;
  }

  return (
    <Container style={{ color: colors.brightColor, marginTop: '1rem' }}>
      <h2>Admin</h2>
      <CsvReader />
      <CsvDownloader />
      <IcalReader />
      <ImageUploader
        requireAdmin
        title={getDictionaryValue('settings', 'uploadImages')}
        text={(
          <>
            <p>
              {getDictionaryValue('settings', 'uploadImagesText')}
            </p>
            <p>
              {getDictionaryValue('settings', 'uploadImagesExample')}
            </p>
          </>
        )}
      />
    </Container>
  );
};

export default AdminSettings;
