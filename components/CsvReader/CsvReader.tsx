import {
  formatFileSize,
  useCSVReader,
} from 'react-papaparse';
import React from 'react';

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
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        console.log('---------------------------');
        console.log(results);
        console.log('---------------------------');
      }}
      onDragOver={(event: DragEvent) => {
        event.preventDefault();
      }}
      onDragLeave={(event: DragEvent) => {
        event.preventDefault();
      }}
    >
      {(props: any) => (
        <div
          {...props.getRootProps()}
          style={{ color: 'white' }}
        >
          {props.acceptedFile ? <FileView {...props} /> : (
            'Drop CSV file here or click to upload'
          )}
        </div>
      )}
    </CSVReader>
  );
};

export default CsvReader;
