import React from 'react';
import {
  formatFileSize,
  useCSVReader,
} from 'react-papaparse';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  borders,
  colors
} from 'styles/global';
import { validatePerson } from 'utils/validatePerson';
import {
  usePeople,
} from '../../hooks/people';
import useAuthPerson from '../../hooks/people/useAuthPerson';
import {
  Person,
  PersonObject
} from '../../types/data';
import Container from '../Container/Container';

const StyledDiv = styled.div`
  border: ${borders.standard};
  color: ${colors.brightColor};
`;

const FileView: React.FC<any> = ({
  ProgressBar,
  getRemoveFileProps,
  Remove,
  acceptedFile,
}) => (
  <div>
    <div>
      <span>
        {formatFileSize(acceptedFile.size)}
      </span>
      <span>{acceptedFile.name}</span>
    </div>
    <div>
      <ProgressBar />
    </div>
    <div
      {...getRemoveFileProps()}
    >
      <Remove />
    </div>
  </div>
);

const CsvReader = () => {
  const { insert } = usePeople();
  const { CSVReader } = useCSVReader();
  const { person: authPerson } = useAuthPerson();

  if (!authPerson?.auth?.people?.admin) {
    return null;
  }

  return (
    <Container style={{
      overflow: 'hidden',
    }}
    >
      <h3>Upload list of people</h3>
      <p>It has to be a csv file. You can export as csv from Google Sheets/Excel/Numbers</p>
      <CSVReader
        config={{ dynamicTyping: true }}
        onUploadAccepted={(results: { data: string[][] }) => {
          console.log('---------------------------');
          console.log(results);
          console.log('---------------------------');

          if (!results.data || results.data.length < 1) {
            toast.error('Missing data');

            return null;
          }

          const columns: string[] = results.data.slice(0, 1)?.[0] ?? [];
          const rows: string[][] = results.data.slice(1);
          const {
            profile,
            score,
            status,
            society,
            year,
            age,
            pronouns,
            province,
            specialisation,
            ...personObject
          } = PersonObject;

          if (!Object.keys(personObject).every((key) => {
            const includes = columns.includes(key);

            if (!includes) {
              toast.error(`Missing ${key} in columns`);
            }

            return includes;
          })) {
            return null;
          }

          const rowErrors: string[] = [];

          const parsedPeople: Person[] = rows.reduce<Person[]>((people, row, currentIndex) => {
            const object = Object
              .fromEntries(row.map((value, index) => [columns[index], value]));
            const person = {
              ...object,
              pronouns: object.pronouns?.split('/'),
              isInactive: !!object.isInactive,
              year: object.type === 'Questi' ? 99 : object.year ?? 100,
              society: object.society ?? '',
              score: object.score ?? -9999,
              profile: object.profile ?? {},
            };

            const [isValidPerson, errors] = validatePerson(person);

            console.log(errors);

            if (isValidPerson) {
              people.push(person as unknown as Person);
            } else {
              rowErrors.push(`${currentIndex + 2}`);
            }

            return people;
          }, []);

          if (rowErrors.length > 0) {
            toast.error(`Rows with errors: ${rowErrors.join(', ')}`, { autoClose: false });
          }

          insert(parsedPeople);

          return true;
        }}
        onDragOver={(event: DragEvent) => {
          event.preventDefault();
        }}
        onDragLeave={(event: DragEvent) => {
          event.preventDefault();
        }}
      >
        {(props: any) => (
          <StyledDiv
            {...props.getRootProps()}
            style={{ color: 'white' }}
          >
            {props.acceptedFile ? <FileView {...props} /> : (
              'Släpp en csv-fil eller klicka för att ladda upp'
            )}
          </StyledDiv>
        )}
      </CSVReader>
    </Container>
  );
};

export default CsvReader;
