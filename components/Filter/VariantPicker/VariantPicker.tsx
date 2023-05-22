import GridIcon from '@assets/grid.svg';
import ListIcon from '@assets/list.svg';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  listVariantAtom,
  PersonListVariant
} from '../../../atoms/filter';
import { sizes } from '../../../styles/global';
import Button from '../../Button/Button';

const StyledRoot = styled(ToggleGroup.Root)`
  display: flex;
`;

const StyledItem = styled(ToggleGroup.Item)<{ variant?: 'left' | 'right' }>`
  cursor: pointer; 
  ${({ variant }) => {
    if (variant === 'left') {
      return `
        border-right: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      `;
    }

    if (variant === 'right') {
      return `
        border-left: none;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      `;
    }

    return `
      border-radius: 0;
      border-left: none;
      border-right: none;
    `;
  }}
`;

const VariantPicker = () => {
  const [selectedListVariant, setListVariant] = useRecoilState(listVariantAtom);

  return (
    <StyledRoot
      type="single"
      orientation="horizontal"
      value={selectedListVariant}
      onValueChange={(variant: PersonListVariant) => {
        if (variant) {
          setListVariant(variant);
        }
      }}
    >
      <StyledItem
        asChild
        variant="left"
        value="list"
        aria-label="List variant: list"
      >
        <Button isSelected={selectedListVariant === 'list'}>
          <ListIcon alt="List" width={sizes.largeIcon} height={sizes.largeIcon} />
        </Button>
      </StyledItem>
      <StyledItem
        asChild
        variant="right"
        value="grid"
        aria-label="List variant: grid"
      >
        <Button isSelected={selectedListVariant === 'grid'}>
          <GridIcon alt="Grid" width={sizes.largeIcon} height={sizes.largeIcon} />
        </Button>
      </StyledItem>
    </StyledRoot>
  );
};

export default VariantPicker;
