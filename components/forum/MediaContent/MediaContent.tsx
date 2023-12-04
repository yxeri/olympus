import {
  CldImage,
  CldVideoPlayer,
} from 'next-cloudinary';
import React from 'react';
import styled from 'styled-components';
import { Thread } from '../../../types/data';

const StyledDiv = styled.div`
  .video > div {
    aspect-ratio: unset !important;
    margin-bottom: .2rem;
  }

  .video .vjs-time-control, .video .vjs-volume-panel, .video .vjs-spacer, .video .vjs-cloudinary-button {
    display: none !important;
  }
`;

const MediaContent = ({ media = [] }: { media: Thread['media'] }) => (
  <StyledDiv>
    {media.slice(0, 1).map(({ path, type }) => {
      if (type === 'video') {
        return (
          <div key={path} className="video" style={{ marginTop: '.8rem' }}>
            <CldVideoPlayer
              hideContextMenu
              id={path}
              floatingWhenNotVisible="right"
              height={600}
              width={600}
              src={path}
            />
          </div>
        );
      }

      return (
        <CldImage
          key={path}
          id={path}
          style={{
            maxWidth: '100%',
            objectFit: 'contain',
            height: 'fit-content',
            marginBottom: '.2rem',
            marginTop: '.8rem',
          }}
          loading="lazy"
          alt={path}
          format="webp"
          src={path}
          width={600}
          height={600}
          transformations={['thread-single']}
        />
      );
    })}
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoFlow: 'row',
      gridGap: '.2rem',
    }}
    >
      {media.slice(1).map(({ path, type }) => {
        if (type === 'video') {
          return (
            <div key={path} className="video">
              <CldVideoPlayer
                hideContextMenu
                id={path}
                floatingWhenNotVisible="right"
                height={200}
                width={200}
                src={path}
              />
            </div>
          );
        }

        return (
          <CldImage
            key={path}
            id={path}
            style={{
              maxWidth: '100%',
              objectFit: 'contain',
              height: 'fit-content',
            }}
            loading="lazy"
            alt={path}
            format="webp"
            src={path}
            width={200}
            height={200}
            transformations={['thumb-thread']}
          />
        );
      })}
    </div>
  </StyledDiv>
);

export default MediaContent;
