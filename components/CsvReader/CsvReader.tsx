import {
  formatFileSize,
  useCSVReader,
} from 'react-papaparse';
import React from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import {
  borders,
  colors
} from '../../styles/global';
import {
  Person,
  PersonObject,
  PersonTypeObject,
  SocietyObject,
  StatusObject,
  YearObject
} from '../../data';
import { peopleAtom } from '../../atoms/person';

const StyledDiv = styled.div`
  border: ${borders.standard};
  color: ${colors.brightColor};
`;

const FileView: React.FC<any> = ({
  ProgressBar, getRemoveFileProps, Remove, acceptedFile,
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
  const [persons, setPersons] = useRecoilState(peopleAtom);
  const { CSVReader } = useCSVReader();

  console.log(persons);

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

        const parsedPeople: Person[] = rows
          .map((row) => (
            Object
              .fromEntries(row.map((value, index) => [columns[index], value]))
          ))
          .filter((row, index) => {
            let isValidPerson = true;
            const errorMsg = [`Row ${index + 2}:`];

            Object.keys(PersonObject).forEach((key) => {
              if (row[key] === undefined) {
                errorMsg.push(`missing ${key}`);

                isValidPerson = false;
              }
            });

            if (!Object.keys(SocietyObject).includes(row.society)) {
              isValidPerson = false;

              errorMsg.push(`valid societies are: ${Object.keys(SocietyObject)}`);
            }

            if (!Object.keys(StatusObject).includes(row.status)) {
              isValidPerson = false;

              errorMsg.push(`valid status are: ${Object.keys(StatusObject)}`);
            }

            if (!Object.keys(YearObject).includes(row.year.toString())) {
              isValidPerson = false;

              errorMsg.push(`valid years are: ${Object.keys(YearObject)}`);
            }

            if (!Object.keys(PersonTypeObject).includes(row.type)) {
              isValidPerson = false;

              errorMsg.push(`valid types are: ${Object.keys(PersonTypeObject)}`);
            }

            if (errorMsg.length > 1) {
              errorMsg.forEach((msg) => console.log(msg));
            }

            return isValidPerson;
          }) as unknown as Person[];

        setPersons(parsedPeople);

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
