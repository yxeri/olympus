import { useRecoilState } from 'recoil';
import React from 'react';
import Button, { ButtonProps } from '../../Button/Button';
import {
  listVariantAtom,
  PersonListVariants,
} from '../atoms';

type ListVariantButtonProps = {
  listVariant: PersonListVariants,
} & ButtonProps;

const ListVariantButton: React.FC<ListVariantButtonProps> = ({ listVariant, ...props }) => {
  const [selectedListVariant, setListVariant] = useRecoilState(listVariantAtom);

  return (
    <Button
      {...props}
      isSelected={listVariant === selectedListVariant}
      onClick={() => setListVariant(listVariant)}
    />
  );
};

export default ListVariantButton;
