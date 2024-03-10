import { Forum } from '@/types/data';
import ListItem from 'components/List/ListItem';
import React from 'react';
import styled from 'styled-components';
import { colors } from 'styles/global';

export type ForumsListItemProps = {
  forum: Forum,
};

export const StyledDiv = styled.div`
  display: grid;
  justify-items: center;
  align-items: center;
`;

const StyledListItem = styled(ListItem)`
  display: grid;
  border: 2px solid;
  box-shadow: 0 0 3px 1px;
  background-color: ${colors.componentBackground};
  padding: .2rem;
  grid-column-gap: .7rem;
  grid-template-columns: 1fr 1.6rem;
`;

const ForumsListItem: React.FC<ForumsListItemProps> = ({ forum }) => {
  const {
    name,
  } = forum;

  return (
    <StyledListItem>
      <StyledDiv>
        {`${name}`}
      </StyledDiv>
    </StyledListItem>
  );
};

export default ForumsListItem;
