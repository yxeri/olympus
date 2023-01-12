import React from 'react';
import { useRouter } from 'next/router';
import Link from '../../Link/Link';
import Button, { ButtonProps } from '../../Button/Button';

type ListVariantButtonProps = {
  path: string,
} & ButtonProps;

const ListVariantButton: React.FC<ListVariantButtonProps> = ({ path, ...props }) => {
  const { pathname } = useRouter();
  const fullPath = `/people${path}`;

  return (
    <Link href={fullPath}>
      <Button
        isSelected={fullPath === pathname}
        {...props}
      />
    </Link>
  );
};

export default ListVariantButton;
