import { selectedCalendarsAtom } from '@/atoms/calendar';
import { colors } from '@/styles/global';
import { Checkbox } from '@radix-ui/react-checkbox';
import React from 'react';
import type { ToolbarProps } from 'react-big-calendar';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import ArrowLeftIcon from '../../assets/arrow-left.svg';
import ArrowRightIcon from '../../assets/arrow-right.svg';
import CalendarIcon from '../../assets/calendar.svg';
import FilterIcon from '../../assets/filter.svg';
import ListIcon from '../../assets/list.svg';
import useCalendars from '../../hooks/calendars/useCalendars';
import Button from '../Button/Button';
import Container from '../Container/Container';
import List from '../List/List';
import ListItem from '../List/ListItem';
import Modal, { Trigger } from '../Modal/Modal';

const ToolbarButton = styled(Button)`
    background-color: inherit;
    color: ${colors.brightColor};
    border-bottom: none;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    min-width: 2.1rem;
    text-align: center;
    cursor: pointer;

    svg {
        width: 1rem;
        height: 1rem;
    }
`;

const ToolbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 0 .5rem;
`;

const NavContainer = styled.div`
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-gap: .7rem;
    font-size: .9rem;
`;

const DateSpan = styled.span`
    text-align: center;
    position: absolute;
    right: 0;
    left: 0;
    top: -1.5rem;
    color: ${colors.brightColor};
    background-color: ${colors.primaryTransBackground};
    font-size: 1.1rem;
    z-index: 2;
    width: fit-content;
    margin: 0 auto;
    padding: .1rem;
`;

const StyledCheckbox = styled(Checkbox)`
    height: 1rem;
    width: 1rem;
    padding: .1rem;
    margin-right: .5rem;
    position: relative;
    border: 1px solid;
    background-color: ${colors.componentBackground};
    border-radius: 15%;

    &[data-state="checked"] {
        background-color: ${colors.primaryColor};
    }
`;

const StyledLabel = styled.label`
    display: flex;
    align-items: center;
`;

const Toolbar: React.FC<ToolbarProps> = ({
  label,
  onNavigate,
  onView,
}) => {
  const { calendars } = useCalendars();
  const [selected, setSelected] = useRecoilState(selectedCalendarsAtom);

  return (
    <ToolbarContainer>
      <NavContainer>
        <Modal
          trigger={(
            <Trigger asChild>
              <ToolbarButton>
                <FilterIcon/>
              </ToolbarButton>
            </Trigger>
          )}
          content={(
            <Container>
              <List style={{ gap: '.5rem' }}>
                <ListItem>
                  <StyledLabel htmlFor="all">
                    <StyledCheckbox id="all" name="all" checked={selected.includes('all')}
                                    onCheckedChange={() => setSelected(['all'])}/>
                    All
                  </StyledLabel>
                </ListItem>
                {calendars.map((calendar) => (
                  <ListItem>
                    <StyledLabel htmlFor={calendar.name}>
                      <StyledCheckbox
                        id={calendar.name}
                        name={calendar.name}
                        checked={selected.includes(calendar.name)}
                        onCheckedChange={(checkedState) => {
                          if (!checkedState) {
                            const filteredSelected = [
                              ...selected.filter(
                                (name) => name !== calendar.name,
                              ),
                            ];

                            if (filteredSelected.length < 1) {
                              setSelected(['all']);
                            } else {
                              setSelected(filteredSelected);
                            }
                          } else if (selected[0] === 'all') {
                            setSelected([calendar.name]);
                          } else {
                            setSelected([
                              ...selected,
                              calendar.name,
                            ]);
                          }
                        }}
                      />
                      {calendar.name}
                    </StyledLabel>
                  </ListItem>
                ))}
              </List>
            </Container>
          )}
          title="Calendars"
        />
        <ToolbarButton onClick={() => onNavigate('PREV')} aria-label="Previous"><ArrowLeftIcon/></ToolbarButton>
        <ToolbarButton onClick={() => onNavigate('TODAY')} aria-label="Today"><CalendarIcon/></ToolbarButton>
        <ToolbarButton onClick={() => onNavigate('NEXT')} aria-label="Next"><ArrowRightIcon/></ToolbarButton>
      </NavContainer>
      <DateSpan>{label}</DateSpan>
      <NavContainer>
        <ToolbarButton onClick={() => onView('week')} aria-label="Week">
          7
        </ToolbarButton>
        <ToolbarButton onClick={() => onView('day')} aria-label="Day">1</ToolbarButton>
        <ToolbarButton onClick={() => onView('agenda')} aria-label="Agenda"><ListIcon/></ToolbarButton>
      </NavContainer>
    </ToolbarContainer>
  );
};

export default Toolbar;
