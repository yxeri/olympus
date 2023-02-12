import React from 'react';
import { useRecoilState } from 'recoil';
import Button, { ButtonProps } from '../../Button/Button';
import {
  listVariantAtom,
  PersonListVariant
} from '../../../atoms/filter';

type ListVariantButtonProps = {
  listVariant: PersonListVariant,
} & ButtonProps;

const ListVariantButton: React.FC<ListVariantButtonProps> = ({ listVariant, ...props }) => {
  const [selectedListVariant, setListVariant] = useRecoilState(listVariantAtom);

  return (
    <Button
      {...props}
      aria-label={`List variant: ${listVariant}`}
      isSelected={selectedListVariant === listVariant}
      onClick={() => setListVariant(listVariant)}
    />
  );
};

export default ListVariantButton;
