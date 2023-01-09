import { useRecoilState } from 'recoil';
import React from 'react';
import Button, { ButtonProps } from '../../Button/Button';
import { listVariantAtom, PersonListVariants } from '../atoms';

type ListStyleButtonProps = {
  listVariant: PersonListVariants,
} & ButtonProps;

const ListStyleButton: React.FC<ListStyleButtonProps> = ({ listVariant, ...props }) => {
  const [selectedListVariant, setListVariant] = useRecoilState(listVariantAtom);

  return (
    <Button
      {...props}
      isSelected={listVariant === selectedListVariant}
      onClick={() => setListVariant(listVariant)}
    />
  );
};

export default ListStyleButton;
