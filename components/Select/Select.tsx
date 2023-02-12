import {
  Content,
  Group,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  SelectItemProps,
  Separator,
  Trigger,
  Value,
  Viewport,
} from '@radix-ui/react-select';
import React from 'react';
import styled from 'styled-components';
import {
  borders,
  colors,
  sizes,
} from '../../styles/global';
import CheckIcon from '../../assets/check.svg';
import ChevronUpIcon from '../../assets/chevron-up.svg';
import ChevronDownIcon from '../../assets/chevron-down.svg';

export type SelectItemType<T> = {
  label: string,
  value: T
};

type SelectProps<T> = {
  placeholder: string,
  items?: SelectItemType<T>[],
  groups?: Array<{ label: string, items: Array<SelectItemType<T>> }>,
  defaultValue?: string,
  onValueChange: (value: T) => void,
};

const SelectTrigger = styled(Trigger)`
  all: unset;
  box-sizing: border-box;
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  background-color: #f6f2dc;
  padding: .3rem;
  border: ${borders.standard};
  border-radius: ${sizes.corner};
  box-shadow: 0 2px 5px rgba(22, 23, 24, 0.5);
`;

const SelectIcon = styled(Icon)`
  display: flex;
`;

const SelectItem = React.forwardRef<HTMLDivElement | null, SelectItemProps>(({
  children,
  ...props
}, ref) => (
  <Item {...props} ref={ref}>
    <ItemText>{children}</ItemText>
    <ItemIndicator>
      <CheckIcon alt="Selected" width={18} height={18} />
    </ItemIndicator>
  </Item>
));
SelectItem.displayName = 'SelectItem';

const StyledSelectItem = styled(SelectItem)`
  display: grid;
  grid-gap: .2rem;
  grid-auto-flow: column;
  padding: .2rem;
`;

const SelectPortal = styled(Portal)`
  margin-left: -.1rem;
  margin-top: -.1rem;
  background-color: ${colors.clickableBackground};
  border-radius: ${sizes.corner};
  box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.5), 0px 10px 20px -15px rgba(22, 23, 24, 0.5);
  z-index: 10;
`;

const SelectViewport = styled(Viewport)`
  display: grid;
  box-sizing: border-box;
  grid-row-gap: .4rem;
  padding: .4rem;
`;

const Select = <T,>({
  placeholder,
  items,
  groups,
  defaultValue,
  onValueChange,
}: SelectProps<string & keyof T>) => {
  const itemComponents = items?.map(({ value, label }, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <StyledSelectItem key={index} value={value}>{label}</StyledSelectItem>));
  const groupComponents = groups?.map(({ label, items: groupItems }, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <Group key={index}>
      <Label>{label}</Label>
      {groupItems.map(({ value, label: itemLabel }, itemIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <StyledSelectItem key={itemIndex} value={value}>{itemLabel}</StyledSelectItem>))}
    </Group>
  ));

  return (
    <Root defaultValue={defaultValue} onValueChange={onValueChange}>
      <SelectTrigger aria-label="Select list filtering">
        <Value placeholder={placeholder} />
        <SelectIcon>
          <ChevronDownIcon alt="Chevron down" width={sizes.largeIcon} height={sizes.largeIcon} />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <Content position="popper">
          <ScrollUpButton>
            <ChevronUpIcon alt="Chevron up" width={sizes.largeIcon} height={sizes.largeIcon} />
          </ScrollUpButton>
          <SelectViewport>
            <>
              {itemComponents}
              {groupComponents?.map((group) => (
                <>
                  <Separator />
                  {group}
                </>
              ))}
            </>
          </SelectViewport>
          <ScrollDownButton>
            <ChevronDownIcon alt="Chevron down" width={sizes.largeIcon} height={sizes.largeIcon} />
          </ScrollDownButton>
        </Content>
      </SelectPortal>
    </Root>
  );
};

export default Select;
