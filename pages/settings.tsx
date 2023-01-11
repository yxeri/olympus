import styled from 'styled-components';
import CsvReader from '../components/CsvReader/CsvReader';
import CsvDownloader from '../components/CsvDownloader/CsvDownloader';

const StyledDiv = styled.div`
  display: grid;
  grid-gap: 1rem;
  width: fit-content;
  max-width: 100%;
`;

export default function Settings() {
  return (
    <StyledDiv className="main-container">
      <CsvReader />
      <CsvDownloader />
    </StyledDiv>
  );
}
