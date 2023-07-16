import { usePerson } from '@hooks/people';
import { CldUploadWidget } from 'next-cloudinary';
import { useRecoilValue } from 'recoil';
import { sessionAtom } from '../../atoms/session';
import { colors } from '../../styles/global';
import Container from '../Container/Container';

const ImageUploader = () => {
  const session = useRecoilValue(sessionAtom);
  const userMeta = session?.user.user_metadata?.[process.env.NEXT_PUBLIC_INSTANCE_NAME ?? ''];
  const [person] = usePerson(userMeta?.name, userMeta?.family);

  if (!person?.auth?.images?.admin) {
    return null;
  }

  return (
    <Container style={{ color: colors.brightColor, borderBottom: `1px solid ${colors.selectedBrightColor}`, paddingBottom: '1rem' }}>
      <p style={{ fontWeight: 'bold' }}>Upload portraits</p>
      <p>
        {
          `Each file should have the name of the person
          with a dash (-) in between the name and family name.
          `
        }
      </p>
      <p>
        {
          `Don't remove any whitespaces or special characters.
          Examples: kahina-soteira.png (Kahina Soteira) or Tyr'ahnee-Phonoi.jpg (Tyr'ahnee Phonoi).`
        }
      </p>
      <CldUploadWidget
        options={{
          styles: {
            palette: {
              inactiveTabIcon: colors.selectedBrightColor,
              tabIcon: colors.brightColor,
              menuIcons: colors.brightColor,
              textLight: colors.brightColor,
              window: colors.primaryBackground,
              sourceBg: colors.componentBackground,
              textDark: colors.primaryColor,
              link: colors.brightColor,
              action: colors.primaryColor,
              windowBorder: colors.primaryColor,
              error: colors.error,
              inProgress: colors.progress,
              complete: colors.success,
            },
            frame: {
              background: colors.primaryTransBackground,
            },
          },
          clientAllowedFormats: ['image'],
          singleUploadAutoClose: false,
          sources: ['local', 'url', 'camera'],
        }}
        signatureEndpoint="/api/cloudinarySignature"
        uploadPreset="people"
        onUpload={() => {}}
      >
        {({ open }: { open: () => void }) => {
          const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            open();
          };

          return (
            <button type="button" onClick={handleOnClick}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </Container>
  );
};

export default ImageUploader;
