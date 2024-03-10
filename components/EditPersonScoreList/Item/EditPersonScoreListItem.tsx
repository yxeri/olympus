import {
  Person,
  romanNumbers,
  Status,
  statusCollection,
} from '@/types/data';
import ListItem from 'components/List/ListItem';
import { Trigger } from 'components/Modal/Modal';
import React, {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';
import { colors } from 'styles/global';
import Container from '../../Container/Container';
import PersonModal from '../../PersonModal/PersonModal';
import ScoreCounter from '../../ScoreCounter/ScoreCounter';

export type PersonListItemProps = {
  person: Person,
};

export const StyledDiv = styled.div<{ $color?: 'positive' | 'negative' | 'neutral' }>`
    display: grid;
    color: ${({ $color }) => {
        if ($color === 'neutral' || !$color) {
            return 'inherit';
        }

        return $color === 'positive'
                ? 'green'
                : 'red';
    }};

    a {
        color: inherit;
    }
`;

const StyledListItem = styled(ListItem)<{ $status: Status }>`
    border: 2px solid ${({ $status }) => colors[$status] ?? 'transparent'};
    box-shadow: 0 0 3px 1px ${({ $status }) => colors[$status] ?? 'transparent'};
    background-color: ${colors.componentBackground};
    padding: .2rem;
    display: grid;
    grid-column-gap: .7rem;
    grid-auto-flow: column;
    grid-template-columns: 1fr auto;
`;

const StyledTrigger = styled(Trigger)`
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-column-gap: .7rem;
`;

const EditPersonScoreListItem: React.FC<PersonListItemProps> = ({ person }) => {
  const {
    family,
    name,
    status,
    score,
    year,
    _id: id,
  } = person;
  const [changeType, setChangeType] = useState<'+' | '-'>('+');
  const [scoreChange, setScoreChange] = useState(0);
  const color = (() => {
    if (scoreChange === 0) {
      return 'neutral';
    }

    if (scoreChange < 0) {
      return 'negative';
    }

    return changeType === '+'
      ? 'positive'
      : 'negative';
  })();

  const listItem = (
    <StyledTrigger aria-label={`${name} ${family}, ${statusCollection[(status as Status)]}`}>
      <StyledDiv style={{
        width: '.8rem',
        textAlign: 'center',
      }}>
        {romanNumbers[year]}
      </StyledDiv>
      <StyledDiv style={{ textTransform: 'capitalize' }}>
        {`${name} ${family.toUpperCase()}`}
      </StyledDiv>
      <StyledDiv $color={color} style={{ justifySelf: 'flex-end' }}>
        {changeType === '+' || scoreChange < 0
          ? score + scoreChange
          : score - scoreChange}
      </StyledDiv>
    </StyledTrigger>
  );

  useEffect(
    () => {
      setScoreChange(0);
    },
    [score],
  );

  return (
    <StyledListItem $status={status}>
      <Container style={{
        justifySelf: 'left',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <PersonModal
          trigger={listItem}
          personId={id ?? ''}
        />
      </Container>
      <ScoreCounter
        changeType={scoreChange < 0
          ? '-'
          : changeType}
        name={id?.toString()}
        onValueChange={({ currentTarget }: ChangeEvent<HTMLInputElement>) => {
          setScoreChange(Number(currentTarget.value));
        }}
        onTypeChange={(newType) => {
          setChangeType(newType);
        }}
      />
    </StyledListItem>
  );
};

export default EditPersonScoreListItem;
