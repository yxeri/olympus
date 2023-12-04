import ListItem from 'components/List/ListItem';
import React from 'react';
import styled from 'styled-components';
import {
  colors,
} from 'styles/global';
import {
  Document,
} from '../../../../types/data';
import Link from '../../../Link/Link';

export type DocumentsListItemProps = {
  document: Partial<Document>,
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

const DocumentsListItem: React.FC<DocumentsListItemProps> = ({ document }) => {
  const {
    _id: id,
    title,
  } = document;

  return (
    <StyledListItem>
      <Link href={`/library/${id?.toString()}`}>
        <StyledDiv>
          {`${title}`}
        </StyledDiv>
      </Link>
    </StyledListItem>
  );
};

export default DocumentsListItem;
