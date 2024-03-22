import React, { PropsWithChildren } from 'react';

const CloudinaryWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <>{children}</>
  );
};

export default CloudinaryWrapper;
