import ListItem from 'components/List/ListItem';
import React from 'react';
import styled from 'styled-components';
import {
  borders,
  colors,
  sizes,
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
  grid-column-gap: .7rem;
  grid-template-columns: 1fr 1.6rem;
  padding: .5rem;
  border-radius: ${sizes.corner};
  border: ${borders.standard};
`;

const DocumentsListItem: React.FC<DocumentsListItemProps> = ({ document }) => {
  const {
    _id: id,
    title,
  } = document;

  return (
    <StyledListItem>
      <Link href={`/library/${id?.toString()}`} style={{ textDecoration: 'none' }}>
        <StyledDiv>
          {`${title}`}
        </StyledDiv>
      </Link>
    </StyledListItem>
  );
};

export default DocumentsListItem;
