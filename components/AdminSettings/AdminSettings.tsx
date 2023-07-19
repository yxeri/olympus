import { useRecoilValue } from 'recoil';
import { sessionAtom } from '../../atoms/session';
import { usePerson } from '../../hooks/people';
import { useDictionary } from '../../hooks/useDictionary';
import { colors } from '../../styles/global';
import Container from '../Container/Container';
import CsvDownloader from '../CsvDownloader/CsvDownloader';
import CsvReader from '../CsvReader/CsvReader';
import IcalReader from '../IcalReader/IcalReader';
import ImageUploader from '../ImageUploader/ImageUploader';

const AdminSettings = () => {
  const { getDictionaryValue } = useDictionary();
  const session = useRecoilValue(sessionAtom);
  const userMeta = session?.user.user_metadata?.[process.env.NEXT_PUBLIC_INSTANCE_NAME ?? ''];
  const [authPerson] = usePerson(userMeta?.name, userMeta?.family);

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
