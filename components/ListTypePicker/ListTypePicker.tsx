import * as ToggleGroup from '@radix-ui/react-toggle-group';
import styled from 'styled-components';
import Button from '../Button/Button';
import Link from '../Link/Link';

const StyledRoot = styled(ToggleGroup.Root)`
  display: flex;
  place-content: center;
  width: 100%;
  margin-bottom: .4rem;
`;

const StyledItem = styled(ToggleGroup.Item)<{ $variant?: 'left' | 'right' }>`
  cursor: pointer;
  ${({ $variant }) => {
    if ($variant === 'left') {
      return `
        border-right: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      `;
    }

    if ($variant === 'right') {
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

const VariantPicker = ({ type }: { type: 'people' | 'families' }) => (
  <StyledRoot
    type="single"
    orientation="horizontal"
  >
    <StyledItem
      asChild
      $variant="left"
      value="list"
      aria-label="List variant: list"
    >
      <Link href="/people" style={{ textDecoration: 'none' }}>
        <Button isSelected={type === 'people'}>
          Personer
        </Button>
      </Link>
    </StyledItem>
    <StyledItem
      asChild
      $variant="right"
      value="grid"
      aria-label="List variant: grid"
    >
      <Link href="/families" style={{ textDecoration: 'none' }}>
        <Button isSelected={type === 'families'}>
          Familjer
        </Button>
      </Link>
    </StyledItem>
  </StyledRoot>
);

export default VariantPicker;
