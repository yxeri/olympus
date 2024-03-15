import { colors } from '@/styles/global';
import { CldUploadWidget } from 'next-cloudinary';
import * as process from 'process';
import React, { ReactNode } from 'react';
import { usePeople } from '../../hooks/people';
import useAuthPerson from '../../hooks/people/useAuthPerson';
import Button from '../Button/Button';
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
  const { update } = usePeople();
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
        onOpen={({ update }) => {
          update({
            cloudName: window.cloudinaryCloudName,
            apiKey: window.cloudinaryApiKey,
          });
        }}
        options={{
          maxFiles,
          publicId: maxFiles === 1
            ? `${authPerson?.name?.replaceAll(
              /[^\w\d]/g,
              '_',
            )}-${authPerson?.family?.replaceAll(
              /[^\w\d]/g,
              '_',
            )}`
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
          sources: [
            'local',
            'url',
            'camera',
          ],
        }}
        signatureEndpoint="/api/cloudinarySignature"
        uploadPreset={process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
          ? 'dev_people'
          : 'people'}
        onUpload={({ info }) => {
          if (info && typeof info === 'object') {
            const { version } = (info as { version: number });

            if (!requireAdmin && maxFiles === 1) {
              update({
                person: {
                  _id: authPerson._id,
                  imgVersion: version,
                },
              });
            }
          }
        }}
      >
        {({
          open,
        }) => {
          const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            open();
          };

          return (
            <Button type="button" onClick={handleOnClick}>
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </Container>
  );
};

export default ImageUploader;
