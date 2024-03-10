import {
  Root, Trigger, Portal, Content
} from '@radix-ui/react-popover';
import {
  ReactNode,
  useState,
} from 'react';
import {
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
} from 'react-aria-components';
import { useFormContext } from 'react-hook-form';
import { colors } from '../../styles/global';
import Input from '../Input/Input';

const ListItem = ({ children, ...props }: ListBoxItemProps & { children: React.ReactNode }) => (
  <ListBoxItem {...props}>
    {({ isSelected }) => (
      <div style={{ textTransform: 'capitalize' }}>
        {children}
        {isSelected && <span>Select</span>}
      </div>
    )}
  </ListBoxItem>
);

const ComboBox = ({
  name,
  items,
  trigger,
}: { name: string, items: Array<{ id: string, name: string }>, trigger: ReactNode }) => {
  const formMethods = useFormContext();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState('');

  return (
    <Root>
      <Trigger asChild>
        {trigger}
      </Trigger>
      <Portal>
        <Content
          style={{
            backgroundColor: colors.inputBackground,
            padding: '.5rem',
            border: '1px solid',
            filter: 'drop-shadow(2px 2px 5px #000000)',
          }}
        >
          <Input
            {...formMethods.register(name)}
            style={{
              marginBottom: '.4rem',
            }}
            placeholder="Filtrera"
            name={`${name}-filter`}
            options={{
              onChange: (event) => setFilter(event.currentTarget.value),
            }}
          />
          <ListBox
            style={{
              maxHeight: '10rem',
              overflow: 'auto',
              display: 'grid',
              gridGap: '.4rem',
            }}
            items={items.filter((item) => item.name.includes(filter))}
            selectionMode="multiple"
            onSelectionChange={(key) => {
              const newSelected = new Set(selected.values());

              if (newSelected.has(key as string)) {
                newSelected.delete(key as string);
              } else {
                newSelected.add(key as string);
              }

              setSelected(newSelected);
            }}
          >
            {(item) => (
              <ListItem id={item.id} textValue={item.name}>
                <span>
                  {item.name}
                </span>
              </ListItem>
            )}
          </ListBox>
        </Content>
      </Portal>
    </Root>
  );
};

export default ComboBox;
