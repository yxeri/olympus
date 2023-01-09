import Button, { ButtonProps } from '../../Button/Button';
import { useRecoilState } from 'recoil';
import { listVariantAtom, PersonListVariants } from '../atoms';
import React from 'react';

type ListStyleButton = {
  listStyle: PersonListVariants,
} & ButtonProps;

const ListStyleButton: React.FC<ListStyleButton> = ({ listStyle, ...props }) => {
  const [listStyleState, setListStyle] = useRecoilState(listVariantAtom);

  return <Button {...props} onClick={() => setListStyle(listStyle)} />;
};

export default ListStyleButton;
