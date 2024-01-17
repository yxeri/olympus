import * as ToggleGroup from '@radix-ui/react-toggle-group';
import styled from 'styled-components';
import Button from '../Button/Button';
import Container from '../Container/Container';
import Input, { InputProps } from '../Input/Input';

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

const StyledToggleRoot = styled(ToggleGroup.Root)`
  display: flex;
  place-content: center;
  width: 100%;
`;

const ScoreCounter = ({
  onTypeChange,
  onValueChange,
  name,
  changeType,
}: {
  name: string,
  onTypeChange: (value: '+' | '-') => void,
  onValueChange: InputProps['onChange'],
  changeType: '+' | '-',
}) => (
  <Container style={{
    width: 'fit-content',
    display: 'grid',
    gridAutoFlow: 'column',
    height: '2rem',
    gridGap: '.2rem',
  }}
  >
    <Input
      hideFocusPlaceholder
      style={{
        background: 'inherit',
        width: '4rem',
      }}
      type="number"
      name={name}
      placeholder="0"
      options={{ onChange: onValueChange, valueAsNumber: true, }}
    />
    <StyledToggleRoot type="single" orientation="horizontal" onValueChange={onTypeChange}>
      <StyledItem asChild value="+" $variant="left"><Button style={{ maxHeight: '2rem' }} isSelected={changeType === '+'}>+</Button></StyledItem>
      <StyledItem asChild value="-" $variant="right"><Button style={{ maxHeight: '2rem' }} isSelected={changeType === '-'}>-</Button></StyledItem>
    </StyledToggleRoot>
  </Container>
);

export default ScoreCounter;
