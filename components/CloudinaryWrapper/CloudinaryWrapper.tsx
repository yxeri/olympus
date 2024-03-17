import React, { PropsWithChildren } from 'react';

const CloudinaryWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  if (typeof window === 'undefined' || !window.cloudinaryCloudName) {
    return;
  }

  return (
    <>{children}</>
  );
};

export default CloudinaryWrapper;
