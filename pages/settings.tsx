import styled from 'styled-components';
import { CldUploadWidget } from 'next-cloudinary';
import CsvReader from '../components/CsvReader/CsvReader';
import CsvDownloader from '../components/CsvDownloader/CsvDownloader';
import IcalReader from '../components/IcalReader/IcalReader';
import { colors } from '../styles/global';

const StyledDiv = styled.div`
  display: grid;
  grid-gap: 1rem;
  width: fit-content;
  max-width: 100%;
`;

export default function Settings() {
  return (
    <StyledDiv className="main-container">
      <CsvReader />
      <CsvDownloader />
      <IcalReader />
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
          croppingAspectRatio: 1,
          validateMaxWidthHeight: true,
          cropping: true,
          minImageWidth: 200,
          minImageHeight: 200,
          maxImageWidth: 1000,
          maxImageHeight: 1000,
          sources: ['local', 'url', 'camera']
        }}
        uploadPreset="olympus-people"
        onUpload={() => console.log('upload')}
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
    </StyledDiv>
  );
}
