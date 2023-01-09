import Image from 'next/image';
import { Root, Trigger, Value, Icon, Portal, Content, ScrollDownButton, ScrollUpButton, Item, Group, Label, Separator, Viewport, ItemIndicator, ItemText, SelectItemProps } from '@radix-ui/react-select';
import React from 'react';
import styled from 'styled-components';
import { useSetRecoilState } from 'recoil';
import { PersonSortables, sortByAtom } from '../Filter/atoms';

export type SelectItem = {
  label: string,
  value: string
}

type SelectProps = {
  placeholder: string,
  items?: SelectItem[],
  groups?: Array<{ label: string, items: Array<SelectItem> }>,
  defaultValue?: string,
};

const SelectTrigger = styled(Trigger)`
  all: unset;
  display: grid;
  align-items: center;
  grid-auto-flow: column;
  background-color: #f6f2dc;
  padding: .3rem;
  border: 1px solid;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(22, 23, 24, 0.5);
`;

const SelectIcon = styled(Icon)`
  display: flex;
`;

const SelectItem = React.forwardRef<HTMLDivElement | null, SelectItemProps>(({ children, ...props }, ref) => (
  <Item {...props} ref={ref}>
    <ItemText>{children}</ItemText>
    <ItemIndicator>
      <Image src="/check.svg" alt="Selected" width={18} height={18} />
    </ItemIndicator>
  </Item>
));
SelectItem.displayName = "SelectItem";

const StyledSelectItem = styled(SelectItem)`
  display: grid;
  grid-gap: .2rem;
  grid-auto-flow: column;
`;

const SelectPortal = styled(Portal)`
  top: 0;
  left: -20px;
  background-color: #f6f2dc;
  border-radius: 4px;
  box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.5), 0px 10px 20px -15px rgba(22, 23, 24, 0.5);
`;

const SelectViewport = styled(Viewport)`
  display: grid;
  grid-row-gap: .4rem;
  padding: .4rem;
`;

const Select: React.FC<SelectProps> = ({
  placeholder,
  items,
  groups,
  defaultValue,
}) => {
  const setSortBy = useSetRecoilState(sortByAtom);
  const itemComponents = items?.map(({ value, label }, index) => <StyledSelectItem key={index} value={value}>{label}</StyledSelectItem>);
  const groupComponents = groups?.map(({ label, items }, index) => (
    <Group key={index}>
      <Label>{label}</Label>
      {items.map(({ value, label }, index) => <StyledSelectItem key={index} value={value}>{label}</StyledSelectItem>)}
    </Group>
  ));

  return (
    <Root defaultValue={defaultValue} onValueChange={(value: PersonSortables) => setSortBy(value)}>
      <SelectTrigger>
        <Value placeholder={placeholder} />
        <SelectIcon>
          <Image src="/chevron-down.svg" alt="Chevron down" width={20} height={20} />
        </SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <Content>
          <ScrollUpButton>
            <Image src="/chevron-up.svg" alt="Chevron up" width={20} height={20} />
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
            <Image src="/chevron-down.svg" alt="Chevron down" width={20} height={20} />
          </ScrollDownButton>
        </Content>
      </SelectPortal>
    </Root>
  );
};

export default Select;
