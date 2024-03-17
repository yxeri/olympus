import ChevronLeftIcon from '@/assets/chevron-left.svg';
import ChevronRightIcon from '@/assets/chevron-right.svg';
import CloudinaryWrapper from '@/components/CloudinaryWrapper/CloudinaryWrapper';
import { Thread } from '@/types/data';
import {
  CldImage,
  CldVideoPlayer,
} from 'next-cloudinary';
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';

const StyledDiv = styled.div`
    .video > div {
        aspect-ratio: unset !important;
        margin-bottom: .2rem;
    }

    .video .vjs-time-control, .video .vjs-volume-panel, .video .vjs-spacer, .video .vjs-cloudinary-button {
        display: none !important;
    }
`;

const IndexButton = styled(Button)<{ $align?: 'left' | 'right' }>`
    background-color: transparent;
    border: none;
    padding: 0;
    ${({ $align }) => ($align === 'left'
            ? 'margin-left: -1rem;'
            : 'margin-right: -1rem;')}
`;

/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

const MediaContent = ({ media = [] }: { media: Thread['media'] }) => {
  const [open, setOpen] = useState(false);
  const [mediaIndex, setMediaIndex] = useState(0);
  const onMediaClick = (index: number) => {
    if (index > media.length - 1) {
      setMediaIndex(0);
    } else if (index < 0) {
      setMediaIndex(media.length - 1);
    } else {
      setMediaIndex(index);
    }

    setOpen(true);
  };
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onMediaClick(mediaIndex + 1),
    onSwipedRight: () => onMediaClick(mediaIndex - 1),
  });
  const selectedMedia = media[mediaIndex];

  // eslint-disable-next-line react/no-unstable-nested-components
  const SelectedMediaContent = () => (
    <StyledDiv
      style={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: 'auto 1fr auto',
      }}
      {...swipeHandlers}
    >
      <IndexButton $align="left" onClick={() => onMediaClick(mediaIndex - 1)}>
        <ChevronLeftIcon width="1rem"/>
      </IndexButton>
      {selectedMedia.type === 'video'
        ? (
          <div
            className="video"
          >
            <CloudinaryWrapper>
              <CldVideoPlayer
                hideContextMenu
                /* @ts-ignore */
                cloud_name={window.cloudinaryCloudName}
                height={600}
                width={600}
                src={selectedMedia.path}
              />
            </CloudinaryWrapper>
          </div>
        )
        : (
          <CloudinaryWrapper>
            <CldImage
              config={{
                cloud: {
                  cloudName: window.cloudinaryCloudName,
                },
              }}
              onClick={() => onMediaClick(0)}
              style={{
                maxWidth: '100%',
                objectFit: 'contain',
                height: '100%',
                maxHeight: '100%',
                marginBottom: '.2rem',
                marginTop: '.8rem',
              }}
              loading="lazy"
              alt={selectedMedia.path}
              format="webp"
              src={selectedMedia.path}
              width={1000}
              height={1000}
            />
          </CloudinaryWrapper>
        )}
      <IndexButton onClick={() => onMediaClick(mediaIndex + 1)}>
        <ChevronRightIcon width="1rem"/>
      </IndexButton>
    </StyledDiv>
  );

  return (
    <StyledDiv>
      <Modal
        onOpenChange={(newOpen) => setOpen(newOpen)}
        open={open}
        /* eslint-disable-next-line react/jsx-no-useless-fragment */
        trigger={<></>}
        title="Media"
        content={(
          <SelectedMediaContent/>
        )}
      />
      {media.slice(
        0,
        1,
      )
        .map(({
          path,
          type,
        }) => {
          if (type === 'video') {
            return (
              <div
                key={path}
                className="video"
                style={{
                  marginTop: '.8rem',
                }}
              >
                <CloudinaryWrapper>
                  <CldVideoPlayer
                    hideContextMenu
                    /* @ts-ignore */
                    cloud_name={window.cloudinaryCloudName}
                    id={path}
                    floatingWhenNotVisible="right"
                    height={600}
                    width={600}
                    src={path}
                  />
                </CloudinaryWrapper>
              </div>
            );
          }

          return (
            <CloudinaryWrapper>
              <CldImage
                config={{
                  cloud: {
                    cloudName: window.cloudinaryCloudName,
                  },
                }}
                onClick={() => onMediaClick(0)}
                key={path}
                id={path}
                style={{
                  maxWidth: '100%',
                  objectFit: 'contain',
                  height: 'fit-content',
                  marginBottom: '.2rem',
                  marginTop: '.8rem',
                  cursor: 'pointer',
                }}
                loading="lazy"
                alt={path}
                format="webp"
                src={path}
                width={600}
                height={600}
                transformations={['thread-single']}
              />
            </CloudinaryWrapper>
          );
        })}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoFlow: 'row',
        gridGap: '.2rem',
      }}
      >
        {media.slice(1)
          .map((
            {
              path,
              type,
            },
            index,
          ) => {
            if (type === 'video') {
              return (
                <div
                  style={{ cursor: 'pointer' }}
                  key={path}
                  onClick={() => onMediaClick(index + 1)}
                >
                  <div
                    className="video"
                    style={{ pointerEvents: 'none' }}
                  >
                    <CloudinaryWrapper>
                      <CldVideoPlayer
                        hideContextMenu
                        /* @ts-ignore */
                        cloud_name={window.cloudinaryCloudName}
                        id={path}
                        floatingWhenNotVisible="right"
                        height={200}
                        width={200}
                        src={path}
                      />
                    </CloudinaryWrapper>
                  </div>
                </div>
              );
            }

            return (
              <CloudinaryWrapper>
                <CldImage
                  config={{
                    cloud: {
                      cloudName: window.cloudinaryCloudName,
                    },
                  }}
                  onClick={() => onMediaClick(index + 1)}
                  key={path}
                  id={path}
                  style={{
                    maxWidth: '100%',
                    objectFit: 'contain',
                    height: 'fit-content',
                    cursor: 'pointer',
                  }}
                  loading="lazy"
                  alt={path}
                  format="webp"
                  src={path}
                  width={200}
                  height={200}
                  transformations={['thumb-thread']}
                />
              </CloudinaryWrapper>
            );
          })}
      </div>
    </StyledDiv>
  );
};

export default MediaContent;
