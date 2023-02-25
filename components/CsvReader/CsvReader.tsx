import {
  formatFileSize,
  useCSVReader,
} from 'react-papaparse';
import React from 'react';
import styled from 'styled-components';
import {
  borders,
  colors
} from 'styles/global';
import {
  Person,
  PersonObject
} from 'data';
import { validatePerson } from 'utils/validatePerson';
import { usePeople } from '@hooks/people';

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

  return (
    <CSVReader
      config={{ dynamicTyping: true }}
      onUploadAccepted={(results: { data: string[][] }) => {
        console.log('---------------------------');
        console.log(results);
        console.log('---------------------------');

        if (!results.data || results.data.length < 1) {
          console.log('missing data');

          return null;
        }

        const columns: string[] = results.data.slice(0, 1)?.[0];
        const rows: string[][] = results.data.slice(1, -1);

        if (!Object.keys(PersonObject).every((key) => {
          const includes = columns.includes(key);

          if (!includes) {
            console.log(`Missing ${key} in columns`);
          }

          return includes;
        })) {
          return null;
        }

        const parsedPeople: Person[] = rows.reduce<Person[]>((people, row, currentIndex) => {
          const personObject = Object
            .fromEntries(row.map((value, index) => [columns[index], value]));

          const [isValidPerson, errors] = validatePerson(personObject);

          if (isValidPerson) {
            people.push(personObject as unknown as Person);
          } else {
            [`Row ${currentIndex + 2}:`, ...errors].forEach((msg) => console.log(msg));
          }

          return people;
        }, []);

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
  );
};

export default CsvReader;
