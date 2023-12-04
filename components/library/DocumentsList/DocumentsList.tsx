import styled from 'styled-components';
import useDocuments from '../../../hooks/documents/useDocuments';
import { sizes } from '../../../styles/global';
import List from '../../List/List';
import DocumentsListItem from './Item/DocumentsListItem';

const StyledList = styled(List)`
  grid-column-gap: ${sizes.largeGap};
  grid-gap: .5rem;
  grid-auto-flow: row;
`;

const DocumentsList = () => {
  const { documents } = useDocuments();

  const ListItems = documents
    .filter((document) => document?._id)
    .map((document) => <DocumentsListItem document={document} key={document._id?.toString()} />);

  return (
    <StyledList>
      {ListItems}
    </StyledList>
  );
};

export default DocumentsList;
