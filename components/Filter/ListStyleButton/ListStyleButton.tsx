import { useRecoilState } from 'recoil';
import React from 'react';
import Button, { ButtonProps } from '../../Button/Button';
import { listVariantAtom, PersonListVariants } from '../atoms';

type ListStyleButtonProps = {
  listStyle: PersonListVariants,
} & ButtonProps;

const ListStyleButton: React.FC<ListStyleButtonProps> = ({ listStyle, ...props }) => {
  const [, setListStyle] = useRecoilState(listVariantAtom);

  return <Button {...props} onClick={() => setListStyle(listStyle)} />;
};

export default ListStyleButton;
