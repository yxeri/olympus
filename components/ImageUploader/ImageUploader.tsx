import { CldUploadWidget } from 'next-cloudinary';
import * as process from 'process';
import React, { ReactNode } from 'react';
import useAuthPerson from '../../hooks/people/useAuthPerson';
import { colors } from '../../styles/global';
import Container from '../Container/Container';

type ImageUploaderProps = {
  title?: string;
  text?: ReactNode;
  maxFiles?: number;
  requireAdmin?: boolean;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  text,
  maxFiles,
  requireAdmin,
}) => {
  const { person: authPerson } = useAuthPerson();

  if ((requireAdmin && !authPerson?.auth?.images?.admin) || !authPerson) {
    return null;
  }

  return (
    <Container style={{
      overflow: 'hidden',
    }}
    >
      {title && <h3>{title}</h3>}
      {text
        && (
        <Container>
          {text}
        </Container>
        )}
      <CldUploadWidget
        options={{
          maxFiles,
          publicId: maxFiles === 1
            ? `${authPerson?.name?.replaceAll(/[^\w\d]/g, '_')}-${authPerson?.family?.replaceAll(/[^\w\d]/g, '_')}`
            : undefined,
          multiple: maxFiles !== 1,
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
        uploadPreset={process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? 'dev_people' : 'people'}
        onUpload={() => {
        }}
      >
        {({ open }) => {
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
